'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { addApplication, JobApplication, loadJobs } from '@/lib/jobs';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function JobDetailClient({ id }: { id: string }) {
  const job = useMemo(() => loadJobs().find((j) => j.id === id) ?? null, [id]);
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');
  const [form, setForm] = useState({ name: '', email: '', coverLetter: '' });
  const [resume, setResume] = useState<File | null>(null);

  const shareLink = useMemo(() => `${typeof window !== 'undefined' ? window.location.origin : ''}/job/${id}`, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    const newApp: JobApplication = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      jobId: job.id,
      name: form.name,
      email: form.email,
      coverLetter: form.coverLetter,
      resumeName: resume?.name,
      resumeDataUrl: '',
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    if (resume) {
      const reader = new FileReader();
      reader.onload = () => {
        newApp.resumeDataUrl = reader.result as string;
        addApplication(newApp);
        setStatus('submitted');
      };
      reader.readAsDataURL(resume);
    } else {
      addApplication(newApp);
      setStatus('submitted');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert('Copied job link to clipboard');
    } catch {
      alert('Unable to copy link');
    }
  };

  if (!job) {
    return (
      <div style={{ minHeight: '70vh', padding: 24, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Job not found</h1>
        <p style={{ color: '#555', marginBottom: 16 }}>Sorry, we could not locate that job listing.</p>
        <Link href="/job" style={{ color: '#bb1919', textDecoration: 'underline' }}>Back to open positions</Link>
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
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link
          href="/job"
          style={{
            color: '#c9a84c',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 24
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5"/>
            <path d="M12 19l-7-7 7-7"/>
          </svg>
          Back to all jobs
        </Link>

        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          marginBottom: 24
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 24,
            marginBottom: 24
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(201,168,76,0.1)',
                color: '#c9a84c',
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  background: '#c9a84c',
                  borderRadius: '50%'
                }}></span>
                {job.type}
              </div>
              <h1 style={{
                fontSize: 36,
                fontWeight: 800,
                margin: 0,
                color: '#1a1a1a',
                lineHeight: 1.2,
                marginBottom: 12
              }}>
                {job.title}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                color: '#666',
                fontSize: 16,
                marginBottom: 8
              }}>
                <span>{job.department}</span>
                <span style={{ color: '#ddd' }}>•</span>
                <span>{job.location}</span>
                <span style={{ color: '#ddd' }}>•</span>
                <span>Posted {formatDate(job.postedAt)}</span>
              </div>
            </div>
            <button
              onClick={copyLink}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.2)',
                color: '#c9a84c',
                padding: '12px 20px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.2)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.1)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16,6 12,2 8,6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
              Share Job
            </button>
          </div>

          {job.description && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                marginBottom: 16,
                color: '#1a1a1a'
              }}>
                Job Description
              </h2>
              <div style={{
                color: '#555',
                lineHeight: 1.6,
                fontSize: 16
              }}>
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} style={{ margin: 0, marginBottom: index < job.description!.split('\n').length - 1 ? 16 : 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {job.requirements && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                marginBottom: 16,
                color: '#1a1a1a'
              }}>
                Requirements
              </h2>
              <ul style={{
                color: '#555',
                lineHeight: 1.6,
                fontSize: 16,
                paddingLeft: 20
              }}>
                {job.requirements.map((req, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && (
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                marginBottom: 16,
                color: '#1a1a1a'
              }}>
                Benefits
              </h2>
              <ul style={{
                color: '#555',
                lineHeight: 1.6,
                fontSize: 16,
                paddingLeft: 20
              }}>
                {job.benefits.map((benefit, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
            marginBottom: 24,
            color: '#1a1a1a'
          }}>
            Apply for this position
          </h2>

          {status === 'submitted' ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'linear-gradient(135deg, #f0f9f0, #e8f5e8)',
              borderRadius: 12,
              border: '1px solid #d4edda'
            }}>
              <div style={{
                width: 64,
                height: 64,
                background: '#28a745',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                margin: 0,
                marginBottom: 8,
                color: '#155724'
              }}>
                Application Submitted!
              </h3>
              <p style={{
                color: '#155724',
                margin: 0,
                fontSize: 16
              }}>
                Thank you for your interest. We'll review your application and get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 20,
                marginBottom: 20
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 8
                  }}>
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      fontSize: 16,
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c9a84c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: 8
                  }}>
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: '1px solid #e0e0e0',
                      fontSize: 16,
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#c9a84c'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: 8
                }}>
                  Cover Letter
                </label>
                <textarea
                  value={form.coverLetter}
                  onChange={(e) => setForm((p) => ({ ...p, coverLetter: e.target.value }))}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    fontSize: 16,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#c9a84c'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: 8
                }}>
                  Resume/CV
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: '2px dashed #e0e0e0',
                    background: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c9a84c';
                    e.currentTarget.style.background = 'rgba(201,168,76,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.background = '#fafafa';
                  }}
                />
                <p style={{
                  margin: '8px 0 0',
                  fontSize: 12,
                  color: '#666'
                }}>
                  Accepted formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #b8942a, #d4aa48)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '16px 32px',
                  color: '#0b1e10',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 8
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
                Submit Application
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 2L11 13"/>
                  <path d="M22 2L15 22 11 13 2 9 22 2Z"/>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}