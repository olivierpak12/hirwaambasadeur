'use client';

import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  author?: { name: string };
  category?: { name: string };
  publishedAt: string;
}

interface LatestNewsProps {
  articles: Article[];
}

export default function LatestNews({ articles }: LatestNewsProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#c9a84c] opacity-30" />
        <span className="text-xs uppercase tracking-widest text-[#c9a84c] font-medium">
          Latest Stories
        </span>
        <div className="flex-1 h-px bg-[#c9a84c] opacity-30" />
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2a4a35] border border-[#2a4a35] rounded-lg overflow-hidden mb-7">
        {articles.slice(0, 3).map((article) => (
          <Link key={article._id} href={`/article/${article.slug}`} className="block">
            <div className="bg-[#f5f2eb] p-5 h-full transition-colors hover:bg-[#eee8d8]">
              {article.featuredImage && (
                <div className="w-full h-32 bg-[#1a3d28] rounded mb-3 overflow-hidden">
                  <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-[#c9a84c] text-xs uppercase tracking-wider mb-2">
                {article.category?.name}
              </div>
              <h3 className="font-serif text-base font-normal leading-tight text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
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
            <div className="bg-[#f5f2eb] p-5 transition-colors hover:bg-[#eee8d8]">
              <div className="text-[#c9a84c] text-xs uppercase tracking-wider mb-2">
                {article.category?.name}
              </div>
              <h3 className="font-serif text-sm font-normal leading-tight text-gray-900 mb-2 line-clamp-2">
                {article.title}
              </h3>
              <div className="flex justify-between text-xs text-gray-500 border-t border-[#ddd8cc] pt-2">
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