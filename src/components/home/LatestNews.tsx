'use client';

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

  if (!articles || articles.length <= 5) return null;

  const latestArticles = articles.slice(5, 11); // Skip featured articles

  return (
    <section className="py-12 bg-gray-50">
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
            <article key={article._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link href={`/article/${article.slug}`}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover"
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
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
              <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex justify-between text-xs text-gray-500 border-t border-[#ddd8cc] pt-2">
                <span>{article.author?.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a4a35] border border-[#2a4a35] rounded-lg overflow-hidden">
        {articles.slice(3, 6).map((article) => (
          <Link key={article._id} href={`/article/${article.slug}`} className="block">
            <div className="bg-[#f5f2eb] p-5 h-full transition-colors hover:bg-[#eee8d8] flex flex-col">
              {article.featuredImage && (
                <div className="w-full h-32 bg-[#1a3d28] rounded mb-3 overflow-hidden">
                  <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-[#c9a84c] text-xs uppercase tracking-wider mb-2">
                {article.category?.name}
              </div>
              <h3 className="font-serif text-sm font-normal leading-tight text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <div className="flex justify-between text-xs text-gray-500 border-t border-[#ddd8cc] pt-2 mt-auto">
                <span>{article.author?.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load more */}
      <div className="text-center mt-7">
        <Link href="/all-news">
          <button className="bg-[#0f2318] text-[#c9a84c] border-none px-9 py-3 rounded font-medium text-sm uppercase tracking-wider cursor-pointer hover:bg-[#1a3d28] transition-colors">
            Load More Stories
          </button>
        </Link>
      </div>
    </section>
  );
}