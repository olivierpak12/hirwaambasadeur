import { Suspense } from 'react';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import LatestNews from '@/components/home/LatestNews';
import TrendingArticles from '@/components/home/TrendingArticles';
import Newsletter from '@/components/home/Newsletter';
import { HeaderAd, SidebarAd } from '@/components/common/AdPlacements';
import JobsSection from '@/components/home/JobsSection';
import CategoryFilter from '@/components/home/CategoryFilter';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <CategoryFilter />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <FeaturedArticles />
              <LatestNews />
            </div>
            <div className="lg:col-span-1">
              <TrendingArticles />
              <SidebarAd />
            </div>
          </div>
        </div>
        <JobsSection />
        <Newsletter />
      </Suspense>
    </div>
  );
}