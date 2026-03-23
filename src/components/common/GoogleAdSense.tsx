'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdSenseProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
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

    // Use Intersection Observer to lazy-load ads only when near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasProcessedRef.current) {
            hasProcessedRef.current = true;
            // Use requestIdleCallback if available for better performance
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(() => {
                if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
                  try {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                  } catch (err) {
                    console.error('AdSense error:', err);
                  }
                }
              });
            } else {
              // Fallback to setTimeout for older browsers
              setTimeout(() => {
                if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
                  try {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                  } catch (err) {
                    console.error('AdSense error:', err);
                  }
                }
              }, 100);
            }
            observer.unobserve(entry.target);
          }
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
        }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
