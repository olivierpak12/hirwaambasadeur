'use client';

import Link from 'next/link';

export default function Navbar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      background: '#0b1e10',
      padding: '11px 16px 8px',   /* side padding directly on header */
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>

      {/* Logo */}
      <div>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 'clamp(15px, 3.8vw, 30px)',
              color: '#c9a84c',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontWeight: 400,
              lineHeight: 1.1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#e8c96a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#c9a84c')}
          >
            Hirwa Ambassadeur
          </div>
        </Link>
        <div style={{
          fontSize: 9,
          color: '#2e5a3a',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          marginTop: 3,
        }}>
          Independent · Courageous · Trusted
        </div>
      </div>

      {/* Date */}
      <div style={{
        fontSize: 12,
        color: '#c9a84c',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        textAlign: 'right',
      }}>
        {today}
      </div>

    </header>
  );
}