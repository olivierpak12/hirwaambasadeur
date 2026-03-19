'use client';

import Link from 'next/link';

interface ArticleDisplayProps {
  article: {
    title: string;
    excerpt: string;
    content: string;
    featuredImages?: string[];
    images?: Array<{ url: string; caption?: string }>;
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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'X / Twitter': `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`,
      Pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ─────────────────────────────────────────────
           PAGE SHELL — centres & constrains everything
        ───────────────────────────────────────────── */
        .article-page {
          width: 100%;
          box-sizing: border-box;
          background: #f5f4f0;
        }

        /* ─────────────────────────────────────────────
           OUTER WRAPPER — full-bleed white card
        ───────────────────────────────────────────── */
        .article-wrapper {
          background: #fff;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 0 0 32px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─────────────────────────────────────────────
           CONTENT COLUMN
           Mobile: ZERO side padding — full bleed to screen edges
           Tablet+: centred readable column with padding
        ───────────────────────────────────────────── */
        .article-inner {
          width: 100%;
          max-width: 100%;
          margin: 0;
          box-sizing: border-box;
          padding: 16px 0 0;
        }

        /* Text-only sections get side padding so prose is readable */
        .article-text-pad {
          padding-left: 14px;
          padding-right: 14px;
        }

        /* ─────────────────────────────────────────────
           FEATURED IMAGE — always full-bleed
        ───────────────────────────────────────────── */
        .featured-img-outer {
          width: 100%;
          margin-bottom: 0;
          overflow: hidden;
        }

        .featured-img-outer img {
          width: 100%;
          display: block;
          object-fit: cover;
          max-height: 260px;   /* phone: generous hero height */
        }

        .featured-gallery {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4px;
          height: 260px;
        }

        .featured-gallery img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .featured-gallery img:first-child {
          grid-row: span 2;
        }

        /* ─────────────────────────────────────────────
           BODY TYPOGRAPHY
        ───────────────────────────────────────────── */
        .article-body {
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .article-body p {
          font-size: 17px;
          line-height: 1.85;
          color: #1a1a1a;
          margin: 0 0 1.5em;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .article-body h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 600;
          color: #111;
          margin: 2.2em 0 0.75em;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .article-body h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #111;
          margin: 1.75em 0 0.6em;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .article-body blockquote {
          border-left: 3px solid #c9a84c;
          margin: 1.75em 0;
          padding: 0.4em 0 0.4em 1.25em;
          font-style: italic;
          font-size: 19px;
          line-height: 1.65;
          color: #333;
          font-weight: 400;
        }

        .article-body a { color: #1a3d28; text-decoration: underline; text-underline-offset: 3px; }

        .article-body ul,
        .article-body ol {
          margin: 0 0 1.5em 1.25em;
          font-size: 17px;
          line-height: 1.85;
          color: #1a1a1a;
          font-weight: 300;
        }

        .article-body li { margin-bottom: 0.4em; }
        .article-body strong { font-weight: 600; color: #111; }
        .article-body em { font-style: italic; }

        /* Drop cap */
        .article-body.drop-cap p:first-of-type::first-letter {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 4.8em;
          font-weight: 700;
          float: left;
          line-height: 0.72;
          margin: 0.08em 0.1em 0 0;
          color: #1a3d28;
        }

        /* ─────────────────────────────────────────────
           META BAR
        ───────────────────────────────────────────── */
        .meta-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px 14px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e8e2d4;
          margin-bottom: 22px;
        }

        .meta-divider {
          width: 1px;
          height: 22px;
          background: #e0dbd2;
          flex-shrink: 0;
        }

        /* ─────────────────────────────────────────────
           AD BOX
        ───────────────────────────────────────────── */
        .ad-box {
          background: #fafaf8;
          border: 1px dashed #d8d3c8;
          border-radius: 3px;
          padding: 12px 16px;
          margin-bottom: 26px;
          text-align: center;
        }

        .ad-box p {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #aaa;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
        }

        /* ─────────────────────────────────────────────
           GALLERY
        ───────────────────────────────────────────── */
        .gallery-grid {
          display: grid;
          gap: 10px;
          grid-template-columns: 1fr;
        }

        /* ─────────────────────────────────────────────
           AUTHOR BIO
        ───────────────────────────────────────────── */
        .author-bio-block {
          border-top: 2px solid #1a3d28;
          padding-top: 22px;
          margin-bottom: 32px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        /* ─────────────────────────────────────────────
           SHARE BUTTONS
        ───────────────────────────────────────────── */
        .share-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .share-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 13px;
          border-radius: 3px;
          border: 1.5px solid;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.18s ease;
          text-transform: uppercase;
          white-space: nowrap;
          background: transparent;
        }

        .share-btn:hover { opacity: 0.8; transform: translateY(-1px); }
        .share-btn:active { transform: translateY(0); }

        /* ─────────────────────────────────────────────
           RELATED ARTICLES
        ───────────────────────────────────────────── */
        .related-section {
          background: #f5f4f0;
          padding: 36px 16px 44px;
        }

        .related-inner {
          max-width: 960px;
          margin: 0 auto;
        }

        .related-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: 1fr;
        }

        .related-card {
          background: #fff;
          border-top: 2px solid transparent;
          padding: 16px;
          border-radius: 2px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }

        .related-card:hover {
          border-color: #c9a84c;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }

        .related-card:hover .related-title { color: #1a3d28; }

        .related-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 15px;
          color: #1a1a1a;
          line-height: 1.45;
          margin: 0 0 6px;
          transition: color 0.2s;
        }

        /* ─────────────────────────────────────────────
           ── ANDROID TABLET: 600px – 839px ──
           Typical: Samsung Tab A8 (800px), Tab S6/S7 (portrait ~800px), 
                    Lenovo Tab M10 (~800px), Fire HD 10 (portrait ~800px)
        ───────────────────────────────────────────── */
        @media (min-width: 600px) and (max-width: 839px) {
          .article-wrapper {
            padding: 0 0 40px;
          }

          .article-inner {
            padding: 28px 0 0;
          }

          .article-text-pad {
            padding-left: 32px;
            padding-right: 32px;
          }

          .featured-img-outer img {
            max-height: 360px;
          }

          .featured-gallery {
            height: 360px;
          }

          /* Two-column gallery on tablet */
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          /* Two-column related on tablet */
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .related-section {
            padding: 36px 32px 48px;
          }

          .article-body p,
          .article-body ul,
          .article-body ol {
            font-size: 17px;
          }

          .article-body blockquote {
            font-size: 20px;
            padding-left: 1.5em;
          }

          .share-btn {
            padding: 10px 18px;
            font-size: 12px;
          }
        }

        /* ─────────────────────────────────────────────
           ── ANDROID TABLET LANDSCAPE + LARGE TABLET: 840px – 1079px ──
           Typical: Tab S6/S7/S8 landscape (~1280px wide is too big, but 
                    10" tablets portrait start here), iPad-class sizes
        ───────────────────────────────────────────── */
        @media (min-width: 840px) and (max-width: 1079px) {
          .article-wrapper {
            padding: 0 0 48px;
          }

          .article-inner {
            max-width: 680px;
            margin: 0 auto;
            padding: 32px 0 0;
          }

          .article-text-pad {
            padding-left: 48px;
            padding-right: 48px;
          }

          .featured-img-outer img {
            max-height: 420px;
          }

          .featured-gallery {
            height: 420px;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .related-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .related-section {
            padding: 40px 48px 56px;
          }

          .article-body p,
          .article-body ul,
          .article-body ol {
            font-size: 18px;
          }

          .article-body h2 {
            font-size: 26px;
          }

          .article-body blockquote {
            font-size: 21px;
          }
        }

        /* ─────────────────────────────────────────────
           ── LAPTOP / DESKTOP: 1080px+ ──
        ───────────────────────────────────────────── */
        @media (min-width: 1080px) {
          .article-wrapper {
            padding: 0 0 56px;
          }

          .article-inner {
            max-width: 740px;
            margin: 0 auto;
            padding: 48px 0 0;
          }

          .article-text-pad {
            padding-left: 0;
            padding-right: 0;
          }

          .featured-img-outer {
            /* Full-bleed hero on laptop */
            max-height: 520px;
          }

          .featured-img-outer img {
            max-height: 520px;
          }

          .featured-gallery {
            height: 520px;
          }

          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 12px;
          }

          .related-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          .related-section {
            padding: 52px 48px 64px;
          }

          .related-inner {
            max-width: 1100px;
          }

          .article-body p,
          .article-body ul,
          .article-body ol {
            font-size: 18.5px;
            line-height: 1.9;
          }

          .article-body h2 {
            font-size: 28px;
          }

          .article-body h3 {
            font-size: 12px;
          }

          .article-body blockquote {
            font-size: 22px;
            margin-left: -24px;
            padding-left: 21px;
          }

          .share-btn {
            padding: 10px 20px;
            font-size: 12px;
          }
        }

        /* ─────────────────────────────────────────────
           ── WIDE SCREENS: 1400px+ ──
        ───────────────────────────────────────────── */
        @media (min-width: 1400px) {
          .article-inner {
            max-width: 760px;
          }

          .featured-img-outer img {
            max-height: 580px;
          }

          .featured-gallery {
            height: 580px;
          }

          .related-inner {
            max-width: 1200px;
          }

          .related-grid {
            gap: 28px;
          }
        }

        /* ─────────────────────────────────────────────
           ── SMALL PHONES: ≤ 480px ──
        ───────────────────────────────────────────── */
        @media (max-width: 480px) {
          .meta-divider { display: none; }
          .author-bio-block { flex-direction: column; }
          .article-body blockquote { padding-left: 0.9em; font-size: 17px; }
          .article-body p { font-size: 16px; }
          .article-inner { padding: 14px 0 0; }
          .article-text-pad { padding-left: 14px; padding-right: 14px; }
        }
      `}</style>

      <div className="article-page">

        {/* ── Full-bleed featured images ABOVE the white card ── */}
        {article.featuredImages && article.featuredImages.length > 0 && (
          <div className="featured-img-outer">
            {article.featuredImages.length === 1 ? (
              <img src={article.featuredImages[0]} alt={article.title} />
            ) : (
              <div className="featured-gallery">
                {article.featuredImages.slice(0, 3).map((img, index) => (
                  <img key={index} src={img} alt={`${article.title} - ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        )}

        <article className="article-wrapper">
          <div className="article-inner">
          <div className="article-text-pad">
            {article.category && (
              <div style={{ paddingBottom: 14, borderBottom: '1px solid #e8e2d4', marginBottom: 18 }}>
                <Link href={`/categories/${article.category.slug}`} style={{ textDecoration: 'none' }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#bb1919', borderBottom: '2px solid #bb1919', paddingBottom: 2,
                  }}>
                    {article.category.name}
                  </span>
                </Link>
              </div>
            )}

            {/* ── Title ── */}
            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(26px, 4.5vw, 44px)',
              fontWeight: 700, color: '#0d0d0d',
              lineHeight: 1.18, letterSpacing: '-0.02em',
              marginBottom: 16,
            }}>
              {article.title}
            </h1>

