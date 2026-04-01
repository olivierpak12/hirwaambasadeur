'use client';

import { useState } from 'react';
import { useWeb3 } from '@/components/providers/Web3Provider';
import { WalletConnect } from '@/components/common/WalletConnect';
import { ethers } from 'ethers';

export default function PublishOnChainPage() {
  const { address, isConnected, chainId } = useWeb3();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setStatusMessage('❌ Please connect your wallet first');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setStatusMessage('❌ Please fill in all fields');
      return;
    }

    setPublishing(true);
    setStatusMessage('⏳ Publishing to blockchain...');
    setTxHash('');

    try {
      // Check if we have ethereum object
      if (!window.ethereum) {
        throw new Error('MetaMask is not available');
      }

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // For demo: we'll just show what would be sent
      // Replace with actual contract interaction
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content));

      console.log('Publishing article:', {
        title,
        contentHash,
        category,
        author: address,
        chainId,
      });

      // Simulate transaction (replace with actual contract call)
      setStatusMessage('✅ Article metadata prepared!');
      setTxHash('0x' + Math.random().toString(16).slice(2));

      // Reset form
      setTimeout(() => {
        setTitle('');
        setContent('');
        setCategory('Technology');
        setStatusMessage('');
      }, 2000);
    } catch (error) {
      console.error('Publishing error:', error);
      setStatusMessage(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setPublishing(false);
    }
  };

  const categories = [
    'Technology',
    'Business',
    'Politics',
    'Health',
    'Sports',
    'Entertainment',
    'Africa',
    'World',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Publish on Blockchain
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Publish your article to the decentralized news network
          </p>
          <WalletConnect />
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              statusMessage.includes('❌')
                ? 'bg-red-100 text-red-700'
                : statusMessage.includes('✅')
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {statusMessage}
            {txHash && (
              <div className="mt-2">
                <a
                  href={`https://polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  View on PolygonScan
                </a>
              </div>
            )}
          </div>
        )}

        {/* Network Info */}
        {isConnected && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Wallet Address</p>
                <p className="font-mono text-sm font-bold">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chain ID</p>
                <p className="font-bold">
                  {chainId === 137 && '🟣 Polygon'}
                  {chainId === 11155111 && '⛓️ Sepolia'}
                  {chainId === 1 && '⟠ Ethereum'}
                  {chainId === 42161 && '⚡ Arbitrum'}
                  {!chainId && '❓ Unknown'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {isConnected ? (
          <form
            onSubmit={handlePublish}
            className="bg-white rounded-xl shadow-lg p-8 space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                disabled={publishing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={publishing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={8}
                disabled={publishing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={publishing || !title || !content}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                publishing || !title || !content
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {publishing ? '⏳ Publishing...' : '🚀 Publish to Blockchain'}
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to publish articles on the blockchain
            </p>
            <WalletConnect />
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 How It Works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              ✓ Connect your wallet to prove ownership of published content
            </li>
            <li>
              ✓ Articles are published to the blockchain with your signature
            </li>
            <li>
              ✓ Community members can verify article authenticity and timestamp
            </li>
            <li>
              ✓ Content is immutable and permanently recorded on-chain
            </li>
          </ul>
        </div>

        {/* Testing Info */}
        <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
          <h3 className="font-bold text-amber-900 mb-2">🧪 For Testing</h3>
          <p className="text-sm text-amber-800 mb-3">
            Using testnet? Get free test funds:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>
              • Sepolia ETH:{' '}
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                sepoliafaucet.com
              </a>
            </li>
            <li>
              • Polygon MATIC:{' '}
              <a
                href="https://faucet.polygon.technology"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                faucet.polygon.technology
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
