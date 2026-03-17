'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Job, JobApplication, addJob, loadApplications, loadJobs, saveApplications, saveJobs, updateApplicationStatus } from '@/lib/jobs';

type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
};

type SelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
};

type BtnProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'danger' | 'success' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'articles' | 'submissions' | 'permissions' | 'authors' | 'categories' | 'messages' | 'files' | 'ads' | 'hiring';

interface Tab { id: TabId; label: string; icon: React.ReactNode; badge?: number }

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = {
  grid:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  article: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  inbox:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  pen:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  briefcase: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 7h20v13a2 2 0 01-2 2H4a2 2 0 01-2-2V7z"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>,
  users:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  folder:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  chat:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  ads:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  logout:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  eye:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  check:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  plus:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  trend:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const CATS = ['Politics', 'Business', 'Technology', 'Health', 'Sports', 'Entertainment', 'Africa', 'World'];

function Badge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    published: ['rgba(26,120,58,0.15)', '#4aaa6a'],
    draft:     ['rgba(201,168,76,0.12)', '#c9a84c'],
    pending:   ['rgba(200,140,30,0.15)', '#c8a030'],
    approved:  ['rgba(26,120,58,0.15)', '#4aaa6a'],
    rejected:  ['rgba(180,40,20,0.15)', '#e07060'],
    active:    ['rgba(26,120,58,0.15)', '#4aaa6a'],
    inactive:  ['rgba(100,100,100,0.15)', '#888'],
    new:       ['rgba(26,100,180,0.15)', '#4a8adc'],
    read:      ['rgba(100,100,100,0.1)', '#888'],
    review:    ['rgba(120,60,180,0.15)', '#a06ae0'],
    closed:    ['rgba(100,100,100,0.12)', '#888'],
  };
  const [bg, color] = map[status] ?? ['rgba(100,100,100,0.1)', '#888'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: bg, color, border: `1px solid ${color}30`,
      padding: '2px 9px', borderRadius: 20, fontSize: 10,
      fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#5a7a6a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#e06050', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(201,168,76,0.15)',
  borderRadius: 4, color: '#d0c8b0', fontSize: 13,
  outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.15s, background 0.15s',
};

function Input({ value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={inp}
      onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.45)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
      onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.15)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
    />
  );
}

function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select value={value} onChange={onChange}
      style={{ ...inp, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%235a7a6a' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(201,168,76,0.45)'; }}
      onBlur={e  => { e.target.style.borderColor = 'rgba(201,168,76,0.15)'; }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false }: BtnProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #b8942a, #d4aa48)', color: '#060e08', border: 'none', fontWeight: 900 },
    ghost:   { background: 'transparent', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)', fontWeight: 700 },
    danger:  { background: 'rgba(180,40,20,0.12)', color: '#e07060', border: '1px solid rgba(180,40,20,0.25)', fontWeight: 700 },
    success: { background: 'rgba(26,120,58,0.15)', color: '#4aaa6a', border: '1px solid rgba(26,120,58,0.3)', fontWeight: 700 },
    muted:   { background: 'rgba(255,255,255,0.04)', color: '#5a7a6a', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 },
  };
  const pads = { sm: '4px 10px', md: '7px 14px', lg: '10px 24px' };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: pads[size as keyof typeof pads],
      borderRadius: 4, fontSize: size === 'sm' ? 10 : 11,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      opacity: disabled ? 0.5 : 1,
      transition: 'filter 0.15s, opacity 0.15s',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
    >{children}</button>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
function Table({ cols, rows }: { cols: string[]; rows: React.ReactNode[][] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{
                padding: '9px 14px', textAlign: 'left',
                fontSize: 10, fontWeight: 800, color: '#4a6a5a',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
                whiteSpace: 'nowrap',
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '11px 14px', fontSize: 13, color: '#b0a890',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  verticalAlign: 'middle',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Panel wrapper ────────────────────────────────────────────────────────────
function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(201,168,76,0.1)',
      borderRadius: 6, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(201,168,76,0.08)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg, #c9a84c, #e8c95a)', borderRadius: 2 }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#d0c090', letterSpacing: '-0.2px' }}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, trend }: { label: string; value: string | number; sub?: string; icon: React.ReactNode; trend?: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(201,168,76,0.1)',
      borderRadius: 6, padding: '18px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', right: 14, top: 14, color: 'rgba(201,168,76,0.18)', transform: 'scale(2)' }}>{icon}</div>
      <div style={{ fontSize: 10, color: '#4a6a5a', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 700, color: '#c9a84c', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#3a5a4a' }}>{sub}</div>}
      {trend && <div style={{ fontSize: 10, color: '#4aaa6a', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>{Icon.trend}{trend}</div>}
    </div>
  );
}

// ─── Form overlay ─────────────────────────────────────────────────────────────
function FormOverlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(201,168,76,0.18)',
      borderRadius: 6, padding: '18px 20px', marginBottom: 20,
      animation: 'slideDown 0.2s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.04em' }}>{title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a7a6a', cursor: 'pointer', display: 'flex' }}>{Icon.x}</button>
      </div>
      {children}
    </div>
  );
}

