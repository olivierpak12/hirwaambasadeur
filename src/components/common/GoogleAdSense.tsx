'use client';

import { useEffect } from 'react';

interface GoogleAdSenseProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense Display Ad Component
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

  useEffect(() => {
    // Only push ad if we have both publisher ID and slot configured
    if (!publisherId || !slot) {
      return;
    }

    // Delay to ensure DOM is properly laid out
    const timeoutId = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (err) {
          console.error('AdSense error:', err);
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [publisherId, slot]);

  // Don't render if no publisher ID or slot configured
  if (!publisherId || !slot) {
    return null;
  }

  return (
    <div
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
