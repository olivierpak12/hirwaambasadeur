// GOOGLE ADSENSE INTEGRATION EXAMPLES
// Copy and paste these examples into your pages

// ═══════════════════════════════════════════════════════════════════════════
// 1. SIMPLE USAGE - Just Import and Use
// ═══════════════════════════════════════════════════════════════════════════

// In any component file:
import { HeaderAd, SidebarAd, ArticleMiddleAd, FooterAd } from '@/components/common/AdPlacements';

export default function MyPage() {
  return (
    <>
      <HeaderAd />
      <main>Your content here</main>
      <SidebarAd />
      <ArticleMiddleAd />
      <FooterAd />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. HOMEPAGE EXAMPLE (Already implemented)
// ═══════════════════════════════════════════════════════════════════════════

import { HeaderAd, SidebarAd } from '@/components/common/AdPlacements';

export default function HomePage() {
  return (
    <div>
      <Header />
      
      {/* Ad at the top */}
      <HeaderAd />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <main>
          {/* Your main content */}
          <CategorySection articles={articles} />
        </main>
        
        <aside>
          {/* Ad in sidebar */}
          <SidebarAd />
          <TrendingSidebar />
        </aside>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. ARTICLE PAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

import { ArticleMiddleAd } from '@/components/common/AdPlacements';

export default function ArticlePage() {
  const { article } = useArticle();
  
  return (
    <article style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>{article.title}</h1>
      <p>{article.excerpt}</p>
      
      {/* Ad after first paragraph */}
      <ArticleMiddleAd />
      
      <div>{article.body}</div>
      
      {/* Another ad in the middle */}
      <ArticleMiddleAd />
      
      {/* Related articles */}
      <RelatedArticles />
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. FOOTER EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

import { FooterAd } from '@/components/common/AdPlacements';

export default function Footer() {
  return (
    <footer>
      {/* Ad above footer links */}
      <FooterAd />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <div>
            <h4>About</h4>
            <ul>{/* links */}</ul>
          </div>
          <div>
            <h4>Content</h4>
            <ul>{/* links */}</ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>{/* links */}</ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>{/* links */}</ul>
          </div>
        </div>
      </div>
      
      <div style={{ background: '#f0f0f0', textAlign: 'center', padding: '32px' }}>
        <p>&copy; 2026 Hirwa Ambassadeur. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. CUSTOM AD COMPONENT WITH SPECIFIC UNIT ID
// ═══════════════════════════════════════════════════════════════════════════

import GoogleAdSense from '@/components/common/GoogleAdSense';

export default function CustomAdPage() {
  // Use specific ad unit ID from your AdSense dashboard
  const headerUnitId = process.env.NEXT_PUBLIC_ADSENSE_HEADER_UNIT;
  
  return (
    <>
      {/* Header ad with specific unit */}
      <GoogleAdSense 
        slot={headerUnitId}
        format="horizontal"
        responsive={true}
        style={{ marginBottom: '24px' }}
      />
      
      {/* Vertical rectangle ad */}
      <GoogleAdSense 
        slot="1234567890"
        format="vertical"
        responsive={false}
        style={{ width: '300px', height: '250px' }}
      />
      
      {/* Auto-format ad (recommended) */}
      <GoogleAdSense 
        slot="9876543210"
        format="auto"
        responsive={true}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. CATEGORY PAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

import { HeaderAd, SidebarAd } from '@/components/common/AdPlacements';

export default function CategoryPage({ slug }: { slug: string }) {
  const articles = useQuery(api.articles.getByCategory, { slug });
  
  return (
    <div>
      {/* Ad at top */}
      <HeaderAd />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <h1>{slug}</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          {/* Articles grid */}
          <div className="articles-grid">
            {articles?.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
          
          {/* Sidebar with ad */}
          <aside>
            <SidebarAd />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. SEARCH RESULTS PAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

import { ArticleMiddleAd } from '@/components/common/AdPlacements';

export default function SearchResults({ query }: { query: string }) {
  const [search, setSearch] = useState(query);
  const results = useQuery(api.articles.search, { query: search });
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <h1>Search Results for "{query}"</h1>
      
      {results && results.length === 0 && <p>No results found</p>}
      
      {results && results.map((result, index) => (
        <div key={result._id}>
          <ArticleCard article={result} />
          
          {/* Show ad after every 3 results */}
          {(index + 1) % 3 === 0 && <ArticleMiddleAd />}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. CONDITIONAL ADS (Show ads only when configured)
// ═══════════════════════════════════════════════════════════════════════════

import { HeaderAd, SidebarAd } from '@/components/common/AdPlacements';

export default function ConditionalAdsPage() {
  const hasAdsEnabled = !!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  
  return (
    <div>
      {/* Only show ads if Google AdSense ID is configured */}
      {hasAdsEnabled && <HeaderAd />}
      
      <main>
        {/* Main content */}
      </main>
      
      {/* Sidebar with conditional ads */}
      <aside>
        {hasAdsEnabled && <SidebarAd />}
        <TrendingSidebar />
      </aside>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. AUTHOR PAGE EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

import { HeaderAd, ArticleMiddleAd } from '@/components/common/AdPlacements';

export default function AuthorPage({ id }: { id: string }) {
  const author = useQuery(api.authors.getById, { id });
  const articles = useQuery(api.articles.getByAuthor, { authorId: id });
  
  return (
    <div>
      <HeaderAd />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: '32px', marginBottom: '48px' }}>
          {/* Author bio */}
          <aside style={{ flex: '0 0 300px' }}>
            <img 
              src={author?.photoUrl} 
              alt={author?.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
            <h2>{author?.name}</h2>
            <p>{author?.bio}</p>
          </aside>
          
          {/* Author's articles */}
          <main style={{ flex: 1 }}>
            <h3>Articles by {author?.name}</h3>
            {articles?.map((article, index) => (
              <div key={article._id}>
                <ArticleCard article={article} />
                {/* Show ad after 2nd article */}
                {index === 1 && <ArticleMiddleAd />}
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTES:
// ═══════════════════════════════════════════════════════════════════════════
//
// 1. All ad components are 'use client' - they run in browser
// 2. Ads won't show until Google AdSense Publisher ID is set
// 3. Placeholder ads show during development when ID isn't configured
// 4. AdSense takes 24-48 hours to start serving ads after approval
// 5. Components handle responsive design automatically
// 6. You can customize styling with the 'style' prop
// 7. Use specific unit IDs for better analytics and control
// 8. Mix ad placements for optimal user experience
// 9. Don't overload pages with too many ads (Google's policy)
// 10. Monitor performance in AdSense dashboard
//
// ═══════════════════════════════════════════════════════════════════════════
