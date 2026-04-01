'use client';

import { useEffect, useState } from 'react';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AIEconomicAnalysisAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState('');

  const economicApi = ((api as unknown) as Record<string, any>).aiEconomicAnalyses;
  const analyses = useQuery(economicApi?.getLatestAnalyses) ?? [];
  const createAnalysis = useMutation(economicApi?.createAnalysis);
  const generateSample = useAction(economicApi?.generateSampleAnalysis);
  const [statusMessage, setStatusMessage] = useState('');

  const [tTitle, setTTitle] = useState('');
  const [tSummary, setTSummary] = useState('');
  const [tContent, setTContent] = useState('');
  const [tImageUrl, setTImageUrl] = useState('');
  const [tSource, setTSource] = useState('');
  const [tTags, setTTags] = useState('');
  const [tAuthorId, setTAuthorId] = useState('');
  const [tRegion, setTRegion] = useState('');
  const [tCategory, setTCategory] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const name = localStorage.getItem('adminName');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setIsAuthenticated(true);
    setAdminName(name || 'Hirwa Ambassadeur');
  }, []);

  const handleGenerateSample = async () => {
    try {
      const result = await generateSample({ topic: 'global economy' });
      setStatusMessage(`✅ Sample analysis generated (ID: ${result ?? 'unknown'})`);
      console.log('generateSample result', result);
    } catch (error) {
      console.error('generateSample error', error);
      setStatusMessage('❌ Failed to generate sample analysis: ' + String(error));
    }
  };

  const handlePublishNew = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createAnalysis({
        title: tTitle,
        summary: tSummary,
        content: tContent,
        imageUrl: tImageUrl || undefined,
        source: tSource || undefined,
        authorId: tAuthorId || undefined,
        tags: tTags.split(',').map((tag) => tag.trim()).filter(Boolean),
        metadata: {
          region: tRegion || undefined,
          category: tCategory || undefined,
        },
        published: true,
      });
      setStatusMessage('✅ New analysis published');
      setTTitle('');
      setTSummary('');
      setTContent('');
      setTImageUrl('');
      setTSource('');
      setTTags('');
      setTAuthorId('');
      setTRegion('');
      setTCategory('');
    } catch (error) {
      setStatusMessage('❌ Publish failed: ' + String(error));
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: '#bb1919', color: 'white' }}>
        <h1>Admin - AI Economic Analysis</h1>
        <p>Welcome, {adminName}</p>
      </header>

      <div style={{ maxWidth: 1100, margin: '20px auto', padding: '0 14px' }}>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => (window.location.href = '/admin')} style={{ marginRight: 8 }}>
            Back to Admin
          </button>
          <button onClick={handleGenerateSample} style={{ backgroundColor: '#2d8f31', color: 'white', padding: '8px 14px', border: 'none', borderRadius: 4 }}>
            Generate AI Draft
          </button>
        </div>

        <section style={{ backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <h2>Publish new analysis</h2>
          <form onSubmit={handlePublishNew} style={{ display: 'grid', gap: 10 }}>
            <input value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="Title" />
            <input value={tSummary} onChange={(e) => setTSummary(e.target.value)} placeholder="Summary" />
            <textarea value={tContent} onChange={(e) => setTContent(e.target.value)} placeholder="Content" rows={6} />
            <input value={tImageUrl} onChange={(e) => setTImageUrl(e.target.value)} placeholder="Image URL" />
            <input value={tSource} onChange={(e) => setTSource(e.target.value)} placeholder="Source" />
            <input value={tAuthorId} onChange={(e) => setTAuthorId(e.target.value)} placeholder="Author ID (optional)" />
            <input value={tRegion} onChange={(e) => setTRegion(e.target.value)} placeholder="Region (e.g., Global, Africa, USA)" />
            <input value={tCategory} onChange={(e) => setTCategory(e.target.value)} placeholder="Category (e.g., Inflation, Growth, Trade)" />
            <input value={tTags} onChange={(e) => setTTags(e.target.value)} placeholder="Tags (comma separated)" />
            <button type="submit" style={{ backgroundColor: '#3770dd', color: 'white', padding: '10px', border: 'none', borderRadius: 4 }}>
              Publish
            </button>
          </form>
          {statusMessage && <div style={{ marginTop: 10 }}>{statusMessage}</div>}
        </section>

        <section>
          <h2>Published Analyses</h2>
          {analyses.length === 0 ? (
            <div>No published analyses yet.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analyses.map((item: any) => (
                <li key={item._id} style={{ backgroundColor: 'white', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <strong>{item.title}</strong>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: '5px 0' }}>{item.summary}</p>
                  <small>
                    {item.source || 'AI'} • {item.tags?.join(', ')}
                    {item.metadata?.region && ` • ${item.metadata.region}`}
                    {item.metadata?.category && ` • ${item.metadata.category}`}
                    {item.metadata?.confidence && ` • ${Math.round((item.metadata.confidence as number) * 100)}% confidence`}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
