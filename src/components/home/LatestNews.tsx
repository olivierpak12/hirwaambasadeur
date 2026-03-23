'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  featuredImageIds?: string[];
  author?: { name: string };
  category?: { name: string };
  publishedAt: string;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function LatestNews() {
  const articles = useQuery(api.articles.getPublishedArticles);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  if (!articles || articles.length <= 5) return null;

  const latestArticles = articles.slice(5, 11); // Skip featured articles

  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => new Set(prev).add(id));
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <Link
            href="/categories/all"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article) => (
            <article key={article._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/article/${article.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  {article.featuredImage && !failedImageIds.has(article._id) ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      onError={() => handleImageError(article._id)}
                      className="object-cover transition-transform hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {article.category?.name || 'News'}
                  </span>
                  <span className="text-gray-500 text-sm">{timeAgo(article.publishedAt)}</span>
                </div>

                <Link href={`/article/${article.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-red-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {article.excerpt}
                </p>

                {article.author && (
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500">
                      By <span className="font-medium text-gray-900">{article.author.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}