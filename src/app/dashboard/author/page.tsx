'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ImageUpload from '@/components/common/ImageUpload';

export default function AuthorDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorId, setAuthorId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'create'>('articles');

  // Article form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageStorageId, setFeaturedImageStorageId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Queries and mutations
  const categories = useQuery(api.categories.getAllCategories);
  // Always call the hook - pass 'skip' when authorId is not available (fixes hook order)
  const authorArticles = useQuery(
    api.articles.getAuthorArticles, 
    authorId ? { authorId: authorId as any } : 'skip'
  ) as any;
  const createArticle = useMutation(api.articles.createArticle);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authorToken');
    const id = localStorage.getItem('authorId');
    const name = localStorage.getItem('authorName');

    if (!token || !id) {
      router.push('/author/login');
      return;
    }

    setIsAuthenticated(true);
    setAuthorId(id);
    setAuthorName(name || 'Author');
  }, [router]);

  const handleCreateArticle = async () => {
    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      await createArticle({
        title,
        slug,
        excerpt: excerpt || title.substring(0, 100),
        content,
        categoryId: categoryId as any,
        authorId: authorId as any,
        status,
        featured: false,
        featuredImageIds: featuredImageStorageId ? [featuredImageStorageId as any] : undefined,
        youtubeUrl: youtubeUrl.trim() || undefined,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Reset form
      setTitle('');
      setExcerpt('');
      setContent('');
      setCategoryId('');
      setStatus('draft');
      setFeaturedImage('');
      setFeaturedImageStorageId('');
      setYoutubeUrl('');
      setActiveTab('articles');
    } catch (err) {
      setError('Failed to create article. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authorToken');
    localStorage.removeItem('authorId');
    localStorage.removeItem('authorEmail');
    localStorage.removeItem('authorName');
    router.push('/author/login');
  };

  const fieldStyle: React.CSSProperties = {
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
  };

  const onFocus = (e: React.FocusEvent<any>) => {
    e.target.style.borderColor = 'rgba(201,168,76,0.4)';
    e.target.style.background = 'rgba(255,255,255,0.05)';
  };

  const onBlur = (e: React.FocusEvent<any>) => {
    e.target.style.borderColor = 'rgba(201,168,76,0.12)';
    e.target.style.background = 'rgba(255,255,255,0.03)';
  };

  if (!isAuthenticated) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070f09', color: '#e8dfc8' }}>Loading...</div>;
  }

  return (
    <div style={{
      background: '#070f09',
      minHeight: '100vh',
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      color: '#e8dfc8',
    }}>
      {/* Top Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7,15,9,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        padding: '0 16px',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          height: 54,
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9a84c', flex: 1 }}>
            My Articles
          </h1>
          <span style={{ fontSize: 12, color: '#3a6a4a' }}>Welcome, {authorName}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              background: '#3a6a4a',
              color: '#e8dfc8',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex',
        gap: 0,
      }}>
        {['articles', 'create'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'articles' | 'create')}
            style={{
              padding: '12px 20px',
              background: activeTab === tab ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #c9a84c' : 'none',
              color: activeTab === tab ? '#c9a84c' : '#5a8a6a',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {tab === 'create' ? '+ New Article' : 'My Articles'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '32px 16px',
      }}>
        {activeTab === 'create' && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 8,
            padding: 32,
          }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              Create New Article
            </h2>

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

            {saved && (
              <div style={{
                background: 'rgba(26,106,58,0.1)',
                border: '1px solid rgba(26,106,58,0.3)',
                color: '#1a6a3a',
                padding: '12px 14px',
                borderRadius: 4,
                marginBottom: 20,
                fontSize: 13,
              }}>
                ✓ Article created successfully!
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Excerpt
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the article"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Featured Image
              </label>
              <ImageUpload
                onUploadComplete={(url: string, storageId: string) => {
                  setFeaturedImage(url);
                  setFeaturedImageStorageId(storageId);
                }}
                currentImage={featuredImage}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                YouTube Link (Optional)
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{
                  ...fieldStyle,
                  appearance: 'none',
                  paddingRight: 30,
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%235a8a6a%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Article content..."
                style={{
                  ...fieldStyle,
                  minHeight: 200,
                  resize: 'vertical',
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#5a8a6a',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: 7,
                display: 'block',
              }}>
                Status
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === 'draft'}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 14, color: '#e8dfc8' }}>Draft</span>
                </label>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === 'published'}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 14, color: '#e8dfc8' }}>Publish</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleCreateArticle}
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: saving ? '#3a5a3a' : '#1a6a3a',
                color: '#e8dfc8',
                border: 'none',
                borderRadius: 4,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 13,
                width: '100%',
              }}
            >
              {saving ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        )}

        {activeTab === 'articles' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              Your Articles ({authorArticles?.length || 0})
            </h2>
            {!authorArticles || authorArticles.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#3a6a4a',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: 8,
              }}>
                <p>You have no articles yet. Create your first article above!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {authorArticles.map((article: any) => (
                  <div
                    key={article._id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: 20,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>
                          {article.title}
                          <span style={{
                            marginLeft: 12,
                            display: 'inline-block',
                            background: article.status === 'published' ? 'rgba(26,106,58,0.2)' : 'rgba(201,168,76,0.2)',
                            color: article.status === 'published' ? '#1a6a3a' : '#c9a84c',
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: 10,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                          }}>
                            {article.status}
                          </span>
                        </h3>
                        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#5a8a6a' }}>
                          {article.excerpt}
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: '#3a6a4a' }}>
                          Views: {article.views || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
