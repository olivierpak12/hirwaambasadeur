'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ArticleDisplay from '@/components/article/ArticleDisplay';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const article = useQuery(api.articles.getArticleBySlug, { slug });
  const relatedArticles = useQuery(api.articles.getRelatedArticles, {
    articleId: article?._id || '',
    categoryId: article?.categoryId || '',
    limit: 3
  });

  if (!article) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '32px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <h1 style={{ color: '#1a1a1a', fontSize: 24 }}>Article not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: '32px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>

          {/* Main article */}
          <div>
            <ArticleDisplay article={article} relatedArticles={relatedArticles || []} />
          </div>

          {/* Sidebar */}
          <aside>
            {/* Ad space */}
            <div style={{
              background: '#e8e2d4', borderRadius: 4, padding: 16, marginBottom: 20,
              textAlign: 'center', height: 300, display: 'flex', alignItems: 'center',
              justifyContent: 'center', border: '1px dashed #c5bfb2', position: 'sticky', top: 24,
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: 1 }}>📢 ADVERTISEMENT</p>
                <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Google AdSense</p>
              </div>
            </div>

            {/* Newsletter */}
            <div style={{
              background: '#0f2318', borderRadius: 4, padding: 24,
              position: 'sticky', top: 340,
            }}>
              <h3 style={{ fontFamily: 'Georgia, serif', color: '#f0ece0', fontSize: 18, fontWeight: 400, marginBottom: 8 }}>
                Get Latest Updates
              </h3>
              <p style={{ color: '#a0b8a8', fontSize: 13, marginBottom: 16 }}>
                Subscribe to our newsletter for breaking news.
              </p>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  width: '100%', padding: '10px 14px', background: '#1a3d28',
                  border: '0.5px solid #2a4a35', borderRadius: 3, color: '#f0ece0',
                  fontSize: 13, outline: 'none', marginBottom: 10,
                }}
              />
              <button style={{
                width: '100%', background: '#c9a84c', color: '#0f2318',
                border: 'none', padding: '10px', borderRadius: 3,
                fontSize: 12, fontWeight: 600, letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer',
              }}>
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}