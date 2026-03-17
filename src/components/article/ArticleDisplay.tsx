'use client';

import Link from 'next/link';

interface ArticleDisplayProps {
  article: {
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    author?: { name: string; bio: string; photo?: string; _id?: string };
    category?: { name: string; slug: string };
    publishedAt: string;
    updatedAt?: string;
    views?: number;
  };
  relatedArticles?: any[];
}

export default function ArticleDisplay({ article, relatedArticles = [] }: ArticleDisplayProps) {
  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Article Header */}
      <article style={{ background: '#fff', borderRadius: 4, overflow: 'hidden', border: '0.5px solid #2a4a35' }}>

        {/* Featured Image */}
        {article.featuredImage && (
          <div style={{ width: '100%', height: 380, overflow: 'hidden', background: '#1a3d28' }}>
            <img
              src={article.featuredImage}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Article Content */}
        <div style={{ padding: 32 }}>

          {/* Category */}
          {article.category && (
            <Link href={`/categories/${article.category.slug}`} style={{ textDecoration: 'none' }}>
              <span style={{
                display: 'inline-block', background: '#c9a84c', color: '#0f2318',
                padding: '3px 12px', borderRadius: 2, fontSize: 11, fontWeight: 600,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, cursor: 'pointer',
              }}>
                {article.category.name}
              </span>
            </Link>
          )}

          {/* Title */}
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 400, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 20 }}>
            {article.title}
          </h1>

          {/* Meta Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24, paddingBottom: 24, borderBottom: '0.5px solid #e8e2d4', fontSize: 13, color: '#888' }}>
            <span>📅 {publishDate}</span>
            <span>👁 {(article.views || 0).toLocaleString()} views</span>
            {article.updatedAt && (
              <span>✏️ Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
            )}
          </div>

          {/* Author Info */}
          {article.author && (
            <div style={{ background: '#0f2318', borderRadius: 4, padding: 16, marginBottom: 28 }}>
              <p style={{ fontSize: 11, color: '#a0b8a8', marginBottom: 4, letterSpacing: 1, textTransform: 'uppercase' }}>By</p>
              {article.author._id ? (
                <Link href={`/author/${article.author._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#c9a84c', cursor: 'pointer', marginBottom: 6 }}>
                    {article.author.name}
                  </h3>
                </Link>
              ) : (
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#c9a84c', marginBottom: 6 }}>
                  {article.author.name}
                </h3>
              )}
              {article.author.bio && (
                <p style={{ fontSize: 13, color: '#a0b8a8', lineHeight: 1.6 }}>{article.author.bio}</p>
              )}
            </div>
          )}

          {/* Ad in article */}
          <div style={{ background: '#f5f2eb', borderRadius: 4, padding: 20, marginBottom: 28, textAlign: 'center', border: '1px dashed #c5bfb2' }}>
            <p style={{ fontSize: 11, color: '#888', letterSpacing: 1 }}>📢 ADVERTISEMENT — Google AdSense</p>
          </div>

          {/* Article Body */}
          <div
            style={{ fontSize: 16, lineHeight: 1.9, color: '#2a2a2a', marginBottom: 28 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Another Ad */}
          <div style={{ background: '#f5f2eb', borderRadius: 4, padding: 20, marginBottom: 28, textAlign: 'center', border: '1px dashed #c5bfb2' }}>
            <p style={{ fontSize: 11, color: '#888', letterSpacing: 1 }}>📢 ADVERTISEMENT — Google AdSense</p>
          </div>

          {/* Social Sharing */}
          <div style={{ borderTop: '0.5px solid #e8e2d4', borderBottom: '0.5px solid #e8e2d4', padding: '20px 0', marginBottom: 8 }}>
            <p style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#555', marginBottom: 12 }}>Share this article</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Facebook', bg: '#1877f2' },
                { label: 'X / Twitter', bg: '#000' },
                { label: 'WhatsApp', bg: '#25d366' },
                { label: 'Pinterest', bg: '#e60023' },
              ].map((s) => (
                <button key={s.label} style={{
                  background: s.bg, color: '#fff', border: 'none',
                  padding: '8px 16px', borderRadius: 3, fontSize: 12,
                  cursor: 'pointer', letterSpacing: 0.5,
                }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#c9a84c', opacity: 0.3 }} />
            <span style={{ fontSize: 11, letterSpacing: 3, color: '#c9a84c', textTransform: 'uppercase' }}>Related Articles</span>
            <div style={{ flex: 1, height: 1, background: '#c9a84c', opacity: 0.3 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#2a4a35', borderRadius: 4, overflow: 'hidden' }}>
            {relatedArticles.map((related) => (
              <Link key={related._id} href={`/article/${related.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{ background: '#f5f2eb', cursor: 'pointer', overflow: 'hidden', height: '100%', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#eee8d8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f2eb')}
                >
                  {related.featuredImage && (
                    <div style={{ height: 130, overflow: 'hidden', background: '#1a3d28' }}>
                      <img src={related.featuredImage} alt={related.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <p style={{ fontSize: 10, color: '#c9a84c', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
                      {related.category?.name}
                    </p>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 14, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 8 }}>
                      {related.title}
                    </h3>
                    <p style={{ fontSize: 11, color: '#888' }}>
                      {new Date(related.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}