// ─── Overview Panel ───────────────────────────────────────────────────────────
function OverviewPanel() {
  const allArticles = useQuery(api.articles.getAllArticles) ?? [];
  const publishedArticles = useMemo(() => allArticles.filter((a: any) => a.status === 'published'), [allArticles]);
  const totalViews = useMemo(() => publishedArticles.reduce((sum: number, a: any) => sum + (a.views || 0), 0), [publishedArticles]);

  const pendingSubmissions = useQuery(api.submissions.getSubmissionsByStatus, { status: 'pending' }) ?? [];
  const pendingPermissions = useQuery(api.writingPermissions.getPendingRequests) ?? [];
  const allAuthors = useQuery(api.authors.getAllAuthors) ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="stat-grid">
        <StatCard label="Total Articles" value={allArticles.length} sub={`${publishedArticles.length} published`} icon={Icon.article} trend="+18% vs last month" />
        <StatCard label="Pending Reviews" value={pendingSubmissions.length + pendingPermissions.length} sub={`${pendingSubmissions.length} submissions, ${pendingPermissions.length} permissions`} icon={Icon.inbox} />
        <StatCard label="Active Authors" value={allAuthors.length} sub="Contributors with articles" icon={Icon.users} trend="+3 new authors" />
        <StatCard label="Total Views" value={totalViews.toLocaleString()} sub="Across published articles" icon={Icon.trend} trend="+24% this week" />
      </div>

      <Panel title="Recent Activity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ...publishedArticles.slice(0, 3).map((a: any) => ({
              action: 'Article published',
              detail: a.title,
              when: a.publishedAt || 'Recently',
            })),
            ...pendingSubmissions.slice(0, 2).map((s: any) => ({
              action: 'Submission pending review',
              detail: s.title,
              when: s.submittedAt || 'Recently',
            })),
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '10px 12px', borderBottom: idx === 4 ? 'none' : '1px solid rgba(201,168,76,0.12)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#d0c8a8' }}>{item.action}</div>
              <div style={{ fontSize: 11, color: '#8a9a8a', marginTop: 2 }}>{item.detail}</div>
              <div style={{ fontSize: 10, color: '#4a6a5a', marginTop: 4 }}>{item.when}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ─── Articles Panel ───────────────────────────────────────────────────────────
function ArticlesPanel() {
  const articles = useQuery(api.articles.getAllArticles) ?? [];
  const updateArticleStatus = useMutation(api.articles.updateArticleStatus);
  const [search, setSearch] = useState('');
  const [localArticles, setLocalArticles] = useState<any[]>([]);
  
  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();
    const displayArticles = localArticles.length > 0 ? localArticles : articles;
    if (!query) return displayArticles;
    return displayArticles.filter((a: any) => a.title.toLowerCase().includes(query));
  }, [articles, localArticles, search]);

  const handlePublish = async (articleId: string) => {
    await updateArticleStatus({ articleId, status: 'published' });
    setLocalArticles(prev => {
      const updated = prev.length > 0 ? prev : articles;
      return updated.map((a: any) => 
        a._id === articleId 
          ? { ...a, status: 'published', publishedAt: new Date().toISOString() }
          : a
      );
    });
  };

  const handleUnpublish = async (articleId: string) => {
    await updateArticleStatus({ articleId, status: 'draft' });
    setLocalArticles(prev => {
      const updated = prev.length > 0 ? prev : articles;
      return updated.map((a: any) => 
        a._id === articleId 
          ? { ...a, status: 'draft', publishedAt: null }
          : a
      );
    });
  };

  return (
    <Panel
      title={`Articles (${articles.length})`}
      action={
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
        />
      }
    >
      <Table
        cols={['Title', 'Author', 'Category', 'Status', 'Views', 'Published', 'Actions']}
        rows={filteredArticles.map((a: any) => [
          <span key="title" style={{ fontWeight: 600, color: '#d0c8a8', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }} title={a.title}>{a.title}</span>,
          <span key="author">{a.author?.name ?? 'Unknown'}</span>,
          <span key="category">{a.category?.name ?? '—'}</span>,
          <Badge key="status" status={a.status ?? 'draft'} />,
          <span key="views">{a.views ? a.views.toLocaleString() : '—'}</span>,
          <span key="published">{a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '—'}</span>,
          <div key="actions" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(a.status === 'draft' || a.status === 'pending') && (
              <Btn variant="success" size="sm" onClick={() => handlePublish(a._id)}>Publish</Btn>
            )}
            {a.status === 'published' && (
              <Btn variant="danger" size="sm" onClick={() => handleUnpublish(a._id)}>Unpublish</Btn>
            )}
            <Btn variant="ghost" size="sm">{Icon.edit}</Btn>
          </div>,
        ])}
      />
    </Panel>
  );
}

