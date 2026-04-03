'use client';

import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';

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
      { label: 'Submit News',   href: '/submit' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',      href: '/about' },
      { label: 'Contact',       href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
];

const socials = [
  {
    label: 'X / Twitter',
    href: 'https://x.com/ambassadeur120?s=21',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1D1WiCvy6i/?mibextid=wwXIfr',
    icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@hirwaambassadeur?si=qxpePqMSPHuzU2D9',
    icon: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/250788695514',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
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

      {/* ── Main footer grid ────────────────────────────────────────────── */}
      <div className="ha-footer-main" style={{ borderBottom: '1px solid rgba(201,168,76,0.08)', padding: 'clamp(24px,4vw,36px) 16px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="ha-footer-grid">

            {/* Brand column */}
            <div>
              {/* Masthead */}
              <div style={{ marginBottom: 12 }}>
                <div style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 20, color: '#c9a84c',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  fontWeight: 400, lineHeight: 1.1, marginBottom: 3,
                }}>Hirwa Ambassadeur</div>
                <div style={{ fontSize: 8, color: '#2e5a3a', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  Independent · Courageous · Trusted
                </div>
              </div>

              {/* Mission */}
              <p style={{
                fontSize: 12, color: 'rgba(160,184,168,0.75)',
                lineHeight: 1.6, marginBottom: 16, maxWidth: 320,
                fontWeight: 400, letterSpacing: '0.3px',
              }}>
                Delivering <strong style={{ color: '#c9a84c', fontWeight: 600 }}>independent, courageous journalism</strong> from East Africa and the world since 2026.
              </p>

              <p style={{
                fontSize: 11, color: 'rgba(160,184,168,0.6)',
                lineHeight: 1.6, marginBottom: 16, maxWidth: 320,
                fontStyle: 'italic', borderLeft: '2px solid rgba(201,168,76,0.3)', paddingLeft: 10,
              }}>
                Holding power to account—one story at a time.
              </p>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
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

              {/* Contact Info */}
              <div style={{ marginTop: 18 }}>
                <div style={{
                  fontSize: 9, fontWeight: 800, color: '#c9a84c',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  marginBottom: 10,
                  paddingBottom: 6,
                  borderBottom: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 2.5, height: 10, background: '#c9a84c', borderRadius: 1, flexShrink: 0 }} />
                  Get In Touch
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <a href="tel:+250788695514" style={{
                    fontSize: 12, color: 'rgba(160,184,168,0.6)',
                    textDecoration: 'none', letterSpacing: '0.02em',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#c9a84c';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(160,184,168,0.6)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    +250 788 695 514
                  </a>
                  <a href="mailto:ambassadeurhirwa@gmail.com" style={{
                    fontSize: 12, color: 'rgba(160,184,168,0.6)',
                    textDecoration: 'none', letterSpacing: '0.02em',
                    transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#c9a84c';
                      e.currentTarget.style.paddingLeft = '4px';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'rgba(160,184,168,0.6)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    ambassadeurhirwa@gmail.com
                  </a>
                </div>
              </div>

              {/* Location tag */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                marginTop: 16,
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.15)',
                borderRadius: 4, padding: '6px 10px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)';
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ fontSize: 10, color: '#c9a84c', letterSpacing: '0.05em', fontWeight: 500 }}>Kigali, Rwanda</span>
              </div>
            </div>

            {/* Link columns */}
            {footerSections.map(section => (
              <div key={section.title}>
                <div suppressHydrationWarning style={{
                  fontSize: 10, fontWeight: 800, color: '#c9a84c',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  marginBottom: 14, paddingBottom: 8,
                  borderBottom: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ width: 2.5, height: 12, background: '#c9a84c', borderRadius: 1, flexShrink: 0 }} />
                  {section.title}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link href={link.href} style={{
                        display: 'block', padding: '4px 0',
                        fontSize: 12, color: 'rgba(160,184,168,0.65)',
                        textDecoration: 'none', letterSpacing: '0.02em',
                        transition: 'all 0.2s ease',
                      }}
                        onMouseEnter={e => {
                          e.currentTarget.style.color = '#c9a84c';
                          e.currentTarget.style.paddingLeft = '6px';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.color = 'rgba(160,184,168,0.65)';
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

      {/* ── Newsletter section ───────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        background: 'linear-gradient(135deg, rgba(11,30,16,0.6) 0%, rgba(22,45,28,0.4) 50%, rgba(11,30,16,0.6) 100%)',
        padding: 'clamp(18px,3vw,32px) 16px',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Newsletter 
            title="Stay Informed"
            description="Get our latest breaking news and updates delivered to your inbox."
            placeholder="your@email.com"
            buttonText="Subscribe"
            source="footer"
            className="footer-newsletter"
          />
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────── */}
      <div className="ha-footer-bottom" style={{ 
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(201,168,76,0.06)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          {/* Copyright */}
          <span style={{ fontSize: 11, color: 'rgba(160,184,168,0.5)', letterSpacing: '0.05em', fontWeight: 400 }}>
            © {year} <strong style={{ color: '#c9a84c' }}>Hirwa Ambassadeur</strong>. All rights reserved.
          </span>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 4, padding: '6px 14px',
              display: 'flex', alignItems: 'center', gap: 5,
              color: '#c9a84c', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
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

        .footer-newsletter h3 {
          color: #c9a84c !important;
          font-size: 20px !important;
          margin-bottom: 14px !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
        }

        .footer-newsletter p {
          color: rgba(160,184,168,0.8) !important;
          font-size: 14px !important;
          line-height: 1.7 !important;
          font-weight: 400 !important;
        }

        .footer-newsletter input {
          background: rgba(255,255,255,0.07) !important;
          border: 1px solid rgba(201,168,76,0.25) !important;
          color: #e0d0a0 !important;
          padding: 12px 14px !important;
          font-size: 13px !important;
          border-radius: 4px !important;
        }

        .footer-newsletter input::placeholder {
          color: rgba(160,184,168,0.5) !important;
        }

        .footer-newsletter input:focus {
          border-color: rgba(201,168,76,0.5) !important;
          background: rgba(255,255,255,0.09) !important;
          outline: none !important;
        }

        .footer-newsletter button {
          background: linear-gradient(135deg, #b8942a 0%, #d4aa48 100%) !important;
          color: #0b1e10 !important;
          padding: 12px 28px !important;
          font-weight: 700 !important;
          border: none !important;
          border-radius: 4px !important;
          font-size: 13px !important;
          letter-spacing: 0.08em !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .footer-newsletter button:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(201,168,76,0.25) !important;
        }

        .ha-footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px 32px;
        }

        /* Mobile: hide all columns except brand */
        .ha-footer-grid > div:not(:first-child) {
          display: none;
        }

        /* Reduce main footer padding on mobile */
        @media (max-width: 520px) {
          .ha-footer-main {
            padding: 16px 16px 20px !important;
          }
          .ha-footer-grid {
            gap: 14px 16px !important;
          }
          .footer-newsletter h3 {
            font-size: 16px !important;
          }
          .footer-newsletter p {
            font-size: 12px !important;
          }
          .ha-footer-bottom {
            flex-direction: column !important;
            padding: 10px 16px !important;
          }
          .ha-footer-bottom > * {
            width: 100% !important;
          }
          .ha-footer-bottom button {
            justify-content: center !important;
          }
        }

        @media (min-width: 521px) and (max-width: 899px) {
          .ha-footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 22px 28px !important;
          }
          .ha-footer-grid > div:not(:first-child) {
            display: block !important;
          }
        }

        @media (min-width: 900px) {
          .ha-footer-grid {
            grid-template-columns: 1.6fr 1fr 1fr 1fr !important;
          }
          .ha-footer-grid > div:not(:first-child) {
            display: block !important;
          }
        }

        /* Reduce padding on mobile */
        @media (max-width: 520px) {
          .ha-footer-bottom {
            padding: 14px 16px !important;
          }
        }
      `}</style>
    </footer>
  );
}