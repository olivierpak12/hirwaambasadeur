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

function PlaceholderImg({ height, index }: { height: number; index: number }) {
  const palettes = [
    ['#1a3c5e', '#2e6da4'], ['#1a3d28', '#2e7d4a'], ['#3b1a1a', '#8b3a3a'],
    ['#2a1a3b', '#5e3db8'], ['#3b2a1a', '#8b6e1a'], ['#1a2e3b', '#1a6a6a'],
  ];
  const [bg, fg] = palettes[index % palettes.length];
  return (
    <div
      className="w-full bg-gradient-to-br rounded-lg flex items-center justify-center"
      style={{ height, background: `linear-gradient(135deg, ${bg} 0%, ${fg} 100%)` }}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-20">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function FeaturedArticles() {
  const articles = useQuery(api.articles.getPublishedArticles);

  if (!articles || articles.length === 0) {
    return (
      <section className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <PlaceholderImg height={300} index={i} />
              <div className="mt-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const featured = articles[0];
  const recentArticles = articles.slice(1, 5);

  return (
    <section className="py-8">
      {/* Featured Article */}
      <div className="mb-12">
        <Link href={`/article/${featured.slug}`} className="group block">
          <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg">
            {featured.featuredImage ? (
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            ) : (
              <PlaceholderImg height={400} index={0} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-600 text-white">
                  {featured.category?.name || 'News'}
                </span>
                <span className="text-white/80 text-sm">{timeAgo(featured.publishedAt)}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                {featured.title}
              </h1>
              <p className="text-white/90 text-lg line-clamp-2">{featured.excerpt}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentArticles.map((article, index) => (
          <Link key={article._id} href={`/article/${article.slug}`} className="group block">
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <PlaceholderImg height={200} index={index + 1} />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    {article.category?.name || 'News'}
                  </span>
                  <span className="text-gray-500 text-xs">{timeAgo(article.publishedAt)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
