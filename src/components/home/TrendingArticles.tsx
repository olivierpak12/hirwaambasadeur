import Link from 'next/link';
import Image from 'next/image';
import { fetchQuery } from 'convex/nextjs';
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
  views?: number;
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default async function TrendingArticles() {
  const articles = await fetchQuery(api.articles.getPublishedArticles);

  if (!articles || articles.length === 0) return null;

  // Sort by views to get trending articles
  const trending = [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="w-1 h-6 bg-red-600 rounded"></div>
        <h3 className="text-lg font-semibold text-gray-900">Trending</h3>
      </div>

      <div className="space-y-4">
        {trending.map((article, index) => (
          <Link key={article._id} href={`/article/${article.slug}`} className="group block">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 relative rounded overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {article.category?.name || 'News'}
                  </span>
                  <span className="text-gray-500 text-xs">{timeAgo(article.publishedAt)}</span>
                </div>

                <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>

                {article.views && (
                  <div className="flex items-center mt-1">
                    <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs text-gray-500">{article.views.toLocaleString()} views</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}