'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import ArticleDisplay from '@/components/article/ArticleDisplay';
import Newsletter from '@/components/home/Newsletter';

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
      <div style={{ background: '#f5f2eb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#1a1a1a', fontSize: 24 }}>Article not found</h1>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ── Mobile: zero padding everywhere, true full bleed ── */
        .ap-bg {
          background: #f5f2eb;
          min-height: 100vh;
          padding: 0;
          margin: 0;
        }

        .ap-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0;
          box-sizing: border-box;
        }

        .ap-grid {
          display: flex;
          flex-direction: column;
          gap: 0;
          width: 100%;
        }

        .ap-main {
          width: 100%;
          min-width: 0;
        }

        .ap-sidebar {
          width: 100%;
          padding: 20px 16px 32px;
          box-sizing: border-box;
          background: #f5f2eb;
        }

        .ap-sidebar-ad {
          background: #e8e2d4;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
          text-align: center;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #c5bfb2;
        }

        .ap-sidebar-newsletter {
          background: #0f2318;
          border-radius: 4px;
          padding: 24px;
        }

        /* ── Tablet 768px+: side by side ── */
        @media (min-width: 768px) {
          .ap-bg { padding: 28px 0; }

          .ap-container { padding: 0 16px; }

          .ap-grid {
            flex-direction: row;
            align-items: flex-start;
            gap: 20px;
          }

          .ap-main { flex: 1 1 0; }

          .ap-sidebar {
            flex: 0 0 240px;
            padding: 0;
            position: sticky;
            top: 24px;
          }

          .ap-sidebar-ad { min-height: 280px; }
        }

        /* ── Desktop 1024px+ ── */
        @media (min-width: 1024px) {
          .ap-bg { padding: 32px 0; }
          .ap-container { padding: 0 24px; }
          .ap-grid { gap: 28px; }
          .ap-sidebar { flex: 0 0 300px; }
          .ap-sidebar-ad { min-height: 300px; }
        }
      `}</style>

      <div className="ap-bg">
        <div className="ap-container">
          <div className="ap-grid">

            <main className="ap-main">
              <ArticleDisplay article={article} relatedArticles={relatedArticles || []} />
            </main>

            <aside className="ap-sidebar">
              <div className="ap-sidebar-ad">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 500, color: '#888', letterSpacing: 1, margin: 0 }}>📢 ADVERTISEMENT</p>
                  <p style={{ fontSize: 11, color: '#aaa', marginTop: 4, marginBottom: 0 }}>Google AdSense</p>
                </div>
              </div>

              <div className="ap-sidebar-newsletter">
                <h3 style={{ fontFamily: 'Georgia, serif', color: '#f0ece0', fontSize: 18, fontWeight: 400, marginBottom: 8, marginTop: 0 }}>
                  Get Latest Updates
                </h3>
                <p style={{ color: '#a0b8a8', fontSize: 13, marginBottom: 16, marginTop: 0 }}>
                  Subscribe to our newsletter for breaking news.
                </p>
                <Newsletter source="article_sidebar" />
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}