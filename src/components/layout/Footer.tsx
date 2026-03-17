'use client';

'use client';

import Link from 'next/link';

const footerSections = [
  {
    title: 'News',
    links: [
      { label: 'Top Stories',   href: '/' },
      { label: 'Africa',        href: '/categories/africa' },
      { label: 'World',         href: '/categories/world' },
      { label: 'Politics',      href: '/categories/politics' },
      { label: 'Business',      href: '/categories/business' },
    ],
  },
  {
    title: 'Topics',
    links: [
      { label: 'Technology',    href: '/categories/technology' },
      { label: 'Health',        href: '/categories/health' },
      { label: 'Sports',        href: '/categories/sports' },
      { label: 'Entertainment', href: '/categories/entertainment' },
      { label: 'Science',       href: '/categories/science' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',      href: '/about' },
      { label: 'Our Team',      href: '/team' },
      { label: 'Careers',       href: '/careers' },
      { label: 'Advertise',     href: '/advertise' },
      { label: 'Contact',       href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '/privacy' },
      { label: 'Terms of Service',  href: '/terms' },
      { label: 'Cookie Policy',     href: '/cookies' },
      { label: 'Editorial Policy',  href: '/editorial' },
      { label: 'Corrections',       href: '/corrections' },
    ],
  },
];

const socials = [
  {
    label: 'X / Twitter',
    href: 'https://twitter.com',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'M16 2H8a6 6 0 00-6 6v8a6 6 0 006 6h8a6 6 0 006-6V8a6 6 0 00-6-6zm4 14a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4v8zm-8-9a5 5 0 100 10A5 5 0 0012 7zm0 8a3 3 0 110-6 3 3 0 010 6zm5.5-9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  },
  {
    label: 'WhatsApp',
    href: 'https://whatsapp.com',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      background: '#060e08',
      borderTop: '3px solid #c9a84c',
      marginTop: 0,
    }}>

      {/* ── Newsletter banner ───────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0b1e10 0%, #162d1c 50%, #0b1e10 100%)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        padding: 'clamp(28px,4vw,44px) 16px',
      }}>
        <div style={{
          maxWidth: 780, margin: '0 auto',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 16, textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 20, padding: '4px 14px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: '#c9a84c', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Daily Briefing
            </span>
          </div>

          <h2 style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700,
            color: '#f0e8d0', letterSpacing: '-0.3px', lineHeight: 1.25,
          }}>
            Stay informed. Stay ahead.
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(160,184,168,0.7)', lineHeight: 1.6, maxWidth: 480 }}>
            Get Kigali's most important stories — politics, business, culture — delivered to your inbox every morning.
          </p>

          <form
            onSubmit={e => e.preventDefault()}
            style={{
              display: 'flex', gap: 8, width: '100%', maxWidth: 460,
              flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              style={{
                flex: 1, minWidth: 200,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.22)',
                borderRadius: 3, padding: '11px 14px',
                color: '#e0d0a0', fontSize: 13, outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e   => (e.target.style.borderColor = 'rgba(201,168,76,0.55)')}
              onBlur={e    => (e.target.style.borderColor = 'rgba(201,168,76,0.22)')}
            />
            <button type="submit" style={{
              background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
              border: 'none', borderRadius: 3, padding: '11px 22px',
              color: '#0b1e10', fontWeight: 900, fontSize: 11,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'filter 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >Subscribe Free</button>
          </form>
          <p style={{ fontSize: 10, color: '#2e5a3a', letterSpacing: '0.04em' }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* ── Main footer grid ────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(201,168,76,0.08)', padding: 'clamp(36px,5vw,56px) 16px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="ha-footer-grid">

            {/* Brand column */}
            <div>
              {/* Masthead */}
              <div style={{ marginBottom: 18 }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 22, color: '#c9a84c',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: 400, lineHeight: 1.1, marginBottom: 4,
                }}>Hirwa Ambassadeur</div>
                <div style={{ fontSize: 9, color: '#2e5a3a', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  Independent · Courageous · Trusted
                </div>
              </div>

              {/* Mission */}
              <p style={{
                fontSize: 13, color: 'rgba(160,184,168,0.55)',
                lineHeight: 1.7, marginBottom: 22, maxWidth: 280,
              }}>
                Providing independent, courageous journalism from East Africa and the world since 2024.
                Holding power to account — one story at a time.
              </p>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(201,168,76,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      textDecoration: 'none',
                      transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.14)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#c9a84c">
                      <path d={s.icon}/>
                    </svg>
                  </a>
                ))}
              </div>

              {/* Location tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 20,
                background: 'rgba(201,168,76,0.05)',
                border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: 3, padding: '6px 10px',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.6)', letterSpacing: '0.08em' }}>Kigali, Rwanda</span>
              </div>
            </div>

            {/* Link columns */}
            {footerSections.map(section => (
              <div key={section.title}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: '#c9a84c',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  marginBottom: 16, paddingBottom: 10,
                  borderBottom: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2, flexShrink: 0 }} />
                  {section.title}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} style={{
                        display: 'block', padding: '5px 0',
                        fontSize: 13, color: 'rgba(160,184,168,0.5)',
                        textDecoration: 'none', letterSpacing: '0.02em',
                        transition: 'color 0.15s, padding-left 0.15s',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#c9a84c';
                          e.currentTarget.style.paddingLeft = '6px';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(160,184,168,0.5)';
                          e.currentTarget.style.paddingLeft = '0';
                        }}
                      >{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div style={{ padding: '16px' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 12,
        }}>
          {/* Copyright */}
          <span style={{ fontSize: 11, color: '#1e3d28', letterSpacing: '0.06em' }}>
            © {year} Hirwa Ambassadeur. All rights reserved.
          </span>

          {/* Legal mini links */}
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {['Privacy Policy', 'Terms', 'Cookies', 'Sitemap'].map(item => (
              <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} style={{
                fontSize: 11, color: '#1e3d28', textDecoration: 'none',
                letterSpacing: '0.04em', transition: 'color 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1e3d28')}
              >{item}</Link>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 3, padding: '6px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              color: '#c9a84c', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.08)')}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Back to top
          </button>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .ha-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px 40px;
        }

        @media (min-width: 560px) {
          .ha-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 900px) {
          .ha-footer-grid {
            grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  );
}