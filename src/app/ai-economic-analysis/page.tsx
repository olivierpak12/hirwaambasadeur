'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type EconomicAnalysis = {
  _id: string;
  title: string;
  summary: string;
  content: string;
  header?: string;
  sections?: Array<{ title: string; content: string }>;
  conclusion?: string;
  images?: Array<{ url: string; caption?: string; alt?: string }>;
  imageUrl?: string;
  source?: string;
  createdAt: string;
  tags?: string[];
  metadata?: {
    region?: string;
    category?: string;
    confidence?: number;
    model?: string;
  };
};

const ImagePlaceholder = ({ width = '100%', height = '200px' }: { width?: string; height?: string }) => (
  <div style={{
    width,
    height,
    background: 'linear-gradient(45deg, #e8e8e8 25%, transparent 25%, transparent 75%, #e8e8e8 75%, #e8e8e8), linear-gradient(45deg, #e8e8e8 25%, transparent 25%, transparent 75%, #e8e8e8 75%, #e8e8e8)',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0, 15px 15px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    color: '#999',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
  }}>
    📸 Image loading...
  </div>
);

function getLocalFallbackImage(topic: string = 'Economic Analysis'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="45%" font-size="42" text-anchor="middle" fill="#666" font-family="Arial, sans-serif">${topic}</text><text x="50%" y="55%" font-size="22" text-anchor="middle" fill="#999" font-family="Arial, sans-serif">Fallback image</text></svg>`;
  return `data:image/svg+xml;base64,${typeof window !== 'undefined' ? window.btoa(svg) : Buffer.from(svg).toString('base64')}`;
}

export default function AIEconomicAnalysisPage() {
  const economicApi = (api as any).aiEconomicAnalyses as {
    getLatestAnalyses: any;
  };
  
  // Query with explicit loading state handling
  const allAnalysesData = useQuery(economicApi.getLatestAnalyses);
  const isLoading = allAnalysesData === undefined;
  const allAnalyses = (allAnalysesData as EconomicAnalysis[] | undefined) ?? [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(imageUrl);
      return next;
    });
  };

  const handleImageLoad = (imageUrl: string) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(imageUrl);
      return next;
    });
  };

  const handleImageStart = (imageUrl: string) => {
    setLoadingImages(prev => new Set(prev).add(imageUrl));
  };

  const filteredAnalyses = useMemo(() => {
    if (!searchTerm.trim()) return allAnalyses;
    const q = searchTerm.trim().toLowerCase();
    return allAnalyses.filter((item) => {
      const haystack = `${item.title ?? ''} ${item.summary ?? ''} ${item.content ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allAnalyses, searchTerm]);

  const selectedItem = selectedAnalysis 
    ? filteredAnalyses.find(a => a._id === selectedAnalysis)
    : null;

  if (selectedItem) {
    return (
      <main style={{ background: '#f5f2eb', minHeight: '100vh', padding: '20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => setSelectedAnalysis(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8a6a2a',
              fontSize: 14,
              cursor: 'pointer',
              marginBottom: 24,
              fontWeight: 600
            }}
          >
            ← Back to analyses
          </button>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: 16,
            lineHeight: 1.2
          }}>
            {selectedItem.title}
          </h1>

          {/* Metadata */}
          <div style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 24,
            fontSize: 13,
            color: '#666'
          }}>
            {selectedItem.metadata?.region && <span>📍 {selectedItem.metadata.region}</span>}
            {selectedItem.metadata?.category && <span>📊 {selectedItem.metadata.category}</span>}
            {selectedItem.metadata?.confidence && <span>🎯 {Math.round((selectedItem.metadata.confidence as number) * 100)}% confidence</span>}
            <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
            {selectedItem.source && <span>Source: {selectedItem.source}</span>}
          </div>

          {/* Summary */}
          <div style={{
            background: '#fff',
            padding: 20,
            borderLeft: '4px solid #8a6a2a',
            marginBottom: 24,
            fontFamily: 'Georgia, serif',
            fontSize: 16,
            lineHeight: 1.6,
            color: '#333'
          }}>
            {selectedItem.summary}
          </div>

          {/* Featured Image */}
          {selectedItem.imageUrl && !failedImages.has(selectedItem.imageUrl) ? (
            <div style={{
              width: '100%',
              marginBottom: 24,
              borderRadius: 4,
              overflow: 'hidden',
              background: '#e8e8e8',
              aspectRatio: '16 / 9',
              position: 'relative'
            }}>
              {loadingImages.has(selectedItem.imageUrl) && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                  <ImagePlaceholder width="100%" height="100%" />
                </div>
              )}
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={selectedItem.imageUrl || getLocalFallbackImage(selectedItem.title)}
                  alt={selectedItem.title}
                  fill
                  sizes="(max-width: 800px) 100vw, 800px"
                  style={{
                    objectFit: 'cover',
                    opacity: loadingImages.has(selectedItem.imageUrl) ? 0.3 : 1,
                    transition: 'opacity 0.35s ease'
                  }}
                  onError={() => handleImageError(selectedItem.imageUrl || '')}
                  onLoad={() => handleImageLoad(selectedItem.imageUrl || '')}
                  onLoadingComplete={() => handleImageLoad(selectedItem.imageUrl || '')}
                />
              </div>

              {selectedItem.imageUrl.includes('source.unsplash.com/featured') && (
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  Fallback image
                </div>
              )}
            </div>
          ) : selectedItem.imageUrl ? (
            <div style={{ marginBottom: 24, borderRadius: 4, overflow: 'hidden', background: '#e8e8e8' }}>
              <img
                src={getLocalFallbackImage(selectedItem.title)}
                alt="Fallback economic analysis image"
                style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : null}

          {/* Header */}
          {selectedItem.header && (
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 16,
              lineHeight: 1.7,
              color: '#333',
              marginBottom: 24,
              background: '#fff',
              padding: 20,
              borderRadius: 4
            }}>
              {selectedItem.header}
            </div>
          )}

          {/* Image Gallery */}
          {selectedItem.images && selectedItem.images.length > 0 && (
            <div style={{
              marginBottom: 24,
              background: '#f8f5f0',
              padding: 24,
              borderRadius: 4
            }}>
              <h2 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                color: '#1a1a1a'
              }}>
                📸 Photo Gallery ({selectedItem.images.length} images)
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12
              }}>
                {selectedItem.images.map((img: any, idx: number) => (
                  failedImages.has(img.url) ? (
                    <div key={idx} style={{
                      background: '#fff',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e0d5c7'
                    }}>
                      <div style={{
                        width: '100%',
                        paddingBottom: '66.67%',
                        position: 'relative',
                        background: '#e8e8e8'
                      }}>
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #f5f5f5 100%)',
                          color: '#999',
                          fontSize: '12px'
                        }}>
                          Image unavailable
                        </div>
                      </div>
                      {img.caption && (
                        <div style={{
                          padding: 10,
                          fontSize: 12,
                          color: '#666',
                          lineHeight: 1.4,
                          fontFamily: 'Georgia, serif'
                        }}>
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div key={idx} style={{
                      background: '#fff',
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid #e0d5c7'
                    }}>
                      <div style={{
                        width: '100%',
                        paddingBottom: '66.67%',
                        position: 'relative',
                        background: '#e8e8e8',
                        overflow: 'hidden'
                      }}>
                        <Image
                          src={img.url || getLocalFallbackImage(selectedItem.title)}
                          alt={img.alt || img.caption || `Image ${idx + 1}`}
                          fill
                          sizes="(max-width: 600px) 100vw, 200px"
                          style={{
                            objectFit: 'cover',
                            backgroundColor: '#f0f0f0'
                          }}
                          onError={() => handleImageError(img.url)}
                        />
                      </div>
                      {img.caption && (
                        <div style={{
                          padding: 10,
                          fontSize: 12,
                          color: '#666',
                          lineHeight: 1.4,
                          fontFamily: 'Georgia, serif'
                        }}>
                          {img.caption}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Sections */}
          {selectedItem.sections && selectedItem.sections.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              {selectedItem.sections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: 24 }}>
                  <h3 style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#1a1a1a',
                    marginBottom: 12
                  }}>
                    {idx + 1}. {section.title}
                  </h3>
                  <div style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    background: '#fff',
                    padding: 16,
                    borderLeft: '3px solid #c9a84c',
                    borderRadius: 2
                  }}>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Conclusion */}
          {selectedItem.conclusion && (
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: 16,
              lineHeight: 1.8,
              color: '#333',
              background: '#f8f5f0',
              padding: 20,
              borderRadius: 4,
              marginBottom: 24,
              borderLeft: '4px solid #8a6a2a'
            }}>
              <h3 style={{
                fontFamily: 'Georgia, serif',
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 12,
                color: '#1a1a1a'
              }}>
                Conclusion
              </h3>
              {selectedItem.conclusion}
            </div>
          )}

          {/* Tags */}
          {selectedItem.tags && selectedItem.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 24
            }}>
              {Array.from(new Set(selectedItem.tags)).map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: '#e8dcc4',
                    color: '#6b5a3d',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">AI Economic Analysis</h1>
      <p className="mb-6 text-gray-700">
        Search and explore AI-generated economic analyses with comprehensive research and professional photos.
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading economic analyses...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <div className="flex gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search economic analyses (keyword, country, market)..."
                className="flex-1 border border-gray-300 p-2 rounded"
              />
              <button
                type="button"
                className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                onClick={() => setSearchTerm(searchTerm.trim())}
              >
                Search
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Latest Published Analysis</h2>
            {filteredAnalyses.length === 0 ? (
              <div className="text-gray-600">
                {allAnalyses.length === 0 ? 'No economic analyses available yet. Generate one from the admin panel.' : 'No matching analyses found.'}
              </div>
            ) : (
              <div className="space-y-4">
              {filteredAnalyses.map((analysis: EconomicAnalysis) => (
                <article
                  key={analysis._id}
                  className="border rounded-lg overflow-hidden shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedAnalysis(analysis._id)}
                >
                  {analysis.imageUrl || analysis.images?.[0]?.url ? (
                    <div className="h-44 overflow-hidden bg-gray-100 relative">
                      <Image
                        src={getLocalFallbackImage(analysis.title)}
                        alt={analysis.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover hover:scale-105 transition-transform"
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">{analysis.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{analysis.source || 'AI Economic Engine'}</p>
                    <p className="text-gray-700 mb-2 line-clamp-2">{analysis.summary}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      {analysis.metadata?.region && <span>📍 {analysis.metadata.region} • </span>}
                      {analysis.metadata?.category && <span>📊 {analysis.metadata.category} • </span>}
                      {analysis.metadata?.confidence && <span>🎯 {Math.round((analysis.metadata.confidence as number) * 100)}% confidence</span>}
                    </div>
                    <p className="text-xs text-gray-500">{new Date(analysis.createdAt).toLocaleString()}</p>
                    {analysis.images && analysis.images.length > 0 && (
                      <p className="text-xs text-blue-600 mt-2 font-semibold">📸 {analysis.images.length} photos included</p>
                    )}
                    {Array.isArray(analysis.tags) && analysis.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {analysis.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      )}
    </main>
  );
}
