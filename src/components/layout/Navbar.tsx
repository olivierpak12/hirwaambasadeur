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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      setNow(new Date());
      const id = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(id);
    }, msToNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const dayStr = now.toLocaleDateString('en-GB', { weekday: 'short' });
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <style>{`
        .ha-clock-divider { display: flex !important; }
        .ha-clock-date { display: flex !important; }
        @media (max-width: 480px) {
          .ha-clock-divider { display: none !important; }
          .ha-clock-date { display: none !important; }
          .ha-clock-time { font-size: 16px !important; letter-spacing: 0.04em !important; }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Vertical divider — hidden on mobile */}
        <div className="ha-clock-divider" style={{
          width: '1px',
          height: '34px',
          backgroundColor: 'rgba(255,255,255,0.2)',
        }} />

        {/* Clock content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          {/* Time */}
          <span className="ha-clock-time" style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '300',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.06em',
            lineHeight: 1,
          }}>
            {timeStr}
          </span>
          {/* Date — hidden on mobile */}
          <div className="ha-clock-date" style={{ alignItems: 'center', gap: '5px' }}>
            <span style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '8px',
              fontWeight: '600',
              fontFamily: 'Helvetica, Arial, sans-serif',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {dayStr}
            </span>
            <span style={{
              width: '3px', height: '3px',
              borderRadius: '50%',
              backgroundColor: '#e8c97a',
              display: 'inline-block',
              flexShrink: 0,
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '8px',
              fontWeight: '600',
              fontFamily: 'Helvetica, Arial, sans-serif',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {dateStr}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const tickerTitles = useQuery(api.articles.getTickerTitles);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Top Stories');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerVisible, setTickerVisible] = useState(true);

  useEffect(() => {
    if (tickerTitles && tickerIndex >= tickerTitles.length) {
      setTickerIndex(0);
    }
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
    <header className="w-full sticky top-0 z-50" style={{ fontFamily: "'BBC Reith Sans', Helvetica, Arial, sans-serif" }}>

      {/* ── Top bar ── */}
      <div style={{ backgroundColor: '#4a5c2f' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          gap: '12px',
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
              flexShrink: 0,
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

          {/* Left: Logo */}
          <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', height: '60px' }}>
              <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" width="60" height="60" style={{ flexShrink: 0 }}>
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
                  <linearGradient id="goldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A0722A"/>
                    <stop offset="50%" stopColor="#F0C84A"/>
                    <stop offset="100%" stopColor="#BF8B30"/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="softglow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Circular background */}
                <circle cx="250" cy="250" r="245" fill="url(#bgGrad)"/>

                {/* Outer ring border */}
                <circle cx="250" cy="250" r="243" fill="none" stroke="url(#goldGrad)" strokeWidth="2"/>
                <circle cx="250" cy="250" r="236" fill="none" stroke="url(#goldGrad)" strokeWidth="0.6" strokeOpacity="0.4"/>

                {/* Globe icon (center, scaled up) */}
                <circle cx="250" cy="185" r="62" fill="none" stroke="url(#goldGrad)" strokeWidth="2.2" filter="url(#glow)"/>
                <ellipse cx="250" cy="185" rx="34" ry="62" fill="none" stroke="url(#goldGrad)" strokeWidth="1.6" strokeOpacity="0.85"/>
                <line x1="188" y1="185" x2="312" y2="185" stroke="url(#goldGrad)" strokeWidth="1.3" strokeOpacity="0.7"/>
                <circle cx="250" cy="123" r="5.5" fill="#F5D680" filter="url(#softglow)"/>
                <circle cx="250" cy="123" r="11" fill="none" stroke="#F5D680" strokeWidth="1.2" strokeOpacity="0.55" filter="url(#glow)"/>
                <circle cx="250" cy="123" r="18" fill="none" stroke="#F5D680" strokeWidth="0.8" strokeOpacity="0.28"/>

                {/* Circular text - TOP ARC: HIRWA AMBASSADEUR */}
                <path id="topArc" d="M 50,250 A 200,200 0 0,1 450,250" fill="none"/>
                <text fontFamily="'Georgia', 'Times New Roman', serif" fontSize="26" fontWeight="700" letterSpacing="14" fill="url(#goldGrad)">
                  <textPath href="#topArc" startOffset="50%" textAnchor="middle">HIRWA AMBASSADEUR</textPath>
                </text>

                {/* Circular text - BOTTOM ARC: tagline */}
                <path id="bottomArc" d="M 60,260 A 190,190 0 0,0 440,260" fill="none"/>
                <text fontFamily="'Georgia', 'Times New Roman', serif" fontSize="13.5" fontStyle="italic" letterSpacing="5" fill="#C9A84C" fillOpacity="0.85">
                  <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">L'information au cœur du monde</textPath>
                </text>

                {/* Center text */}
                <line x1="170" y1="265" x2="330" y2="265" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.5"/>
                <text x="250" y="292" fontFamily="'Georgia', 'Times New Roman', serif" fontSize="13" letterSpacing="8" fill="#FFFFFF" fillOpacity="0.7" textAnchor="middle">· NEWS ·</text>
                <line x1="170" y1="308" x2="330" y2="308" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.5"/>
                <text x="178" y="291" fontSize="9" fill="#F5D680" fillOpacity="0.6" textAnchor="middle">✦</text>
                <text x="322" y="291" fontSize="9" fill="#F5D680" fillOpacity="0.6" textAnchor="middle">✦</text>
                <circle cx="250" cy="7" r="3" fill="#F5D680" fillOpacity="0.5"/>
                <circle cx="250" cy="493" r="3" fill="#F5D680" fillOpacity="0.5"/>
              </svg>
            </div>
          </Link>

          {/* Right: Live clock */}
          <LiveClock />

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
              flexShrink: 0,
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
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
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
        <div style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4a5c2f',
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
            <div style={{ width: '1px', height: '16px', backgroundColor: '#444', flexShrink: 0 }} />
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
        <div style={{ backgroundColor: '#3a4a24', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
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
        div::-webkit-scrollbar { display: none; }
        @media (max-width: 480px) {
          .ha-wordmark { font-size: 13px !important; letter-spacing: 0.08em !important; }
        }
      `}</style>
    </header>
  );
}