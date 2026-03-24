import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import LatestNews from '@/components/home/LatestNews';
import TrendingArticles from '@/components/home/TrendingArticles';
import AIStory from '@/components/home/AIStory';
import { HeaderAd } from '@/components/common/AdPlacements';

const Newsletter = dynamic(() => import('@/components/home/Newsletter'));
const JobsSection = dynamic(() => import('@/components/home/JobsSection'));

export const revalidate = 60;

export default function Home() {
  const LoadingFallback = () => (
    <div style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#999', fontSize: '14px' }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f2f2f2', fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif" }}>
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '3px solid #f0f0f0',
            borderTop: '3px solid #bb1919',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      }>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>

          {/* ── Main grid: hero + sidebar ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0',
            paddingTop: '16px',
          }}
            className="home-grid"
          >
            {/* LEFT: hero + secondary stories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

              {/* Hero featured articles */}
              <div style={{
                backgroundColor: 'white',
                borderBottom: '4px solid #bb1919',
              }}>
                <FeaturedArticles />
              </div>

              {/* Latest news row — 3 columns */}
              <div style={{ marginTop: '16px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid #bb1919',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1a1a1a',
                  }}>Latest News</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1px',
                  backgroundColor: '#ddd',
                }}>
                  <LatestNews />
                </div>
              </div>

              {/* Ad strip */}
              <HeaderAd />

            </div>

            {/* RIGHT sidebar: trending */}
            <div className="home-sidebar" style={{
              borderLeft: '1px solid #ddd',
              paddingLeft: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '8px',
                borderBottom: '2px solid #bb1919',
                marginBottom: '12px',
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#1a1a1a',
                }}>More Top Stories</span>
              </div>
              <TrendingArticles />

              {/* AI Story Section */}
              <AIStory />
            </div>
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <JobsSection />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Newsletter />
        </Suspense>

      </Suspense>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 1024px) {
          .home-grid {
            grid-template-columns: 1fr 320px !important;
            align-items: start;
          }
          .home-sidebar {
            display: block !important;
            position: sticky;
            top: 140px;
          }
        }

        @media (max-width: 1023px) {
          .home-sidebar {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 2px solid #bb1919;
            padding-top: 16px;
            margin-top: 16px;
          }
        }
      `}</style>
    </div>
  );
}