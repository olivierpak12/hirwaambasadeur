'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminPage() {
  const [adminName, setAdminName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const stories = useQuery(api.aiStories.getAllStories);
  const generateStory = useMutation(api.aiStories.generateNewStory);
  const seedInitialStory = useMutation(api.aiStories.seedInitialStory);
  const clearAndRegenerate = useMutation(api.aiStories.clearAndRegenerateMutilingual);
  const schedulingStatus = useQuery(api.aiStories.getSchedulingStatus);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    setAdminName(name || 'Hirwa Ambassadeur');
    setIsLoading(false);
  }, []);

  const handleGenerateStory = async () => {
    try {
      await generateStory();
      alert('New AI story generated successfully!');
      window.location.reload(); // Refresh to show new story
    } catch (error) {
      alert('Failed to generate story: ' + error);
    }
  };

  const handleSeedInitialStory = async () => {
    try {
      await seedInitialStory();
      alert('Initial AI story seeded successfully!');
      window.location.reload(); // Refresh to show the story
    } catch (error) {
      alert('Failed to seed initial story: ' + error);
    }
  };

  const handleClearAndRegenerate = async () => {
    if (!window.confirm('This will delete all old AI stories and generate a fresh multilingual story. Continue?')) {
      return;
    }
    try {
      await clearAndRegenerate();
      alert('All old stories cleared. Fresh multilingual story generated!');
      window.location.reload();
    } catch (error) {
      alert('Failed to clear and regenerate: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#bb1919',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          Admin Dashboard - {adminName}
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid white',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation */}
        <nav style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/admin/articles" style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#bb1919',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}>Articles</a>
            <a href="/admin/authors" style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#bb1919',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}>Authors</a>
            <a href="/admin/ads" style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#bb1919',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}>Ads</a>
            <a href="/admin/jobs" style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#bb1919',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}>Jobs</a>
          </div>
        </nav>

        {/* AI Stories Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginTop: 0, color: '#333' }}>🤖 AI Funny Stories</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={handleGenerateStory}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Generate New Story
              </button>
              <button
                onClick={handleSeedInitialStory}
                style={{
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Seed Initial Story
              </button>
              <button
                onClick={handleClearAndRegenerate}
                style={{
                  backgroundColor: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Clear & Regenerate (Fix Translation)
              </button>
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              Click "Generate New Story" to create a new AI funny story, or "Seed Initial Story" to add the first story if none exists.
            </p>

            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔄 Automatic Generation Setup</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#666' }}>
                To generate stories automatically every 24 hours, set up a cron job or scheduled task that calls:
              </p>
              <code style={{
                display: 'block',
                backgroundColor: '#e9ecef',
                padding: '8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontFamily: 'monospace',
                marginBottom: '10px',
              }}>
                curl -X POST https://your-domain.com/api/generate-ai-story \<br/>
                &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json"
              </code>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                Set the <code>AI_STORY_API_KEY</code> environment variable for authentication.
              </p>
            </div>
          </div>

          {/* Scheduling Status */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⏰ Scheduling Status</h4>
            {schedulingStatus ? (
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#856404' }}>
                  <strong>Next Generation:</strong> {schedulingStatus.nextGeneration ? new Date(schedulingStatus.nextGeneration).toLocaleString() : 'N/A'}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#856404' }}>
                  <strong>Status:</strong> {schedulingStatus.isScheduled ? 'Active' : 'Inactive'}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#856404' }}>
                  Stories are automatically generated every 24 hours using Convex scheduler.
                </p>
              </div>
            ) : (
              <p style={{ margin: '0', fontSize: '14px', color: '#856404' }}>
                No scheduling information available. Generate a story to start the automatic cycle.
              </p>
            )}
          </div>

          {/* Stories List */}
          <div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Recent Stories</h3>
            {stories && stories.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {stories.map((story) => (
                  <div key={story._id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '15px',
                    backgroundColor: story.isActive ? '#f8f9fa' : 'white',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: story.isActive ? '#28a745' : '#6c757d',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}>
                        {story.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(story.generatedAt).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', color: '#bb1919', marginBottom: '5px' }}>English</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>{story.englishText}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', color: '#bb1919', marginBottom: '5px' }}>Kinyarwanda</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>{story.kinyarwandaText}</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', color: '#bb1919', marginBottom: '5px' }}>Français</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.4', margin: 0 }}>{story.frenchText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No stories generated yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}