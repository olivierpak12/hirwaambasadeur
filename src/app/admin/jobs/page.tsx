'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
const JOB_STATUSES = ['open', 'closed'];

// ─── Small reusable components ─────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: '#5a8a6a',
      letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 7,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'rgba(201,168,76,0.08)', margin: '20px 0' }} />;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function JobsAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list' | 'applications'>('create');

  // Form states
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [status, setStatus] = useState('open');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Queries and mutations
  const jobs = useQuery(api.jobs.getAllJobs);
  const applications = useQuery(api.jobs.getAllApplications);
  const createJob = useMutation(api.jobs.createJob);
  const updateJobStatus = useMutation(api.jobs.updateJob);
  const deleteJob = useMutation(api.jobs.deleteJob);
  const updateApplicationStatus = useMutation(api.jobs.updateApplicationStatus);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    setIsAuthenticated(true);
    setAdminName(name || 'Hirwa Ambassadeur');
  }, [router]);

  const addRequirement = () => {
    const req = requirementInput.trim();
    if (req && !requirements.includes(req)) {
      setRequirements([...requirements, req]);
      setRequirementInput('');
    }
  };

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter(r => r !== req));
  };

  const addBenefit = () => {
    const ben = benefitInput.trim();
    if (ben && !benefits.includes(ben)) {
      setBenefits([...benefits, ben]);
      setBenefitInput('');
    }
  };

  const removeBenefit = (ben: string) => {
    setBenefits(benefits.filter(b => b !== ben));
  };

  const handleCreateJob = async () => {
    if (!title.trim() || !department.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      await createJob({
        title,
        department,
        type: type as 'Full-time' | 'Part-time' | 'Contract' | 'Freelance',
        location,
        description,
        requirements: requirements.length > 0 ? requirements : undefined,
        benefits: benefits.length > 0 ? benefits : undefined,
        status: status as 'open' | 'closed',
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Reset form
      setTitle('');
      setDepartment('');
      setType('Full-time');
      setLocation('');
      setDescription('');
      setRequirements([]);
      setBenefits([]);
      setStatus('open');
      setActiveTab('list');
    } catch (err) {
      setError('Failed to create job. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminRole');
    router.push('/auth/login');
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      try {
        await deleteJob({ jobId: jobId as any });
      } catch (err) {
        console.error(err);
        setError('Failed to delete job');
      }
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateApplicationStatus({
        applicationId: appId as any,
        status: newStatus,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to update application status');
    }
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
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#070f09',
        color: '#e8dfc8',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid #1a3d28',
            borderTop: '3px solid #c9a84c',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#c9a84c' }}>
              Hiring Management
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
            <button onClick={() => router.push('/admin/ads')} style={{
              padding: '8px 12px', fontSize: 11, background: 'transparent',
              color: '#5a8a6a', border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 4, cursor: 'pointer', fontWeight: 600,
            }} title="Ads">Ads</button>
            <span style={{ fontSize: 12, color: '#3a6a4a' }}>Welcome, {adminName}</span>
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
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex',
        gap: 0,
      }}>
        {['create', 'list', 'applications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'create' | 'list' | 'applications')}
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
            {tab === 'create' ? '+ New Job' : tab === 'list' ? 'All Jobs' : 'Applications'}
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
              Create New Job Posting
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
                ✓ Job posting created successfully!
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <Label>Job Title *</Label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Content Editor"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <Label>Department *</Label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Editorial, Marketing"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <Label>Job Type *</Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{
                    ...fieldStyle,
                    cursor: 'pointer',
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                >
                  {JOB_TYPES.map((jt) => (
                    <option key={jt} value={jt}>
                      {jt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Location *</Label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Kigali, Rwanda or Remote"
                  style={fieldStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Job Description *</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed job description..."
                style={{
                  ...fieldStyle,
                  minHeight: 150,
                  resize: 'vertical',
                }}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Requirements</Label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRequirement();
                    }
                  }}
                  placeholder="Add a requirement and press Enter"
                  style={{ ...fieldStyle, flex: 1 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  onClick={addRequirement}
                  style={{
                    padding: '11px 14px',
                    background: 'rgba(201,168,76,0.2)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: 4,
                    color: '#c9a84c',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {requirements.map((req) => (
                  <div
                    key={req}
                    style={{
                      background: 'rgba(201,168,76,0.15)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      borderRadius: 20,
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    {req}
                    <button
                      onClick={() => removeRequirement(req)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#c9a84c',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Benefits</Label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addBenefit();
                    }
                  }}
                  placeholder="Add a benefit and press Enter"
                  style={{ ...fieldStyle, flex: 1 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  onClick={addBenefit}
                  style={{
                    padding: '11px 14px',
                    background: 'rgba(201,168,76,0.2)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    borderRadius: 4,
                    color: '#c9a84c',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {benefits.map((ben) => (
                  <div
                    key={ben}
                    style={{
                      background: 'rgba(201,168,76,0.15)',
                      border: '1px solid rgba(201,168,76,0.25)',
                      borderRadius: 20,
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 12,
                    }}
                  >
                    {ben}
                    <button
                      onClick={() => removeBenefit(ben)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#c9a84c',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <Label>Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ ...fieldStyle, cursor: 'pointer' }}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                {JOB_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === 'open' ? 'Open' : 'Closed'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCreateJob}
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
              {saving ? 'Creating...' : 'Create Job Posting'}
            </button>
          </div>
        )}

        {activeTab === 'list' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              All Job Postings ({jobs?.length || 0})
            </h2>

            {!jobs || jobs.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#3a6a4a',
              }}>
                <p>No job postings yet. Create your first one above!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {jobs.map((job: any) => (
                  <div
                    key={job._id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>
                        {job.title}
                      </h3>
                      <div style={{ fontSize: 12, color: '#5a8a6a', marginBottom: 8 }}>
                        <span style={{ marginRight: 12 }}>📁 {job.department}</span>
                        <span style={{ marginRight: 12 }}>📍 {job.location}</span>
                        <span style={{ marginRight: 12 }}>⏰ {job.type}</span>
                        <span style={{
                          display: 'inline-block',
                          background: job.status === 'open' ? 'rgba(26,106,58,0.2)' : 'rgba(224,90,58,0.2)',
                          color: job.status === 'open' ? '#1a6a3a' : '#e05a3a',
                          padding: '2px 8px',
                          borderRadius: 3,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          {job.status}
                        </span>
                      </div>
                      <p style={{ margin: '8px 0', fontSize: 13, color: '#3a6a4a', lineHeight: 1.5 }}>
                        {job.description.substring(0, 150)}...
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
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

        {activeTab === 'applications' && (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700, color: '#c9a84c' }}>
              Job Applications ({applications?.length || 0})
            </h2>

            {!applications || applications.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#3a6a4a',
              }}>
                <p>No applications yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {applications.map((app: any) => (
                  <div
                    key={app._id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(201,168,76,0.1)',
                      borderRadius: 8,
                      padding: 20,
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: 16,
                      alignItems: 'start',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#c9a84c' }}>
                        {app.name}
                      </h3>
                      <p style={{ margin: '0 0 8px', fontSize: 12, color: '#5a8a6a' }}>
                        Applied for: <span style={{ color: '#1a6a3a', fontWeight: 600 }}>{app.jobTitle}</span>
                      </p>
                      <div style={{ margin: '8px 0', fontSize: 12, color: '#3a6a4a' }}>
                        <div>📧 {app.email}</div>
                        {app.phone && <div>📱 {app.phone}</div>}
                      </div>
                      {app.coverLetter && (
                        <div style={{ margin: '8px 0', fontSize: 12, color: '#5a8a6a' }}>
                          💬 Cover Letter: {app.coverLetter.substring(0, 100)}...
                        </div>
                      )}
                      <div style={{ margin: '8px 0', fontSize: 11, color: '#3a6a4a' }}>
                        Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexDirection: 'column', minWidth: 100 }}>
                      <button
                        onClick={() => handleUpdateApplicationStatus(app._id, 'approved')}
                        disabled={app.status === 'approved'}
                        style={{
                          padding: '8px 12px',
                          background: app.status === 'approved' ? 'rgba(26,106,58,0.3)' : 'rgba(26,106,58,0.2)',
                          border: '1px solid rgba(26,106,58,0.3)',
                          color: '#1a6a3a',
                          borderRadius: 4,
                          cursor: app.status === 'approved' ? 'not-allowed' : 'pointer',
                          fontSize: 11,
                          fontWeight: 600,
                          opacity: app.status === 'approved' ? 0.6 : 1,
                        }}
                      >
                        {app.status === 'approved' ? '✓ Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                        disabled={app.status === 'rejected'}
                        style={{
                          padding: '8px 12px',
                          background: app.status === 'rejected' ? 'rgba(224,90,58,0.3)' : 'rgba(224,90,58,0.2)',
                          border: '1px solid rgba(224,90,58,0.3)',
                          color: '#e05a3a',
                          borderRadius: 4,
                          cursor: app.status === 'rejected' ? 'not-allowed' : 'pointer',
                          fontSize: 11,
                          fontWeight: 600,
                          opacity: app.status === 'rejected' ? 0.6 : 1,
                        }}
                      >
                        {app.status === 'rejected' ? '✗ Rejected' : 'Reject'}
                      </button>
                      <span style={{
                        display: 'inline-block',
                        background: app.status === 'pending' ? 'rgba(201,168,76,0.2)' : app.status === 'approved' ? 'rgba(26,106,58,0.2)' : 'rgba(224,90,58,0.2)',
                        color: app.status === 'pending' ? '#c9a84c' : app.status === 'approved' ? '#1a6a3a' : '#e05a3a',
                        padding: '4px 8px',
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        textAlign: 'center',
                      }}>
                        {app.status}
                      </span>
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
