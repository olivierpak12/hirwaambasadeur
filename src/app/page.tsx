'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Job, loadJobs, loadSeenJobIds, markJobsAsSeen } from '@/lib/jobs';

type Article = any;

const CATEGORIES = ['Top Stories', 'World', 'Technology', 'Business', 'Sport', 'Culture', 'Health', 'Science', 'Africa'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

function CategoryPill({ name }: { name: string }) {
  return (
    <span style={{
      background: '#bb1919',
      color: '#fff',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      padding: '2px 7px',
      borderRadius: '2px',
      display: 'inline-block',
    }}>{name}</span>
  );
}

function JobsSection({ jobs }: { jobs: Job[] }) {
  const openJobs = jobs.filter((job) => job.status === 'open');
  if (!openJobs.length) return null;

  const share = (job: Job) => {
    const url = `${window.location.origin}/job/${job.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Join our team</h2>
          <p style={{ margin: '4px 0 0', color: '#eee' }}>Explore open positions and apply directly.</p>
        </div>
        <Link href="/job" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'underline' }}>View all jobs</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {openJobs.slice(0, 3).map((job) => (
          <div key={job.id} style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 16, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>{job.title}</h3>
                <p style={{ margin: '6px 0 0', color: '#ccc', fontSize: 13 }}>{job.department} &mdash; {job.location}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => share(job)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 4, padding: '6px 10px', cursor: 'pointer', color: '#fff', fontSize: 12 }}>Share</button>
                <Link href={`/job/${job.id}`} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 4, padding: '6px 10px', color: '#fff', fontSize: 12, textDecoration: 'none' }}>View</Link>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb' }}>{job.type}</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#bbb' }}>{job.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Placeholder image (SVG inline) ─────────────────────────────────────────
function PlaceholderImg({ aspectRatio = '16/9', index = 0 }: { aspectRatio?: string; index?: number }) {
  const palettes = [
    ['#1a3c5e', '#2e6da4'],
    ['#3b1a1a', '#bb1919'],
    ['#1a3b1a', '#2e7d2e'],
    ['#2a1a3b', '#6e3db8'],
    ['#3b2a1a', '#b86e1a'],
    ['#1a2e3b', '#1a7a7a'],
    ['#2e2e1a', '#8a8a1a'],
    ['#1a1a3b', '#1a1abb'],
  ];
  const [bg, fg] = palettes[index % palettes.length];
  return (
    <div style={{
      aspectRatio,
      background: `linear-gradient(135deg, ${bg} 0%, ${fg} 100%)`,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity="0.35">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
type HeaderProps = {
  activeCategory: string;
  onCategory: (cat: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

function Header({ activeCategory, onCategory, menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#bb1919',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.22)' : 'none',
        transition: 'box-shadow 0.2s',
      }}>
        {/* Top bar */}
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 52,
        }}>
          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 5,
              padding: '6px 4px',
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: '#fff', borderRadius: 2,
                transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)') : 'none',
                transition: 'transform 0.2s',
              }} />
            ))}
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              background: '#fff', color: '#bb1919',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px',
              padding: '2px 8px', borderRadius: 3, lineHeight: 1.2,
            }}>NEWS</div>
          </div>

          {/* Search icon */}
          <button aria-label="Search" style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 6,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
            </svg>
          </button>
        </div>

        {/* Category nav (desktop) */}
        <div style={{
          background: '#a01515',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 16px',
            display: 'flex', gap: 0, minWidth: 'max-content',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => onCategory(cat)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: activeCategory === cat ? '#fff' : 'rgba(255,255,255,0.78)',
                  fontFamily: '"Helvetica Neue", Arial, sans-serif',
                  fontSize: 13, fontWeight: activeCategory === cat ? 700 : 400,
                  padding: '9px 14px',
                  borderBottom: activeCategory === cat ? '3px solid #fff' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >{cat}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.45)',
          }}
        >
          <nav
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 280,
              background: '#fff', overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{
              background: '#bb1919', padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>SECTIONS</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>✕</button>
            </div>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { onCategory(cat); setMenuOpen(false); }}
                style={{
                  background: 'none', border: 'none', borderBottom: '1px solid #eee',
                  textAlign: 'left', padding: '14px 20px',
                  fontFamily: '"Helvetica Neue", Arial, sans-serif',
                  fontSize: 15, fontWeight: activeCategory === cat ? 700 : 400,
                  color: activeCategory === cat ? '#bb1919' : '#1a1a1a',
                  cursor: 'pointer',
                }}
              >{cat}</button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

// ─── Breaking News Ticker ─────────────────────────────────────────────────────
function BreakingTicker({ articles }: { articles: Article[] }) {
  return (
    <div style={{
      background: '#1a1a1a', color: '#fff',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden', height: 36,
    }}>
      <div style={{
        background: '#bb1919', color: '#fff',
        padding: '0 14px', height: '100%',
        display: 'flex', alignItems: 'center',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        fontWeight: 800, fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
      }}>LIVE</div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'flex', gap: 48,
          animation: 'ticker 40s linear infinite',
          whiteSpace: 'nowrap',
        }}>
          {[...articles, ...articles].map((a, i) => (
            <span key={i} style={{
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ color: '#bb1919', fontWeight: 700 }}>●</span>
              <span>{a.title}</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ─── Hero (Top 2 featured) ───────────────────────────────────────────────────
function HeroSection({ articles }: { articles: Article[] }) {
  const [main, ...rest] = articles.slice(0, 3);
  if (!main) return null;

  const mainCategory = main.category?.name ?? 'News';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 2, background: '#1a1a1a',
    }}>
      {/* Main hero */}
      <div style={{
        gridColumn: 'span 2',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        minHeight: 300,
      }}>
        <PlaceholderImg aspectRatio="16/7" index={0} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 60%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '20px 18px',
        }}>
          <CategoryPill name={mainCategory} />
          <h2 style={{
            color: '#fff', margin: '7px 0 6px',
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            fontWeight: 800, fontSize: 'clamp(18px, 3vw, 28px)',
            lineHeight: 1.25, letterSpacing: '-0.2px',
          }}>{main.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 0 4px', lineHeight: 1.5 }}>
            {main.excerpt}
          </p>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{timeAgo(main.publishedAt)}</span>
        </div>
      </div>

      {/* Secondary articles */}
      {rest.map((a, i) => {
        const categoryName = a.category?.name ?? 'News';
        return (
          <div key={a._id} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', minHeight: 180 }}>
            <PlaceholderImg aspectRatio="4/3" index={i + 1} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 60%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '14px 14px',
            }}>
              <CategoryPill name={categoryName} />
              <h3 style={{
                color: '#fff', margin: '6px 0 0',
                fontFamily: '"Helvetica Neue", Arial, sans-serif',
                fontWeight: 700, fontSize: 'clamp(13px, 2vw, 16px)',
                lineHeight: 1.3,
              }}>{a.title}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Story Card (list item) ──────────────────────────────────────────────────
function StoryCard({ article, index }: { article: Article; index: number }) {
  return (
    <article style={{
      display: 'flex', gap: 12, padding: '14px 0',
      borderBottom: '1px solid #e8e8e8',
      cursor: 'pointer',
      transition: 'background 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f7f7f7')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ flexShrink: 0, width: 100, borderRadius: 2, overflow: 'hidden' }}>
        <PlaceholderImg aspectRatio="4/3" index={index} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <CategoryPill name={article.category.name} />
        <h3 style={{
          margin: '5px 0 4px',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontWeight: 700, fontSize: 15, lineHeight: 1.35,
          color: '#1a1a1a',
        }}>{article.title}</h3>
        <p style={{
          margin: '0 0 5px', fontSize: 13, color: '#4a4a4a',
          lineHeight: 1.4, display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{article.excerpt}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#767676' }}>{timeAgo(article.publishedAt)}</span>
          <span style={{ fontSize: 11, color: '#adadad' }}>·</span>
          <span style={{ fontSize: 11, color: '#767676' }}>{article.readTime} read</span>
        </div>
      </div>
    </article>
  );
}

// ─── Trending sidebar ────────────────────────────────────────────────────────
function TrendingSidebar({ articles }: { articles: Article[] }) {
  return (
    <section>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: '2px solid #bb1919', marginBottom: 12, paddingBottom: 8,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#bb1919"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        <span style={{
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1a1a1a',
        }}>Most Read</span>
      </div>
      {articles.slice(0, 5).map((a, i) => (
        <div key={a._id} style={{
          display: 'flex', gap: 12, padding: '10px 0',
          borderBottom: '1px solid #e8e8e8', cursor: 'pointer',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontSize: 24, fontWeight: 900, color: '#ddd',
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            lineHeight: 1, flexShrink: 0, width: 28, textAlign: 'center',
          }}>{i + 1}</span>
          <div>
            <h4 style={{
              margin: 0, fontSize: 14, fontWeight: 700, lineHeight: 1.3,
              color: '#1a1a1a', fontFamily: '"Helvetica Neue", Arial, sans-serif',
            }}>{a.title}</h4>
            <span style={{ fontSize: 11, color: '#767676', marginTop: 3, display: 'block' }}>
              {a.views.toLocaleString()} views · {timeAgo(a.publishedAt)}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}

// ─── Newsletter ──────────────────────────────────────────────────────────────
function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <div style={{
      background: '#1a1a1a', borderRadius: 4, padding: '20px 18px', marginTop: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#bb1919"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Newsletter</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.5 }}>
        Get the day&apos;s top stories delivered to your inbox.
      </p>
      {done ? (
        <p style={{ color: '#4caf50', fontSize: 13, fontWeight: 600 }}>✓ You&apos;re subscribed!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: '9px 12px', borderRadius: 3, border: 'none',
              fontSize: 13, background: 'rgba(255,255,255,0.12)', color: '#fff',
              outline: 'none',
            }}
          />
          <button
            onClick={() => email && setDone(true)}
            style={{
              background: '#bb1919', color: '#fff', border: 'none',
              padding: '9px', borderRadius: 3, fontWeight: 700, fontSize: 13,
              cursor: 'pointer', letterSpacing: '0.04em',
            }}
          >SIGN UP</button>
        </div>
      )}
    </div>
  );
}

// ─── Ad Placeholder ──────────────────────────────────────────────────────────
function AdBox() {
  return (
    <div style={{
      border: '1px dashed #d0d0d0', borderRadius: 4,
      background: '#f9f9f9', padding: 16,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: 160, marginBottom: 20, gap: 4,
    }}>
      <span style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1 }}>Advertisement</span>
      <span style={{ fontSize: 12, color: '#ccc' }}>Google AdSense</span>
    </div>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────
function CategorySection({ title, articles, startIndex }: { title: string; articles: Article[]; startIndex: number }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '2px solid #bb1919', paddingBottom: 8, marginBottom: 4,
      }}>
        <span style={{
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          fontWeight: 800, fontSize: 16, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#1a1a1a',
        }}>{title}</span>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#bb1919', fontSize: 12, fontWeight: 700,
          textDecoration: 'underline', padding: 0,
        }}>See all</button>
      </div>
      {articles.map((a, i) => <StoryCard key={a._id} article={a} index={startIndex + i} />)}
    </section>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const articles = useQuery(api.articles.getPublishedArticles);
  const articlesList = articles ?? [];
  const loading = articles === undefined;
  const [jobs, setJobs] = useState<Job[]>(() => loadJobs());
  const [unseenJobs, setUnseenJobs] = useState<Job[]>([]);
  const [activeCategory, setActiveCategory] = useState('Top Stories');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const latest = loadJobs();
      setJobs(latest);
      const seenIds = loadSeenJobIds();
      const unseen = latest.filter((j) => !seenIds.includes(j.id));
      if (unseen.length) setUnseenJobs(unseen);
    };

    // Update when jobs change in other tabs, when window gets focus, or when jobs are updated in this tab.
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('jobsUpdated', refresh);

    // Do an initial refresh
    refresh();

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('jobsUpdated', refresh);
    };
  }, []);

  const trending = [...articlesList].sort((a, b) => (b.views || 0) - (a.views || 0));

  const filtered = activeCategory === 'Top Stories'
    ? articlesList
    : articlesList.filter(a => a.category?.name === activeCategory);

  if (loading) {
    return (
      <>
        <Header activeCategory={activeCategory} onCategory={setActiveCategory} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div style={{
          minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f5f5f5',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, border: '3px solid #e0e0e0',
              borderTop: '3px solid #bb1919', borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <span style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: 2 }}>Loading</span>
          </div>
        </div>
      </>
    );
  }

  const dismissJobNotification = () => {
    if (unseenJobs.length) {
      markJobsAsSeen(unseenJobs.map((j) => j.id));
      setUnseenJobs([]);
    }
  };

  return (
    <div style={{ fontFamily: '"Helvetica Neue", Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <Header activeCategory={activeCategory} onCategory={setActiveCategory} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <BreakingTicker articles={articlesList.slice(0, 4)} />

      {unseenJobs.length > 0 && (
        <div style={{ position: 'fixed', bottom: 18, right: 18, zIndex: 999, width: 320, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', borderRadius: 12, background: 'rgba(0,0,0,0.9)', color: '#fff', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <strong style={{ fontSize: 14 }}>New job opening available!</strong>
              <div style={{ fontSize: 12, marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>
                {unseenJobs.length === 1 ? unseenJobs[0].title : `${unseenJobs.length} new jobs`} are now open.
              </div>
            </div>
            <button
              onClick={dismissJobNotification}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <Link
              href="/job"
              onClick={dismissJobNotification}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, background: '#bb1919', color: '#fff', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: 12 }}
            >View jobs</Link>
            <button
              onClick={dismissJobNotification}
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
            >Dismiss</button>
          </div>
        </div>
      )}

      {/* Hero */}
      {activeCategory === 'Top Stories' && <HeroSection articles={articlesList} />}

      {/* Hiring / Careers */}
      <JobsSection jobs={jobs} />

      {/* Main layout */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 0',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr)',
      }}>
        {/* Responsive two-col wrapper */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr)',
        }}>
          {/* Inner grid for desktop */}
          <div className="bbc-grid" style={{ display: 'contents' }}>
            {/* Main column */}
            <main style={{ background: '#fff', padding: '0 16px' }}>
              <CategorySection
                title={activeCategory === 'Top Stories' ? 'Latest News' : activeCategory}
                articles={filtered.length ? filtered : articlesList}
                startIndex={4}
              />
            </main>

            {/* Sidebar */}
            <aside style={{ background: '#fff', padding: '16px', borderLeft: '1px solid #e8e8e8' }}>
              <AdBox />
              <TrendingSidebar articles={trending} />
              <NewsletterBox />
            </aside>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #bb1919; border-radius: 2px; }

        .bbc-grid {
          display: grid !important;
          grid-template-columns: 1fr !important;
        }

        @media (min-width: 900px) {
          .bbc-grid {
            grid-template-columns: minmax(0, 1fr) 320px !important;
          }
        }

        article:hover h3 {
          color: #bb1919 !important;
        }
      `}</style>
    </div>
  );
}