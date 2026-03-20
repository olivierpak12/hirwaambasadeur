'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AuthorPage() {
  const params = useParams();
  const authorName = decodeURIComponent(params.id as string);

  const authorData = useQuery(api.articles.getAuthorByName, { authorName });

  if (!authorData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black">Author not found</h1>
        </div>
      </div>
    );
  }

  const { ...author } = authorData;
  const authorArticles = authorData.articles || [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Author Profile Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Photo */}
            {author.photo && (
              <div className="md:w-1/3">
                <div className="h-64 w-full md:w-64 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={author.photo}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-2 text-black">{author.name}</h1>

              <div className="text-black mb-4 space-y-2">
                <p>✉️ <a href={`mailto:${author.email}`} className="text-gray-800 hover:underline">{author.email}</a></p>
                <p>📚 Staff Journalist at Hirwa Ambassadeur</p>
              </div>

              <p className="text-black leading-relaxed mb-6">
                {author.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{authorArticles.length}</p>
                  <p className="text-sm text-black">Articles Published</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">45K+</p>
                  <p className="text-sm text-black">Total Readers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">12</p>
                  <p className="text-sm text-black">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author's Articles */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-8 text-black">Articles by {author.name}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {authorArticles.map((article) => (
            <Link key={article._id} href={`/article/${article.slug}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                {article.featuredImage && (
                  <div className="h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-xs text-gray-800 font-bold mb-2 uppercase">
                    {article.category?.name ?? 'Uncategorized'}
                  </p>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 flex-1 text-black">
                    {article.title}
                  </h3>
                  <p className="text-sm text-black mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-black border-t pt-3">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Advertisement */}
      <div className="bg-gray-100 rounded-lg p-8 text-center max-w-4xl mx-auto">
        <p className="text-sm font-semibold">📢 Advertisement</p>
        <p className="text-xs text-black">Google AdSense - Author Profile Ad</p>
      </div>
    </div>
  );
}











