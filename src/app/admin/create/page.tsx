'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ImageUpload from '@/components/common/ImageUpload';
import MultiImageUpload from '@/components/common/MultiImageUpload';

const CATEGORIES = ['Politics', 'Business', 'Technology', 'Health', 'Sports', 'Entertainment', 'Africa', 'World'];

const STATUSES = [
  { value: 'draft',     label: 'Draft',     color: '#4a7a5a' },
  { value: 'published', label: 'Published', color: '#1a6a3a' },
];

// ─── Small reusable atoms ─────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: '#5a8a6a',
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(201,168,76,0.08)', margin: '20px 0' }} />;
}

function CharCount({ value, max }: { value: string; max: number }) {
  const pct = value.length / max;
  const color = pct > 0.9 ? '#e05a3a' : pct > 0.7 ? '#c9a84c' : '#3a6a4a';
  return (
    <span style={{ fontSize: 10, color, marginLeft: 'auto', letterSpacing: '0.04em' }}>
      {value.length}/{max}
    </span>
  );
}

// ─── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(201,168,76,0.1)' : 'transparent',
        border: 'none', borderRadius: 3, padding: '5px 8px',
        color: hov ? '#c9a84c' : '#5a8a6a',
        cursor: 'pointer', fontSize: 12, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s, color 0.15s',
        minWidth: 30, height: 28,
      }}
    >{icon}</button>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 16px', flex: 1 }}>
      <div style={{ color: '#3a6a4a', marginBottom: 1 }}>{icon}</div>
      <span style={{ fontSize: 16, fontWeight: 800, color: '#c9a84c', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 9, color: '#3a5a3a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CreateArticlePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');

  const categories = useQuery(api.categories.getAllCategories);
  const authors = useQuery(api.authors.getAllAuthors);
  const createArticle = useMutation(api.articles.createArticle);
  const createAuthor = useMutation(api.authors.createAuthor);
  const seedCategories = useMutation(api.categories.seedCategories);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsAuthenticated(true);
    setAdminName(name || 'Admin');
  }, [router]);

  // Auto-seed categories if none exist
  useEffect(() => {
    if (isAuthenticated && categories !== undefined && categories.length === 0) {
      console.log('No categories found, seeding...');
      seedCategories().catch(error => {
        console.error('Failed to seed categories:', error);
      });
    }
  }, [isAuthenticated, categories, seedCategories]);

  const [title, setTitle]                     = useState('');
  const [excerpt, setExcerpt]                 = useState('');
  const [content, setContent]                 = useState('');
  const [category, setCategory]               = useState('');
  const [author, setAuthor]                   = useState('');
  const [tags, setTags]                       = useState<string[]>([]);
  const [tagInput, setTagInput]               = useState('');
  const [featuredImages, setFeaturedImages] = useState<Array<{ storageId: string; caption: string }>>([]);
  const [featuredImageUrl, setFeaturedImageUrl] = useState(''); // Direct URL input for Unsplash etc
  const [images, setImages] = useState<Array<{ storageId: string; caption: string }>>([]);
  const [status, setStatus]                   = useState('draft');
  const [saving, setSaving]                   = useState(false);
  const [saved, setSaved]                     = useState(false);
  const [error, setError]                     = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const wordCount  = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime   = Math.max(1, Math.round(wordCount / 200));
  const isReady    = title.trim() && content.trim() && category;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const insertMarkdown = useCallback((prefix: string, suffix = '') => {
    const ta = contentRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const next = v.slice(0, s) + replacement + v.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + prefix.length, s + prefix.length + (selected || 'text').length);
    });
  }, []);

  const handleSubmit = async () => {
    if (!isReady) { setError('Please fill in the headline, body, and category.'); return; }
    setError('');
    setSaving(true);
    try {
      // Generate slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Find category
      const selectedCategory = categories?.find(cat => cat.name === category);
      if (!selectedCategory) {
        setError('Selected category not found.');
        return;
      }

      // Get or create author
      let authorId = author || authors?.[0]?._id;
      if (!authorId) {
        // Create a default author if none exist
        authorId = await createAuthor({
          name: 'Admin',
          email: 'admin@hirwaambassadeur.com',
          bio: 'Administrator',
          canCreateArticles: true,
          canEditPhotos: false,
        });
      }

      // Create article
      await createArticle({
        title,
        slug,
        content,
        excerpt,
        featuredImage: featuredImageUrl || undefined, // Direct URL takes priority
        featuredImageIds: featuredImages.length > 0 ? featuredImages.map(img => img.storageId as any) : undefined,
        images: images.length > 0 ? images.map(img => ({
          storageId: img.storageId as any,
          caption: img.caption,
        })) : undefined,
        categoryId: selectedCategory._id,
        authorId: authorId as unknown as any,
        status: status as 'draft' | 'published' | 'archived',
        tags: tags.length > 0 ? tags : undefined,
        featured: false,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 4000);

      // Reset form
      setTitle('');
      setExcerpt('');
      setContent('');
      setCategory('');
      setAuthor('');
      setTags([]);
      setTagInput('');
      setFeaturedImages([]);
      setFeaturedImageUrl('');
      setImages([]);
      setStatus('draft');
    } catch (err) {
      setError('Failed to publish. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ─── Input styles ──────────────────────────────────────────────────────────
  const field: React.CSSProperties = {
    width: '100%', display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: 4, padding: '11px 14px',
    color: '#e8dfc8', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', lineHeight: 1.6,
    transition: 'border-color 0.18s, background 0.18s',
  };

  const onFocus = (e: React.FocusEvent<any>) => {
    e.target.style.borderColor = 'rgba(201,168,76,0.4)';
    e.target.style.background  = 'rgba(255,255,255,0.05)';
  };
  const onBlur = (e: React.FocusEvent<any>) => {
    e.target.style.borderColor = 'rgba(201,168,76,0.12)';
    e.target.style.background  = 'rgba(255,255,255,0.03)';
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    
    // Clear cookies
    document.cookie = 'adminToken=; path=/; max-age=0';
    document.cookie = 'adminEmail=; path=/; max-age=0';
    
    router.push('/auth/login');
  };

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#070f09',
        color: '#e8dfc8',
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid #1a3d28',
            borderTop: '3px solid #c9a84c',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p>Loading...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#070f09',
      minHeight: '100vh',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      color: '#e8dfc8',
    }}>

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,15,9,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        padding: '8px 10px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 6,
          height: 'auto',
          minHeight: 40,
          flexWrap: 'wrap',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3a6a4a', flex: 1 }} className="breadcrumb-mobile-hide">
            <span>Dashboard</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Articles</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span style={{ color: '#c9a84c', fontWeight: 600 }}>New Article</span>
          </div>

          {/* Status selector */}
          <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: 3, border: '1px solid rgba(201,168,76,0.1)' }}>
            {STATUSES.map(s => (
              <button key={s.value} onClick={() => setStatus(s.value)} style={{
                background: status === s.value ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: status === s.value ? '1px solid rgba(201,168,76,0.25)' : '1px solid transparent',
                borderRadius: 3, padding: '4px 10px',
                fontSize: 10, fontWeight: status === s.value ? 800 : 500,
                color: status === s.value ? '#c9a84c' : '#3a6a4a',
                cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}>{s.label}</button>
            ))}
          </div>

          {/* Save as draft */}
          <button onClick={() => setStatus('draft')} style={{
            background: 'transparent', border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4, padding: '7px 14px',
            fontSize: 11, fontWeight: 700, color: '#5a8a6a',
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = '#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)'; e.currentTarget.style.color = '#5a8a6a'; }}
          >Save Draft</button>

          {/* Publish */}
          <button onClick={handleSubmit} disabled={saving} style={{
            background: isReady
              ? saving ? 'rgba(201,168,76,0.5)' : 'linear-gradient(135deg, #b8942a, #d4aa48)'
              : 'rgba(255,255,255,0.05)',
            border: 'none', borderRadius: 4,
            padding: '7px 20px',
            fontSize: 11, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: isReady ? '#070f09' : '#2a4a35',
            cursor: isReady && !saving ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'filter 0.15s',
          }}
            onMouseEnter={e => { if (isReady && !saving) e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
          >
            {saving ? (
              <>
                <span style={{ width: 12, height: 12, border: '2px solid #070f09', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Publishing…
              </>
            ) : saved ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Published!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Publish
              </>
            )}
          </button>

          {/* Authors Link */}
          <button onClick={() => router.push('/admin/authors')} style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4,
            padding: '7px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: '#5a8a6a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
              e.currentTarget.style.color = '#5a8a6a';
            }}
            title="Manage Authors"
          >Authors</button>

          {/* Hiring Link */}
          <button onClick={() => router.push('/admin/jobs')} style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4,
            padding: '7px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: '#5a8a6a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
              e.currentTarget.style.color = '#5a8a6a';
            }}
            title="Manage Job Postings"
          >Hiring</button>

          {/* Articles Link */}
          <button onClick={() => router.push('/admin/articles')} style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4,
            padding: '7px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: '#5a8a6a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
              e.currentTarget.style.color = '#5a8a6a';
            }}
            title="View & Edit Articles"
          >Articles</button>

          {/* Ads Link */}
          <button onClick={() => router.push('/admin/ads')} style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4,
            padding: '7px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: '#5a8a6a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
              e.currentTarget.style.color = '#5a8a6a';
            }}
            title="Manage Advertisements"
          >Ads</button>

          {/* Logout button */}
          <button onClick={handleLogout} style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 4,
            padding: '7px 12px',
            fontSize: 10,
            fontWeight: 700,
            color: '#5a8a6a',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
            marginLeft: 'auto',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
              e.currentTarget.style.color = '#e88878';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.18)';
              e.currentTarget.style.color = '#5a8a6a';
            }}
            title={adminName}
          >Logout</button>
        </div>
      </div>

      {/* ── Error bar ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{ background: 'rgba(180,40,20,0.15)', borderBottom: '1px solid rgba(180,40,20,0.3)', padding: '10px 16px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#e88878' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#e88878', cursor: 'pointer', marginLeft: 'auto', fontSize: 16 }}>✕</button>
          </div>
        </div>
      )}

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(12px, 2vw, 24px) 10px 50px' }}>
        <div className="editor-grid">

          {/* ═══ LEFT: Editor ═════════════════════════════════════════════ */}
          <div style={{ minWidth: 0 }}>

            {/* Page title */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 3, height: 20, background: 'linear-gradient(180deg, #c9a84c, #e8c95a)', borderRadius: 2 }} />
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#f0e8d0', letterSpacing: '-0.3px' }}>
                  Write New Article
                </h1>
              </div>
              <p style={{ fontSize: 12, color: '#2e5a3a', letterSpacing: '0.04em', paddingLeft: 11 }}>
                Compose, format, and publish your story.
              </p>
            </div>

            {/* ── Headline ──────────────────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7 }}>
                <Label>Headline</Label>
                <CharCount value={title} max={120} />
              </div>
              <textarea
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Write a clear, compelling headline…"
                rows={2}
                maxLength={120}
                style={{
                  ...field,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 22, fontWeight: 700,
                  lineHeight: 1.35, resize: 'none',
                  letterSpacing: '-0.2px',
                }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* ── Excerpt ───────────────────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 7 }}>
                <Label>Excerpt / Standfirst</Label>
                <CharCount value={excerpt} max={280} />
              </div>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="A brief summary shown in article cards and search results (1–2 sentences)…"
                rows={3}
                maxLength={280}
                style={{ ...field, resize: 'vertical' }}
                onFocus={onFocus} onBlur={onBlur}
              />
            </div>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div>
              {/* Toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderBottom: 'none',
                borderRadius: '4px 4px 0 0',
                padding: '4px 8px',
                flexWrap: 'wrap',
              }}>
                <Label>Body</Label>
                <div style={{ flex: 1 }} />
                {[
                  { label: 'Bold',        icon: <b>B</b>,         action: () => insertMarkdown('**', '**') },
                  { label: 'Italic',      icon: <i>I</i>,         action: () => insertMarkdown('_', '_') },
                  { label: 'H2',          icon: 'H2',             action: () => insertMarkdown('\n## ') },
                  { label: 'H3',          icon: 'H3',             action: () => insertMarkdown('\n### ') },
                  { label: 'Quote',       icon: '❝',              action: () => insertMarkdown('\n> ') },
                  { label: 'Bullet list', icon: '• —',            action: () => insertMarkdown('\n- ') },
                  { label: 'Link',        icon: '🔗',             action: () => insertMarkdown('[', '](url)') },
                  { label: 'Divider',     icon: '—',              action: () => setContent(c => c + '\n---\n') },
                ].map(tb => (
                  <ToolBtn key={tb.label} label={tb.label} icon={tb.icon} onClick={tb.action} />
                ))}
                <div style={{ width: 1, height: 18, background: 'rgba(201,168,76,0.12)', margin: '0 4px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 4px' }}>
                  <span style={{ fontSize: 10, color: '#2e5a3a', letterSpacing: '0.06em' }}>{wordCount} words</span>
                  <span style={{ fontSize: 10, color: '#2e5a3a', letterSpacing: '0.06em' }}>{readTime} min read</span>
                </div>
              </div>

              <textarea
                ref={contentRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your article here. Markdown is supported for formatting — use **bold**, _italic_, ## headings, > blockquotes, and - bullet points…"
                rows={22}
                style={{
                  ...field,
                  borderRadius: '0 0 4px 4px',
                  resize: 'vertical',
                  lineHeight: 1.85,
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 14,
                  minHeight: 400,
                }}
                onFocus={onFocus} onBlur={onBlur}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: '#2a4a30', letterSpacing: '0.06em' }}>Markdown supported</span>
              </div>
            </div>

            {/* ── Tags ──────────────────────────────────────────────────── */}
            <div style={{ marginTop: 24, padding: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 4 }}>
              <Label>Tags</Label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                {tags.map(t => (
                  <span key={t} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.22)',
                    borderRadius: 3, padding: '3px 9px',
                    fontSize: 11, color: '#c9a84c', fontWeight: 600,
                  }}>
                    #{t}
                    <button onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', color: '#8a6a2a', cursor: 'pointer', padding: 0, fontSize: 13, lineHeight: 1, display: 'flex', alignItems: 'center' }}>✕</button>
                  </span>
                ))}
                {tags.length === 0 && <span style={{ fontSize: 12, color: '#2a4a30' }}>No tags yet</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }}}
                  placeholder="Add tag and press Enter…"
                  style={{ ...field, marginBottom: 0, flex: 1, fontSize: 13 }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button onClick={addTag} style={{
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.22)',
                  borderRadius: 4, padding: '0 14px', color: '#c9a84c',
                  fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>Add</button>
              </div>
              <p style={{ fontSize: 10, color: '#2a4a30', marginTop: 6 }}>Up to 8 tags · Press Enter or comma to add</p>
            </div>
          </div>

          {/* ═══ RIGHT: Sidebar ═══════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Live stats */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: '#5a8a6a', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Article Stats</span>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.06)' }} className="stat-container">
                <Stat
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                  label="Words" value={wordCount}
                />
                <div style={{ width: 1, background: 'rgba(201,168,76,0.06)' }} />
                <Stat
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                  label="Min Read" value={readTime}
                />
                <div style={{ width: 1, background: 'rgba(201,168,76,0.06)' }} />
                <Stat
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
                  label="Chars" value={content.length}
                />
              </div>
              {/* Completeness */}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#3a6a4a', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span>Completeness</span>
                  <span style={{ color: '#c9a84c', fontWeight: 700 }}>
                    {Math.round(([title, excerpt, content, category, featuredImages.length > 0].filter(Boolean).length / 5) * 100)}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, #b8942a, #d4aa48)',
                    width: `${([title, excerpt, content, category, featuredImages.length > 0].filter(Boolean).length / 5) * 100}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
                  {[
                    { label: 'Headline',      done: !!title },
                    { label: 'Excerpt',       done: !!excerpt },
                    { label: 'Body',          done: !!content },
                    { label: 'Category',      done: !!category },
                    { label: 'Featured Image',done: featuredImages.length > 0 },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11 }}>
                      <span style={{
                        width: 14, height: 14, borderRadius: '50%',
                        background: item.done ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                        border: item.done ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 8, color: item.done ? '#c9a84c' : '#2a4a30',
                        transition: 'all 0.2s',
                      }}>✓</span>
                      <span style={{ color: item.done ? '#8aaa8a' : '#2a4a30' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Publish settings */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: '#5a8a6a', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Publish Settings</span>
              </div>

              <div style={{ padding: '14px' }}>
                <Label>Category <span style={{ color: '#b04030', marginLeft: 2 }}>*</span></Label>
                {!categories ? (
                  <div style={{ padding: '10px', color: '#8a7a6a', fontSize: 12, textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderRadius: 3 }}>
                    Loading categories...
                  </div>
                ) : categories.length === 0 ? (
                  <div style={{ padding: '10px', color: '#8a7a6a', fontSize: 12, textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderRadius: 3 }}>
                    Seeding categories...
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }} className="category-grid">
                    {categories.map(cat => (
                      <button key={cat._id} onClick={() => setCategory(cat.name)} style={{
                        background: category === cat.name ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.02)',
                        border: category === cat.name ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(201,168,76,0.08)',
                        borderRadius: 3, padding: '7px 8px',
                        color: category === cat.name ? '#c9a84c' : '#3a6a4a',
                        fontSize: 11, fontWeight: category === cat.name ? 800 : 500,
                        cursor: 'pointer', letterSpacing: '0.06em',
                        transition: 'all 0.15s',
                        textAlign: 'left',
                      }}
                        onMouseEnter={e => { if (category !== cat.name) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#5a8a6a'; }}}
                        onMouseLeave={e => { if (category !== cat.name) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#3a6a4a'; }}}
                      >{cat.name}</button>
                    ))}
                  </div>
                )}

                <Divider />

                <Label>Author</Label>
                {!authors || authors.length === 0 ? (
                  <div style={{ padding: '10px', color: '#8a7a6a', fontSize: 12, textAlign: 'center', background: 'rgba(201,168,76,0.05)', borderRadius: 3 }}>
                    No authors available. Please create one in Authors Management.
                  </div>
                ) : (
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(201,168,76,0.12)',
                      borderRadius: 4,
                      padding: '11px 14px',
                      color: '#e8dfc8',
                      fontSize: 13,
                      outline: 'none',
                      cursor: 'pointer',
                      marginBottom: 16,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <option value="">Select an author...</option>
                    {authors
                      .filter((a: any) => a.canCreateArticles === true)
                      .map((a: any) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.email})
                        </option>
                      ))}
                  </select>
                )}

                <Divider />
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  style={{
                    width: '100%',
                    background: isReady
                      ? saving ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #b8942a, #d4aa48)'
                      : 'rgba(255,255,255,0.04)',
                    border: isReady ? 'none' : '1px solid rgba(201,168,76,0.08)',
                    borderRadius: 4, padding: '13px',
                    color: isReady ? '#070f09' : '#2a4a30',
                    fontSize: 12, fontWeight: 900,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    cursor: isReady && !saving ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'filter 0.15s',
                  }}
                  onMouseEnter={e => { if (isReady && !saving) e.currentTarget.style.filter = 'brightness(1.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
                >
                  {saving ? (
                    <>
                      <span style={{ width: 13, height: 13, border: '2px solid #070f09', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                      Publishing…
                    </>
                  ) : saved ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Published!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                      Publish Article
                    </>
                  )}
                </button>

                {!isReady && (
                  <p style={{ fontSize: 10, color: '#3a5a3a', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
                    Fill in headline, body &amp; category to publish
                  </p>
                )}
              </div>
            </div>

            {/* Featured image */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: '#5a8a6a', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Featured Image</span>
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Direct URL input - PREFERRED for Unsplash/external images */}
                <div>
                  <label style={{ fontSize: 11, color: '#a0b8a8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Paste Image URL (Unsplash, etc.) - Recommended for production
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={featuredImageUrl}
                    onChange={(e) => setFeaturedImageUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: 12,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(201,168,76,0.12)',
                      borderRadius: 3,
                      color: '#e8dfc8',
                      fontFamily: 'inherit',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(201,168,76,0.12)'}
                  />
                  <div style={{ fontSize: 10, color: '#5a8a6a', marginTop: 6 }}>
                    💡 Direct URLs work best in production. Try: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800
                  </div>
                </div>

                {/* OR divider */}
                <div style={{ textAlign: 'center', color: '#5a8a6a', fontSize: 11, fontWeight: 600, padding: '8px 0' }}>
                  — OR —
                </div>

                {/* File upload - backup option */}
                <div>
                  <label style={{ fontSize: 11, color: '#a0b8a8', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Upload File (optional - slower for production)
                  </label>
                  <MultiImageUpload
                    onImagesChange={setFeaturedImages}
                    maxImages={5}
                    label="Upload featured photos"
                  />
                </div>
              </div>
            </div>

            {/* Additional images gallery */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: '#5a8a6a', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Article Images (up to 5)</span>
              </div>
              <div style={{ padding: '14px' }}>
                <MultiImageUpload
                  onImagesChange={setImages}
                  maxImages={5}
                  label="Add photos to your article"
                />
              </div>
            </div>

            {/* SEO preview */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(201,168,76,0.1)',
              borderRadius: 4, overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 14, background: '#c9a84c', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: '#5a8a6a', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>SEO Preview</span>
              </div>
              <div style={{ padding: '14px' }}>
                <div style={{
                  background: '#fff', borderRadius: 4, padding: '12px 14px',
                  border: '1px solid #e0e0e0',
                }}>
                  <div style={{ fontSize: 11, color: '#006621', marginBottom: 3, letterSpacing: '0.02em' }}>
                    hirwaambassadeur.rw › article
                  </div>
                  <div style={{
                    fontSize: 14, color: '#1a0dab', fontWeight: 500, lineHeight: 1.3,
                    marginBottom: 4, overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {title || 'Article headline will appear here…'}
                  </div>
                  <div style={{
                    fontSize: 12, color: '#545454', lineHeight: 1.5,
                    overflow: 'hidden', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>
                    {excerpt || 'Your article excerpt will appear as the meta description in search results.'}
                  </div>
                </div>
                <p style={{ fontSize: 10, color: '#2a4a30', marginTop: 8, lineHeight: 1.5 }}>
                  The headline and excerpt populate your Google search preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved toast */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 999,
          background: 'linear-gradient(135deg, #0b1e10, #162d1c)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 6, padding: '12px 24px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.3s ease both',
        }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span style={{ fontSize: 13, color: '#c9a84c', fontWeight: 700 }}>Article published successfully!</span>
        </div>
      )}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateX(-50%) translateY(10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 3px; }
        ::selection { background: rgba(201,168,76,0.18); }

        textarea::placeholder, input::placeholder { color: #2a4a30; }

        /* Top bar responsiveness */
        div[style*="position: 'sticky'"] {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .editor-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 860px) {
          .editor-grid {
            grid-template-columns: minmax(0, 1fr) 280px;
            gap: 28px;
          }
        }

        /* Ensure sidebar is responsive */
        .editor-grid > div:last-child {
          width: 100%;
        }
        @media (min-width: 860px) {
          .editor-grid > div:last-child {
            width: auto;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 900px) {
          .topbar-nav-buttons {
            display: none !important;
          }
          .topbar-draft-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .breadcrumb-mobile-hide {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          /* Ensure grid stacks vertically */
          .editor-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          /* Sidebar should be full width */
          .editor-grid > div:last-child {
            width: 100% !important;
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }

          /* Side panel boxes */
          div[style*="background: 'rgba(255,255,255,0.02)'"],
          div[style*='background: "rgba(255,255,255,0.02)'] {
            width: 100% !important;
          }

          /* Publish button - primary action */
          button[style*="linear-gradient"] {
            padding: 8px 12px !important;
            font-size: 9px !important;
          }
          
          /* Page title */
          h1 {
            font-size: 15px !important;
            margin-bottom: 6px !important;
          }
          
          /* Main content article text smaller on mobile */
          p {
            font-size: 12px;
          }
          
          /* Input fields responsive - 16px prevents auto-zoom on iOS */
          input[type="text"],
          input[type="email"],
          textarea,
          select {
            font-size: 16px !important;
            padding: 10px 8px !important;
            margin-bottom: 6px;
            width: 100% !important;
            box-sizing: border-box;
          }
          
          /* Category grid - single column on mobile */
          .category-grid {
            grid-template-columns: 1fr !important;
            gap: 5px !important;
          }
          
          /* Stat cards responsive */
          .stat-container {
            flex-direction: column !important;
            gap: 0 !important;
          }
          
          /* Container padding */
          div[style*="marginBottom: 28"] {
            margin-bottom: 16px !important;
          }
          
          div[style*="marginBottom: 20"] {
            margin-bottom: 12px !important;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 14px !important;
          }
          p {
            font-size: 11px;
          }
          
          input, textarea, select {
            font-size: 16px !important;
            padding: 8px 6px !important;
          }
          
          /* Stack buttons more compactly */
          button {
            padding: 6px 6px !important;
            font-size: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}