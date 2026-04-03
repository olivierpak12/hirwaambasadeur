'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ImageUpload from '@/components/common/ImageUpload';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: '#5a8a6a',
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7,
    }}>{children}</div>
  );
}

export default function JournalistsAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Form states for creation
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sendCredentialsEmail, setSendCredentialsEmail] = useState(true);
  const [bio, setBio] = useState('');
  const [canCreateArticles, setCanCreateArticles] = useState(true);
  const [canEditPhotos, setCanEditPhotos] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profilePhotoStorageId, setProfilePhotoStorageId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Edit mode states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCanCreateArticles, setEditCanCreateArticles] = useState(false);
  const [editCanEditPhotos, setEditCanEditPhotos] = useState(false);
  const [editProfilePhoto, setEditProfilePhoto] = useState('');
  const [editProfilePhotoStorageId, setEditProfilePhotoStorageId] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Queries and mutations
  const authors = useQuery(api.authors.getAllAuthorsWithPhotos);
  const createAuthor = useMutation(api.authors.createAuthor);
  const updateAuthor = useMutation(api.authors.updateAuthor);
  const deleteAuthor = useMutation(api.authors.deleteAuthor);
  const sendAuthorCredentials = useAction(api.sendAuthorCredentials.sendAuthorCredentials);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminName = localStorage.getItem('adminName');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsAuthenticated(true);
    setAdminName(adminName || 'Hirwa Ambassadeur');
  }, [router]);

  const handleCreateAuthor = async () => {
    if (!name.trim() || !email.trim()) {
      setError('Please fill in name and email.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password for the author.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      const result = await createAuthor({
        name,
        email,
        password,
        bio,
        canCreateArticles,
        canEditPhotos,
        photoStorageId: profilePhotoStorageId ? (profilePhotoStorageId as any) : undefined,
        sendCredentialsEmail,
      });

      // Send credentials email if requested
      if (result.sendCredentialsEmail && result.password) {
        try {
          await sendAuthorCredentials({
            email: result.email,
            name: result.name,
            password: result.password,
          });
        } catch (emailErr) {
          console.error('Failed to send credentials email:', emailErr);
          // Don't fail the creation if email fails
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setSendCredentialsEmail(true);
      setBio('');
      setCanCreateArticles(true);
      setCanEditPhotos(false);
      setProfilePhoto('');
      setProfilePhotoStorageId('');
      setActiveTab('list');
    } catch (err) {
      setError('Failed to create author. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePermission = async (authorId: string, permission: 'articles' | 'photos', value: boolean) => {
    try {
      await updateAuthor({
        authorId: authorId as any,
        [permission === 'articles' ? 'canCreateArticles' : 'canEditPhotos']: value,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to update permission');
    }
  };

  const handleToggleActive = async (authorId: string, isActive: boolean) => {
    try {
      await updateAuthor({
        authorId: authorId as any,
        isActive: !isActive,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to toggle author status');
    }
  };

  const handleDeleteAuthor = async (authorId: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor({ authorId: authorId as any });
      } catch (err) {
        console.error(err);
        setError('Failed to delete author');
      }
    }
  };

  const handleOpenEdit = (author: any) => {
    setEditingId(author._id);
    setEditName(author.name || '');
    setEditEmail(author.email || '');
    setEditBio(author.bio || '');
    setEditCanCreateArticles(author.canCreateArticles ?? false);
    setEditCanEditPhotos(author.canEditPhotos ?? false);
    setEditProfilePhoto(author.photo || '');
    setEditProfilePhotoStorageId('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditBio('');
    setEditCanCreateArticles(false);
    setEditCanEditPhotos(false);
    setEditProfilePhoto('');
    setEditProfilePhotoStorageId('');
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      setError('Please fill in name and email.');
      return;
    }

    setError('');
    setEditSaving(true);

    try {
      await updateAuthor({
        authorId: editingId as any,
        name: editName,
        email: editEmail,
        bio: editBio,
        canCreateArticles: editCanCreateArticles,
        canEditPhotos: editCanEditPhotos,
        ...(editProfilePhotoStorageId ? { photoStorageId: editProfilePhotoStorageId as any } : {}),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      handleCancelEdit();
    } catch (err) {
      setError('Failed to update author. Please try again.');
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    router.push('/auth/login');
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
            Edit Journalist
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div>
              <Label>Journalist Name *</Label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g., John Smith"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
            <div>
              <Label>Email Address *</Label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="journalist@example.com"
                style={fieldStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <Label>Bio</Label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Journalist biography..."
              style={{
                ...fieldStyle,
                minHeight: 100,
                resize: 'vertical',
              }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <Label>Profile Picture</Label>
            <ImageUpload
              onUploadComplete={(url: string, storageId: string) => {
                setEditProfilePhoto(url);
                setEditProfilePhotoStorageId(storageId);
              }}
              currentImage={editProfilePhoto}
            />
          </div>

          <div style={{ marginBottom: 24, background: 'rgba(201,168,76,0.05)', padding: 16, borderRadius: 6, border: '1px solid rgba(201,168,76,0.1)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>Permissions</h3>
            
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
              <input
                type="checkbox"
                id="edit-articles"
                checked={editCanCreateArticles}
                onChange={(e) => setEditCanCreateArticles(e.target.checked)}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <label htmlFor="edit-articles" style={{ cursor: 'pointer', fontSize: 14, color: '#e8dfc8', flex: 1 }}>
                Can Create & Edit Articles
              </label>
            </div>

            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="checkbox"
                id="edit-photos"
                checked={editCanEditPhotos}
                onChange={(e) => setEditCanEditPhotos(e.target.checked)}
                style={{ cursor: 'pointer', width: 18, height: 18 }}
              />
              <label htmlFor="edit-photos" style={{ cursor: 'pointer', fontSize: 14, color: '#e8dfc8', flex: 1 }}>
                Can Edit & Upload Photos
              </label>
            </div>
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

  const fieldStyle: React.CSSProperties = {
    width: '100%', display: 'block',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.12)',
    borderRadius: 4, padding: '11px 14px',
    color: '#e8dfc8', fontSize: 14, outline: 'none',
    fontFamily: 'inherit', lineHeight: 1.6,
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
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9a84c', flex: 1 }}>Journalists Management</h1>
          <button onClick={() => router.push('/admin/create')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Articles">Articles</button>
          <button onClick={() => router.push('/admin/jobs')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Hiring">Hiring</button>
          <button onClick={() => router.push('/admin/ads')} style={{
            padding: '8px 12px', fontSize: 11, background: 'transparent',
            color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 4, cursor: 'pointer', fontWeight: 600,
          }} title="Ads">Ads</button>
          <span style={{ fontSize: 12, color: '#3a6a4a' }}>Welcome, {adminName}</span>
          <button onClick={handleLogout} style={{
            padding: '8px 12px', fontSize: 12, background: '#3a6a4a',
            color: '#e8dfc8', border: 'none', borderRadius: 4, cursor: 'pointer',
          }}>
            Logout
          </button>
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
            {tab === 'create' ? '+ New Journalist' : 'All Journalists'}
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
              Add New Journalist
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
                ✓ Journalist created successfully!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <Label>Journalist Name *</Label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Smith"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <Label>Email Address *</Label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="journalist@example.com"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <Label>Password *</Label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer', flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={sendCredentialsEmail}
                    onChange={(e) => setSendCredentialsEmail(e.target.checked)}
                    style={{ cursor: 'pointer', width: 18, height: 18 }}
                  />
                  <span style={{ fontSize: 14, color: '#e8dfc8' }}>
                    Send credentials via email
                  </span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Journalist biography..."
                style={{
                  ...fieldStyle,
                  minHeight: 100,
                  resize: 'vertical',
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Label>Profile Picture</Label>
              <ImageUpload
                onUploadComplete={(url: string, storageId: string) => {
                  setProfilePhoto(url);
                  setProfilePhotoStorageId(storageId);
                }}
                currentImage={profilePhoto}
              />
            </div>

            <div style={{ marginBottom: 24, background: 'rgba(201,168,76,0.05)', padding: 16, borderRadius: 6, border: '1px solid rgba(201,168,76,0.1)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#c9a84c' }}>Permissions</h3>
              
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="articles"
                  checked={canCreateArticles}
                  onChange={(e) => setCanCreateArticles(e.target.checked)}
                  style={{ cursor: 'pointer', width: 18, height: 18 }}
                />
                <label htmlFor="articles" style={{ cursor: 'pointer', fontSize: 14, color: '#e8dfc8', flex: 1 }}>
                  Can Create & Edit Articles
                </label>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  id="photos"
                  checked={canEditPhotos}
                  onChange={(e) => setCanEditPhotos(e.target.checked)}
                  style={{ cursor: 'pointer', width: 18, height: 18 }}
                />
                <label htmlFor="photos" style={{ cursor: 'pointer', fontSize: 14, color: '#e8dfc8', flex: 1 }}>
                  Can Edit & Upload Photos
                </label>
              </div>
            </div>

            <button
              onClick={handleCreateAuthor}
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
              {saving ? 'Creating...' : 'Create Author'}
            </button>
          </div>
        )}

        {activeTab === 'list' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              All Authors ({authors?.length || 0})
            </h2>

            {!authors || authors.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#3a6a4a',
              }}>
                <p>No authors yet. Create your first one above!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {authors.map((author: any) => (
                  <div
                    key={author._id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: 20,
                      alignItems: 'start',
                    }}
                  >
                    {/* Profile Picture */}
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {author.photo ? (
                        <img
                          src={author.photo}
                          alt={author.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 32, color: '#5a8a6a' }}>
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Author Info */}
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>
                        {author.name}
                        <span style={{
                          marginLeft: 12,
                          display: 'inline-block',
                          background: author.isActive ? 'rgba(26,106,58,0.2)' : 'rgba(224,90,58,0.2)',
                          color: author.isActive ? '#1a6a3a' : '#e05a3a',
                          padding: '2px 8px',
                          borderRadius: 3,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          {author.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </h3>
                      <p style={{ margin: '0 0 12px', fontSize: 12, color: '#3a6a4a' }}>{author.email}</p>
                      {author.bio && <p style={{ margin: '0 0 12px', fontSize: 13, color: '#5a8a6a' }}>{author.bio}</p>}
                      
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, marginTop: 12 }}>
                        <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={author.canCreateArticles}
                            onChange={(e) => handleTogglePermission(author._id, 'articles', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ color: author.canCreateArticles ? '#c9a84c' : '#3a6a4a' }}>Create Articles</span>
                        </label>
                        <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={author.canEditPhotos}
                            onChange={(e) => handleTogglePermission(author._id, 'photos', e.target.checked)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ color: author.canEditPhotos ? '#c9a84c' : '#3a6a4a' }}>Edit Photos</span>
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <button
                        onClick={() => handleOpenEdit(author)}
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
                        onClick={() => handleToggleActive(author._id, author.isActive)}
                        style={{
                          padding: '8px 12px',
                          background: author.isActive ? 'rgba(224,90,58,0.2)' : 'rgba(26,106,58,0.2)',
                          border: '1px solid ' + (author.isActive ? 'rgba(224,90,58,0.3)' : 'rgba(26,106,58,0.3)'),
                          color: author.isActive ? '#e05a3a' : '#1a6a3a',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {author.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteAuthor(author._id)}
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
