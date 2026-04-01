// Web3 Configuration for Decentralized News Platform

export const NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    currencySymbol: 'ETH',
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    currencySymbol: 'MATIC',
  },
  ARBITRUM: {
    chainId: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    currencySymbol: 'ETH',
  },
  SEPOLIA_TESTNET: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorerUrl: 'https://sepolia.etherscan.io',
    currencySymbol: 'ETH',
  },
};

// Default to Polygon for production (lower fees, faster)
export const DEFAULT_NETWORK = NETWORKS.POLYGON;

// Smart Contract Addresses (will be Set after deployment)
export const CONTRACTS = {
  NEWS_VERIFICATION: {
    address: process.env.NEXT_PUBLIC_NEWS_CONTRACT_ADDRESS || '',
    abi: [
      {
        name: 'publishArticle',
        type: 'function',
        inputs: [
          { name: 'title', type: 'string' },
          { name: 'contentHash', type: 'bytes32' },
          { name: 'category', type: 'string' },
        ],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'verifyArticle',
        type: 'function',
        inputs: [
          { name: 'articleId', type: 'uint256' },
          { name: 'verdict', type: 'bool' },
        ],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
  },
};

// Web3 Error Messages
export const WEB3_ERRORS = {
  METAMASK_NOT_INSTALLED: 'MetaMask is not installed. Please install it from https://metamask.io',
  WRONG_NETWORK: 'Please switch to the correct network in MetaMask',
  USER_REJECTED: 'You rejected the wallet connection',
  CONNECTION_FAILED: 'Failed to connect to wallet',
  SIGNATURE_FAILED: 'Failed to sign the transaction',
  INSUFFICIENT_BALANCE: 'Insufficient balance to perform this operation',
};
