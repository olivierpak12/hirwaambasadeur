'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage?: string;
  youtubeUrl?: string;
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

function getYouTubeVideoId(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
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
  const [canSeeViews, setCanSeeViews] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const adminRole = window.localStorage.getItem('adminRole');
    const loggedAuthorId = window.localStorage.getItem('authorId');

    if (adminRole === 'admin' || loggedAuthorId) {
      setCanSeeViews(true);
    } else {
      setCanSeeViews(false);
    }
  }, []);

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
    <>
      <section className="bg-white">
      {/* Featured Article - BBC Style */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        <Link href={`/article/${featured.slug}`} className="group block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature image always on top */}
            <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden">
              {featured.featuredImage ? (
                <Image
                  src={featured.featuredImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <PlaceholderImg height={400} index={0} />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white">
                  {featured.category?.name || 'News'}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-red-600 transition-colors">
                {featured.title}
              </h1>

              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{timeAgo(featured.publishedAt)}</span>
                {featured.author?.name && (
                  <>
                    <span>•</span>
                    <span>By {featured.author.name}</span>
                  </>
                )}
                {canSeeViews && featured.views && (
                  <>
                    <span>•</span>
                    <span>{featured.views.toLocaleString()} views</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>

        {featured.youtubeUrl && getYouTubeVideoId(featured.youtubeUrl) && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1.8em 0' }}>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.13em',
              textTransform: 'uppercase',
              color: '#aaa',
              marginBottom: '8px',
              alignSelf: 'flex-start',
              marginLeft: '6%',
            }}>
              ▶ Watch
            </span>
            <div style={{
              position: 'relative',
              width: '88%',
              maxWidth: '500px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 4px 18px rgba(0,0,0,0.13)',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            }}>
              <div style={{ paddingTop: '56.25%' }} />
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(featured.youtubeUrl)}?rel=0&showinfo=0&modestbranding=1`}
                title="Featured video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Secondary Articles Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article, index) => (
            <Link key={article._id} href={`/article/${article.slug}`} className="group block">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {article.featuredImage ? (
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <PlaceholderImg height={200} index={index + 1} />
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {article.category?.name || 'News'}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center text-xs text-gray-500">
                    <span>{timeAgo(article.publishedAt)}</span>
                    {article.author?.name && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{article.author.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
