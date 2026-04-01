'use client';

import { useWeb3 } from '@/components/providers/Web3Provider';
import { useState } from 'react';

export function WalletConnect() {
  const { address, isConnected, isConnecting, error, connect, disconnect } = useWeb3();
  const [showError, setShowError] = useState(false);

  const handleConnect = async () => {
    setShowError(false);
    try {
      await connect();
    } catch (error) {
      setShowError(true);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600 font-medium">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`px-4 py-2 rounded font-medium transition ${
          isConnecting
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && showError && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
}
