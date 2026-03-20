'use client';

export default function AboutPage() {
  return (
    <div style={{
      background: '#070f09',
      minHeight: '100vh',
      color: '#e8dfc8',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      paddingTop: 40,
      paddingBottom: 80,
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '0 16px 60px',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
      }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 800,
          color: '#c9a84c',
          marginBottom: 16,
          letterSpacing: '-1px',
        }}>
          About Hirwa Ambassadeur
        </h1>
        <p style={{
          fontSize: 18,
          color: '#8aaa8a',
          lineHeight: 1.6,
        }}>
          Independent, courageous, and trusted journalism in East Africa
        </p>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        padding: '60px 16px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 40,
        }}>
          {/* Mission */}
          <section>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#c9a84c',
              marginBottom: 16,
              borderLeft: '3px solid #c9a84c',
              paddingLeft: 16,
            }}>
              Our Mission
            </h2>
            <p style={{
              fontSize: 16,
              color: '#b0c0b0',
              lineHeight: 1.8,
              marginBottom: 12,
            }}>
              Hirwa Ambassadeur is dedicated to delivering independent, courageous, and trusted journalism. We believe in the power of accurate information to transform communities and cultures across East Africa.
            </p>
            <p style={{
              fontSize: 16,
              color: '#b0c0b0',
              lineHeight: 1.8,
            }}>
              Our mission is to provide comprehensive coverage of politics, business, technology, health, sports, and entertainment while maintaining the highest standards of journalistic integrity.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#c9a84c',
              marginBottom: 16,
              borderLeft: '3px solid #c9a84c',
              paddingLeft: 16,
            }}>
              Our Values
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
            }}>
              {[
                { title: 'INDEPENDENT', desc: 'Free from external influence' },
                { title: 'COURAGEOUS', desc: 'Bold in pursuing the truth' },
                { title: 'TRUSTED', desc: 'Reliable and accountable' },
                { title: 'INCLUSIVE', desc: 'Diverse voices and perspectives' },
              ].map((value) => (
                <div key={value.title} style={{
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 6,
                  padding: 20,
                }}>
                  <h3 style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: '#c9a84c',
                    letterSpacing: '0.12em',
                    marginBottom: 8,
                  }}>
                    {value.title}
                  </h3>
                  <p style={{
                    fontSize: 13,
                    color: '#8aaa8a',
                    lineHeight: 1.6,
                  }}>
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#c9a84c',
              marginBottom: 16,
              borderLeft: '3px solid #c9a84c',
              paddingLeft: 16,
            }}>
              Get in Touch
            </h2>
            <p style={{
              fontSize: 16,
              color: '#b0c0b0',
              lineHeight: 1.8,
              marginBottom: 20,
            }}>
              Have a story tip or want to contribute? We'd love to hear from you. Reach out to our editorial team.
            </p>
            <a href="/contact" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
              color: '#070f09',
              padding: '12px 28px',
              borderRadius: 4,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: 12,
              textDecoration: 'none',
              transition: 'filter 0.2s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            >
              Contact Us
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
