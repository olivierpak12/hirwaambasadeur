'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div style={{
      background: '#070f09',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      color: '#e8dfc8',
      padding: 20,
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 600,
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          color: '#c9a84c',
          marginBottom: 8,
        }}>
          Welcome
        </h1>
        <p style={{
          fontSize: 16,
          color: '#5a8a6a',
          marginBottom: 48,
        }}>
          Choose your login option
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}>
          {/* Admin Login */}
          <Link href="/auth/login">
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 8,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>👨‍💼</div>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#c9a84c',
                margin: '0 0 8px',
              }}>
                Admin
              </h2>
              <p style={{
                fontSize: 13,
                color: '#5a8a6a',
                margin: 0,
              }}>
                Manage articles, authors, and more
              </p>
            </div>
          </Link>

          {/* Author Login */}
          <Link href="/author/login">
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 8,
              padding: 32,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.3)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
            }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>✍️</div>
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1a6a3a',
                margin: '0 0 8px',
              }}>
                Author
              </h2>
              <p style={{
                fontSize: 13,
                color: '#5a8a6a',
                margin: 0,
              }}>
                Write and publish articles
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
