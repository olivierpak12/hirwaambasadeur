'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type AdPlacement = 'header_banner' | 'sidebar' | 'footer' | 'article_middle';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: '#5a8a6a',
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7,
    }}>{children}</div>
  );
}

export default function AdsAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Form states
  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('sidebar');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPlacement, setEditPlacement] = useState<AdPlacement>('sidebar');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [editLinkUrl, setEditLinkUrl] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSaving, setEditSaving] = useState(false);

  // Queries and mutations
  const ads = useQuery(api.ads.getAllAds);
  const createAd = useMutation(api.ads.createAd);
  const updateAd = useMutation(api.ads.updateAd);
  const deleteAd = useMutation(api.ads.deleteAd);

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

  const handleCreateAd = async () => {
    if (!title.trim() || !imageUrl.trim() || !altText.trim()) {
      setError('Please fill in title, image URL, and alt text.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await createAd({
        title,
        placement,
        imageUrl,
        altText,
        linkUrl: linkUrl || undefined,
        isActive,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Reset form
      setTitle('');
      setPlacement('sidebar');
      setImageUrl('');
      setAltText('');
      setLinkUrl('');
      setIsActive(true);
      setActiveTab('list');
    } catch (err) {
      setError('Failed to create ad. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (ad: any) => {
    setEditingId(ad._id);
    setEditTitle(ad.title);
    setEditPlacement(ad.placement);
    setEditImageUrl(ad.imageUrl);
    setEditAltText(ad.altText);
    setEditLinkUrl(ad.linkUrl || '');
    setEditIsActive(ad.isActive);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditPlacement('sidebar');
    setEditImageUrl('');
    setEditAltText('');
    setEditLinkUrl('');
    setEditIsActive(true);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editImageUrl.trim() || !editAltText.trim()) {
      setError('Please fill in title, image URL, and alt text.');
      return;
    }

    setError('');
    setEditSaving(true);

    try {
      await updateAd({
        adId: editingId as any,
        title: editTitle,
        placement: editPlacement,
        imageUrl: editImageUrl,
        altText: editAltText,
        linkUrl: editLinkUrl || undefined,
        isActive: editIsActive,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      handleCancelEdit();
    } catch (err) {
      setError('Failed to update ad. Please try again.');
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleToggleActive = async (ad: any) => {
    try {
      await updateAd({
        adId: ad._id,
        isActive: !ad.isActive,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to toggle ad status');
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await deleteAd({ adId: adId as any });
      } catch (err) {
        console.error(err);
        setError('Failed to delete ad');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    router.push('/auth/login');
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: 4, padding: '11px 14px',
    color: '#e8dfc8', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', lineHeight: 1.6,
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

  const renderEditModal = () => {
    if (!editingId) return null;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}>
        <div style={{
          background: '#070f09',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 8,
          padding: 32,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}>
          <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
            Edit Advertisement
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

          <div style={{ marginBottom: 20 }}>
            <Label>Title *</Label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Ad title"
              style={fieldStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Placement *</Label>
            <select
              value={editPlacement}
              onChange={(e) => setEditPlacement(e.target.value as AdPlacement)}
              style={fieldStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              <option value="header_banner">Header Banner</option>
              <option value="sidebar">Sidebar</option>
              <option value="footer">Footer</option>
              <option value="article_middle">Middle of Article</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Image URL *</Label>
            <input
              type="url"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={fieldStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Alt Text *</Label>
            <input
              type="text"
              value={editAltText}
              onChange={(e) => setEditAltText(e.target.value)}
              placeholder="Alt text for image"
              style={fieldStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Link URL</Label>
            <input
              type="url"
              value={editLinkUrl}
              onChange={(e) => setEditLinkUrl(e.target.value)}
              placeholder="https://example.com"
              style={fieldStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editIsActive}
                onChange={(e) => setEditIsActive(e.target.checked)}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <span style={{ fontSize: 14, color: '#e8dfc8' }}>Active</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: editSaving ? '#3a5a3a' : '#1a6a3a',
                color: '#e8dfc8',
                border: 'none',
                borderRadius: 4,
                cursor: editSaving ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={editSaving}
              style={{
                flex: 1,
                padding: '12px 24px',
                background: 'transparent',
                color: '#5a8a6a',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 4,
                cursor: editSaving ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
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
      {renderEditModal()}
      
      {/* Top Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,15,9,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        padding: '0 16px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: 14, height: 54,
        }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9a84c', flex: 1 }}>Advertisements</h1>
          <button onClick={() => router.push('/admin/create')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Articles">Articles</button>
          <button onClick={() => router.push('/admin/authors')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Authors">Authors</button>
          <button onClick={() => router.push('/admin/jobs')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Jobs">Hiring</button>
          <span style={{ fontSize: 12, color: '#3a6a4a' }}>Welcome, {adminName}</span>
          <button onClick={handleLogout} style={{
            padding: '8px 12px', fontSize: 12, background: '#3a6a4a',
            color: '#e8dfc8', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', gap: 0,
      }}>
        {['create', 'list'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'create' | 'list')}
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
            {tab === 'create' ? '+ New Ad' : 'All Ads'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', padding: '32px 16px',
      }}>
        {activeTab === 'create' && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 8,
            padding: 32,
          }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              Create New Advertisement
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
                ✓ Advertisement created successfully!
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <Label>Title *</Label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ad title"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Placement *</Label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="header_banner">Header Banner</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
                <option value="article_middle">Middle of Article</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Image URL *</Label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Alt Text *</Label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Alt text for image"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Link URL</Label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ cursor: 'pointer', width: 18, height: 18 }}
                />
                <span style={{ fontSize: 14, color: '#e8dfc8' }}>Active</span>
              </label>
            </div>

            <button
              onClick={handleCreateAd}
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
              {saving ? 'Creating...' : 'Create Advertisement'}
            </button>
          </div>
        )}

        {activeTab === 'list' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              All Advertisements ({ads?.length || 0})
            </h2>

            {!ads || ads.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#3a6a4a',
              }}>
                <p>No advertisements yet. Create your first one above!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {ads.map((ad: any) => (
                  <div
                    key={ad._id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: 16,
                      alignItems: 'start',
                    }}
                  >
                    {/* Ad Preview */}
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: 6,
                      background: 'rgba(201,168,76,0.1)',
                      overflow: 'hidden',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}>
                      <img
                        src={ad.imageUrl}
                        alt={ad.altText}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Ad Info */}
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>
                        {ad.title}
                        <span style={{
                          marginLeft: 12,
                          display: 'inline-block',
                          background: ad.isActive ? 'rgba(26,106,58,0.2)' : 'rgba(224,90,58,0.2)',
                          color: ad.isActive ? '#1a6a3a' : '#e05a3a',
                          padding: '2px 8px',
                          borderRadius: 3,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </h3>
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#5a8a6a' }}>
                        📍 Placement: <span style={{ fontWeight: 600 }}>{ad.placement.replace('_', ' ').toUpperCase()}</span>
                      </p>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#3a6a4a' }}>
                        <div>👁️ Views: <span style={{ color: '#1a6a3a', fontWeight: 600 }}>{ad.views || 0}</span></div>
                        <div>🖱️ Clicks: <span style={{ color: '#1a6a3a', fontWeight: 600 }}>{ad.clicks || 0}</span></div>
                        <div>📊 CTR: <span style={{ color: '#1a6a3a', fontWeight: 600 }}>{ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0}%</span></div>
                      </div>
                      {ad.linkUrl && (
                        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#5a8a6a', wordBreak: 'break-all' }}>
                          🔗 {ad.linkUrl}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <button
                        onClick={() => handleOpenEdit(ad)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(201,168,76,0.2)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          color: '#c9a84c',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(ad)}
                        style={{
                          padding: '8px 12px',
                          background: ad.isActive ? 'rgba(224,90,58,0.2)' : 'rgba(26,106,58,0.2)',
                          border: '1px solid ' + (ad.isActive ? 'rgba(224,90,58,0.3)' : 'rgba(26,106,58,0.3)'),
                          color: ad.isActive ? '#e05a3a' : '#1a6a3a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {ad.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad._id)}
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(224,90,58,0.2)',
                          border: '1px solid rgba(224,90,58,0.3)',
                          color: '#e05a3a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
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
