'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArticleMiddleAd } from '@/components/common/AdPlacements';

interface LightboxEntry { url: string; caption?: string; }

interface ArticleDisplayProps {
  article: {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    featured?: string | boolean;
    featuredImage?: string;
    featuredImages?: string[];
    images?: Array<{ url: string; caption?: string }>;
    author?: { name: string; bio: string; photo?: string; _id?: string };
    category?: { name: string; slug: string };
    publishedAt: string;
    updatedAt?: string;
    views?: number;
    commentCount?: number;
    likeCount?: number;
    youtubeUrl?: string;
  };
  relatedArticles?: any[];
}

function getYouTubeVideoId(url?: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

export default function ArticleDisplay({ article, relatedArticles = [] }: ArticleDisplayProps) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [canSeeViews, setCanSeeViews] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const adminRole = window.localStorage.getItem('adminRole');
    const loggedAuthorId = window.localStorage.getItem('authorId');
    const articleAuthorId = article.author?._id ? String(article.author._id) : null;

    if (adminRole === 'admin') {
      setCanSeeViews(true);
      return;
    }

    if (loggedAuthorId && articleAuthorId && loggedAuthorId === articleAuthorId) {
      setCanSeeViews(true);
      return;
    }

    setCanSeeViews(false);
  }, [article.author]);

  // ── Lightbox ──
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbList, setLbList] = useState<LightboxEntry[]>([]);
  const [lbZoom, setLbZoom] = useState(false);
  const [lbLoading, setLbLoading] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Build master image list from backend-resolved properties
  const featuredImages: string[] = (() => {
    if (article.featuredImages && Array.isArray(article.featuredImages) && article.featuredImages.length > 0) {
      const validated = article.featuredImages.filter(img => typeof img === 'string' && img.length > 10);
      if (validated.length > 0) return validated;
    }
    if (article.featuredImage && typeof article.featuredImage === 'string' && article.featuredImage.length > 10) {
      return [article.featuredImage];
    }
    return [];
  })();

  useEffect(() => {
    if (featuredImages.length === 0) {
      console.warn(`⚠️ [${article.title}] No featured images resolved`);
      console.log('Backend returned:', {
        featured: article.featured,
        featuredImages: article.featuredImages,
      });
    } else {
      console.log(`✅ [${article.title}] Resolved ${featuredImages.length} featured image(s)`);
      featuredImages.forEach((img, i) => {
        console.log(`  [${i}] ${img.substring(0, 100)}...`);
      });
    }
  }, [article.title, article.featured, article.featuredImages, featuredImages]);

  const galleryImages: LightboxEntry[] = article.images ?? [];

  const buildList = useCallback((): LightboxEntry[] => {
    const list: LightboxEntry[] = [];
    featuredImages.forEach(url => { if (!failedImages.has(url)) list.push({ url, caption: article.title }); });
    galleryImages.forEach(img => { if (!list.find(x => x.url === img.url)) list.push(img); });
    if (bodyRef.current) {
      bodyRef.current.querySelectorAll('img').forEach(el => {
        if (el.src && !list.find(x => x.url === el.src)) list.push({ url: el.src, caption: el.alt || undefined });
      });
    }
    return list;
  }, [featuredImages, galleryImages, article.title, failedImages]);

  const openLb = useCallback((url: string, caption?: string) => {
    const list = buildList();
    let idx = list.findIndex(x => x.url === url);
    if (idx === -1) { list.push({ url, caption }); idx = list.length - 1; }
    setLbList(list); setLbIndex(idx); setLbLoading(true); setLbZoom(false); setLbOpen(true);
  }, [buildList]);

  const closeLb = useCallback(() => { setLbOpen(false); setLbZoom(false); }, []);
  const goNext = useCallback(() => { setLbLoading(true); setLbZoom(false); setLbIndex(i => (i + 1) % lbList.length); }, [lbList.length]);
  const goPrev = useCallback(() => { setLbLoading(true); setLbZoom(false); setLbIndex(i => (i - 1 + lbList.length) % lbList.length); }, [lbList.length]);

  useEffect(() => {
    if (!lbOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') goNext(); if (e.key === 'ArrowLeft') goPrev(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lbOpen, closeLb, goNext, goPrev]);

  useEffect(() => { document.body.style.overflow = lbOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [lbOpen]);

  // Make body images clickable
  useEffect(() => {
    if (!bodyRef.current) return;
    const imgs = bodyRef.current.querySelectorAll('img');
    const handlers: Array<[HTMLImageElement, () => void]> = [];
    imgs.forEach(img => {
      img.style.cursor = 'zoom-in';
      const h = () => openLb(img.src, img.alt || undefined);
      img.addEventListener('click', h);
      handlers.push([img, h]);
    });
    return () => handlers.forEach(([img, h]) => img.removeEventListener('click', h));
  }, [article.content, openLb]);

  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const comments = useQuery(api.articles.getComments, { articleId: article._id as any });
  const likeStatus = useQuery(api.articles.getLikeStatus, { articleId: article._id as any, userId: typeof window !== 'undefined' ? localStorage.getItem('userId') || 'anonymous' : 'anonymous' });
  const addComment = useMutation(api.articles.addComment);
  const addLike = useMutation(api.articles.addLike);

  const handleLike = async () => { try { await addLike({ articleId: article._id as any, userId: localStorage.getItem('userId') || 'anonymous' }); } catch (e) { console.error(e); } };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;
    try { await addComment({ articleId: article._id as any, authorName: authorName.trim(), authorEmail: authorEmail.trim() || undefined, content: commentText.trim() }); setCommentText(''); setAuthorEmail(''); } catch (e) { console.error(e); }
  };

  const handleShare = (p: string) => {
    const u: Record<string, string> = { Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, 'X / Twitter': `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, WhatsApp: `https://wa.me/?text=${encodeURIComponent(article.title + ' ' + shareUrl)}`, Pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}` };
    if (u[p]) window.open(u[p], '_blank');
  };

  const cur = lbList[lbIndex];
  const heroCount = featuredImages.filter(u => !failedImages.has(u)).length;
  const youtubeId = getYouTubeVideoId(article.youtubeUrl);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ad-page { width: 100%; background: #f0ede6; }

        /* ══ HERO ══ */
        .hero-wrap { width: 100%; background: #111; overflow: hidden; position: relative; line-height: 0; }

        .hero-single {
          width: 100%; height: 56vw;
          min-height: 220px; max-height: 600px;
          position: relative; overflow: hidden; cursor: zoom-in;
        }
        .hero-single img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .hero-single:hover img { transform: scale(1.03); }
        .hero-single::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.42) 100%); pointer-events: none; }

        .hero-expand-hint {
          position: absolute; bottom: 14px; right: 14px;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: 0.06em;
          padding: 5px 11px; border-radius: 20px;
          pointer-events: none; opacity: 0; transition: opacity 0.25s; z-index: 2;
        }
        .hero-single:hover .hero-expand-hint { opacity: 1; }

        .hero-multi { display: grid; width: 100%; gap: 3px; }
        .hero-multi.c2 { grid-template-columns: 1fr 1fr; height: 52vw; min-height: 200px; max-height: 460px; }
        .hero-multi.c3 { grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; height: 56vw; min-height: 220px; max-height: 520px; }
        .hero-multi.c3 .hmi:first-child { grid-row: span 2; }
        .hero-multi.c4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; height: 56vw; min-height: 220px; max-height: 520px; }

        .hmi { position: relative; overflow: hidden; cursor: zoom-in; background: #1a1a1a; }
        .hmi img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
        .hmi:hover img { transform: scale(1.04); }
        .hmi::after { content: '⤢'; position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.55); color: #fff; font-size: 13px; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .hmi:hover::after { opacity: 1; }

        .hero-more { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 4px; color: #fff; font-family: 'DM Sans', sans-serif; }
        .hero-more span:first-child { font-size: clamp(22px, 5vw, 36px); font-weight: 700; }
        .hero-more span:last-child { font-size: 10px; letter-spacing: 0.1em; opacity: 0.8; text-transform: uppercase; }

        /* ══ ARTICLE CARD ══ */
        .art-card { background: #fff; width: 100%; font-family: 'DM Sans', sans-serif; }
        .art-inner { width: 100%; max-width: 100%; padding: 20px 16px 0; }

        .art-cat { display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bb1919; border-bottom: 2px solid #bb1919; padding-bottom: 2px; text-decoration: none; margin-bottom: 14px; }

        .art-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(24px, 5.5vw, 46px); font-weight: 700; color: #0d0d0d; line-height: 1.15; letter-spacing: -0.025em; margin: 0 0 16px; }

        .art-standfirst { font-family: 'Source Serif 4', Georgia, serif; font-size: clamp(15px, 2.2vw, 19px); font-weight: 300; color: #444; line-height: 1.7; margin: 0 0 20px; padding-left: 14px; border-left: 3px solid #c9a84c; letter-spacing: 0.01em; }

        .art-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 10px 12px; padding-bottom: 16px; border-bottom: 1px solid #e8e2d4; margin-bottom: 20px; }
        .art-meta-div { width: 1px; height: 20px; background: #e0dbd2; flex-shrink: 0; }
        .art-author-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #e8e2d4; }
        .art-author-avatar-init { width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0; background: #1a3d28; display: flex; align-items: center; justify-content: center; color: #c9a84c; font-size: 14px; font-weight: 700; font-family: 'Playfair Display', serif; }

        .art-ad { background: #fafaf8; border: 1px dashed #d0cbc0; border-radius: 3px; text-align: center; padding: 10px; margin-bottom: 24px; }
        .art-ad p { font-family: 'DM Sans', sans-serif; font-size: 9px; color: #bbb; letter-spacing: 0.1em; text-transform: uppercase; margin: 0; }

        /* ══ YOUTUBE VIDEO ══ */
        .youtube-outer {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1.8em 0;
        }
        .youtube-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 8px;
          align-self: flex-start;
          margin-left: calc(6%);
        }
        .youtube-wrap {
          position: relative;
          width: 88%;
          max-width: 500px;
          border-radius: 8px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 4px 18px rgba(0,0,0,0.13);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .youtube-wrap::before {
          content: '';
          display: block;
          padding-bottom: 56.25%;
        }
        .youtube-wrap:hover {
          box-shadow: 0 8px 26px rgba(0,0,0,0.2);
          transform: translateY(-2px);
        }
        .youtube-wrap iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ══ BODY ══ */
        .art-body { font-family: 'Source Serif 4', Georgia, serif; }
        .art-body p { font-size: 17px; line-height: 1.88; color: #1c1c1c; margin: 0 0 1.5em; font-weight: 300; }
        .art-body h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 600; color: #111; margin: 2em 0 0.75em; line-height: 1.3; }
        .art-body h3 { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; color: #111; margin: 1.75em 0 0.6em; letter-spacing: 0.1em; text-transform: uppercase; }
        .art-body blockquote { border-left: 3px solid #c9a84c; margin: 2em 0; padding: 0.4em 0 0.4em 1.2em; font-style: italic; font-size: 19px; line-height: 1.65; color: #333; }
        .art-body a { color: #1a3d28; text-decoration: underline; text-underline-offset: 3px; }
        .art-body ul, .art-body ol { margin: 0 0 1.5em 1.2em; font-size: 17px; line-height: 1.88; color: #1c1c1c; font-weight: 300; }
        .art-body li { margin-bottom: 0.4em; }
        .art-body strong { font-weight: 600; color: #111; }
        .art-body img { max-width: 100%; height: auto; display: block; margin: 1.8em auto; border-radius: 3px; cursor: zoom-in; transition: opacity 0.2s, transform 0.3s; box-shadow: 0 2px 16px rgba(0,0,0,0.1); }
        .art-body img:hover { opacity: 0.92; transform: scale(1.007); }
        .art-body.dropcap > p:first-of-type::first-letter { font-family: 'Playfair Display', Georgia, serif; font-size: 5em; font-weight: 700; float: left; line-height: 0.72; margin: 0.07em 0.1em 0 0; color: #1a3d28; }

        /* ══ GALLERY ══ */
        .gallery-section { padding: 28px 0 32px; background: #f7f4ee; margin: 28px 0; }
        .gallery-header { display: flex; align-items: center; gap: 12px; padding: 0 16px; margin-bottom: 16px; }
        .gallery-label { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #555; white-space: nowrap; }
        .gallery-rule { flex: 1; height: 1px; background: #ddd8cf; }
        .gallery-count { font-family: 'DM Sans', sans-serif; font-size: 10px; color: #aaa; letter-spacing: 0.06em; white-space: nowrap; }

        .gallery-grid { display: grid; gap: 4px; padding: 0 16px; grid-template-columns: repeat(2, 1fr); }

        .gi { position: relative; overflow: hidden; border-radius: 2px; background: #1a1a1a; cursor: zoom-in; aspect-ratio: 4/3; }
        .gi img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease, opacity 0.3s; }
        .gi:hover img { transform: scale(1.06); opacity: 0.9; }
        .gi-cap { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.78), transparent); color: #f0ece0; padding: 24px 10px 10px; font-family: 'Source Serif 4', Georgia, serif; font-size: 12px; line-height: 1.45; font-style: italic; opacity: 0; transition: opacity 0.3s; }
        .gi:hover .gi-cap { opacity: 1; }
        .gi-zoom { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); color: #fff; font-size: 10px; padding: 3px 7px; border-radius: 10px; font-family: 'DM Sans', sans-serif; letter-spacing: 0.04em; opacity: 0; transition: opacity 0.25s; pointer-events: none; }
        .gi:hover .gi-zoom { opacity: 1; }
        .gallery-grid.odd .gi:first-child { grid-column: span 2; aspect-ratio: 16/7; }

        /* ══ LIGHTBOX ══ */
        .lb-wrap { position: fixed; inset: 0; background: rgba(3,6,5,0.97); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 99999; animation: lbIn 0.2s ease; }
        @keyframes lbIn { from { opacity: 0; } to { opacity: 1; } }

        .lb-bar { position: absolute; top: 0; left: 0; right: 0; height: 54px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent); z-index: 2; }
        .lb-counter { font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.1em; color: rgba(255,255,255,0.65); text-transform: uppercase; }
        .lb-x { width: 36px; height: 36px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; color: #fff; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s; }
        .lb-x:hover { background: rgba(201,168,76,0.3); border-color: #c9a84c; color: #c9a84c; }

        .lb-img-area { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; padding: 58px 64px 16px; position: relative; overflow: hidden; }
        .lb-img { max-width: 100%; max-height: calc(100vh - 170px); object-fit: contain; display: block; transition: transform 0.35s ease, opacity 0.25s; cursor: zoom-in; user-select: none; border-radius: 2px; }
        .lb-img.zoomed { transform: scale(2); cursor: zoom-out; }
        .lb-img.loading { opacity: 0.2; }
        .lb-spin { position: absolute; width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.12); border-top-color: #c9a84c; border-radius: 50%; animation: spin 0.65s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; color: #fff; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s, border-color 0.2s; z-index: 3; }
        .lb-nav:hover { background: rgba(201,168,76,0.22); border-color: #c9a84c; color: #c9a84c; }
        .lb-prev { left: 12px; }
        .lb-next { right: 12px; }

        .lb-cap-area { width: 100%; max-width: 680px; padding: 8px 20px 14px; text-align: center; }
        .lb-cap-text { font-family: 'Source Serif 4', Georgia, serif; font-size: 13px; font-style: italic; color: rgba(255,255,255,0.55); line-height: 1.6; margin: 0; }

        .lb-thumbs { display: flex; gap: 5px; padding: 0 16px 18px; overflow-x: auto; scrollbar-width: none; max-width: 100%; }
        .lb-thumbs::-webkit-scrollbar { display: none; }
        .lb-th { width: 44px; height: 33px; object-fit: cover; border-radius: 2px; opacity: 0.4; cursor: pointer; flex-shrink: 0; border: 1.5px solid transparent; transition: opacity 0.2s, transform 0.2s; }
        .lb-th:hover { opacity: 0.75; }
        .lb-th.on { opacity: 1; border-color: #c9a84c; transform: scale(1.1); }

        /* ══ AUTHOR ══ */
        .author-block { border-top: 2px solid #1a3d28; padding-top: 22px; margin-bottom: 30px; display: flex; gap: 14px; align-items: flex-start; }
        .author-av { width: 54px; height: 54px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .author-av-init { width: 54px; height: 54px; border-radius: 50%; flex-shrink: 0; background: #1a3d28; display: flex; align-items: center; justify-content: center; color: #c9a84c; font-size: 22px; font-weight: 700; font-family: 'Playfair Display', serif; }

        /* ══ SHARE ══ */
        .share-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .share-btn { padding: 7px 13px; border-radius: 3px; border: 1.5px solid; font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; background: transparent; transition: opacity 0.18s, transform 0.18s; white-space: nowrap; }
        .share-btn:hover { opacity: 0.75; transform: translateY(-1px); }

        /* ══ RELATED ══ */
        .related-wrap { background: #f0ede6; padding: 36px 16px 48px; }
        .related-inner { max-width: 100%; }
        .related-grid { display: grid; gap: 14px; grid-template-columns: 1fr; margin-top: 18px; }
        .related-card { background: #fff; border-radius: 3px; overflow: hidden; border-top: 2px solid transparent; transition: border-color 0.2s, box-shadow 0.2s; text-decoration: none; display: block; }
        .related-card:hover { border-color: #c9a84c; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }
        .related-img-wrap { height: 160px; overflow: hidden; background: #1a1a1a; }
        .related-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s; }
        .related-card:hover .related-img-wrap img { transform: scale(1.05); }
        .related-body { padding: 13px 14px 16px; }
        .related-cat { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700; color: #bb1919; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; margin-top: 0; }
        .related-title { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 600; color: #1a1a1a; line-height: 1.45; margin: 0 0 7px; transition: color 0.2s; }
        .related-card:hover .related-title { color: #1a3d28; }
        .related-date { font-family: 'DM Sans', sans-serif; font-size: 10px; color: #aaa; margin: 0; }

        /* ══ RESPONSIVE ══ */
        @media (min-width: 600px) {
          .art-inner { padding: 28px 28px 0; }
          .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 0 28px; }
          .gallery-grid.odd .gi:first-child { aspect-ratio: 21/8; }
          .gallery-header { padding: 0 28px; }
          .related-wrap { padding: 40px 28px 52px; }
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .hero-multi.c2 { height: 44vw; }
          .hero-multi.c3 { height: 44vw; }
          .hero-multi.c4 { height: 44vw; }
          .art-body p, .art-body ul, .art-body ol { font-size: 17.5px; }
        }

        @media (min-width: 900px) {
          .art-inner { max-width: 700px; margin: 0 auto; padding: 36px 0 0; }
          .hero-single { height: 48vw; max-height: 580px; }
          .hero-multi.c2 { height: 38vw; max-height: 460px; }
          .hero-multi.c3 { height: 42vw; max-height: 500px; }
          .hero-multi.c4 { height: 42vw; max-height: 500px; }
          .gallery-section { margin: 32px 0; }
          .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 0 calc((100% - 700px) / 2); }
          .gallery-header { padding: 0 calc((100% - 700px) / 2); }
          .related-wrap { padding: 48px 0 60px; }
          .related-inner { max-width: 900px; margin: 0 auto; padding: 0 24px; }
          .related-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
          .art-body p, .art-body ul, .art-body ol { font-size: 18.5px; line-height: 1.92; }
          .art-body h2 { font-size: 26px; }
          .art-body blockquote { font-size: 21px; margin-left: -20px; }
          .lb-img-area { padding: 58px 80px 16px; }
          .lb-prev { left: 20px; }
          .lb-next { right: 20px; }
          .youtube-label { margin-left: 0; }
          .youtube-wrap { max-width: 480px; }
        }

        @media (min-width: 1200px) {
          .art-inner { max-width: 740px; }
          .hero-single { max-height: 640px; }
          .gallery-grid { padding: 0 calc((100% - 740px) / 2); }
          .gallery-header { padding: 0 calc((100% - 740px) / 2); }
          .related-inner { max-width: 1080px; }
          .related-grid { gap: 24px; }
        }

        @media (max-width: 480px) {
          .art-title { font-size: clamp(22px, 7vw, 32px); }
          .art-meta-div { display: none; }
          .art-body p { font-size: 16px; }
          .art-body blockquote { font-size: 17px; padding-left: 0.9em; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 3px; padding: 0 10px; }
          .gallery-header { padding: 0 10px; }
          .author-block { flex-direction: column; }
          .lb-nav { width: 38px; height: 38px; font-size: 18px; }
          .lb-prev { left: 6px; }
          .lb-next { right: 6px; }
          .lb-img-area { padding: 58px 46px 12px; }
          .youtube-wrap { width: 94%; }
        }
      `}</style>

      <div className="ad-page">

        {/* ══ FEATURED IMAGE HERO ══ */}
        {featuredImages.length > 0 ? (
          <div className="hero-wrap">
            {heroCount === 1 && (
              <div className="hero-single" onClick={() => openLb(featuredImages[0], article.title)}>
                <img
                  src={featuredImages[0]}
                  alt={article.title}
                  loading="eager"
                  onError={() => {
                    console.error('Featured image failed to load:', featuredImages[0]);
                    setFailedImages(p => new Set([...p, featuredImages[0]]));
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="hero-expand-hint">⤢ View full</div>
              </div>
            )}

            {heroCount >= 2 && (
              <div className={`hero-multi c${Math.min(heroCount, 4)}`}>
                {featuredImages.slice(0, 4).map((url, i) => {
                  const showMore = i === 3 && heroCount > 4;
                  return (
                    <div key={i} className="hmi" onClick={() => openLb(url, `${article.title} — ${i + 1}`)}>
                      {!failedImages.has(url) ? (
                        <img
                          src={url}
                          alt={`${article.title} ${i + 1}`}
                          loading="eager"
                          onError={() => {
                            console.error('Gallery image failed to load:', url);
                            setFailedImages(p => new Set([...p, url]));
                          }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: '#1a3d28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 12 }}>Image not available</div>
                      )}
                      {showMore && (
                        <div className="hero-more">
                          <span>+{heroCount - 3}</span>
                          <span>More Photos</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '100%', minHeight: 200, background: 'linear-gradient(135deg, #1a3d28 0%, #2d5c42 50%, #c9a84c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)' }} />
            <span style={{ position: 'relative', zIndex: 1 }}>📸 No image available</span>
          </div>
        )}

        {/* ══ ARTICLE ══ */}
        <article className="art-card">
          <div className="art-inner">

            {article.category && (
              <Link href={`/categories/${article.category.slug}`} className="art-cat">
                {article.category.name}
              </Link>
            )}

            <h1 className="art-title">{article.title}</h1>

            {article.excerpt && <p className="art-standfirst">{article.excerpt}</p>}

            <div className="art-meta">
              {article.author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {article.author.photo
                    ? <img src={article.author.photo} alt={`${article.author.name} photo`} className="art-author-avatar" />
                    : <div className="art-author-avatar-init">{article.author.name.charAt(0).toUpperCase()}</div>
                  }
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.08em' }}>By</span>
                    {article.author._id
                      ? <Link href={`/author/${article.author._id}`} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>{article.author.name}</Link>
                      : <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{article.author.name}</span>
                    }
                  </div>
                </div>
              )}
              {article.author && <span className="art-meta-div" />}
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: '#777' }}>{publishDate}</span>
              {canSeeViews && article.views && article.views > 0 && (
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: '#bbb', marginLeft: 'auto' }}>{article.views.toLocaleString()} views</span>
              )}
            </div>

            {/* ══ AD ══ */}
            <ArticleMiddleAd />

            {/* ══ YOUTUBE VIDEO — compact inset ══ */}
            {youtubeId && (
              <div className="youtube-outer">
                <span className="youtube-label">▶ Watch</span>
                <div className="youtube-wrap">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&showinfo=0&modestbranding=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* ══ ARTICLE BODY ══ */}
            <div ref={bodyRef} className="art-body dropcap" dangerouslySetInnerHTML={{ __html: article.content }} />

          </div>

          {/* ══ GALLERY (full-bleed) ══ */}
          {galleryImages.length > 0 && (
            <div className="gallery-section">
              <div className="gallery-header">
                <span className="gallery-label">Photo Gallery</span>
                <div className="gallery-rule" />
                <span className="gallery-count">{galleryImages.length} photo{galleryImages.length !== 1 ? 's' : ''}</span>
              </div>
              <div className={`gallery-grid${galleryImages.length % 2 !== 0 ? ' odd' : ''}`}>
                {galleryImages.map((img, i) => (
                  <div key={i} className="gi" onClick={() => openLb(img.url, img.caption)}>
                    <img src={img.url} alt={img.caption || `Photo ${i + 1}`} loading="lazy" />
                    <div className="gi-zoom">⤢ View</div>
                    {img.caption && <div className="gi-cap">{img.caption}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="art-inner" style={{ paddingTop: 0 }}>
            <ArticleMiddleAd />

            {/* Author bio */}
            {article.author?.bio && (
              <div className="author-block">
                {article.author.photo
                  ? <img src={article.author.photo} alt={article.author.name} className="author-av" />
                  : <div className="author-av-init">{article.author.name.charAt(0).toUpperCase()}</div>
                }
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, marginTop: 0 }}>About the journalist</p>
                  {article.author._id
                    ? <Link href={`/author/${article.author._id}`} style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: '#1a3d28', textDecoration: 'none', display: 'block', marginBottom: 6 }}>{article.author.name}</Link>
                    : <p style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: '#1a3d28', marginBottom: 6, marginTop: 0 }}>{article.author.name}</p>
                  }
                  <p style={{ fontFamily: "'Source Serif 4',serif", fontSize: 14, color: '#555', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{article.author.bio}</p>
                </div>
              </div>
            )}

            {/* Engagement */}
            <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 20, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', border: '1px solid #ddd', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f7f4ee')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <span style={{ color: likeStatus?.liked ? '#e74c3c' : '#888' }}>♥</span>
                <span style={{ color: '#666' }}>{article.likeCount || 0}</span>
              </button>
              <button onClick={() => setShowComments(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', border: '1px solid #ddd', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f7f4ee')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <span style={{ color: '#888' }}>💬</span>
                <span style={{ color: '#666' }}>{article.commentCount || 0}</span>
              </button>
            </div>

            {showComments && (
              <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 20, marginBottom: 8 }}>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 600, color: '#1a3d28', marginBottom: 16 }}>Comments ({article.commentCount || 0})</h3>
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: 24 }}>
                  <input type="text" placeholder="Your name *" value={authorName} onChange={e => setAuthorName(e.target.value)} required style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 8, fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' }} />
                  <input type="email" placeholder="Your email (optional)" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, marginBottom: 8, fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' }} />
                  <textarea placeholder="Write your comment..." value={commentText} onChange={e => setCommentText(e.target.value)} required rows={4} style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, resize: 'vertical', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' }} />
                  <button type="submit" style={{ marginTop: 8, padding: '9px 18px', background: '#1a3d28', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Post Comment</button>
                </form>
                {comments && comments.length > 0 && (
                  <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
                    {comments.map((c: any) => (
                      <div key={c._id} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f5f5f5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#1a3d28', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: 13, fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{c.authorName.charAt(0).toUpperCase()}</div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#1a3d28', margin: 0, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{c.authorName}</p>
                            <p style={{ color: '#999', margin: 0, fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>{new Date(c.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p style={{ color: '#333', lineHeight: 1.65, margin: 0, fontSize: 14, fontFamily: "'Source Serif 4',serif", fontWeight: 300 }}>{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Share */}
            <div style={{ borderTop: '1px solid #e8e2d4', paddingTop: 20, paddingBottom: 32, marginTop: 8 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: 12, marginTop: 0 }}>Share this article</p>
              <div className="share-row">
                {[{ l: 'Facebook', c: '#1877f2' }, { l: 'X / Twitter', c: '#000' }, { l: 'WhatsApp', c: '#25d366' }, { l: 'Pinterest', c: '#e60023' }].map(s => (
                  <button key={s.l} onClick={() => handleShare(s.l)} className="share-btn" style={{ borderColor: s.c, color: s.c }}>{s.l}</button>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ══ RELATED ══ */}
        {relatedArticles.length > 0 && (
          <section className="related-wrap">
            <div className="related-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', whiteSpace: 'nowrap' }}>More to read</span>
                <div style={{ flex: 1, height: 1, background: '#d4cfc7' }} />
              </div>
              <div className="related-grid">
                {relatedArticles.map(r => (
                  <Link key={r._id} href={`/article/${r.slug}`} className="related-card">
                    {(r.featuredImage || r.featuredImages?.[0]) && (
                      <div className="related-img-wrap">
                        <img src={r.featuredImage || r.featuredImages[0]} alt={r.title} />
                      </div>
                    )}
                    <div className="related-body">
                      {r.category?.name && <p className="related-cat">{r.category.name}</p>}
                      <h3 className="related-title">{r.title}</h3>
                      <p className="related-date">{new Date(r.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ══ LIGHTBOX ══ */}
      {lbOpen && cur && (
        <div className="lb-wrap" onClick={closeLb}>
          <div className="lb-bar" onClick={e => e.stopPropagation()}>
            <span className="lb-counter">{lbList.length > 1 ? `${lbIndex + 1} / ${lbList.length}` : 'Photo'}</span>
            <button className="lb-x" onClick={closeLb} aria-label="Close">✕</button>
          </div>
          {lbList.length > 1 && (
            <>
              <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); goPrev(); }} aria-label="Previous">‹</button>
              <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); goNext(); }} aria-label="Next">›</button>
            </>
          )}
          <div className="lb-img-area" onClick={e => e.stopPropagation()}>
            {lbLoading && <div className="lb-spin" />}
            <img key={cur.url} src={cur.url} alt={cur.caption || 'Full size photo'}
              className={`lb-img${lbZoom ? ' zoomed' : ''}${lbLoading ? ' loading' : ''}`}
              onLoad={() => setLbLoading(false)}
              onClick={() => setLbZoom(z => !z)}
              draggable={false}
            />
          </div>
          {cur.caption && (
            <div className="lb-cap-area" onClick={e => e.stopPropagation()}>
              <p className="lb-cap-text">{cur.caption}</p>
            </div>
          )}
          {lbList.length > 1 && (
            <div className="lb-thumbs" onClick={e => e.stopPropagation()}>
              {lbList.map((img, i) => (
                <img key={i} src={img.url} alt="" className={`lb-th${i === lbIndex ? ' on' : ''}`}
                  onClick={() => { setLbLoading(true); setLbZoom(false); setLbIndex(i); }} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}