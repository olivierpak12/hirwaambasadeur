'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WalletConnection {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

interface Web3ContextType extends WalletConnection {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletConnection>({
    address: null,
    isConnected: false,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  // Check if MetaMask is available
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum !== undefined;

  // Connect to wallet
  const connect = async () => {
    if (!hasMetaMask) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask is not installed. Please install it from https://metamask.io',
      }));
      return;
    }

    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ethereum = window.ethereum as any;

      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get chain ID
      const chainIdHex = await ethereum.request({
        method: 'eth_chainId',
      });
      const chainId = parseInt(chainIdHex, 16);

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId,
        isConnecting: false,
        error: null,
      });

      // Store in localStorage for persistence
      localStorage.setItem('walletAddress', accounts[0]);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: error?.message || 'Failed to connect wallet',
      }));
    }
  };

  // Disconnect from wallet
  const disconnect = async () => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      isConnecting: false,
      error: null,
    });
    localStorage.removeItem('walletAddress');
  };

  // Switch network
  const switchNetwork = async (chainId: number) => {
    if (!hasMetaMask) {
      setWallet((prev) => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    try {
      const ethereum = window.ethereum as any;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      setWallet((prev) => ({ ...prev, chainId, error: null }));
    } catch (error: any) {
      console.error('Network switch error:', error);
      setWallet((prev) => ({
        ...prev,
        error: error?.message || 'Failed to switch network',
      }));
    }
  };

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress && hasMetaMask) {
      connect().catch((error) => {
        console.error('Auto-connect failed:', error);
      });
    }

    // Listen for account changes
    if (hasMetaMask) {
      const ethereum = window.ethereum as any;

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setWallet((prev) => ({ ...prev, address: accounts[0] }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setWallet((prev) => ({
          ...prev,
          chainId: parseInt(chainId, 16),
        }));
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        ...wallet,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
}