            {/* ── Standfirst ── */}
            {article.excerpt && (
              <p style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: 'clamp(15px, 2vw, 20px)',
                fontWeight: 300, color: '#444',
                lineHeight: 1.65, marginBottom: 22,
                letterSpacing: '0.01em',
                borderLeft: '3px solid #c9a84c', paddingLeft: 16,
              }}>
                {article.excerpt}
              </p>
            )}

            {/* ── Meta bar ── */}
            <div className="meta-bar">
              {article.author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  {article.author.photo ? (
                    <img
                      src={article.author.photo}
                      alt={article.author.name}
                      style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #e8e2d4', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: '#1a3d28', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#c9a84c', fontSize: 14, fontWeight: 700,
                    }}>
                      {article.author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {article.author._id ? (
                    <Link href={`/author/${article.author._id}`} style={{ textDecoration: 'none' }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                        {article.author.name}
                      </span>
                    </Link>
                  ) : (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                      {article.author.name}
                    </span>
                  )}
                </div>
              )}

              {article.author && <span className="meta-divider" />}

              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#777' }}>
                {publishDate}
              </span>

              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#bbb', marginLeft: 'auto' }}>
                {(article.views || 0).toLocaleString()} views
              </span>
            </div>

            {/* ── Ad ── */}
            <div className="ad-box"><p>Advertisement</p></div>

            {/* ── Body ── */}
            <div className="article-body drop-cap" dangerouslySetInnerHTML={{ __html: article.content }} />

          </div>{/* /article-text-pad — close before gallery so images are full-bleed */}

            {/* ── Gallery — full bleed on mobile ── */}
            {article.images && article.images.length > 0 && (
              <div style={{ marginTop: 24, marginBottom: 24 }}>
                <div className="article-text-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#888', whiteSpace: 'nowrap',
                  }}>
                    Photo Gallery
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#e8e2d4' }} />
                </div>
                <div className="gallery-grid">
                  {article.images.map((img, idx) => (
                    <div key={idx} style={{ overflow: 'hidden' }}>
                      <img
                        src={img.url}
                        alt={img.caption || `Gallery image ${idx + 1}`}
                        style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      {img.caption && (
                        <p className="article-text-pad" style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12, color: '#777',
                          paddingTop: 7, lineHeight: 1.4, margin: 0,
                        }}>
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div className="article-text-pad">
            {/* ── Second ad ── */}
            <div className="ad-box"><p>Advertisement</p></div>

            {/* ── Author bio ── */}
            {article.author && article.author.bio && (
              <div className="author-bio-block">
                {article.author.photo ? (
                  <img
                    src={article.author.photo}
                    alt={article.author.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                    background: '#1a3d28', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#c9a84c', fontSize: 22, fontWeight: 700,
                  }}>
                    {article.author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10, color: '#aaa',
                    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5,
                  }}>
                    About the author
                  </p>
                  {article.author._id ? (
                    <Link href={`/author/${article.author._id}`} style={{ textDecoration: 'none' }}>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, color: '#1a3d28', marginBottom: 7, cursor: 'pointer' }}>
                        {article.author.name}
                      </p>
                    </Link>
                  ) : (
                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, color: '#1a3d28', marginBottom: 7 }}>
                      {article.author.name}
                    </p>
                  )}
                  <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, color: '#555', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                    {article.author.bio}
                  </p>
                </div>
              </div>
            )}

            {/* ── Share ── */}
            <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 22, marginBottom: 8 }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#aaa', marginBottom: 14,
              }}>
                Share this article
              </p>
              <div className="share-grid">
                {[
                  { label: 'Facebook', color: '#1877f2' },
                  { label: 'X / Twitter', color: '#000' },
                  { label: 'WhatsApp', color: '#25d366' },
                  { label: 'Pinterest', color: '#e60023' },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleShare(s.label)}
                    className="share-btn"
                    style={{ borderColor: s.color, color: s.color }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>{/* /article-text-pad (second) */}
          </div>{/* /article-inner */}
        </article>

        {/* ── Related Articles ── */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="related-section">
            <div className="related-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#1a1a1a', whiteSpace: 'nowrap',
                }}>
                  More to read
                </span>
                <div style={{ flex: 1, height: 1, background: '#ddd8cf' }} />
              </div>

              <div className="related-grid">
                {relatedArticles.map((related) => (
                  <Link key={related._id} href={`/article/${related.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="related-card">
                      {(related.featuredImage || (related.featuredImages && related.featuredImages.length > 0)) && (
                        <div style={{ height: 150, overflow: 'hidden', marginBottom: 12, borderRadius: 2 }}>
                          <img
                            src={related.featuredImage || related.featuredImages[0]}
                            alt={related.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        </div>
                      )}
                      {related.category?.name && (
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 10, fontWeight: 600,
                          color: '#bb1919', letterSpacing: '0.1em',
                          textTransform: 'uppercase', marginBottom: 6,
                        }}>
                          {related.category.name}
                        </p>
                      )}
                      <h3 className="related-title">{related.title}</h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#aaa', margin: 0 }}>
                        {new Date(related.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>{/* /article-page */}
    </>
  );
}