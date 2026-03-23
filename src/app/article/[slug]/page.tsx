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
    limit: 3,
  });
  
  // Fallback to latest articles if no related articles found
  const latestArticles = useQuery(api.articles.getLatestArticles, {
    excludeId: article?._id || '',
    limit: 3,
  });

  if (article === undefined) {
    return (
      <>
        <style>{`
          @keyframes ap-shimmer {
            0%   { background-position: -600px 0 }
            100% { background-position:  600px 0 }
          }
          .ap-skel {
            background: linear-gradient(90deg, #e8e2d4 25%, #f0ece3 50%, #e8e2d4 75%);
            background-size: 600px 100%;
            animation: ap-shimmer 1.4s infinite linear;
            border-radius: 3px;
          }
        `}</style>
        <div style={{ background: '#f5f2eb', minHeight: '100vh', padding: 'clamp(20px,4vw,40px) clamp(16px,5vw,40px)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div className="ap-skel" style={{ height: 14, width: 120, marginBottom: 28 }} />
            <div className="ap-skel" style={{ height: 36, width: '90%', marginBottom: 10 }} />
            <div className="ap-skel" style={{ height: 36, width: '70%', marginBottom: 24 }} />
            <div className="ap-skel" style={{ height: 14, width: 200, marginBottom: 32 }} />
            <div className="ap-skel" style={{ height: 340, width: '100%', marginBottom: 32, borderRadius: 4 }} />
            {[100, 95, 88, 100, 60].map((w, i) => (
              <div key={i} className="ap-skel" style={{ height: 13, width: `${w}%`, marginBottom: 10 }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (article === null) {
    return (
      <div style={{ background: '#f5f2eb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8e2d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9a9080" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h1 style={{ color: '#2a2218', fontSize: 22, fontWeight: 700, fontFamily: 'Georgia, serif', margin: 0 }}>Article not found</h1>
        <p style={{ color: '#7a7060', fontSize: 14, margin: 0, textAlign: 'center', maxWidth: 300 }}>
          This article may have been moved or removed. Check the URL and try again.
        </p>
        <a href="/" style={{ marginTop: 8, fontSize: 13, color: '#8a6a2a', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.05em' }}>← Back to home</a>
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* ─────────────────────────────────────────────
           PAGE SHELL — true full-screen, no gutters
        ───────────────────────────────────────────── */
        .ap-page {
          background: #f0ede4;
          min-height: 100vh;
          width: 100%;
        }

        /* ─────────────────────────────────────────────
           PROGRESS BAR
        ───────────────────────────────────────────── */
        .ap-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #b8942a, #d4aa48);
          z-index: 100;
          transition: width 0.1s linear;
          pointer-events: none;
        }

        /* ─────────────────────────────────────────────
           CATEGORY BANNER — edge to edge
        ───────────────────────────────────────────── */
        .ap-category-bar {
          background: #1a160e;
          border-bottom: 1px solid #2e2510;
          padding: 0 clamp(14px, 3vw, 32px);
          width: 100%;
        }
        .ap-category-bar-inner {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .ap-category-bar-inner::-webkit-scrollbar { display: none; }
        .ap-cat-chip {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c9a84c;
          white-space: nowrap;
          text-decoration: none;
          padding: 3px 0;
          border-bottom: 2px solid #c9a84c;
        }
        .ap-breadcrumb {
          font-size: 11px;
          color: #5a5040;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          overflow: hidden;
        }
        .ap-breadcrumb a { color: #7a6a50; text-decoration: none; }
        .ap-breadcrumb a:hover { color: #c9a84c; }
        .ap-breadcrumb-sep { color: #3a3028; }

        /* ─────────────────────────────────────────────
           WRAPPER — full width, zero outer padding
        ───────────────────────────────────────────── */
        .ap-wrap {
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .ap-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          width: 100%;
        }

        /* ─────────────────────────────────────────────
           ARTICLE CARD — no border/radius, bleeds fully
        ───────────────────────────────────────────── */
        .ap-article-card {
          background: #fff;
          border: none;
          border-radius: 0;
          overflow: hidden;
          width: 100%;
        }

        /* ─────────────────────────────────────────────
           ARTICLE HEADER
        ───────────────────────────────────────────── */
        .ap-header {
          padding: clamp(20px, 4vw, 56px) clamp(16px, 5vw, 72px) 0;
          border-bottom: 1px solid #f0ebe0;
        }
        .ap-meta-top {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
        }
        .ap-cat-pill {
          display: inline-block;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: #1a160e;
          color: #c9a84c;
          padding: 4px 10px;
          border-radius: 2px;
          text-decoration: none;
          white-space: nowrap;
        }
        .ap-headline {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(22px, 4.5vw, 40px);
          font-weight: 700;
          line-height: 1.22;
          color: #1a1008;
          letter-spacing: -0.3px;
          margin: 0 0 16px;
        }
        .ap-standfirst {
          font-size: clamp(14px, 2vw, 17px);
          line-height: 1.65;
          color: #4a4030;
          font-family: Georgia, serif;
          font-style: italic;
          border-left: 3px solid #c9a84c;
          padding-left: 16px;
          margin: 0 0 22px;
        }
        .ap-byline {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding: 14px 0;
          border-top: 1px solid #f0ebe0;
        }
        .ap-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #e8e2d4;
          border: 2px solid #d4c9b4;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #8a7a60;
          flex-shrink: 0;
          overflow: hidden;
        }
        .ap-byline-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .ap-author-name { font-size: 13px; font-weight: 700; color: #2a2010; }
        .ap-pub-date    { font-size: 11px; color: #8a7a60; letter-spacing: 0.02em; }
        .ap-share-strip {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .ap-share-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid #e0d8c8;
          background: #faf8f2;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          text-decoration: none;
          color: #6a5a40;
        }
        .ap-share-btn:hover { background: #f0e8d4; border-color: #c9a84c; color: #8a6820; }

        /* ─────────────────────────────────────────────
           FEATURED IMAGE — true full bleed
        ───────────────────────────────────────────── */
        .ap-hero {
          width: 100%;
          position: relative;
          background: #e8e2d4;
          overflow: hidden;
          /* nice cinematic ratio on all screen sizes */
          aspect-ratio: 16 / 7;
        }
        .ap-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ap-hero-caption {
          font-size: 11px;
          color: #8a7a60;
          text-align: center;
          padding: 8px clamp(16px, 5vw, 72px);
          border-bottom: 1px solid #f0ebe0;
          font-style: italic;
          background: #faf9f5;
        }

        /* ─────────────────────────────────────────────
           ARTICLE BODY — full width, prose centred inside
        ───────────────────────────────────────────── */
        .ap-body {
          padding: clamp(24px, 4vw, 56px) clamp(16px, 5vw, 72px);
        }
        .ap-body-content {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 1.9;
          color: #2a2010;
          /* comfortable reading width — but no hard cap so it
             respects whatever space it's given in the grid */
          max-width: 780px;
        }
        .ap-body-content p    { margin: 0 0 1.4em; }
        .ap-body-content h2   { font-size: clamp(18px, 2.5vw, 24px); font-weight: 700; color: #1a1008; margin: 2em 0 0.6em; line-height: 1.3; }
        .ap-body-content h3   { font-size: clamp(15px, 2vw, 19px); font-weight: 700; color: #1a1008; margin: 1.6em 0 0.5em; }
        .ap-body-content blockquote {
          margin: 1.8em 0;
          padding: 16px 20px;
          border-left: 3px solid #c9a84c;
          background: #faf8f2;
          font-style: italic;
          color: #4a3e28;
          font-size: clamp(15px, 2vw, 17px);
        }
        .ap-body-content ul, .ap-body-content ol { padding-left: 1.5em; margin: 0 0 1.4em; }
        .ap-body-content li   { margin-bottom: 0.4em; }
        .ap-body-content a    { color: #8a6820; text-decoration: underline; text-underline-offset: 3px; }
        .ap-body-content strong { font-weight: 700; color: #1a1008; }
        .ap-body-content hr   { border: none; border-top: 1px solid #e8e0d0; margin: 2em 0; }
        .ap-body-content img  { max-width: 100%; height: auto; border-radius: 2px; margin: 1.2em 0; }

        /* ─────────────────────────────────────────────
           TAGS
        ───────────────────────────────────────────── */
        .ap-tags {
          padding: 20px clamp(16px, 5vw, 72px) clamp(20px, 4vw, 36px);
          border-top: 1px solid #f0ebe0;
        }
        .ap-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6a5a40;
          border: 1px solid #d8d0c0;
          border-radius: 2px;
          padding: 4px 9px;
          margin: 0 5px 5px 0;
          text-decoration: none;
          background: #faf8f2;
          transition: background 0.12s, border-color 0.12s, color 0.12s;
        }
        .ap-tag:hover { background: #f0e8d4; border-color: #c9a84c; color: #8a6820; }

        /* ─────────────────────────────────────────────
           RELATED ARTICLES
        ───────────────────────────────────────────── */
        .ap-related {
          border-top: 2px solid #1a160e;
          padding: clamp(20px, 3vw, 40px) clamp(16px, 5vw, 72px) clamp(24px, 4vw, 48px);
          background: #faf8f2;
        }
        .ap-related-title {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ap-related-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8e0d0;
        }
        .ap-related-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .ap-related-card {
          display: flex;
          gap: 12px;
          text-decoration: none;
          padding: 12px;
          border: 1px solid #e8e0d0;
          border-radius: 2px;
          background: #faf9f5;
          transition: background 0.12s, border-color 0.12s;
        }
        .ap-related-card:hover { background: #f0e8d4; border-color: #d4c4a0; }
        .ap-related-thumb {
          width: 72px; height: 60px;
          flex-shrink: 0;
          border-radius: 2px;
          background: #e8e2d4;
          overflow: hidden;
        }
        .ap-related-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ap-related-meta { display: flex; flex-direction: column; justify-content: center; gap: 4px; min-width: 0; }
        .ap-related-cat  { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #c9a84c; }
        .ap-related-hed  { font-family: Georgia, serif; font-size: 13px; font-weight: 700; color: #2a2010; line-height: 1.35;
                           overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .ap-related-date { font-size: 10px; color: #9a8a6a; }

        /* ─────────────────────────────────────────────
           SIDEBAR
        ───────────────────────────────────────────── */
        .ap-sidebar {
          display: none;
          background: #f0ede4;
          border-left: 1px solid #e8e0d0;
        }
        .ap-sidebar-inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 0;
          padding: 20px 16px;
          max-height: 100vh;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .ap-sidebar-widget {
          background: #fff;
          border: 1px solid #e4ddd0;
          border-radius: 2px;
          overflow: hidden;
        }
        .ap-widget-head {
          padding: 10px 14px;
          border-bottom: 1px solid #f0ebe0;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a7a60;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ap-widget-head::before {
          content: '';
          width: 3px; height: 12px;
          background: #c9a84c;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .ap-ad-slot {
          background: #f0ede4;
          min-height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 20px;
          border: 1px dashed #d4c9b4;
          margin: 0;
        }
        .ap-ad-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #b0a080; }
        .ap-trending-item {
          display: flex;
          gap: 10px;
          padding: 10px 14px;
          border-bottom: 1px solid #f5f1ea;
          text-decoration: none;
          transition: background 0.12s;
        }
        .ap-trending-item:last-child { border-bottom: none; }
        .ap-trending-item:hover { background: #faf6ee; }
        .ap-trending-num { font-size: 18px; font-weight: 900; color: #e8e0d0; line-height: 1; flex-shrink: 0; width: 24px; }
        .ap-trending-hed { font-family: Georgia, serif; font-size: 12px; font-weight: 700; color: #2a2010; line-height: 1.4;
                           overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }

        /* ─────────────────────────────────────────────
           TABLET 768px — sidebar appears, flush height
        ───────────────────────────────────────────── */
        @media (min-width: 768px) {
          .ap-grid {
            display: grid;
            grid-template-columns: 1fr 220px;
            gap: 0;
            align-items: start;
            min-height: 100vh;
          }
          .ap-sidebar { display: block; }
          .ap-related-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ─────────────────────────────────────────────
           LAPTOP 1024px — wider sidebar, more breathing room
        ───────────────────────────────────────────── */
        @media (min-width: 1024px) {
          .ap-grid {
            grid-template-columns: 1fr 300px;
          }
          .ap-related-grid { grid-template-columns: repeat(3, 1fr); }
          .ap-ad-slot { min-height: 300px; }
        }

        /* ─────────────────────────────────────────────
           WIDE 1440px — even wider sidebar
        ───────────────────────────────────────────── */
        @media (min-width: 1440px) {
          .ap-grid {
            grid-template-columns: 1fr 340px;
          }
        }

        /* ─────────────────────────────────────────────
           PRINT
        ───────────────────────────────────────────── */
        @media print {
          .ap-category-bar, .ap-sidebar, .ap-related, .ap-share-strip, .ap-progress { display: none !important; }
          .ap-article-card { border: none; }
          .ap-body-content { font-size: 12pt; line-height: 1.6; }
        }
      `}</style>

      {/* Reading-progress bar (JS-driven) */}
      <div id="ap-prog" className="ap-progress" style={{ width: '0%' }} />

      {/* Category bar */}
      <div className="ap-category-bar">
        <div className="ap-category-bar-inner">
          <nav className="ap-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="ap-breadcrumb-sep">›</span>
            {article.categoryName && (
              <>
                <a href={`/category/${article.categorySlug || ''}`}>{article.categoryName}</a>
                <span className="ap-breadcrumb-sep">›</span>
              </>
            )}
            <span style={{ color: '#7a6a50', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'clamp(120px, 30vw, 260px)' }}>
              {article.title}
            </span>
          </nav>

          {article.categoryName && (
            <a href={`/category/${article.categorySlug || ''}`} className="ap-cat-chip" style={{ marginLeft: 'auto' }}>
              {article.categoryName}
            </a>
          )}
        </div>
      </div>

      <div className="ap-page">
        <div className="ap-wrap">
          <div className="ap-grid">

            {/* ── MAIN ARTICLE ── */}
            <main style={{ margin: 0, padding: 0, minWidth: 0 }}>
              <article className="ap-article-card">

                {/* Header */}
                <header className="ap-header">
                  <div className="ap-meta-top">
                    {article.categoryName && (
                      <a href={`/category/${article.categorySlug || ''}`} className="ap-cat-pill">
                        {article.categoryName}
                      </a>
                    )}
                    {article.tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} style={{ fontSize: 10, color: '#9a8a6a', fontWeight: 600 }}>#{tag}</span>
                    ))}
                  </div>

                  <h1 className="ap-headline">{article.title}</h1>

                  {article.excerpt && (
                    <p className="ap-standfirst">{article.excerpt}</p>
                  )}

                  <div className="ap-byline">
                    <div className="ap-avatar">
                      {article.authorImageUrl
                        ? <img src={article.authorImageUrl} alt={article.authorName || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (article.authorName?.[0] || 'A')}
                    </div>
                    <div className="ap-byline-text">
                      <span className="ap-author-name">{article.authorName || 'Staff Reporter'}</span>
                      <span className="ap-pub-date">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                          : new Date(article._creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                        }
                        {article.readTime && <> · {article.readTime} min read</>}
                      </span>
                    </div>

                    {/* Share buttons */}
                    <div className="ap-share-strip" aria-label="Share article">
                      {[
                        {
                          label: 'Share on Twitter',
                          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
                          icon: (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          ),
                        },
                        {
                          label: 'Share on Facebook',
                          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
                          icon: (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                          ),
                        },
                        {
                          label: 'Copy link',
                          href: '#copy',
                          icon: (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                          ),
                        },
                      ].map(btn => (
                        <a
                          key={btn.label}
                          href={btn.href}
                          className="ap-share-btn"
                          aria-label={btn.label}
                          target={btn.href.startsWith('http') ? '_blank' : undefined}
                          rel={btn.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          onClick={btn.href === '#copy' ? (e) => {
                            e.preventDefault();
                            navigator.clipboard?.writeText(window.location.href);
                          } : undefined}
                        >
                          {btn.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                </header>

                {/* Hero image */}
                {(article.featuredImageUrl || article.featuredImage || article.featured) && (
                  <>
                    <div className="ap-hero">
                      <img src={article.featuredImageUrl || article.featuredImage || article.featured} alt={article.title} loading="lazy" />
                    </div>
                    {article.featuredImageCaption && (
                      <p className="ap-hero-caption">{article.featuredImageCaption}</p>
                    )}
                  </>
                )}

                {/* Body — renders ArticleDisplay's content OR raw markdown */}
                <div className="ap-body">
                  <div className="ap-body-content" id="ap-article-body">
                    <ArticleDisplay 
                      article={article} 
                      relatedArticles={(relatedArticles && relatedArticles.length > 0) ? relatedArticles : (latestArticles || [])} 
                    />
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="ap-tags">
                    {article.tags.map((tag: string) => (
                      <a key={tag} href={`/tag/${tag}`} className="ap-tag">#{tag}</a>
                    ))}
                  </div>
                )}

                {/* Related articles */}
                {relatedArticles && relatedArticles.length > 0 && (
                  <section className="ap-related" aria-label="Related articles">
                    <h2 className="ap-related-title">More from {article.categoryName || 'this section'}</h2>
                    <div className="ap-related-grid">
                      {relatedArticles.map((rel: any) => (
                        <a key={rel._id} href={`/article/${rel.slug}`} className="ap-related-card">
                          <div className="ap-related-thumb">
                            {(rel.featuredImageUrl || rel.featuredImage || rel.featured) && (
                              <img src={rel.featuredImageUrl || rel.featuredImage || rel.featured} alt={rel.title} loading="lazy" />
                            )}
                          </div>
                          <div className="ap-related-meta">
                            <span className="ap-related-cat">{rel.categoryName}</span>
                            <span className="ap-related-hed">{rel.title}</span>
                            <span className="ap-related-date">
                              {rel.publishedAt
                                ? new Date(rel.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : new Date(rel._creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}

              </article>
            </main>

            {/* ── SIDEBAR (tablet+) ── */}
            <aside className="ap-sidebar" aria-label="Sidebar" style={{ margin: 0, padding: 0 }}>
              <div className="ap-sidebar-inner">

                {/* Ad slot */}
                <div className="ap-sidebar-widget">
                  <div className="ap-widget-head">Advertisement</div>
                  <div className="ap-ad-slot">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9b080" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
                    <span className="ap-ad-label">Google AdSense</span>
                    <span style={{ fontSize: 9, color: '#c0b090', letterSpacing: '0.06em' }}>300 × 250</span>
                  </div>
                </div>

                {/* Trending widget (placeholder — swap with real data) */}
                {relatedArticles && relatedArticles.length > 0 && (
                  <div className="ap-sidebar-widget">
                    <div className="ap-widget-head">Trending</div>
                    {relatedArticles.slice(0, 3).map((rel: any, i: number) => (
                      <a key={rel._id} href={`/article/${rel.slug}`} className="ap-trending-item">
                        <span className="ap-trending-num">{i + 1}</span>
                        <span className="ap-trending-hed">{rel.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Second ad slot */}
                <div className="ap-sidebar-widget">
                  <div className="ap-widget-head">Advertisement</div>
                  <div className="ap-ad-slot" style={{ minHeight: 200 }}>
                    <span className="ap-ad-label">Google AdSense</span>
                    <span style={{ fontSize: 9, color: '#c0b090', letterSpacing: '0.06em' }}>300 × 200</span>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* Reading progress bar script */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var bar = document.getElementById('ap-prog');
          var body = document.getElementById('ap-article-body');
          if (!bar || !body) return;
          function update() {
            var rect = body.getBoundingClientRect();
            var total = rect.height - window.innerHeight;
            var scrolled = Math.max(0, -rect.top);
            var pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
            bar.style.width = pct + '%';
          }
          window.addEventListener('scroll', update, { passive: true });
          update();
        })();
      `}} />
    </>
  );
}