// ─── Submissions Panel ─────────────────────────────────────────────────────
function SubmissionsPanel() {
  const subs = useQuery(api.submissions.getAllSubmissions) ?? [];
  const pending = useMemo(() => subs.filter((s: any) => s.status === 'pending'), [subs]);

  return (
    <Panel title={`Submissions (${subs.length})`}>
      <Table
        cols={['Title', 'Author', 'Email', 'Submitted', 'Status']}
        rows={subs.map((s: any) => [
          <span key="title" style={{ fontWeight: 600, color: '#d0c8a8' }}>{s.title}</span>,
          <span key="author">{s.authorName || s.author || '—'}</span>,
          <span key="email">{s.authorEmail || '—'}</span>,
          <span key="submitted">{new Date(s.submittedAt).toLocaleDateString()}</span>,
          <Badge key="status" status={s.status} />,
        ])}
      />
    </Panel>
  );
}

// ─── Permissions Panel ────────────────────────────────────────────────────────
function PermissionsPanel() {
  const [perms, setPerms] = useState([
    { _id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', requestedAt: '2026-03-12', status: 'pending', category: 'Technology', reason: 'Professional tech journalist' },
    { _id: '2', name: 'Michael Chen', email: 'mchen@example.com', requestedAt: '2026-03-11', status: 'approved', category: 'Business', reason: 'Business analyst' },
    { _id: '3', name: 'Emma Williams', email: 'emma.w@example.com', requestedAt: '2026-03-10', status: 'pending', category: 'Politics', reason: 'Political correspondent' },
    { _id: '4', name: 'David Martinez', email: 'dmartinez@example.com', requestedAt: '2026-03-09', status: 'rejected', category: 'General', reason: 'Insufficient credentials' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', category: '' });

  const statCounts = { total: perms.length, pending: perms.filter(p => p.status === 'pending').length, approved: perms.filter(p => p.status === 'approved').length, rejected: perms.filter(p => p.status === 'rejected').length };

  const handleGrant = () => {
    if (!form.name || !form.email || !form.category) return;
    setPerms(p => [{ _id: String(p.length + 1), name: form.name, email: form.email, requestedAt: new Date().toLocaleDateString(), status: 'approved', category: form.category, reason: 'Granted by admin' }, ...p]);
    setForm({ name: '', email: '', category: '' });
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total',    value: statCounts.total,    color: '#c9a84c' },
          { label: 'Pending',  value: statCounts.pending,  color: '#c8a030' },
          { label: 'Approved', value: statCounts.approved, color: '#4aaa6a' },
          { label: 'Rejected', value: statCounts.rejected, color: '#e07060' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 6, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#4a6a5a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Panel title="Writing Permissions" action={<Btn onClick={() => setShowForm(s => !s)} variant={showForm ? 'muted' : 'primary'} size="sm">{showForm ? <>{Icon.x} Cancel</> : <>{Icon.plus} Grant Access</>}</Btn>}>
        {showForm && (
          <FormOverlay title="Grant Writing Permission" onClose={() => setShowForm(false)}>
            <div className="form-grid-3" style={{ gap: 10, marginBottom: 12 }}>
              <Field label="Full Name" required><Input value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Writer name…" /></Field>
              <Field label="Email" required><Input type="email" value={form.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email address…" /></Field>
              <Field label="Category" required><Select value={form.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm(p => ({ ...p, category: e.target.value }))} options={[...CATS, 'General']} placeholder="Select category…" /></Field>
            </div>
            <Btn onClick={handleGrant} variant="primary" size="md">{Icon.check} Approve & Grant Permission</Btn>
          </FormOverlay>
        )}
        <Table
          cols={['Name', 'Email', 'Category', 'Reason', 'Requested', 'Status', 'Actions']}
          rows={perms.map(p => [
            <span key="name" style={{ fontWeight: 600, color: '#d0c8a8' }}>{p.name}</span>,
            <span key="email">{p.email}</span>,
            <span key="category">{p.category}</span>,
            <span key="reason" style={{ fontSize: 12, color: '#6a8a7a', fontStyle: 'italic' }}>{p.reason}</span>,
            <span key="requested">{p.requestedAt}</span>,
            <Badge key="status" status={p.status} />,
            <div key="actions" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {p.status === 'pending' && <><Btn variant="success" size="sm" onClick={() => setPerms(x => x.map(r => r._id === p._id ? { ...r, status: 'approved' } : r))}>{Icon.check}</Btn><Btn variant="danger" size="sm" onClick={() => setPerms(x => x.map(r => r._id === p._id ? { ...r, status: 'rejected' } : r))}>{Icon.x}</Btn></>}
              {p.status === 'approved' && <Btn variant="danger" size="sm">Revoke</Btn>}
              {p.status === 'rejected' && <Btn variant="ghost" size="sm">Review</Btn>}
            </div>,
          ])}
        />
      </Panel>
    </div>
  );
}

// ─── Hiring Panel ─────────────────────────────────────────────────────────────
function HiringPanel() {
  const [jobs, setJobsState] = useState<Job[]>(() => loadJobs());
  const [applications, setApplications] = useState<JobApplication[]>(() => loadApplications());
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState({ title: '', department: '', type: 'Full-time' as Job['type'], location: '', status: 'open' as Job['status'] });

  const persistJobs = (next: Job[]) => {
    setJobsState(next);
    saveJobs(next);
  };

  const persistApplications = (next: JobApplication[]) => {
    setApplications(next);
    saveApplications(next);
  };

  const handleAdd = () => {
    if (!form.title || !form.department || !form.location) return;
    const job: Job = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: form.title,
      department: form.department,
      type: form.type,
      location: form.location,
      status: form.status,
      postedAt: new Date().toLocaleDateString(),
    };
    addJob(job);
    persistJobs([job, ...jobs]);
    setForm({ title: '', department: '', type: 'Full-time', location: '', status: 'open' });
    setShowForm(false);
  };

  const handleToggleStatus = (jobId: string) => {
    const next = jobs.map((j) =>
      j.id === jobId
        ? { ...j, status: (j.status === 'open' ? 'closed' : 'open') as import('@/lib/jobs').JobStatus }
        : j
    );
    persistJobs(next);
  };

  const handleDelete = (jobId: string) => {
    persistJobs(jobs.filter((j) => j.id !== jobId));
  };

  const openApplicants = (job: Job) => {
    setSelectedJob(job);
  };

  const closeApplicants = () => {
    setSelectedJob(null);
  };

  const jobApplications = selectedJob ? applications.filter((a) => a.jobId === selectedJob.id) : [];

  const updateApplicantStatus = (applicationId: string, status: JobApplication['status']) => {
    const next = applications.map((a) => (a.id === applicationId ? { ...a, status } : a));
    persistApplications(next);
    updateApplicationStatus(applicationId, status);
  };

  return (
    <>
      <Panel title={`Hiring (${jobs.length})`} action={<Btn onClick={() => setShowForm((s) => !s)} variant={showForm ? 'muted' : 'primary'} size="sm">{showForm ? <>{Icon.x} Cancel</> : <>{Icon.plus} New Job</>}</Btn>}>
        {showForm && (
          <FormOverlay title="Create Job Posting" onClose={() => setShowForm(false)}>
            <div className="form-grid-3" style={{ gap: 10, marginBottom: 12 }}>
              <Field label="Job Title" required><Input value={form.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Content Editor" /></Field>
              <Field label="Department" required><Input value={form.department} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, department: e.target.value }))} placeholder="e.g., Editorial" /></Field>
              <Field label="Location" required><Input value={form.location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Remote / Kigali" /></Field>
              <Field label="Type"><Select value={form.type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((p) => ({ ...p, type: e.target.value as Job['type'] }))} options={['Full-time', 'Part-time', 'Contract', 'Freelance']} /></Field>
              <Field label="Status"><Select value={form.status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm((p) => ({ ...p, status: e.target.value as Job['status'] }))} options={['open', 'closed']} /></Field>
            </div>
            <Btn onClick={handleAdd} variant="primary" size="md">{Icon.check} Publish Job</Btn>
          </FormOverlay>
        )}

        <Table
          cols={['Title', 'Department', 'Type', 'Location', 'Status', 'Posted', 'Applicants', 'Actions']}
          rows={jobs.map((j) => [
            <span key="title" style={{ fontWeight: 600, color: '#d0c8a8' }}>{j.title}</span>,
            <span key="department">{j.department}</span>,
            <span key="type">{j.type}</span>,
            <span key="location">{j.location}</span>,
            <Badge key="status" status={j.status} />,
            <span key="posted">{j.postedAt}</span>,
            <Btn key="applicants" variant="ghost" size="sm" onClick={() => openApplicants(j)}>{applications.filter((a) => a.jobId === j.id).length} applicants</Btn>,
            <div key="actions" style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/job/${j.id}`;
                  navigator.clipboard.writeText(url);
                  alert('Job link copied to clipboard');
                }}
              >Share</Btn>
              <Btn variant="ghost" size="sm" onClick={() => handleToggleStatus(j.id)}>{j.status === 'open' ? 'Close' : 'Reopen'}</Btn>
              <Btn variant="danger" size="sm" onClick={() => handleDelete(j.id)}>{Icon.trash}</Btn>
            </div>,
          ])}
        />
      </Panel>

      {selectedJob && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: '100%', maxWidth: 900, background: 'rgba(255,255,255,0.96)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 47px rgba(0,0,0,0.35)' }}>
            <div style={{ padding: 18, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{selectedJob.title}</div>
                <div style={{ fontSize: 12, color: '#555' }}>{selectedJob.department} • {selectedJob.location}</div>
              </div>
              <button onClick={closeApplicants} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#777' }}>✕</button>
            </div>
            <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: 18 }}>
              {jobApplications.length ? (
                <Table
                  cols={['Name', 'Email', 'Applied', 'Status', 'Actions']}
                  rows={jobApplications.map((a) => [
                    <span key="name" style={{ fontWeight: 600, color: '#333' }}>{a.name}</span>,
                    <span key="email">{a.email}</span>,
                    <span key="applied">{new Date(a.appliedAt).toLocaleDateString()}</span>,
                    <Badge key="status" status={a.status} />,
                    <div key="actions" style={{ display: 'flex', gap: 6 }}>
                      {a.status !== 'approved' && <Btn variant="success" size="sm" onClick={() => updateApplicantStatus(a.id, 'approved')}>Approve</Btn>}
                      {a.status !== 'rejected' && <Btn variant="danger" size="sm" onClick={() => updateApplicantStatus(a.id, 'rejected')}>Reject</Btn>}
                    </div>,
                  ])}
                />
              ) : (
                <div style={{ padding: 20, color: '#555' }}>No applications yet. Share the job link to start receiving applications.</div>
              )}
              {jobApplications.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Applicants can attach a resume. Click to view:</div>
                  {jobApplications.map((a) => a.resumeDataUrl ? (
                    <div key={a.id} style={{ marginBottom: 10 }}>
                      <strong style={{ fontSize: 12 }}>{a.name}</strong> &ndash; <span style={{ fontSize: 12, color: '#555' }}>{a.resumeName}</span>
                      <div>
                        <a href={a.resumeDataUrl} download={a.resumeName} style={{ fontSize: 12, color: '#bb1919', textDecoration: 'underline' }}>Download</a>
                      </div>
                    </div>
                  ) : null)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Authors Panel ────────────────────────────────────────────────────────────
function AuthorsPanel() {
  const authors = useQuery(api.authors.getAllAuthors);
  const seedAuthors = useMutation(api.authors.seedAuthors);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newAuthorEmail, setNewAuthorEmail] = useState('');
  const [newAuthorBio, setNewAuthorBio] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreateAuthor = async () => {
    if (!newAuthorName.trim() || !newAuthorEmail.trim()) return;
    const createAuthor = useMutation(api.authors.createAuthor);
    await createAuthor({
      name: newAuthorName.trim(),
      email: newAuthorEmail.trim(),
      bio: newAuthorBio.trim() || 'Journalist',
    });
    setNewAuthorName('');
    setNewAuthorEmail('');
    setNewAuthorBio('');
    setShowForm(false);
  };

  const handleSeedAuthors = async () => {
    await seedAuthors();
  };

  return (
    <Panel title={`Authors (${authors?.length || 0})`} action={
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant="muted" size="sm" onClick={handleSeedAuthors}>Seed Default</Btn>
        <Btn variant="primary" size="sm" onClick={() => setShowForm(true)}>{Icon.plus} Add Author</Btn>
      </div>
    }>
      {showForm && (
        <div style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Input value={newAuthorName} onChange={e => setNewAuthorName(e.target.value)} placeholder="Author name" />
            <Input value={newAuthorEmail} onChange={e => setNewAuthorEmail(e.target.value)} placeholder="Email" type="email" />
            <Input value={newAuthorBio} onChange={e => setNewAuthorBio(e.target.value)} placeholder="Bio (optional)" />
            <Btn variant="success" size="sm" onClick={handleCreateAuthor}>Create</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <Table
        cols={['Author', 'Email', 'Bio', 'Articles', 'Actions']}
        rows={authors?.map(a => [
          <div key="author" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#c9a84c', flexShrink: 0 }}>{a.name.charAt(0)}</div>
            <span style={{ fontWeight: 600, color: '#d0c8a8' }}>{a.name}</span>
          </div>,
          <span key="email">{a.email}</span>,
          <span key="bio" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.bio}</span>,
          <span key="articles">0</span>, // TODO: count articles per author
          <div key="actions" style={{ display: 'flex', gap: 4 }}>
            <Btn variant="ghost" size="sm">{Icon.edit}</Btn>
            <Btn variant="danger" size="sm">{Icon.trash}</Btn>
          </div>,
        ]) || []}
      />
    </Panel>
  );
}

// ─── Categories Panel ─────────────────────────────────────────────────────────
function CategoriesPanel() {
  const cats = useQuery(api.categories.getAllCategories);
  const createCategory = useMutation(api.categories.createCategory);
  const seedCategories = useMutation(api.categories.seedCategories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await createCategory({
      name: newCategoryName.trim(),
      slug,
    });
    setNewCategoryName('');
    setShowForm(false);
  };

  const handleSeedCategories = async () => {
    await seedCategories();
  };

  return (
    <Panel title={`Categories (${cats?.length || 0})`} action={
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn variant="muted" size="sm" onClick={handleSeedCategories}>Seed Default</Btn>
        <Btn variant="primary" size="sm" onClick={() => setShowForm(true)}>{Icon.plus} New Category</Btn>
      </div>
    }>
      {showForm && (
        <div style={{ marginBottom: 16, padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 4 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" />
            <Btn variant="success" size="sm" onClick={handleCreateCategory}>Create</Btn>
            <Btn variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      )}
      <Table
        cols={['Category', 'Slug', 'Articles', 'Actions']}
        rows={cats?.map(c => [
          <span key="name" style={{ fontWeight: 600, color: '#d0c8a8' }}>{c.name}</span>,
          <span key="slug" style={{ fontSize: 12, color: '#6a8a7a' }}>{c.slug}</span>,
          <span key="articles">0</span>, // TODO: count articles per category
          <div key="actions" style={{ display: 'flex', gap: 4 }}>
            <Btn variant="ghost" size="sm">{Icon.edit}</Btn>
            <Btn variant="danger" size="sm">{Icon.trash}</Btn>
          </div>,
        ]) || []}
      />
    </Panel>
  );
}

// ─── Messages Panel ───────────────────────────────────────────────────────────
function MessagesPanel() {
  const [msgs, setMsgs] = useState([
    { _id: '1', name: 'John Doe', email: 'john@example.com', subject: 'Great reporting on the summit!', status: 'new', date: '2026-03-12' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', subject: 'Story tip: local elections fraud', status: 'read', date: '2026-03-11' },
    { _id: '3', name: 'Mark Uwera', email: 'mark@example.com', subject: 'Partnership inquiry', status: 'new', date: '2026-03-10' },
  ]);
  return (
    <Panel title={`Messages (${msgs.filter(m => m.status === 'new').length} unread)`}>
      <Table
        cols={['From', 'Email', 'Subject', 'Date', 'Status', 'Actions']}
        rows={msgs.map(m => [
          <span key="name" style={{ fontWeight: 600, color: '#d0c8a8' }}>{m.name}</span>,
          <span key="email">{m.email}</span>,
          <span key="subject" style={{ color: m.status === 'new' ? '#d0c8a8' : '#6a8a7a' }}>{m.subject}</span>,
          <span key="date">{m.date}</span>,
          <Badge key="status" status={m.status} />,
          <div key="actions" style={{ display: 'flex', gap: 4 }}>
            <Btn variant="ghost" size="sm" onClick={() => setMsgs(p => p.map(x => x._id === m._id ? { ...x, status: 'read' } : x))}>View</Btn>
            <Btn variant="danger" size="sm" onClick={() => setMsgs(p => p.filter(x => x._id !== m._id))}>{Icon.trash}</Btn>
          </div>,
        ])}
      />
    </Panel>
  );
}

// ─── Files/Media Panel ────────────────────────────────────────────────────────
function FilesPanel() {
  const [files, setFiles] = useState([
    { _id: '1', name: 'breaking-news-header.jpg', size: '2.4 MB', type: 'Image', uploadedAt: '2026-03-15', usedIn: '5 articles', status: 'active' },
    { _id: '2', name: 'featured-article-image.png', size: '1.8 MB', type: 'Image', uploadedAt: '2026-03-14', usedIn: '3 articles', status: 'active' },
    { _id: '3', name: 'author-profile-pic.jpg', size: '0.5 MB', type: 'Image', uploadedAt: '2026-03-12', usedIn: '2 articles', status: 'active' },
    { _id: '4', name: 'archive-2025.pdf', size: '15.2 MB', type: 'Document', uploadedAt: '2026-01-10', usedIn: 'Not used', status: 'archived' },
  ]);
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [showForm, setShowForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'Image' });

  const sortedFiles = useMemo(() => {
    const sorted = [...files];
    if (sortBy === 'uploadedAt') sorted.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'size') sorted.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
    return sorted;
  }, [files, sortBy]);

  const handleUpload = () => {
    if (!uploadForm.name) return;
    const newFile = {
      _id: String(files.length + 1),
      name: uploadForm.name,
      size: '1.0 MB',
      type: uploadForm.type,
      uploadedAt: new Date().toLocaleDateString(),
      usedIn: 'Not used',
      status: 'active',
    };
    setFiles([newFile, ...files]);
    setUploadForm({ name: '', type: 'Image' });
    setShowForm(false);
  };

  const handleDelete = (fileId: string) => {
    setFiles(files.filter(f => f._id !== fileId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Files', value: files.length, color: '#c9a84c' },
          { label: 'Active', value: files.filter(f => f.status === 'active').length, color: '#4aaa6a' },
          { label: 'Storage Used', value: '31.5 GB', color: '#a06ae0' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 6, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#4a6a5a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Panel
        title="Media Files"
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={['uploadedAt', 'name', 'size']} placeholder="Sort by…" />
            <Btn onClick={() => setShowForm(s => !s)} variant={showForm ? 'muted' : 'primary'} size="sm">{showForm ? <>{Icon.x} Cancel</> : <>{Icon.plus} Upload File</>}</Btn>
          </div>
        }
      >
        {showForm && (
          <FormOverlay title="Upload New File" onClose={() => setShowForm(false)}>
            <div className="form-grid-2" style={{ gap: 10, marginBottom: 12 }}>
              <Field label="File Name" required><Input value={uploadForm.name} onChange={(e) => setUploadForm(p => ({ ...p, name: e.target.value }))} placeholder="filename.jpg…" /></Field>
              <Field label="File Type" required><Select value={uploadForm.type} onChange={(e) => setUploadForm(p => ({ ...p, type: e.target.value }))} options={['Image', 'Document', 'Video', 'Audio']} placeholder="Select type…" /></Field>
            </div>
            <Btn onClick={handleUpload} variant="primary" size="md">{Icon.check} Upload File</Btn>
          </FormOverlay>
        )}
        <Table
          cols={['File Name', 'Type', 'Size', 'Uploaded', 'Used In', 'Status', 'Actions']}
          rows={sortedFiles.map(f => [
            <span key="name" style={{ fontWeight: 600, color: '#d0c8a8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }} title={f.name}>{f.name}</span>,
            <span key="type">{f.type}</span>,
            <span key="size">{f.size}</span>,
            <span key="uploadedAt">{f.uploadedAt}</span>,
            <span key="usedIn" style={{ fontSize: 12, color: f.usedIn === 'Not used' ? '#6a8a7a' : '#d0c8a8' }}>{f.usedIn}</span>,
            <Badge key="status" status={f.status} />,
            <div key="actions" style={{ display: 'flex', gap: 4 }}>
              <Btn variant="ghost" size="sm">{Icon.eye}</Btn>
              <Btn variant="danger" size="sm" onClick={() => handleDelete(f._id)}>{Icon.trash}</Btn>
            </div>,
          ])}
        />
      </Panel>
    </div>
  );
}

// ─── Ads Panel ────────────────────────────────────────────────────────────────
function AdsPanel() {
  const [ads, setAds] = useState([
    { _id: '1', title: 'Google AdSense — Header Banner', placement: 'Header', type: 'AdSense', active: true },
    { _id: '2', title: 'Sidebar Display Ad', placement: 'Sidebar', type: 'Display', active: true },
    { _id: '3', title: 'In-Article Ad Unit', placement: 'In-Article', type: 'AdSense', active: false },
  ]);
  return (
    <Panel title={`Advertisements (${ads.length})`} action={<Btn variant="primary" size="sm">{Icon.plus} Add Ad</Btn>}>
      <Table
        cols={['Title', 'Placement', 'Type', 'Status', 'Actions']}
        rows={ads.map(a => [
          <span key="title" style={{ fontWeight: 600, color: '#d0c8a8' }}>{a.title}</span>,
          <span key="placement">{a.placement}</span>,
          <span key="type">{a.type}</span>,
          <Badge key="status" status={a.active ? 'active' : 'inactive'} />,
          <div key="actions" style={{ display: 'flex', gap: 4 }}>
            <Btn variant="ghost" size="sm" onClick={() => setAds(p => p.map(x => x._id === a._id ? { ...x, active: !x.active } : x))}>{a.active ? 'Pause' : 'Activate'}</Btn>
            <Btn variant="danger" size="sm" onClick={() => setAds(p => p.filter(x => x._id !== a._id))}>{Icon.trash}</Btn>
          </div>,
        ])}
      />
    </Panel>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!password) return;
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin123')) {
      sessionStorage.setItem('adminAuthorized', 'true');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#040a06', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      {/* Background texture */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />

      <div style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 8, padding: 'clamp(28px,5vw,48px)',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        animation: 'fadeUp 0.35s ease both',
      }}>
        {/* Gold top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', borderRadius: '8px 8px 0 0' }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: '#c9a84c', marginBottom: 6, letterSpacing: '-0.3px' }}>Admin Access</h1>
          <p style={{ fontSize: 13, color: '#4a6a5a' }}>Hirwa Ambassadeur — Authorized personnel only</p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#5a7a6a', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Admin Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && attempt()}
              placeholder="Enter your password"
              style={{ ...inp, paddingRight: 44, fontSize: 14 }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(201,168,76,0.45)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.target.style.borderColor = 'rgba(201,168,76,0.15)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            />
            <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4a6a5a', cursor: 'pointer', display: 'flex', padding: 0 }}>
              {show ? Icon.eyeOff : Icon.eye}
            </button>
          </div>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#e07060' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        </div>

        <button onClick={attempt} disabled={loading || !password} style={{
          width: '100%', background: password ? 'linear-gradient(135deg, #b8942a, #d4aa48)' : 'rgba(255,255,255,0.04)',
          border: 'none', borderRadius: 4, padding: '12px',
          color: password ? '#060e08' : '#2a4a30',
          fontSize: 12, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase',
          cursor: password && !loading ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          marginBottom: 12, transition: 'filter 0.15s',
          fontFamily: 'inherit',
        }}
          onMouseEnter={e => { if (password) e.currentTarget.style.filter = 'brightness(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
        >
          {loading ? (
            <><span style={{ width: 14, height: 14, border: '2px solid #060e08', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Verifying…</>
          ) : 'Access Dashboard'}
        </button>

        <Link href="/" style={{ display: 'block', textAlign: 'center', fontSize: 12, color: '#3a5a4a', textDecoration: 'none', letterSpacing: '0.06em', transition: 'color 0.15s' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#c9a84c')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = '#3a5a4a')}
        >← Back to site</Link>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
const TABS: Tab[] = [
  { id: 'overview',     label: 'Overview',     icon: Icon.grid },
  { id: 'articles',     label: 'Articles',     icon: Icon.article,  badge: 47 },
  { id: 'submissions',  label: 'Submissions',  icon: Icon.inbox,    badge: 2 },
  { id: 'permissions',  label: 'Permissions',  icon: Icon.pen,      badge: 2 },
  { id: 'authors',      label: 'Authors',      icon: Icon.users },
  { id: 'categories',   label: 'Categories',   icon: Icon.folder },
  { id: 'messages',     label: 'Messages',     icon: Icon.chat,     badge: 2 },
  { id: 'files',        label: 'Files',        icon: Icon.folder },
  { id: 'hiring',       label: 'Hiring',      icon: Icon.briefcase },
  { id: 'ads',          label: 'Ads',          icon: Icon.ads },
];

export default function AdminDashboard() {
  // Use `null` until hydration completes to avoid SSR/client mismatch.
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [active, setActive] = useState<TabId>('overview');
  const [, setSideOpen] = useState(false);

  useEffect(() => {
    const authorized = typeof window !== 'undefined' && sessionStorage.getItem('adminAuthorized') === 'true';
    setAuthed(authorized);
  }, []);

  if (authed === null) {
    return (
      <div style={{ background: '#040a06', minHeight: '100vh', fontFamily: '"Helvetica Neue", Arial, sans-serif', color: '#b0a890', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: 24, borderRadius: 12, background: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid rgba(187,168,76,0.4)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ marginTop: 12, fontSize: 14, color: '#c9a84c' }}>Loading dashboard...</div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const logout = () => { sessionStorage.removeItem('adminAuthorized'); setAuthed(false); };

  return (
    <div style={{ background: '#040a06', minHeight: '100vh', fontFamily: '"Helvetica Neue", Arial, sans-serif', color: '#b0a890' }}>

      {/* ── Top header ──────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(4,10,6,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        padding: '0 16px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 54, gap: 12 }}>
          {/* Mobile menu toggle */}
          <button onClick={() => setSideOpen(s => !s)} style={{ background: 'none', border: 'none', color: '#5a7a6a', cursor: 'pointer', display: 'flex', padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          {/* Brand */}
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#c9a84c', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 400 }}>Hirwa</div>
          <div style={{ width: 1, height: 16, background: 'rgba(201,168,76,0.2)' }} />
          <div style={{ fontSize: 11, color: '#4a6a5a', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Admin</div>

          <div style={{ flex: 1 }} />

          {/* Active tab indicator */}
          <div style={{ fontSize: 12, color: '#5a7a6a', letterSpacing: '0.06em', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 6 }}>
            {TABS.find(t => t.id === active)?.icon}
            {active.charAt(0).toUpperCase() + active.slice(1)}
          </div>

          <div style={{ width: 1, height: 16, background: 'rgba(201,168,76,0.1)' }} />

          {/* New article shortcut */}
          <Link href="/admin/create" style={{ textDecoration: 'none' }}>
            <Btn variant="primary" size="sm">{Icon.plus} Article</Btn>
          </Link>

          {/* Logout */}
          <button onClick={logout} style={{ background: 'rgba(180,40,20,0.1)', border: '1px solid rgba(180,40,20,0.2)', borderRadius: 4, padding: '6px 12px', color: '#e07060', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'filter 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.2)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
          >{Icon.logout} Logout</button>
        </div>
      </header>

      {/* ── Layout ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px', display: 'grid' }} className="admin-layout">

        {/* Sidebar */}
        <aside style={{
          position: 'relative',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 6, overflow: 'hidden',
            position: 'sticky', top: 78,
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#4a6a5a', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Navigation</span>
            </div>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActive(tab.id); setSideOpen(false); }} style={{
                width: '100%', textAlign: 'left', padding: '11px 16px',
                background: active === tab.id ? 'rgba(201,168,76,0.08)' : 'transparent',
                color: active === tab.id ? '#c9a84c' : '#5a7a6a',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)',
                borderLeft: active === tab.id ? '3px solid #c9a84c' : '3px solid transparent',
                fontSize: 12, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 9,
                fontWeight: active === tab.id ? 700 : 500,
                letterSpacing: '0.04em',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
                onMouseEnter={e => { if (active !== tab.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = '#8aaa8a'; } }}
                onMouseLeave={e => { if (active !== tab.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#5a7a6a'; } }}
              >
                <span style={{ flexShrink: 0 }}>{tab.icon}</span>
                <span style={{ flex: 1 }}>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span style={{
                    background: active === tab.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)',
                    color: active === tab.id ? '#c9a84c' : '#5a7a6a',
                    fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 10,
                    minWidth: 18, textAlign: 'center',
                  }}>{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main style={{ minWidth: 0 }}>
          {active === 'overview'    && <OverviewPanel />}
          {active === 'articles'    && <ArticlesPanel />}
          {active === 'submissions' && <SubmissionsPanel />}
          {active === 'permissions' && <PermissionsPanel />}
          {active === 'authors'     && <AuthorsPanel />}
          {active === 'categories'  && <CategoriesPanel />}
          {active === 'messages'    && <MessagesPanel />}
          {active === 'files'       && <FilesPanel />}
          {active === 'hiring'      && <HiringPanel />}
          {active === 'ads'         && <AdsPanel />}
        </main>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }

        ::-webkit-scrollbar       { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 3px; }
        ::selection               { background: rgba(201,168,76,0.18); }
        input::placeholder, textarea::placeholder { color: #2a4a30; }
        select option             { background: #0b1e10; color: #d0c8a8; }

        .admin-layout {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 860px) {
          .admin-layout {
            grid-template-columns: 220px minmax(0,1fr);
          }
        }

        .stat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 700px) {
          .stat-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .form-grid-2 { display: grid; grid-template-columns: 1fr; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr; }
        @media (min-width: 600px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
          .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}