'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AuthorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyLogin = useMutation(api.authorAuth.verifyAuthorLogin);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyLogin({ email, password });
      
      if (result.success && result.authorId) {
        // Store author session
        const token = 'token_' + Date.now();
        localStorage.setItem('authorToken', token);
        localStorage.setItem('authorId', String(result.authorId));
        localStorage.setItem('authorEmail', result.email || '');
        localStorage.setItem('authorName', result.name || '');

        // Also set cookie so middleware can validate author dashboard routes
        const maxAge = 30 * 24 * 60 * 60; // 30 days
        document.cookie = `authorToken=${token}; path=/; max-age=${maxAge}`;
        document.cookie = `authorEmail=${encodeURIComponent(result.email || '')}; path=/; max-age=${maxAge}`;
        document.cookie = `authorName=${encodeURIComponent(result.name || '')}; path=/; max-age=${maxAge}`;

        // Preserve possible redirect from query param
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        router.push(from && from.startsWith('/dashboard') ? from : '/dashboard/author');
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(201,168,76,0.1)',
        borderRadius: 8,
        padding: '40px',
        maxWidth: 400,
        width: '100%',
      }}>
        <h1 style={{
          margin: '0 0 8px',
          fontSize: 24,
          fontWeight: 700,
          color: '#c9a84c',
          textAlign: 'center',
        }}>
          Author Login
        </h1>
        <p style={{
          margin: '0 0 32px',
          fontSize: 13,
          color: '#5a8a6a',
          textAlign: 'center',
        }}>
          Sign in to manage your articles
        </p>

        {error && (
          <div style={{
            background: 'rgba(224,90,58,0.1)',
            border: '1px solid rgba(224,90,58,0.3)',
            color: '#e05a3a',
            padding: '12px 14px',
            borderRadius: 4,
            marginBottom: 20,
            fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              color: '#5a8a6a',
              textTransform: 'uppercase',
              marginBottom: 8,
              letterSpacing: '0.1em',
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                display: 'block',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 4,
                padding: '11px 14px',
                color: '#e8dfc8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.4)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.03)';
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              color: '#5a8a6a',
              textTransform: 'uppercase',
              marginBottom: 8,
              letterSpacing: '0.1em',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                display: 'block',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 4,
                padding: '11px 14px',
                color: '#e8dfc8',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.4)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(201,168,76,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.03)';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 24px',
              background: loading ? '#3a5a3a' : '#1a6a3a',
              color: '#e8dfc8',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid rgba(201,168,76,0.1)',
          textAlign: 'center',
          fontSize: 12,
          color: '#5a8a6a',
        }}>
          <p style={{ margin: 0 }}>Admin? <a href="/auth/login" style={{ color: '#c9a84c', textDecoration: 'none', fontWeight: 600 }}>Admin Login</a></p>
        </div>
      </div>
    </div>
  );
}
