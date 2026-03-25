'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const PRIMARY_LINKS = [
  'Top Stories', 'World', 'Technology', 'Business',
  'Sport', 'Culture', 'Health', 'Science', 'Africa'
];

function LiveClock() {
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(new Date(0));

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => setNow(new Date());
    updateTime();
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();
    const timeout = setTimeout(() => {
      updateTime();
      const id = setInterval(updateTime, 60000);
      return () => clearInterval(id);
    }, msToNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  if (!isMounted) return null;

  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
      <span style={{
        color: '#fff',
        fontSize: '18px',
        fontWeight: '300',
        fontFamily: 'Georgia, serif',
        letterSpacing: '0.08em',
        lineHeight: 1.1,
      }}>
        {timeStr}
      </span>
      <span style={{
        color: 'rgba(255,255,255,0.5)',
        fontSize: '9px',
        fontWeight: '600',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        lineHeight: 1,
        marginTop: '3px',
      }}>
        {dateStr}
      </span>
    </div>
  );
}

export default function Navbar() {
  const tickerTitles = useQuery(api.articles.getTickerTitles);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Top Stories');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  useEffect(() => {
    if (tickerTitles && tickerIndex >= tickerTitles.length) setTickerIndex(0);
  }, [tickerTitles, tickerIndex]);

  useEffect(() => {
    if (!tickerTitles || tickerTitles.length === 0) return;
    const id = setInterval(() => {
      setTickerVisible(false);
      setTimeout(() => {
        setTickerIndex((i) => (i + 1) % tickerTitles.length);
        setTickerVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, [tickerTitles]);

  return (
    <>
      <style>{`
        .ha-navbar * { box-sizing: border-box; }

        /* ── Top bar ── */
        .ha-topbar {
          background-color: #4a5c2f;
          width: 100%;
        }
        .ha-topbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          height: 64px;
          gap: 10px;
        }

        /* Logo block */
        .ha-logo-link { text-decoration: none; display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
        .ha-logo-svg { width: 46px; height: 46px; flex-shrink: 0; }
        .ha-logo-divider {
          width: 1px; height: 32px;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }
        .ha-wordmark { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .ha-wordmark-title {
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          font-family: Georgia, 'Times New Roman', serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
          line-height: 1;
        }
        .ha-wordmark-sub {
          color: #e8c97a;
          font-size: 9px;
          font-style: italic;
          font-family: Georgia, 'Times New Roman', serif;
          letter-spacing: 0.08em;
          white-space: nowrap;
          opacity: 0.85;
          line-height: 1;
        }

        /* Clock */
        .ha-clock { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
        .ha-clock-sep { width: 1px; height: 28px; background: rgba(255,255,255,0.2); flex-shrink: 0; margin-left: 2px; }

        /* Search + hamburger buttons */
        .ha-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 4px;
          transition: background 0.15s;
        }
        .ha-icon-btn:hover { background: rgba(255,255,255,0.12); }

        /* ── Category tabs ── */
        .ha-tabs {
          background: #bb1919;
          border-top: 1px solid rgba(255,255,255,0.2);
          width: 100%;
        }
        .ha-tabs-inner {
          max-width: 1280px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          display: flex;
          align-items: stretch;
        }
        .ha-tabs-inner::-webkit-scrollbar { display: none; }
        .ha-tab {
          display: inline-flex;
          align-items: center;
          padding: 9px 13px;
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.9);
          background: transparent;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          border-bottom: 2px solid transparent;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.01em;
          font-family: Helvetica, Arial, sans-serif;
        }
        .ha-tab:hover { background: rgba(255,255,255,0.12); }
        .ha-tab.active {
          font-weight: 700;
          color: #bb1919;
          background: white;
          border-bottom-color: transparent;
        }

        /* ── Ticker ── */
        .ha-ticker {
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
          width: 100%;
        }
        .ha-ticker-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          height: 34px;
          overflow: hidden;
        }
        .ha-live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4a5c2f;
          flex-shrink: 0;
          animation: livePulse 1.5s ease-in-out infinite;
        }
        .ha-live-label {
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          flex-shrink: 0;
          font-family: Helvetica, Arial, sans-serif;
        }
        .ha-ticker-sep { width: 1px; height: 14px; background: #333; flex-shrink: 0; }
        .ha-ticker-text {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: rgba(255,255,255,0.88);
          font-size: 12px;
          font-weight: 500;
          font-family: Helvetica, Arial, sans-serif;
          transition: opacity 0.3s ease;
        }
        .ha-ticker-dots { display: flex; gap: 4px; flex-shrink: 0; }
        .ha-ticker-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }

        /* ── Mobile drawer ── */
        .ha-drawer {
          background: #3a4a24;
          border-top: 1px solid rgba(255,255,255,0.15);
          width: 100%;
          animation: drawerDown 0.2s ease;
        }
        .ha-drawer-inner { max-width: 1280px; margin: 0 auto; padding: 4px 12px 8px; }
        .ha-drawer-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.92);
          font-size: 14px;
          font-weight: 600;
          padding: 11px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          font-family: Helvetica, Arial, sans-serif;
          transition: background 0.15s;
          border-radius: 4px;
        }
        .ha-drawer-link:hover { background: rgba(255,255,255,0.08); }
        .ha-drawer-link:last-child { border-bottom: none; }

        /* ── MOBILE BREAKPOINTS ── */

        /* Tablet: hide wordmark tagline, shrink logo */
        @media (max-width: 768px) {
          .ha-wordmark-sub { display: none; }
          .ha-wordmark-title { font-size: 14px; letter-spacing: 0.10em; }
          .ha-logo-svg { width: 40px; height: 40px; }
          .ha-topbar-inner { height: 56px; }
        }

        /* Phone: compact but keep wordmark title visible */
        @media (max-width: 520px) {
          .ha-topbar-inner { padding: 0 10px; gap: 6px; height: 52px; }
          .ha-logo-svg { width: 34px; height: 34px; }
          .ha-logo-divider { display: none; }
          .ha-wordmark-sub { display: none; }
          .ha-wordmark-title { font-size: 12px; letter-spacing: 0.08em; }
          .ha-clock-sep { margin-left: 0; }
        }

        /* Very small phones: minimal layout */
        @media (max-width: 360px) {
          .ha-logo-svg { width: 28px; height: 28px; }
          .ha-icon-btn { padding: 6px; }
          .ha-topbar-inner { gap: 4px; padding: 0 8px; height: 48px; }
          .ha-tab { padding: 8px 10px; font-size: 12px; }
          .ha-wordmark-title { font-size: 11px; letter-spacing: 0.05em; }
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes drawerDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="ha-navbar w-full sticky top-0 z-50">

        {/* ── Top bar ── */}
        <div className="ha-topbar">
          <div className="ha-topbar-inner">

            {/* Hamburger */}
            <button
              className="ha-icon-btn"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="ha-logo-link">
              <svg className="ha-logo-svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#071428"/>
                    <stop offset="100%" stopColor="#0D2247"/>
                  </linearGradient>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF8B30"/>
                    <stop offset="40%" stopColor="#F5D680"/>
                    <stop offset="100%" stopColor="#C9961F"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="softglow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <circle cx="250" cy="250" r="245" fill="url(#bgGrad)"/>
                <circle cx="250" cy="250" r="243" fill="none" stroke="url(#goldGrad)" strokeWidth="2"/>
                <circle cx="250" cy="185" r="62" fill="none" stroke="url(#goldGrad)" strokeWidth="2.2" filter="url(#glow)"/>
                <ellipse cx="250" cy="185" rx="34" ry="62" fill="none" stroke="url(#goldGrad)" strokeWidth="1.6" strokeOpacity="0.85"/>
                <line x1="188" y1="185" x2="312" y2="185" stroke="url(#goldGrad)" strokeWidth="1.3" strokeOpacity="0.7"/>
                <circle cx="250" cy="123" r="5.5" fill="#F5D680" filter="url(#softglow)"/>
                <circle cx="250" cy="123" r="11" fill="none" stroke="#F5D680" strokeWidth="1.2" strokeOpacity="0.55" filter="url(#glow)"/>
                <path id="topArc" d="M 50,250 A 200,200 0 0,1 450,250" fill="none"/>
                <text fontFamily="Georgia, serif" fontSize="26" fontWeight="700" letterSpacing="14" fill="url(#goldGrad)">
                  <textPath href="#topArc" startOffset="50%" textAnchor="middle">HIRWA AMBASSADEUR</textPath>
                </text>
                <path id="bottomArc" d="M 60,260 A 190,190 0 0,0 440,260" fill="none"/>
                <text fontFamily="Georgia, serif" fontSize="13.5" fontStyle="italic" letterSpacing="5" fill="#C9A84C" fillOpacity="0.85">
                  <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">L'information au cœur du monde</textPath>
                </text>
                <line x1="170" y1="265" x2="330" y2="265" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.5"/>
                <text x="250" y="292" fontFamily="Georgia, serif" fontSize="13" letterSpacing="8" fill="#FFFFFF" fillOpacity="0.7" textAnchor="middle">· NEWS ·</text>
                <line x1="170" y1="308" x2="330" y2="308" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.5"/>
                <text x="178" y="291" fontSize="9" fill="#F5D680" fillOpacity="0.6" textAnchor="middle">✦</text>
                <text x="322" y="291" fontSize="9" fill="#F5D680" fillOpacity="0.6" textAnchor="middle">✦</text>
              </svg>

              <div className="ha-logo-divider" />

              <div className="ha-wordmark">
                <span className="ha-wordmark-title">Hirwa Ambassadeur</span>
                <span className="ha-wordmark-sub">L&apos;information au cœur du monde</span>
              </div>
            </Link>

            {/* Spacer pushes clock + search to right */}
            <div style={{ flex: 1 }} />

            {/* Clock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="ha-clock-sep" />
              <LiveClock />
            </div>

            {/* Search */}
            <Link href="/search" aria-label="Search" className="ha-icon-btn" style={{ textDecoration: 'none' }}>
              <svg width="19" height="19" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Category tabs ── */}
        <div className="ha-tabs">
          <div className="ha-tabs-inner">
            {PRIMARY_LINKS.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => setActiveTab(cat)}
                className={`ha-tab${activeTab === cat ? ' active' : ''}`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Live ticker ── */}
        {tickerTitles && tickerTitles.length > 0 && (
          <div className="ha-ticker">
            <div className="ha-ticker-inner">
              <span className="ha-live-dot" />
              <span className="ha-live-label">LIVE</span>
              <div className="ha-ticker-sep" />
              <span
                className="ha-ticker-text"
                style={{ opacity: tickerVisible ? 1 : 0 }}
              >
                {tickerTitles[tickerIndex]}
              </span>
              <div className="ha-ticker-dots">
                {tickerTitles.map((_, i) => (
                  <button
                    key={i}
                    className="ha-ticker-dot"
                    onClick={() => { setTickerIndex(i); setTickerVisible(true); }}
                    style={{ backgroundColor: i === tickerIndex ? 'white' : 'rgba(255,255,255,0.28)' }}
                    aria-label={`Ticker item ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div className="ha-drawer">
            <div className="ha-drawer-inner">
              {PRIMARY_LINKS.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(' ', '-')}`}
                  className="ha-drawer-link"
                  onClick={() => { setMenuOpen(false); setActiveTab(cat); }}
                >
                  <svg width="4" height="4" viewBox="0 0 4 4" fill="#e8c97a">
                    <circle cx="2" cy="2" r="2"/>
                  </svg>
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

      </header>
    </>
  );
}