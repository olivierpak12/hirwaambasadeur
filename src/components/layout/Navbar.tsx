'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const PRIMARY_LINKS = [
  'Top Stories', 'World', 'Technology', 'Business',
  'Sport', 'Culture', 'Health', 'Science', 'Africa'
];

export default function Navbar() {
  const tickerTitles = useQuery(api.articles.getTickerTitles);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Top Stories');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  // Reset ticker index if titles change and index is out of bounds
  useEffect(() => {
    if (tickerTitles && tickerIndex >= tickerTitles.length) {
      setTickerIndex(0);
    }
  }, [tickerTitles, tickerIndex]);

  // Rotate ticker every 4 seconds
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
    <header className="w-full sticky top-0 z-50" style={{ fontFamily: "'BBC Reith Sans', Helvetica, Arial, sans-serif" }}>

      {/* ── Top bar: logo + search ── */}
      <div style={{ backgroundColor: '#bb1919' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}>
          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
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

          {/* Centered logo */}
          <Link href="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '5px 12px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              minWidth: '160px',
            }}>
              {/* HA monogram emblem */}
              <svg width="36" height="22" viewBox="0 0 72 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left pillar H */}
                <rect x="2" y="4" width="6" height="36" fill="#bb1919"/>
                <rect x="2" y="19" width="22" height="6" fill="#bb1919"/>
                <rect x="18" y="4" width="6" height="36" fill="#bb1919"/>
                {/* Divider */}
                <rect x="33" y="0" width="1.5" height="44" fill="#e8c97a" opacity="0.7"/>
                {/* Right pillar A */}
                <path d="M45 40 L57 4 L69 40" stroke="#bb1919" strokeWidth="6" strokeLinejoin="round" fill="none"/>
                <line x1="49" y1="27" x2="65" y2="27" stroke="#bb1919" strokeWidth="5"/>
              </svg>
              {/* Wordmark */}
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span style={{
                  display: 'block',
                  color: '#bb1919',
                  fontWeight: '900',
                  fontSize: '13px',
                  letterSpacing: '0.12em',
                  fontFamily: 'Georgia, serif',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  Hirwa Ambassadeur
                </span>
                <span style={{
                  display: 'block',
                  color: '#888',
                  fontWeight: '500',
                  fontSize: '7.5px',
                  letterSpacing: '0.25em',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  textTransform: 'uppercase',
                  marginTop: '1px',
                  whiteSpace: 'nowrap',
                }}>
                  Kigali · Rwanda
                </span>
              </div>
            </div>
          </Link>

          {/* Search */}
          <Link
            href="/search"
            aria-label="Search"
            style={{
              color: 'white',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div style={{ backgroundColor: '#bb1919', borderTop: '1px solid rgba(255,255,255,0.25)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            whiteSpace: 'nowrap',
          }}>
            {PRIMARY_LINKS.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setActiveTab(cat)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#bb1919' : 'rgba(255,255,255,0.92)',
                    backgroundColor: isActive ? 'white' : 'transparent',
                    textDecoration: 'none',
                    borderBottom: isActive ? 'none' : '3px solid transparent',
                    transition: 'all 0.15s ease',
                    letterSpacing: '0.01em',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Live ticker ── */}
      {tickerTitles && tickerTitles.length > 0 && (
      <div style={{
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '36px',
          overflow: 'hidden',
        }}>
          {/* LIVE badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#bb1919',
              display: 'inline-block',
              animation: 'livePulse 1.5s ease-in-out infinite',
            }} />
            <span style={{
              color: 'white',
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}>LIVE</span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', backgroundColor: '#444', flexShrink: 0 }} />

          {/* Ticker text */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '12.5px',
              fontWeight: '500',
              opacity: tickerVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
              display: 'inline-block',
            }}>
              {tickerTitles[tickerIndex]}
            </span>
          </div>

          {/* Navigation dots */}
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {tickerTitles.map((_, i) => (
              <button
                key={i}
                onClick={() => { setTickerIndex(i); setTickerVisible(true); }}
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: i === tickerIndex ? 'white' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background-color 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          backgroundColor: '#8b1010',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 16px' }}>
            {PRIMARY_LINKS.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase().replace(' ', '-')}`}
                onClick={() => { setMenuOpen(false); setActiveTab(cat); }}
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.92)',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 8px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        /* Hide scrollbar for category tabs */
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </header>
  );
}