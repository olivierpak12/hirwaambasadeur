'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useMutation(api.auth.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminEmail', result.admin.email);
        localStorage.setItem('adminName', result.admin.name);
        localStorage.setItem('adminRole', result.admin.role);

        // Redirect to admin dashboard
        router.push('/admin/create');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3d28] to-[#0d1f17] flex items-center justify-center px-4 py-8">
      <style>{`
        * { box-sizing: border-box; }
        
        .login-container {
          width: 100%;
          max-width: 400px;
        }

        .login-card {
          background: white;
          border-radius: 8px;
          padding: 40px 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a3d28;
          margin-bottom: 8px;
        }

        .login-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #999;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          border: 1.5px solid #e0dbd2;
          border-radius: 4px;
          transition: border-color 0.2s, box-shadow 0.2s;
          background: #fff;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a3d28;
          box-shadow: 0 0 0 3px rgba(26, 61, 40, 0.1);
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px 14px;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .error-icon {
          font-size: 16px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: #1a3d28;
          color: white;
          border: none;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .login-button:hover:not(:disabled) {
          background: #0f2818;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          text-align: center;
          margin-top: 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #999;
        }

        .login-footer a {
          color: #1a3d28;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-footer a:hover {
          color: #c9a84c;
        }

        .loading-spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 28px 24px;
          }

          .login-logo {
            font-size: 24px;
          }

          .form-input {
            font-size: 16px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">Hirwa Ambassadeur</div>
            <div className="login-subtitle">Admin Portal</div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p style={{ margin: '16px 0 0', fontSize: '12px', color: '#aaa' }}>
              Need access? Contact your administrator.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: '#fff',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              display: 'inline-block',
              opacity: 0.7,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
