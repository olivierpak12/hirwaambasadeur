# Web3 Integration Guide - Decentralized News Platform

This guide explains how to add Web3/blockchain functionality to Hirwa Ambassadeur for a decentralized news platform where readers can publish and verify content on the blockchain.

## What This Enables

✅ **Decentralized Article Publishing** - Authors publish directly to blockchain  
✅ **Content Verification** - Community members verify article authenticity  
✅ **Immutable Records** - Article history stored permanently on-chain  
✅ **Wallet Integration** - MetaMask and compatible wallets  
✅ **Cross-Chain Support** - Ethereum, Polygon, Arbitrum, Testnets  

## Architecture

```
Browser (MetaMask)
      ↓
Web3Provider (React Context)
      ↓
Smart Contract on Blockchain
      ↓
Convex Backend (off-chain storage)
```

## Prerequisites

1. **MetaMask Extension** - Install from [metamask.io](https://metamask.io)
2. **Test Funds** - For testnet development (free from faucets)
3. **ethers.js** - Already installed or `npm install ethers`

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install ethers
```

### 2. Add Environment Variables

Copy `.env.web3-template` to `.env.local` and update:

```env
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=polygon
NEXT_PUBLIC_NEWS_CONTRACT_ADDRESS=0x... # Set after deploying contract
```

### 3. Use Wallet in Your Components

```typescript
'use client';

import { useWeb3 } from '@/components/providers/Web3Provider';
import { WalletConnect } from '@/components/common/WalletConnect';

export function MyComponent() {
  const { address, isConnected, connect } = useWeb3();

  return (
    <div>
      <WalletConnect />
      {isConnected && (
        <p>Connected: {address}</p>
      )}
    </div>
  );
}
```

## File Structure

```
Web3 Integration Files:
├── src/lib/web3-config.ts           # Network configs & contract ABIs
├── src/components/providers/Web3Provider.tsx    # Wallet context
├── src/components/common/WalletConnect.tsx      # Connect button
└── .env.web3-template               # Environment template
```

## Network Recommendations

| Network | Use Case | Fees | ChainId |
|---------|----------|------|---------|
| **Sepolia Testnet** | 🧪 Development | Free | 11155111 |
| **Polygon** | 💚 Production | ~$0.001-0.01 | 137 |
| **Arbitrum** | ⚡ High Speed | ~$0.01-0.05 | 42161 |
| Ethereum Mainnet | 💎 Maximum Security | $1-10+ | 1 |

**Recommended:** Polygon (low cost, EVM-compatible, fast)

## Testnet Setup

### Sepolia Testnet (Recommended for Development)

1. **Switch MetaMask to Sepolia**
   - Open MetaMask → Networks → Add network
   - Or toggle "Show test networks" at the top

2. **Get Free Test ETH**
   - [Sepolia Faucet](https://sepoliafaucet.com/)
   - [Alchemy Faucet](https://www.alchemy.com/faucets/ethereum)
   - [Infura Faucet](https://www.infura.io/faucet/sepolia)

3. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_BLOCKCHAIN_NETWORK=sepolia
   ```

### Polygon Testnet (Mumbai)

1. **Switch to Polygon Mumbai**
   - Network ID: 80001
   - RPC: https://rpc-mumbai.maticvigil.com

2. **Get Test MATIC**
   - [Polygon Mumbai Faucet](https://faucet.polygon.technology/)

## Smart Contract Deployment

### Option A: Use Existing Contract (Recommended)

If you already have a deployed contract:

```env
NEXT_PUBLIC_NEWS_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### Option B: Deploy Your Own Contract

Create a basic article registry contract in Solidity:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewsRegistry {
    struct Article {
        uint256 id;
        address author;
        string title;
        bytes32 contentHash;
        string category;
        uint256 timestamp;
        uint256 verifications;
        bool published;
    }

    mapping(uint256 => Article) public articles;
    uint256 public articleCount;

    event ArticlePublished(uint256 indexed id, address indexed author, string title);
    event ArticleVerified(uint256 indexed id, address indexed verifier);

    function publishArticle(
        string memory _title,
        bytes32 _contentHash,
        string memory _category
    ) external returns (uint256) {
        articleCount++;
        articles[articleCount] = Article(
            articleCount,
            msg.sender,
            _title,
            _contentHash,
            _category,
            block.timestamp,
            0,
            true
        );
        emit ArticlePublished(articleCount, msg.sender, _title);
        return articleCount;
    }

    function getArticle(uint256 _id) external view returns (Article memory) {
        return articles[_id];
    }
}
```

Deploy using:
- [Remix IDE](https://remix.ethereum.org) (easiest for beginners)
- [Hardhat](https://hardhat.org/) (professional development)
- [Foundry](https://book.getfoundry.sh/) (advanced)

## Publishing an Article to Blockchain

```typescript
import { useWeb3 } from '@/components/providers/Web3Provider';
import { ethers } from 'ethers';
import { CONTRACTS } from '@/lib/web3-config';

export function PublishToBlockchain() {
  const { address, isConnected } = useWeb3();

  const publishArticle = async (title: string, content: string) => {
    if (!isConnected || !window.ethereum) return;

    try {
      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(
        CONTRACTS.NEWS_VERIFICATION.address,
        CONTRACTS.NEWS_VERIFICATION.abi,
        signer
      );

      // Hash content for on-chain storage
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content));

      // Call smart contract
      const tx = await contract.publishArticle(
        title,
        contentHash,
        'Technology'
      );

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Article published:', receipt.transactionHash);

      return receipt;
    } catch (error) {
      console.error('Publication failed:', error);
      throw error;
    }
  };

  return (
    <button
      onClick={() => publishArticle('News Title', 'Content...')}
      disabled={!isConnected}
    >
      Publish to Blockchain
    </button>
  );
}
```

## Features Included

### ✅ Wallet Connection
```typescript
const { connect, disconnect, address, isConnected } = useWeb3();

// Auto-reconnect on refresh
// Listen to account/network changes
// Error handling
```

### ✅ Network Switching
```typescript
const { switchNetwork } = useWeb3();
await switchNetwork(137); // Switch to Polygon
```

### ✅ UI Components
- `<WalletConnect />` - Connect/disconnect button
- Shows abbreviated address when connected
- Error messages for failed connections

### ✅ Error Handling
```typescript
const { error } = useWeb3();
// Handles: MetaMask not installed, wrong network, rejected connection, etc.
```

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ | Best support |
| Firefox | ✅ | Full support |
| Safari | ⚠️ | Use MetaMask extension |
| Edge | ✅ | Full support |

## Security Best Practices

1. **Never expose private keys**
   - MetaMask handles signing securely
   - Never ask users for keys

2. **Verify smart contracts**
   - Audit contracts before mainnet
   - Use OpenZeppelin libraries

3. **Validate on-chain data**
   - Always verify signatures
   - Check contract ownership/permissions

4. **Limit transaction scope**
   - Request approval before signing
   - Show what will be signed

5. **Use testnets first**
   - Test thoroughly on Sepolia/Mumbai
   - Before deploying to mainnet

## Troubleshooting

### "MetaMask is not installed"
```
→ Install MetaMask extension
→ https://metamask.io
→ Reload the page
```

### "Failed to connect to wallet"
```
→ Check MetaMask is unlocked (click extension icon)
→ Make sure you're not in incognito mode
→ Clear browser cache and reload
```

### "Please switch to the correct network"
```
→ Click MetaMask extension
→ Select the correct network dropdown
→ Try connecting again
```

### "Contract not found at address"
```
→ Verify NEXT_PUBLIC_BLOCKCHAIN_NETWORK matches contract's network
→ Check NEXT_PUBLIC_NEWS_CONTRACT_ADDRESS is correct
→ Ensure contract is deployed at that address
```

### "Insufficient balance"
```
→ Get test funds from faucet
→ https://sepoliafaucet.com (for Sepolia)
→ https://faucet.polygon.technology (for Polygon)
```

## Next Steps

1. ✅ Install ethers.js: `npm install ethers`
2. ✅ Add environment variables from `.env.web3-template`
3. ✅ Test wallet connection: Use `<WalletConnect/>`
4. ✅ Deploy smart contract (or use existing)
5. ✅ Build article publishing UI
6. ✅ Test on testnet before mainnet

## Example: Complete Article Publishing Page

See `/src/app/publish-on-chain/page.tsx` for a full working example (coming soon).

## Resources

- **Ethers.js Docs**: https://docs.ethers.org
- **Polygon Docs**: https://polygon.technology/developers
- **Solidity Docs**: https://docs.soliditylang.org
- **MetaMask API**: https://docs.metamask.io/guide/rpc-api.html
- **Web3 Security**: https://consensys.net/blog/developers/

## Support & Questions

For issues or questions about Web3 integration:
1. Check the troubleshooting section above
2. Review MetaMask docs: https://docs.metamask.io
3. Ask in Polygon/Ethereum Discord communities

---

**Next Update**: March 26, 2026
**Status**: Ready for development & testnet
