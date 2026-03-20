'use client';

import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  featuredImageIds?: string[];
  views?: number;
  author?: { name: string };
  publishedAt: string;
}

interface TrendingArticlesProps {
  articles: Article[];
}

export default function TrendingArticles({ articles }: TrendingArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="bg-[#0f2318] rounded-lg p-5">
      <h2 className="text-[#c9a84c] text-xs uppercase tracking-widest mb-4 pb-3 border-b border-[#2a4a35] font-medium">
        Trending Now
      </h2>

      <div>
        {articles.slice(0, 8).map((article, index) => (
          <Link key={article._id} href={`/article/${article.slug}`} className="block">
            <div className="flex items-start gap-3 py-3 border-b border-[#1a3d28] cursor-pointer transition-opacity hover:opacity-75">
              <div className="font-serif text-xl font-normal text-[#2a4a35] min-w-8 leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                {article.featuredImage && (
                  <div className="w-full h-20 bg-[#1a3d28] rounded mb-2 overflow-hidden">
                    <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-serif text-sm text-white leading-tight">
                  {article.title}
                </h3>
                <p className="text-xs text-[#a0b8a8] mt-1">
                  {article.views ? `${article.views.toLocaleString()} views · ` : ''}
                  {new Date(article.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}