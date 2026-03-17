'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);

  const articles = useQuery(api.articles.getPublishedArticles) ?? [];
  const loading = articles === undefined;

  const results = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];
    return articles.filter((article: any) => {
      const title = (article.title ?? '').toLowerCase();
      const excerpt = (article.excerpt ?? '').toLowerCase();
      const category = (article.category?.name ?? '').toLowerCase();
      return title.includes(term) || excerpt.includes(term) || category.includes(term);
    });
  }, [articles, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles, categories, keywords..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {searchQuery.trim() && (
        <>
          <div className="max-w-3xl mx-auto mb-8">
            {loading ? (
              <div className="text-center text-black">🔍 Searching articles...</div>
            ) : results.length > 0 ? (
              <p className="text-black mb-6">
                Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for "<strong>{searchQuery}</strong>"
              </p>
            ) : (
              <div className="bg-gray-50 border border-gray-300 text-gray-800 px-4 py-4 rounded-lg">
                ⚠️ No articles found for "<strong>{searchQuery}</strong>". Try different keywords or browse our categories.
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              {results.map((article: any) => (
                <Link key={article._id} href={`/article/${article.slug}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                    {article.featuredImage && (
                      <div className="h-48 w-full overflow-hidden bg-gray-100">
                        <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-xs text-gray-800 font-bold mb-2 uppercase">
                        {article.category?.name}
                      </p>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 flex-1 text-black">
                        {article.title}
                      </h3>
                      <p className="text-sm text-black mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-xs text-black border-t pt-3">
                        <span>{article.author?.name}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Popular Searches */}
      {!searchQuery.trim() && (
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-black">Popular Searches</h2>
          <div className="flex flex-wrap gap-3">
            {['Politics', 'Technology', 'Business', 'AI', 'Markets', 'Health'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm transition"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advertisement */}
      <div className="bg-gray-100 rounded-lg p-8 text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold">📢 Advertisement</p>
        <p className="text-xs text-black">Google AdSense - Search Page Ad</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}











