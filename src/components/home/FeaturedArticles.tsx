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
  views?: number;
}

interface FeaturedArticlesProps {
  articles: Article[];
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
    <div style={{
      width: '100%', height,
      background: `linear-gradient(135deg, ${bg} 0%, ${fg} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity="0.2">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const others = articles.slice(1, 4);

  return (
    <section style={{ background: '#0f2318', paddingTop: 20, width: '100%' }}>
      <div style={{ width: '100%', padding: '0 16px' }}>

        {/* ── Main hero ── */}
        <Link href={`/article/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 16 }}>
          <div style={{
            position: 'relative', borderRadius: 6, overflow: 'hidden',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Image / placeholder */}
            {featured.featuredImage ? (
              <img
                src={featured.featuredImage}
                alt={featured.title}
                style={{ width: '100%', height: 'clamp(240px, 40vw, 500px)', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <PlaceholderImg height={400} index={0} />
            )}

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
            }} />

            {/* Text */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: 'clamp(16px, 3vw, 32px)',
            }}>
              {featured.category?.name && (
                <span style={{
                  display: 'inline-block',
                  background: '#c9a84c', color: '#0f2318',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '3px 10px',
                  borderRadius: 2, marginBottom: 10,
                }}>{featured.category.name}</span>
              )}

              <h2 style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 'clamp(20px, 3.5vw, 38px)',
                fontWeight: 700, color: '#fff',
                lineHeight: 1.25, marginBottom: 10,
                letterSpacing: '-0.3px',
              }}>{featured.title}</h2>

              {featured.excerpt && (
                <p style={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: 'clamp(13px, 1.5vw, 15px)',
                  lineHeight: 1.55, marginBottom: 10,
                  display: '-webkit-box',
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{featured.excerpt}</p>
              )}

              <div style={{
                display: 'flex', gap: 12, flexWrap: 'wrap',
                fontSize: 12, color: 'rgba(255,255,255,0.55)',
                alignItems: 'center',
              }}>
                {featured.author?.name && (
                  <span>By <span style={{ color: '#c9a84c', fontWeight: 600 }}>{featured.author.name}</span></span>
                )}
                <span>·</span>
                <span>{timeAgo(featured.publishedAt)}</span>
                {featured.views !== undefined && (
                  <>
                    <span>·</span>
                    <span>{featured.views.toLocaleString()} views</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* ── Secondary stories ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          paddingBottom: 20,
        }}>
          {others.map((article, index) => (
            <Link key={article._id} href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: '#1a3d28', border: '1px solid #2a4a35',
                  borderRadius: 5, overflow: 'hidden', height: '100%',
                  cursor: 'pointer',
                  transition: 'background 0.18s, transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#243f2e';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#1a3d28';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <PlaceholderImg height={130} index={index + 1} />
                  )}
                  {/* Category overlay badge */}
                  {article.category?.name && (
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: '#c9a84c', color: '#0f2318',
                      fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2,
                    }}>{article.category.name}</div>
                  )}
                </div>

                <div style={{ padding: '12px 14px 14px' }}>
                  <h3 style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 'clamp(13px, 1.8vw, 15px)',
                    fontWeight: 700, color: '#f0ece0',
                    lineHeight: 1.35, marginBottom: 8,
                    display: '-webkit-box',
                    WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{article.title}</h3>

                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 11, color: '#5a8a6a',
                  }}>
                    <span>{article.author?.name}</span>
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`* { box-sizing: border-box; }`}</style>
    </section>
  );
}