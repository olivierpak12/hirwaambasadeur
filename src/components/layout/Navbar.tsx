'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const categories = [
  { name: 'Home',          slug: '/' },
  { name: 'Africa',        slug: '/categories/africa' },
  { name: 'World',         slug: '/categories/world' },
  { name: 'Politics',      slug: '/categories/politics' },
  { name: 'Business',      slug: '/categories/business' },
  { name: 'Technology',    slug: '/categories/technology' },
  { name: 'Health',        slug: '/categories/health' },
  { name: 'Sports',        slug: '/categories/sports' },
  { name: 'Entertainment', slug: '/categories/entertainment' },
];

const quickLinks = ['Politics', 'Business', 'Technology', 'Health', 'Sports'];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [query, setQuery]           = useState('');
  const [active, setActive]         = useState('/');
  const searchRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  /* scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* focus search input */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* HEADER                                                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        transition: 'box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.48)' : 'none',
      }}>

        {/* ── Eyebrow bar ───────────────────────────────────────────────── */}
        <div style={{ background: '#040a06', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '4px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Est. 2024 · Kigali, Rwanda
            </span>

            {/* Quick links — desktop only */}
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              {quickLinks.map(cat => (
                <Link key={cat} href={`/categories/${cat.toLowerCase()}`}
                  style={{
                    fontSize: 10, color: 'rgba(160,184,168,0.45)',
                    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(160,184,168,0.45)')}
                >{cat}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Brand bar ─────────────────────────────────────────────────── */}
        <div style={{ background: '#0b1e10', padding: '11px 0 8px' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '0 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                flexShrink: 0, padding: '4px 0',
                display: 'flex', flexDirection: 'column', gap: 5,
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 22, height: 2,
                  borderRadius: 2, background: '#c9a84c',
                  transition: 'transform 0.26s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : i === 1 ? 'scaleX(0)'
                    : 'rotate(-45deg) translate(5px, -5px)'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>

            {/* Logo — centred */}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 'clamp(15px, 3.8vw, 30px)',
                  color: '#c9a84c', letterSpacing: '0.22em',
                  textTransform: 'uppercase', fontWeight: 400, lineHeight: 1.1,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#e8c96a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#c9a84c')}
                >Hirwa Ambassadeur</div>
              </Link>
              <div style={{
                fontSize: 9, color: '#2e5a3a',
                letterSpacing: '0.32em', textTransform: 'uppercase', marginTop: 3,
              }}>Independent · Courageous · Trusted</div>
            </div>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(v => !v)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                flexShrink: 0, padding: 6,
                color: searchOpen ? '#c9a84c' : '#3d6a4a',
                transition: 'color 0.2s',
              }}
            >
              {searchOpen
                ? (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
                  </svg>
                )}
            </button>
          </div>

          {/* Animated search bar */}
          <div style={{
            maxHeight: searchOpen ? 58 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <div style={{ padding: '8px 16px' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8 }}>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search Hirwa Ambassadeur…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(201,168,76,0.22)',
                    borderRadius: 3, padding: '8px 12px',
                    color: '#e0d0a0', fontSize: 13, outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,168,76,0.55)')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(201,168,76,0.22)')}
                />
                <button style={{
                  background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
                  border: 'none', borderRadius: 3,
                  padding: '8px 18px',
                  color: '#0b1e10', fontWeight: 900, fontSize: 10,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'filter 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
                  onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
                >GO</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Category nav strip ────────────────────────────────────────── */}
        <div style={{
          background: '#162d1c',
          borderBottom: '3px solid #c9a84c',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <style>{`::-webkit-scrollbar{display:none}`}</style>
          <div style={{
            maxWidth: 1280, margin: '0 auto',
            padding: '0 8px',
            display: 'flex', minWidth: 'max-content',
          }}>
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={cat.slug}
                onClick={() => setActive(cat.slug)}
                style={{
                  display: 'block',
                  color: active === cat.slug ? '#c9a84c' : 'rgba(160,184,168,0.65)',
                  fontSize: 11, fontWeight: active === cat.slug ? 800 : 500,
                  padding: '9px 13px',
                  borderBottom: active === cat.slug ? '3px solid #c9a84c' : '3px solid transparent',
                  marginBottom: -3,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  whiteSpace: 'nowrap', textDecoration: 'none',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { if (active !== cat.slug) e.currentTarget.style.color = 'rgba(201,168,76,0.8)'; }}
                onMouseLeave={e => { if (active !== cat.slug) e.currentTarget.style.color = 'rgba(160,184,168,0.65)'; }}
              >{cat.name}</Link>
            ))}
          </div>
        </div>

        {/* ── Date bar ──────────────────────────────────────────────────── */}
        <div style={{ background: '#040a06', borderTop: '1px solid rgba(201,168,76,0.06)', padding: '4px 0' }}>
          <div style={{
            maxWidth: 1280, margin: '0 auto', padding: '0 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#2e5a3a', letterSpacing: '0.06em' }}>{today}</span>
            <span style={{ fontSize: 10, color: '#2e5a3a', letterSpacing: '0.06em' }}>East Africa · World News</span>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE DRAWER                                                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s',
        }}
      />

      {/* Drawer panel */}
      <nav
        aria-label="Site navigation"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 400,
          width: 292,
          background: '#0b1e10',
          borderRight: '2px solid rgba(201,168,76,0.22)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: menuOpen ? '12px 0 48px rgba(0,0,0,0.55)' : 'none',
        }}
      >
        {/* Drawer header */}
        <div style={{
          background: '#162d1c',
          borderBottom: '1px solid rgba(201,168,76,0.14)',
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Sections
            </div>
            <div style={{ color: '#2e5a3a', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 2 }}>
              Hirwa Ambassadeur
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#6a8a74', fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
          >✕</button>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1 }}>
          {categories.map((cat, i) => {
            const isActive = active === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={cat.slug}
                onClick={() => { setActive(cat.slug); setMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: isActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                  color: isActive ? '#c9a84c' : '#8aaa94',
                  textDecoration: 'none',
                  fontSize: 13, fontWeight: isActive ? 800 : 400,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  transition: 'background 0.16s, color 0.16s',
                  animationDelay: `${i * 28}ms`,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.color = 'rgba(201,168,76,0.75)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#8aaa94';
                  }
                }}
              >
                {/* Active indicator */}
                <span style={{
                  width: 3,
                  height: isActive ? 20 : 6,
                  borderRadius: 2,
                  background: isActive ? '#c9a84c' : 'rgba(201,168,76,0.15)',
                  flexShrink: 0,
                  transition: 'height 0.22s cubic-bezier(0.4,0,0.2,1), background 0.15s',
                }} />
                {cat.name}
                {isActive && (
                  <svg style={{ marginLeft: 'auto' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                )}
              </Link>
            );
          })}
        </div>

        {/* Drawer footer */}
        <div style={{
          padding: '18px 20px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: '#070f0a',
          flexShrink: 0,
        }}>
          {/* Social row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14, justifyContent: 'center' }}>
            {[
              { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'FB', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'WA', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z' },
            ].map(s => (
              <button key={s.label} aria-label={s.label}
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(201,168,76,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#c9a84c"><path d={s.path}/></svg>
              </button>
            ))}
          </div>
          <p style={{ fontSize: 9, color: '#1e3d28', textAlign: 'center', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Hirwa Ambassadeur © 2024
          </p>
        </div>
      </nav>

      {/* Global styles */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 3px; }
        ::selection { background: rgba(201,168,76,0.18); }
        :focus-visible { outline: 2px solid #c9a84c; outline-offset: 2px; }
      `}</style>
    </>
  );
}