'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdSenseProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle' | 'fluid';
  layout?: 'in-article' | 'in-feed' | 'in-article-top' | 'in-article-bottom';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense Display Ad Component with Intersection Observer
 * Lazy loads ads only when they're about to become visible
 * 
 * Usage:
 * <GoogleAdSense slot="1234567890" />
 * <GoogleAdSense slot="1234567890" format="horizontal" />
 */
export default function GoogleAdSense({
  slot,
  format = 'auto',
  layout,
  responsive = true,
  style = {},
  className = '',
}: GoogleAdSenseProps) {
  const publisherId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Only push ad if we have both publisher ID and slot configured
    if (!publisherId || !slot || !containerRef.current) {
      return;
    }

    let retryCount = 0;
    const MAX_RETRIES = 6;

    // Use Intersection Observer to lazy-load ads only when near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasProcessedRef.current) {
            return;
          }

          const width = containerRef.current?.getBoundingClientRect().width || 0;
          if (width <= 0 && retryCount < MAX_RETRIES) {
            retryCount += 1;
            setTimeout(() => {
              observer.unobserve(entry.target);
              observer.observe(entry.target);
            }, 150);
            return;
          }

          if (width <= 0) {
            // Prevent endless retries if container cannot resolve size
            console.warn('GoogleAdSense: ad container width is zero, skipping insertion.');
            observer.unobserve(entry.target);
            return;
          }

          const pushAd = (attempt = 0) => {
            const container = containerRef.current;
            if (!container) {
              return;
            }

            const containerWidth = container.getBoundingClientRect().width;
            const insEl = container.querySelector<HTMLElement>('ins.adsbygoogle');
            const insWidth = insEl?.getBoundingClientRect().width || containerWidth;

            if ((containerWidth <= 0 || insWidth <= 0) && attempt < 12) {
              setTimeout(() => pushAd(attempt + 1), 180);
              return;
            }

            if (containerWidth <= 0 || insWidth <= 0) {
              console.warn('GoogleAdSense: final slot width is zero, aborting push.');
              hasProcessedRef.current = true;
              observer.unobserve(entry.target);
              return;
            }

            const doPush = () => {
              if (typeof window === 'undefined') {
                return;
              }

              if (!(window as any).adsbygoogle) {
                if (attempt < 8) {
                  setTimeout(() => pushAd(attempt + 1), 250);
                  return;
                }

                console.warn('GoogleAdSense: adsbygoogle script not yet loaded after retries, aborting push.');
                hasProcessedRef.current = true;
                observer.unobserve(entry.target);
                return;
              }

              const insEl = container.querySelector<HTMLElement>('ins.adsbygoogle');
              if (insEl?.getAttribute('data-adsbygoogle-status') === 'done') {
                hasProcessedRef.current = true;
                observer.unobserve(entry.target);
                return;
              }

              try {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                const insElDone = container.querySelector<HTMLElement>('ins.adsbygoogle');
                if (insElDone) {
                  insElDone.dataset.adsbygoogleStatus = 'done';
                }
                hasProcessedRef.current = true;
                observer.unobserve(entry.target);
              } catch (err: any) {
                const message = err?.message || String(err);
                if (message.includes('already have ads in them')) {
                  // Another routine already filled this slot; mark done and skip.
                  hasProcessedRef.current = true;
                  observer.unobserve(entry.target);
                  return;
                }
                if (message.includes('No slot size')) {
                  if (attempt < 3) {
                    setTimeout(() => pushAd(attempt + 1), 250);
                    return;
                  }
                  console.warn('GoogleAdSense: slot size still 0 after retries, dropping ad render.');
                  hasProcessedRef.current = true;
                  observer.unobserve(entry.target);
                  return;
                }
                console.error('AdSense error:', err);
                hasProcessedRef.current = true;
                observer.unobserve(entry.target);
              }
            };

            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(doPush);
            } else {
              setTimeout(doPush, 100);
            }
          };

          pushAd();
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before ad becomes visible
      }
    );

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [publisherId, slot]);

  // Don't render if no publisher ID or slot configured
  if (!publisherId || !slot) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`google-adsense-container ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: format === 'horizontal' ? '90px' : format === 'vertical' ? '600px' : '250px',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...(!responsive && { width: '100%', maxWidth: '728px', height: '90px' }),
          ...((format === 'fluid' || layout === 'in-article') ? { width: '100%', height: 'auto' } : {}),
        }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive={responsive}
        data-adtest={process.env.NODE_ENV !== 'production' ? 'on' : undefined}
      />
    </div>
  );
}
