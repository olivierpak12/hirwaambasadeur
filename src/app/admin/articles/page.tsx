'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: '#5a8a6a',
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7,
    }}>{children}</div>
  );
}

export default function ArticlesAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'edit'>('list');

  // Edit form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFeaturedImageUrl, setEditFeaturedImageUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [editTags, setEditTags] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  // Queries and mutations
  const articles = useQuery(api.articles.getAllArticles);
  const categories = useQuery(api.categories.getAllCategories);
  const updateArticle = useMutation(api.articles.updateArticle);
  const deleteArticle = useMutation(api.articles.deleteArticle);
  const updateStatus = useMutation(api.articles.updateArticleStatus);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsAuthenticated(true);
    setAdminName(adminName || 'Admin');
  }, [router]);

  const startEditingArticle = (article: any) => {
    setEditingId(article._id);
    setEditTitle(article.title);
    setEditSlug(article.slug);
    setEditExcerpt(article.excerpt);
    setEditContent(article.content);
    setEditFeaturedImageUrl(article.featuredImage || '');
    setEditCategory(article.categoryId);
    setEditStatus(article.status);
    setEditTags((article.tags || []).join(', '));
    setError('');
    setSavedMessage('');
    setActiveTab('edit');
  };

  const handleSaveArticle = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setError('Title and content are required.');
      return;
    }

    setError('');
    setSavedMessage('');
    setEditSaving(true);

    try {
      await updateArticle({
        articleId: editingId as any,
        title: editTitle,
        slug: editSlug,
        excerpt: editExcerpt,
        content: editContent,
        featuredImage: editFeaturedImageUrl || undefined,
        categoryId: editCategory as any,
        status: editStatus,
        tags: editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      });

      setSavedMessage('✅ Article updated successfully!');
      setTimeout(() => {
        setSavedMessage('');
        setActiveTab('list');
        setEditingId(null);
      }, 2000);
    } catch (err) {
      setError('Failed to update article. Please try again.');
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteArticle({
        articleId: articleId as any,
      });
      setSavedMessage('✅ Article deleted successfully!');
      setTimeout(() => setSavedMessage(''), 2000);
    } catch (err) {
      setError('Failed to delete article. Please try again.');
      console.error(err);
    }
  };

  const handleChangeStatus = async (articleId: string, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      await updateStatus({
        articleId: articleId as any,
        status: newStatus,
      });
      setSavedMessage('✅ Status updated!');
      setTimeout(() => setSavedMessage(''), 2000);
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    }
  };

  const field: React.CSSProperties = {
    width: '100%', display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: 4, padding: '11px 14px',
    color: '#e8dfc8', fontSize: 14, outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.18s',
    marginBottom: 12,
    boxSizing: 'border-box',
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a3d28 0%, #0d1f17 100%)',
      color: '#e8dfc8',
      fontFamily: '"DM Sans", sans-serif',
      padding: '32px 20px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#c9a84c', margin: 0 }}>Articles</h1>
          <button
            onClick={() => router.push('/admin/create')}
            style={{
              background: '#c9a84c',
              color: '#070f09',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as any).style.filter = 'brightness(1.1)'}
            onMouseLeave={(e) => (e.currentTarget as any).style.filter = 'brightness(1)'}
          >
            + Create Article
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: 'rgba(224,90,58,0.12)',
            border: '1px solid #e05a3a',
            color: '#e05a3a',
            padding: '12px 16px',
            borderRadius: 4,
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {error}
            <button
              onClick={() => setError('')}
              style={{ background: 'none', border: 'none', color: '#e05a3a', cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>
          </div>
        )}

        {savedMessage && (
          <div style={{
            background: 'rgba(76,175,80,0.12)',
            border: '1px solid #4caf50',
            color: '#4caf50',
            padding: '12px 16px',
            borderRadius: 4,
            marginBottom: 16,
          }}>
            {savedMessage}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: 12 }}>
          <button
            onClick={() => setActiveTab('list')}
            style={{
              background: activeTab === 'list' ? 'rgba(201,168,76,0.2)' : 'transparent',
              border: 'none',
              color: activeTab === 'list' ? '#c9a84c' : '#5a8a6a',
              padding: '8px 16px',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            All Articles
          </button>
          {editingId && (
            <button
              onClick={() => setActiveTab('edit')}
              style={{
                background: activeTab === 'edit' ? 'rgba(201,168,76,0.2)' : 'transparent',
                border: 'none',
                color: activeTab === 'edit' ? '#c9a84c' : '#5a8a6a',
                padding: '8px 16px',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              ✏️ Edit Article
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === 'list' ? (
          <div style={{
            display: 'grid',
            gap: 16,
          }}>
            {articles && articles.length > 0 ? (
              articles.map((article: any) => (
                <div
                  key={article._id}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(201,168,76,0.1)',
                    borderRadius: 8,
                    padding: 20,
                    display: 'grid',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700, color: '#c9a84c' }}>
                        {article.title}
                      </h3>
                      <p style={{ margin: 0, color: '#a0b8a8', fontSize: 14 }}>
                        {article.excerpt}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <select
                        value={article.status}
                        onChange={(e) => handleChangeStatus(article._id, e.target.value as any)}
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(201,168,76,0.2)',
                          color: '#c9a84c',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => startEditingArticle(article)}
                        style={{
                          background: 'rgba(201,168,76,0.2)',
                          border: 'none',
                          color: '#c9a84c',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id, article.title)}
                        style={{
                          background: 'rgba(224,90,58,0.2)',
                          border: 'none',
                          color: '#e05a3a',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#5a8a6a' }}>
                    <span>📅 {new Date(article.publishedAt || article.updatedAt).toLocaleDateString()}</span>
                    <span>👁️ {article.views || 0} views</span>
                    <span>💬 {(article.commentCount || 0)} comments</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5a8a6a' }}>
                <p style={{ fontSize: 16, marginBottom: 16 }}>No articles yet.</p>
                <button
                  onClick={() => router.push('/admin/create')}
                  style={{
                    background: '#c9a84c',
                    color: '#070f09',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create First Article
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 8,
            padding: 24,
            maxWidth: 800,
          }}>
            <div style={{ marginBottom: 20 }}>
              <Label>Title</Label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={field}
                placeholder="Article title"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Slug</Label>
              <input
                type="text"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                style={field}
                placeholder="article-slug"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Excerpt</Label>
              <textarea
                value={editExcerpt}
                onChange={(e) => setEditExcerpt(e.target.value)}
                style={{...field, minHeight: 80, resize: 'vertical'}}
                placeholder="Brief summary..."
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Content</Label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{...field, minHeight: 300, resize: 'vertical', fontFamily: 'monospace'}}
                placeholder="Article content (HTML or markdown)..."
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Featured Image URL</Label>
              <input
                type="url"
                value={editFeaturedImageUrl}
                onChange={(e) => setEditFeaturedImageUrl(e.target.value)}
                style={field}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Category</Label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                style={{...field, cursor: 'pointer'}}
              >
                <option value="">Select a category</option>
                {categories && categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Status</Label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                style={{...field, cursor: 'pointer'}}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Tags (comma-separated)</Label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                style={field}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleSaveArticle}
                disabled={editSaving}
                style={{
                  background: '#c9a84c',
                  color: '#070f09',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: editSaving ? 'not-allowed' : 'pointer',
                  opacity: editSaving ? 0.6 : 1,
                }}
              >
                {editSaving ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setActiveTab('list');
                }}
                style={{
                  background: 'transparent',
                  color: '#5a8a6a',
                  border: '1px solid rgba(201,168,76,0.2)',
                  padding: '12px 24px',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
