# Web3 Integration - Quick Reference

## 3-Step Setup

1. **Install ethers.js**
   ```bash
   npm install ethers
   ```

2. **Add env variable to `.env.local`**
   ```env
   NEXT_PUBLIC_BLOCKCHAIN_NETWORK=polygon
   ```

3. **Done!** Wallet connection now available in your app

## Use in Components

```typescript
'use client';
import { useWeb3 } from '@/components/providers/Web3Provider';

export function MyComponent() {
  const { address, isConnected, connect, disconnect } = useWeb3();
  
  return (
    <>
      {!isConnected ? (
        <button onClick={() => connect()}>Connect Wallet</button>
      ) : (
        <p>Connected: {address}</p>
      )}
    </>
  );
}
```

Or use the button component:

```typescript
import { WalletConnect } from '@/components/common/WalletConnect';

<WalletConnect />
```

## Fix for MetaMask Error

The "Failed to connect to MetaMask" error is now handled automatically:
- ✅ Web3Provider handles connection gracefully
- ✅ Error messages shown to user
- ✅ Auto-reconnect on page refresh
- ✅ Listens for account/network changes

## Common Tasks

### Check if User is Connected
```typescript
const { isConnected, address } = useWeb3();

if (isConnected) {
  console.log('User:', address);
}
```

### Switch Network
```typescript
const { switchNetwork } = useWeb3();
await switchNetwork(137); // Polygon
```

### Get Provider & Signer
```typescript
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
```

### Call Smart Contract
```typescript
const contract = new ethers.Contract(ADDRESS, ABI, signer);
const tx = await contract.myFunction(args);
await tx.wait(); // Wait for confirmation
```

## Networks ChainIds

- **Sepolia (Testnet)**: 11155111 ← Use for testing
- **Polygon**: 137
- **Arbitrum**: 42161
- **Ethereum**: 1

## Files Created

- `src/lib/web3-config.ts` - Network configs
- `src/components/providers/Web3Provider.tsx` - Wallet context
- `src/components/common/WalletConnect.tsx` - Connect button
- `WEB3_SETUP.md` - Full guide
- `.env.web3-template` - Environment template

## Get Test Funds

**Sepolia ETH**: https://sepoliafaucet.com  
**Polygon MATIC**: https://faucet.polygon.technology

## What's Included

✅ MetaMask integration  
✅ Multi-network support  
✅ Auto-reconnect  
✅ Error handling  
✅ React Context hook  
✅ Connect/Disconnect UI  
✅ Environment template  

## Next Steps

1. Install ethers: `npm install ethers`
2. Test `<WalletConnect/>` component
3. Deploy smart contract
4. Build publishing interface
5. Test on Sepolia testnet

## Error: "Failed to connect to MetaMask"

**Fixed!** The Web3Provider now:
- Handles missing MetaMask gracefully
- Shows user-friendly error messages
- Doesn't break the app
- Auto-retries on unlock

---

**Full Guide**: See [WEB3_SETUP.md](./WEB3_SETUP.md)
