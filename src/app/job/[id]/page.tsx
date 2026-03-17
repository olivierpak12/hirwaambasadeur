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

function JobDetailClient({ id }: { id: string }) {
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
    <div style={{ minHeight: '70vh', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <Link href="/job" style={{ color: '#bb1919', textDecoration: 'underline', fontSize: 13 }}>&larr; Back to jobs</Link>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 30, margin: 0 }}>{job.title}</h1>
          <p style={{ margin: '10px 0 0', color: '#555' }}>{job.department} · {job.location} · {job.type}</p>
          <p style={{ margin: '6px 0 0', color: '#777', fontSize: 13 }}>Posted {formatDate(job.postedAt)}</p>
        </div>
        <button onClick={copyLink} style={{ border: '1px solid rgba(187,25,25,0.5)', background: 'rgba(187,25,25,0.1)', color: '#bb1919', padding: '10px 14px', borderRadius: 6, cursor: 'pointer' }}>Share</button>
      </div>

      <section style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr', gap: 26 }}>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 18 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>How to apply</h2>
          {status === 'submitted' ? (
            <div style={{ padding: 18, background: 'rgba(34,139,34,0.08)', borderRadius: 8 }}>
              <strong>Application submitted!</strong>
              <p style={{ margin: '8px 0 0', color: '#444' }}>We will review your application and reach out if you are a match.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)' }}
                  placeholder="Your name"
                />

                <label style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>Email address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)' }}
                  placeholder="you@example.com"
                />

                <label style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>Cover letter (optional)</label>
                <textarea
                  value={form.coverLetter}
                  onChange={(e) => setForm((p) => ({ ...p, coverLetter: e.target.value }))}
                  rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.12)', resize: 'vertical' }}
                  placeholder="Tell us why you're a great fit..."
                />

                <label style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>Upload resume (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                  style={{ width: '100%' }}
                />

                <button type="submit" style={{ background: '#bb1919', color: '#fff', padding: '10px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Submit application</button>
              </div>
            </form>
          )}
        </div>

        {job.description && (
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 18 }}>
            <h2 style={{ fontSize: 18, marginBottom: 10 }}>About this role</h2>
            <p style={{ lineHeight: 1.6, color: '#444' }}>{job.description}</p>
          </div>
        )}
      </section>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#bb1919', textDecoration: 'underline' }}>Back to home</Link>
      </div>
    </div>
  );
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <JobDetailClient id={id} />;
}
