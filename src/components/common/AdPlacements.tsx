'use client';

import GoogleAdSense from './GoogleAdSense';

/**
 * Header Banner Advertisement
 * Displayed at the top of the page
 */
export function HeaderAd() {
  const unitId = process.env.NEXT_PUBLIC_ADSENSE_HEADER_UNIT;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderBottom: '1px solid rgba(201,168,76,0.1)',
      padding: '12px 0',
      marginBottom: '24px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '16px', paddingRight: '16px' }}>
        <GoogleAdSense
          slot={unitId}
          format="horizontal"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

/**
 * Sidebar Advertisement
 * Displayed in the right sidebar
 */
export function SidebarAd() {
  const unitId = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_UNIT;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(201,168,76,0.1)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
    }}>
      <p style={{
        fontSize: '12px',
        color: '#5a8a6a',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '12px',
        margin: 0,
      }}>
        Advertisement
      </p>
      <GoogleAdSense
        slot={unitId}
        format="vertical"
        style={{ minHeight: '250px' }}
      />
    </div>
  );
}

/**
 * Footer Advertisement
 * Displayed in the footer section
 */
export function FooterAd() {
  const unitId = process.env.NEXT_PUBLIC_ADSENSE_FOOTER_UNIT;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      borderTop: '1px solid rgba(201,168,76,0.1)',
      padding: '24px 16px',
      marginTop: '32px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{
          fontSize: '12px',
          color: '#5a8a6a',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}>
          Advertisement
        </p>
        <GoogleAdSense
          slot={unitId}
          format="horizontal"
          style={{ minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

/**
 * Article Middle Advertisement
 * Displayed inline within article content
 */
export function ArticleMiddleAd() {
  const unitId = process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_UNIT || '2284414068';

  return (
    <div style={{
      margin: '32px 0',
      padding: '20px',
      background: 'rgba(255,255,255,0.02)',
      borderLeft: '3px solid rgba(201,168,76,0.3)',
      borderRadius: '4px',
    }}>
      <p style={{
        fontSize: '11px',
        color: '#5a8a6a',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '12px',
        margin: 0,
      }}>
        Advertisement
      </p>
      <GoogleAdSense
        slot={unitId}
        format="fluid"
        layout="in-article"
        responsive={true}
        style={{ minHeight: '150px' }}
      />
    </div>
  );
}
