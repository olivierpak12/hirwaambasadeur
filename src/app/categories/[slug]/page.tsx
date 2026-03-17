'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories: Record<string, { label: string; description: string; color: string }> = {
  politics:      { label: 'Politics',      description: 'Government, elections, policy, and power.',         color: '#1a3d28' },
  business:      { label: 'Business',      description: 'Markets, economy, companies, and finance.',         color: '#1a2a3d' },
  technology:    { label: 'Technology',    description: 'AI, science, innovation, and digital world.',        color: '#2a1a3d' },
  health:        { label: 'Health',        description: 'Medicine, wellness, and public health.',             color: '#1a3d30' },
  sports:        { label: 'Sports',        description: 'Scores, transfers, and sporting events.',            color: '#3d1a1a' },
  entertainment: { label: 'Entertainment', description: 'Culture, film, music, and lifestyle.',               color: '#3d2a1a' },
  africa:        { label: 'Africa',        description: 'News and stories from across the continent.',        color: '#2a3d1a' },
  world:         { label: 'World',         description: 'International affairs and global developments.',     color: '#1a1a3d' },
};

const SORT_OPTIONS = ['Latest', 'Most Read', 'Oldest'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function PlaceholderImg({ index, height = 180 }: { index: number; height?: number }) {
  const palettes = [
    ['#1a3c5e','#2e6da4'], ['#1a3d28','#2e7d4a'], ['#3b1a1a','#bb1919'],
    ['#2a1a3b','#6e3db8'], ['#3b2a1a','#b86e1a'], ['#1a2e3b','#1a7a7a'],
    ['#2e2e1a','#8a8a1a'], ['#1a1a3b','#1a1abb'],
  ];
  const [bg, fg] = palettes[index % palettes.length];
  return (
    <div style={{
      height, width: '100%',
      background: `linear-gradient(135deg, ${bg} 0%, ${fg} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.25">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ─── Hero card (first article, large) ────────────────────────────────────────
function HeroCard({ article, categoryLabel, index }: { article: any; categoryLabel: string; index: number }) {
  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
          border: '1px solid #e0dbd0',
          transition: 'box-shadow 0.2s, transform 0.2s',
          background: '#fff',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.13)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ position: 'relative' }}>
          <PlaceholderImg index={index} height={260} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 18,
          }}>
            <span style={{
              display: 'inline-block', background: '#c9a84c', color: '#0f2318',
              fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '2px 8px', borderRadius: 2, marginBottom: 8,
              width: 'fit-content',
            }}>{categoryLabel}</span>
            <h2 style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 700,
              color: '#fff', lineHeight: 1.3, margin: 0,
            }}>{article.title}</h2>
          </div>
        </div>
        <div style={{ padding: '14px 16px 16px' }}>
          <p style={{
            fontSize: 13, color: '#555', lineHeight: 1.55, margin: '0 0 12px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{article.excerpt}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999' }}>
            <span style={{ fontWeight: 600, color: '#555' }}>{article.author?.name}</span>
            <span>{timeAgo(article.publishedAt)} · {article.readTime} read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── List card (compact horizontal) ──────────────────────────────────────────
function ListCard({ article, categoryLabel, index }: { article: any; categoryLabel: string; index: number }) {
  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          display: 'flex', gap: 12, padding: '14px 0',
          borderBottom: '1px solid #eee', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#faf8f2')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div style={{ flexShrink: 0, width: 96, borderRadius: 3, overflow: 'hidden' }}>
          <PlaceholderImg index={index} height={72} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, color: '#c9a84c',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>{categoryLabel}</span>
          <h3 style={{
            fontFamily: 'Georgia, serif', fontSize: 14, fontWeight: 700,
            color: '#1a1a1a', lineHeight: 1.35, margin: '4px 0 6px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{article.title}</h3>
          <div style={{ fontSize: 11, color: '#999', display: 'flex', gap: 8 }}>
            <span>{article.author?.name}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
            <span>·</span>
            <span>{(article.views || 0).toLocaleString()} views</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const cat = categories[categorySlug] || { label: 'News', description: 'Latest news and updates.', color: '#1a3d28' };

  const articles = useQuery(api.articles.getArticlesByCategory, { categorySlug });

  const [sort, setSort] = useState('Latest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const sorted = [...(articles || [])].sort((a, b) => {
    if (sort === 'Most Read') return (b.views || 0) - (a.views || 0);
    if (sort === 'Oldest') return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const visible = sorted.slice(0, page * PER_PAGE);
  const hasMore = visible.length < sorted.length;

  const [hero, ...rest] = visible;

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', minHeight: '100vh', background: '#f5f3ee' }}>

      {/* ── Category hero header ── */}
      <div style={{
        background: cat.color,
        padding: 'clamp(28px, 5vw, 52px) 0',
        borderBottom: '4px solid #c9a84c',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative background text */}
        <div style={{
          position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)',
          fontSize: 'clamp(60px, 12vw, 120px)', fontWeight: 900,
          color: 'rgba(255,255,255,0.04)', lineHeight: 1,
          textTransform: 'uppercase', letterSpacing: '-4px',
          userSelect: 'none', pointerEvents: 'none',
          fontFamily: 'Georgia, serif',
        }}>{cat.label}</div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', position: 'relative' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <Link href="/" style={{ color: 'rgba(201,168,76,0.65)', fontSize: 11, textDecoration: 'none', letterSpacing: '0.08em' }}>Home</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ color: '#c9a84c', fontSize: 11, letterSpacing: '0.08em' }}>{cat.label}</span>
          </div>

          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700,
            color: '#f0ece0', lineHeight: 1.1, marginBottom: 10,
            letterSpacing: '-0.5px',
          }}>{cat.label}</h1>

          <p style={{ color: '#a0b8a8', fontSize: 14, marginBottom: 18 }}>
            {cat.description}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { icon: '📰', value: `${(articles?.length ?? 0)} articles` },
              { icon: '🕒', value: 'Updated daily' },
              { icon: '🌍', value: 'East Africa focus' },
            ].map(s => (
              <div key={s.value} style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: 20,
                padding: '4px 12px', fontSize: 11, color: '#a0b8a8',
                border: '1px solid rgba(201,168,76,0.18)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>{s.icon}</span><span>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e4dc', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          height: 44,
        }}>
          {/* Sort */}
          <div style={{ display: 'flex', gap: 2 }}>
            {SORT_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setSort(opt)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 10px', fontSize: 11, fontWeight: sort === opt ? 700 : 400,
                color: sort === opt ? '#c9a84c' : '#888',
                borderBottom: sort === opt ? '2px solid #c9a84c' : '2px solid transparent',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                transition: 'color 0.15s',
              }}>{opt}</button>
            ))}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} title={v} style={{
                width: 30, height: 30, borderRadius: 3,
                border: view === v ? '1.5px solid #c9a84c' : '1px solid #e0dbd0',
                background: view === v ? '#fff8e8' : '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: view === v ? '#c9a84c' : '#aaa',
              }}>
                {v === 'grid' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 48px' }}>

        {view === 'grid' ? (
          <>
            {/* Hero + sidebar grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16, marginBottom: 16,
            }}>
              {hero && <HeroCard article={hero} categoryLabel={cat.label} index={0} />}
              {rest.slice(0, 2).map((a, i) => (
                <HeroCard key={a._id} article={a} categoryLabel={cat.label} index={i + 1} />
              ))}
            </div>

            {/* Remaining grid */}
            {rest.length > 2 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}>
                {rest.slice(2).map((a, i) => (
                  <HeroCard key={a._id} article={a} categoryLabel={cat.label} index={i + 3} />
                ))}
              </div>
            )}
          </>
        ) : (
          /* List view */
          <div style={{ background: '#fff', borderRadius: 4, border: '1px solid #e8e4dc', padding: '0 16px' }}>
            {visible.map((a, i) => (
              <ListCard key={a._id} article={a} categoryLabel={cat.label} index={i} />
            ))}
          </div>
        )}

        {/* Load more / pagination */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {hasMore ? (
            <button
              onClick={() => setPage(p => p + 1)}
              style={{
                background: '#0f2318', color: '#c9a84c',
                border: '1px solid rgba(201,168,76,0.3)',
                padding: '12px 40px', borderRadius: 3, fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', fontWeight: 700,
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a3d28'; e.currentTarget.style.color = '#e0c870'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0f2318'; e.currentTarget.style.color = '#c9a84c'; }}
            >Load More Articles</button>
          ) : (
            <p style={{ fontSize: 12, color: '#bbb', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              All {sorted.length} articles loaded
            </p>
          )}
        </div>
      </div>

      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
    </div>
  );
}