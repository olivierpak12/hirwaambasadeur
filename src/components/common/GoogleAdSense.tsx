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
    // Check if adsbygoogle is available and push ad
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  // Don't render if no publisher ID configured
  if (!publisherId) {
    return null;
  }

  return (
    <div
      className={`google-adsense-container ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
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
