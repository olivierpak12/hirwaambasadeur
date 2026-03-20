'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function SetupPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const createAdmin = useMutation(api.auth.createSuperAdmin);

  const handleSetup = async () => {
    setStatus('loading');
    setMessage('Creating admin account...');
    
    try {
      const result = await createAdmin({
        email: 'admin@hirwa.com',
        password: 'admin123',
        name: 'Admin User',
      });

      console.log('Setup result:', result);

      if (result.success) {
        setStatus('success');
        setMessage('✅ Admin account created successfully!');
        setShowSuccess(true);
        
        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('❌ ' + (result.message || 'Admin account already exists'));
        setShowSuccess(false);
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      setStatus('error');
      setMessage('❌ Error: ' + (error.message || 'Failed to create admin'));
      setShowSuccess(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3d28 0%, #0d1f17 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"DM Sans", sans-serif',
      color: '#e8dfc8',
      padding: '20px',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '8px',
        padding: '48px 40px',
        maxWidth: '500px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '8px',
          color: '#c9a84c',
          fontFamily: '"Playfair Display", serif',
        }}>
          Hirwa Ambassadeur
        </h1>

        <p style={{
          fontSize: '12px',
          color: '#aaa',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '32px',
        }}>
          Admin Setup
        </p>

        {!showSuccess && (
          <>
            <p style={{
              color: '#bbb',
              marginBottom: '24px',
              fontSize: '14px',
              lineHeight: 1.6,
            }}>
              Click below to create your super admin account:
            </p>

            <div style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '6px',
              padding: '20px',
              marginBottom: '28px',
              fontSize: '13px',
              textAlign: 'left',
              fontFamily: '"Source Code Pro", monospace',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#aaa' }}>Email:</span>{' '}
                <span style={{ color: '#c9a84c', fontWeight: 600 }}>admin@hirwa.com</span>
              </div>
              <div>
                <span style={{ color: '#aaa' }}>Password:</span>{' '}
                <span style={{ color: '#c9a84c', fontWeight: 600 }}>admin123</span>
              </div>
            </div>

            <button
              onClick={handleSetup}
              disabled={status === 'loading'}
              style={{
                width: '100%',
                padding: '14px',
                background: '#c9a84c',
                color: '#070f09',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: status === 'loading' ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') {
                  (e.currentTarget as HTMLButtonElement).style.background = '#d4b456';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#c9a84c';
              }}
            >
              {status === 'loading' ? '⏳ Creating Account...' : '🔧 Create Admin Account'}
            </button>

            {message && (
              <p style={{
                marginTop: '16px',
                fontSize: '13px',
                color: status === 'error' ? '#ff7a7a' : '#4ecdc4',
              }}>
                {message}
              </p>
            )}
          </>
        )}

        {showSuccess && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <p style={{
              fontSize: '16px',
              color: '#4ecdc4',
              marginBottom: '8px',
              fontWeight: 600,
            }}>
              {message}
            </p>
            <p style={{
              fontSize: '13px',
              color: '#aaa',
              marginTop: '16px',
            }}>
              Redirecting to login page...
            </p>
          </div>
        )}

        <p style={{
          marginTop: '32px',
          fontSize: '11px',
          color: '#666',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          paddingTop: '20px',
        }}>
          After setup, you can login and create articles from the admin dashboard.
        </p>
      </div>
    </div>
  );
}
