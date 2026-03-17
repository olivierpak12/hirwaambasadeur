'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Job, loadJobs } from '@/lib/jobs';

export default function JobListPage() {
  const [jobs] = useState<Job[]>(() => loadJobs());

  if (!jobs.length) {
    return (
      <div style={{ minHeight: '70vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, marginBottom: 12 }}>No job openings yet</h1>
          <p style={{ color: '#555' }}>Check back soon or contact the team for opportunities.</p>
          <Link href="/" style={{ marginTop: 16, display: 'inline-block', color: '#bb1919', textDecoration: 'underline' }}>Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '70vh', padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Open Positions</h1>
      <p style={{ marginBottom: 24, color: '#444' }}>Browse available roles and click a job to view details and apply.</p>

      <div style={{ display: 'grid', gap: 16 }}>
        {jobs.filter(j => j.status === 'open').map(job => (
          <div key={job.id} style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: 18, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>{job.title}</h2>
                <p style={{ margin: '6px 0 0', color: '#666' }}>{job.department} — {job.location}</p>
              </div>
              <Link href={`/job/${job.id}`} style={{ padding: '8px 12px', background: '#bb1919', color: '#fff', borderRadius: 6, textDecoration: 'none', fontWeight: 700 }}>View</Link>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>{job.type}</span>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Posted {job.postedAt}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#bb1919', textDecoration: 'underline' }}>Back to home</Link>
      </div>
    </div>
  );
}
