'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Job, loadJobs } from '@/lib/jobs';

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);

  // Avoid hydrating twice with a different initial state by only loading jobs on the client.
  // The server and first client render will match (loading state), then we update after mount.
  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  if (jobs === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '80px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'rgba(201,168,76,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            marginBottom: 12,
            color: '#1a1a1a'
          }}>
            Loading jobs...
          </h1>
          <p style={{
            color: '#666',
            fontSize: 16,
            lineHeight: 1.5,
            margin: 0,
            marginBottom: 32
          }}>
            Hang tight while we fetch the latest job openings.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
              color: '#0b1e10',
              padding: '12px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'brightness(1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      padding: '40px 24px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 800,
            margin: 0,
            marginBottom: 16,
            color: '#1a1a1a',
            letterSpacing: '-0.02em'
          }}>
            Open Positions
          </h1>
          <p style={{
            fontSize: 18,
            color: '#666',
            margin: '0 auto',
            maxWidth: 600,
            lineHeight: 1.5
          }}>
            Join our mission to deliver exceptional journalism from Africa and around the world.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 24
        }}>
          {jobs.filter(j => j.status === 'open').map(job => (
            <div key={job.id} style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(201,168,76,0.1)',
                  color: '#c9a84c',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 12
                }}>
                  <span style={{
                    width: 6,
                    height: 6,
                    background: '#c9a84c',
                    borderRadius: '50%'
                  }}></span>
                  {job.type}
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  lineHeight: 1.3,
                  marginBottom: 8
                }}>
                  {job.title}
                </h2>
                <p style={{
                  margin: 0,
                  color: '#666',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span>{job.department}</span>
                  <span style={{ color: '#ddd' }}>•</span>
                  <span>{job.location}</span>
                </p>
              </div>

              {job.description && (
                <p style={{
                  margin: 0,
                  color: '#777',
                  fontSize: 14,
                  lineHeight: 1.5,
                  marginBottom: 20,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {job.description}
                </p>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: 12,
                  color: '#999',
                  fontWeight: 500
                }}>
                  Posted {job.postedAt}
                </span>
                <Link
                  href={`/job/${job.id}`}
                  style={{
                    background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
                    color: '#0b1e10',
                    padding: '8px 16px',
                    borderRadius: 8,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M7 17L17 7"/>
                    <path d="M7 7h10v10"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#c9a84c',
              textDecoration: 'none',
              fontSize: 16,
              fontWeight: 600,
              padding: '12px 24px',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 8,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
