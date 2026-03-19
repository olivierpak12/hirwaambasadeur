'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface ArticleDisplayProps {
  article: {
    _id: string;
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
    commentCount?: number;
    likeCount?: number;
  };
  relatedArticles?: any[];
}

export default function ArticleDisplay({ article, relatedArticles = [] }: ArticleDisplayProps) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(-1);

  const featuredImages = article.featuredImages ?? [];

  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Convex hooks
  const comments = useQuery(api.articles.getComments, { articleId: article._id as any });
  const likeStatus = useQuery(api.articles.getLikeStatus, { 
    articleId: article._id as any, 
    userId: typeof window !== 'undefined' ? localStorage.getItem('userId') || 'anonymous' : 'anonymous' 
  });
  const addComment = useMutation(api.articles.addComment);
  const addLike = useMutation(api.articles.addLike);

  const handleImageError = (imageSrc: string) => {
    setFailedImages((prev) => new Set([...prev, imageSrc]));
  };

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      'X / Twitter': `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`,
      Pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
  };

  const handleLike = async () => {
    try {
      await addLike({
        articleId: article._id as any,
        userId: localStorage.getItem('userId') || 'anonymous',
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    try {
      await addComment({
        articleId: article._id as any,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim() || undefined,
        content: commentText.trim(),
      });
      setCommentText('');
      setAuthorEmail('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleOpenLightbox = (image: { url: string; caption?: string }, index: number) => {
    setLightboxImage(image);
    setLightboxImageIndex(index);
  };

  const handlePrevImage = () => {
    if (!article.images || article.images.length === 0) return;
    const newIndex = lightboxImageIndex === 0 ? article.images.length - 1 : lightboxImageIndex - 1;
    setLightboxImage(article.images[newIndex]);
    setLightboxImageIndex(newIndex);
  };

  const handleNextImage = () => {
    if (!article.images || article.images.length === 0) return;
    const newIndex = lightboxImageIndex === article.images.length - 1 ? 0 : lightboxImageIndex + 1;
    setLightboxImage(article.images[newIndex]);
    setLightboxImageIndex(newIndex);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxImageIndex(-1);
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
          background: #f0f0f0;
        }

        .featured-img-outer img {
          width: 100%;
          display: block;
          object-fit: cover;
          height: auto;
          min-height: 180px;
          max-height: 280px;
        }

        .featured-gallery {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          height: auto;
          min-height: 240px;
        }

        .featured-gallery img {
          width: 100%;
          height: auto;
          min-height: 180px;
          object-fit: cover;
          display: block;
        }

        .featured-gallery img:first-child {
          grid-row: span 1;
        }

        /* Tablet: 2-column gallery */
        @media (min-width: 600px) {
          .featured-gallery {
            grid-template-columns: 2fr 1fr;
            height: 360px;
            gap: 6px;
          }

          .featured-gallery img {
            height: 100%;
            min-height: unset;
          }

          .featured-gallery img:first-child {
            grid-row: span 2;
          }
        }

        /* Laptop: 2-column gallery continues */
        @media (min-width: 1080px) {
          .featured-gallery {
            height: 420px;
          }
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
           GALLERY — Professional Masonry Layout
        ───────────────────────────────────────────── */
        .gallery-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: 1fr;
          margin-top: 28px;
          margin-bottom: 28px;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          background: #f0f0f0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gallery-item:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.02);
        }

        .gallery-caption-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 20px 14px 14px;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 13px;
          line-height: 1.5;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-caption-overlay {
          opacity: 1;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-image {
          width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: 2px;
        }

        .lightbox-caption {
          color: white;
          padding: 20px 0;
          text-align: center;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
          max-width: 100%;
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          color: white;
          font-size: 28px;
          cursor: pointer;
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-close:hover {
          color: #c9a84c;
        }

        /* Lightbox Navigation */
        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-nav-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-50%) scale(1.1);
        }

        .lightbox-nav-prev {
          left: 20px;
        }

        .lightbox-nav-next {
          right: 20px;
        }

        .lightbox-counter {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 14px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 640px) {
          .lightbox-nav-btn {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .lightbox-nav-prev {
            left: 12px;
          }

          .lightbox-nav-next {
            right: 12px;
          }

          .lightbox-counter {
            font-size: 11px;
            padding: 6px 12px;
            top: 10px;
          }
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
            max-height: 380px;
          }

          .featured-gallery {
            height: 380px;
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
           ── ANDROID TABLET: 600px – 839px ──
        ───────────────────────────────────────────── */
        @media (min-width: 600px) and (max-width: 839px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        /* ─────────────────────────────────────────────
           ── ANDROID TABLET LANDSCAPE + LARGE TABLET: 840px – 1079px ──
        ───────────────────────────────────────────── */
        @media (min-width: 840px) and (max-width: 1079px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 18px;
          }
        }

        /* ─────────────────────────────────────────────
           ── LAPTOP / DESKTOP: 1080px+ ──
        ───────────────────────────────────────────── */
        @media (min-width: 1080px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
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
            max-height: none;
          }

          .featured-img-outer img {
            max-height: 540px;
          }

          .featured-gallery {
            height: 480px;
          }

          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
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
            height: 540px;
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
        {featuredImages.length > 0 && (
          <div className="featured-img-outer">
            {featuredImages.length === 1 ? (
              <div style={{ position: 'relative', width: '100%' }}>
                {!failedImages.has(featuredImages[0]) ? (
                  <img
                    src={featuredImages[0]}
                    alt={article.title}
                    onError={() => handleImageError(featuredImages[0])}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    minHeight: '180px',
                    maxHeight: '280px',
                    background: 'linear-gradient(135deg, #1a3d28 0%, #2d6f4d 50%, #4a9b6f 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 24,
                    fontWeight: 600,
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    {article.title}
                  </div>
                )}
              </div>
            ) : (
              <div className="featured-gallery">
                {featuredImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {!failedImages.has(img) ? (
                      <img
                        src={img}
                        alt={`${article.title} - ${index + 1}`}
                        onError={() => handleImageError(img)}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${['#1a3d28', '#bb1919', '#c9a84c'][index % 3]} 0%, ${['#2d6f4d', '#d91e1e', '#e0c055'][index % 3]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}></div>
                    )}
                  </div>
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

            {/* ── Gallery — Professional Masonry Layout ── */}
            {article.images && article.images.length > 0 && (
              <div style={{ marginTop: 28, marginBottom: 28 }}>
                <div className="article-text-pad" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#1a1a1a', whiteSpace: 'nowrap',
                  }}>
                    Photo Gallery ({article.images.length})
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#e8e2d4' }} />
                </div>
                <div className="gallery-grid">
                  {article.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="gallery-item"
                      onClick={() => handleOpenLightbox(img, idx)}
                      style={{ minHeight: 240 }}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Gallery image ${idx + 1}`}
                      />
                      {img.caption && (
                        <div className="gallery-caption-overlay">
                          {img.caption}
                        </div>
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

            {/* ── Engagement ── */}
            <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 22, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ color: likeStatus?.liked ? '#e74c3c' : '#666' }}>❤️</span>
                  <span style={{ color: '#666' }}>{article.likeCount || 0}</span>
                </button>

                {/* Comments Toggle */}
                <button
                  onClick={() => setShowComments(!showComments)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #ddd', borderRadius: 4, background: 'white', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <span style={{ color: '#666' }}>💬</span>
                  <span style={{ color: '#666' }}>{article.commentCount || 0}</span>
                </button>
              </div>
            </div>

            {/* ── Comments Section ── */}
            {showComments && (
              <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 22, marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#1a3d28', marginBottom: 16 }}>
                  Comments ({article.commentCount || 0})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: 24 }}>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 8 }}
                    />
                    <input
                      type="email"
                      placeholder="Your email (optional)"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 8 }}
                    />
                    <textarea
                      placeholder="Write your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      rows={4}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ padding: '8px 16px', background: '#1a3d28', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
                  >
                    Post Comment
                  </button>
                </form>

                {/* Comments List */}
                {comments && comments.length > 0 && (
                  <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
                    {comments.map((comment: any) => (
                      <div key={comment._id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f5f5f5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a3d28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 14, fontWeight: 600 }}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#1a3d28', margin: 0, fontSize: 14 }}>{comment.authorName}</p>
                            <p style={{ color: '#666', margin: 0, fontSize: 12 }}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p style={{ color: '#333', lineHeight: 1.6, margin: 0 }}>{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* ── Lightbox Modal with Navigation ── */}
      {lightboxImage && article.images && article.images.length > 0 && (
        <div 
          className="lightbox-overlay"
          onClick={() => closeLightbox()}
        >
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="lightbox-close"
              onClick={() => closeLightbox()}
              aria-label="Close lightbox"
            >
              ✕
            </button>

            {/* Image Counter */}
            {article.images.length > 1 && (
              <div className="lightbox-counter">
                {lightboxImageIndex + 1} of {article.images.length}
              </div>
            )}

            {/* Main Image */}
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.caption || 'Full-size gallery image'}
              className="lightbox-image"
            />

            {/* Navigation Buttons */}
            {article.images.length > 1 && (
              <>
                <button 
                  className="lightbox-nav-btn lightbox-nav-prev"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ❮
                </button>
                <button 
                  className="lightbox-nav-btn lightbox-nav-next"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ❯
                </button>
              </>
            )}

            {/* Caption */}
            {lightboxImage.caption && (
              <div className="lightbox-caption">
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}