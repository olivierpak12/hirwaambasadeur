import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import LatestNews from '@/components/home/LatestNews';
import TrendingArticles from '@/components/home/TrendingArticles';
// Lazy load below-the-fold components
const Newsletter = dynamic(() => import('@/components/home/Newsletter'));
const JobsSection = dynamic(() => import('@/components/home/JobsSection'));

export default function Home() {
  const LoadingFallback = () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bb1919]"></div>
        </div>
      }>
        {/* Breaking News Banner */}
        <div className="bg-[#bb1919] text-white border-t border-white/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-1.5">
              <span className="bg-white text-[#bb1919] text-[11px] font-bold px-1.5 py-0.5 uppercase tracking-wide shrink-0">
                Breaking
              </span>
              <span className="text-sm">Latest updates from Africa and beyond</span>
            </div>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Main featured + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t-2 border-[#bb1919]">
            <div className="lg:col-span-2 pr-0 lg:pr-5 border-r-0 lg:border-r border-gray-200">
              <FeaturedArticles />
            </div>
            <div className="pl-0 lg:pl-5 mt-4 lg:mt-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2 pb-2 border-b border-gray-200">
                More Top Stories
              </p>
              <TrendingArticles />
            </div>
          </div>

          {/* 3-column latest news row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-2 border-[#bb1919] mt-5">
            <LatestNews />
          </div>

          {/* Advertisement */}
          <div className="my-4 border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center h-12">
            <span className="text-[11px] text-gray-400 uppercase tracking-widest">Advertisement</span>
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <JobsSection />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Newsletter />
        </Suspense>
      </Suspense>
    </div>
  );
}