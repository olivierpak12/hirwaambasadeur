# Hirwa Ambassadeur - Professional News Website

A modern, fully-responsive professional news website built with Next.js, React, TypeScript, Tailwind CSS, and Convex backend.

## 🎯 Features

### Core Features
- **Homepage** - Breaking news section, featured stories, latest news, trending articles
- **News Categories** - Politics, Business, Technology, Health, Sports, Entertainment, Africa News, World News
- **Article Pages** - Full article display with author info, sharing buttons, related articles
- **Author Profiles** - Journalist profiles with article listings and statistics
- **Submit News** - Form for journalists and users to submit articles for review
- **Contact Page** - Reader contact form with multiple contact methods
- **Search Function** - Full-text search across all articles and categories
- **Admin Dashboard** - Manage articles, submissions, authors, categories, messages, and ads

### Advanced Features
- **Advertisement System** - Google AdSense integration, banner ads, sidebar ads, article-inline ads
- **SEO Optimized** - Meta tags, Open Graph, structured data, sitemaps
- **Responsive Design** - Fully responsive on mobile, tablet, and desktop
- **Newsletter Signup** - Email subscription capability
- **User Submissions** - Article review and approval workflow
- **Analytics Ready** - View tracking for articles

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3+
- **Backend**: Convex (Backend-as-a-Service)
- **Database**: Convex DB (NoSQL)
- **File Storage**: Convex Storage
- **Authentication**: Ready for Convex Auth integration

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── article/[slug]/           # Article detail page
│   ├── categories/[slug]/        # Category pages
│   ├── author/[id]/              # Author profile pages
│   ├── search/                   # Search functionality
│   ├── contact/                  # Contact form
│   ├── submit/                   # News submission form
│   └── dashboard/admin/          # Admin dashboard
├── components/
│   ├── common/
│   │   ├── Header.tsx           # Main navigation header
│   │   └── Footer.tsx           # Footer with links
│   ├── home/
│   │   ├── FeaturedArticles.tsx # Featured section
│   │   ├── LatestNews.tsx       # Latest articles grid
│   │   └── TrendingArticles.tsx # Trending sidebar
│   └── article/
│       └── ArticleDisplay.tsx   # Article display component
├── lib/                          # Utility functions
├── types/
│   └── index.ts                 # TypeScript type definitions
├── styles/
│   └── globals.css              # Global styles
└── convex/
    ├── schema.ts                # Database schema
    ├── articles.ts              # Article queries/mutations
    ├── authors.ts               # Author queries/mutations
    ├── categories.ts            # Category queries/mutations
    └── submissions.ts           # Submissions & contacts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd hirwaambassadeur
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Convex**
   ```bash
   npm install convex
   ```

4. **Initialize Convex** (Create free account at convex.dev)
   ```bash
   npx convex init
   ```

5. **Start development servers**
   - Terminal 1: Start Next.js dev server
     ```bash
     npm run dev
     ```
   - Terminal 2: Start Convex dev server (in same directory)
     ```bash
     npx convex dev
     ```

6. **Open in browser**
   - Main site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/dashboard/admin

## 📖 Usage

### Pages Available

| Route | Description |
|-------|------------|
| `/` | Homepage with breaking news and featured articles |
| `/article/[slug]` | Full article page with sharing and related articles |
| `/categories/[slug]` | Category-specific news feed |
| `/author/[id]` | Author profile page with all their articles |
| `/search?q=[query]` | Search results page |
| `/submit` | Article submission form for journalists |
| `/contact` | Contact form for readers |
| `/dashboard/admin` | Admin panel for managing content |

### Admin Functions

The admin dashboard allows you to:
- ✏️ Create, edit, and delete articles
- 👥 Manage authors and journalists
- 📂 Organize news into categories
- 📝 Review and approve article submissions
- 💬 Respond to reader messages
- 📢 Manage advertisements

## 🎨 Customization

### Update Site Information
Edit `src/app/layout.tsx` to update:
- Site title and description
- Meta tags and SEO information
- Site name in header/footer

### Brand Colors
Update color classes in components (currently using Tailwind blue/slate):
- Primary: `blue-600`, `blue-700`
- Secondary: `slate-900`, `slate-800`

### Categories
Modify categories in:
- `src/components/common/Header.tsx`
- `src/app/categories/[slug]/page.tsx`

## 🔌 Convex Backend Setup

### Database Schema
The Convex schema includes tables for:
- `articles` - News articles
- `authors` - Journalists/writers
- `categories` - News categories
- `submissions` - Submitted articles for review
- `contacts` - Reader messages
- `advertisements` - Ad placements

### Available Convex Functions

**Articles:**
- `getPublishedArticles` - Paginated list of published articles
- `getFeaturedArticles` - Featured articles
- `getTrendingArticles` - Most viewed articles
- `getArticleBySlug` - Single article by slug
- `createArticle`, `updateArticle`, `deleteArticle` - CRUD operations
- `searchArticles` - Full-text search
- `incrementArticleViews` - Track article views

**Authors:** CRUD operations for journalist profiles

**Categories:** CRUD operations for news categories

**Submissions:** Handle article submissions and approval workflow

## 🌐 SEO Optimization

The site includes:
- Meta title and description
- Open Graph tags for social sharing
- Keywords optimization
- Structured heading hierarchy
- Site-wide SEO metadata

Add to `src/app/layout.tsx` for:
- Google Analytics
- Sitemaps
- Robots.txt
- Canonical URLs

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 768px - 1024px
- Desktop: > 1024px

All components use `md:` and `lg:` Tailwind breakpoints for responsive layouts.

## 💳 Advertisement System

Ready for integration with:
- **Google AdSense** - Banner, sidebar, and article-inline ads
- **Custom Ad system** - Convex-backed ad management through admin dashboard

Ad placements:
- Header banner
- Sidebar (300px)
- Article middle (between paragraphs)
- Footer banner

## 🔐 Security Notes

- Authentication ready with Convex Auth
- Input validation on forms
- CORS configured for API calls
- Add environment variables for sensitive data

## 📦 Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

To add new features:
1. Create new components in `src/components/`
2. Add new pages in `src/app/`
3. Update Convex functions as needed
4. Test on multiple devices

## 📝 License

This project is available for personal and commercial use.

## 🎉 Demo Content

The site includes mock data for demonstration. Replace with real content by:
1. Setting up Convex database
2. Using admin dashboard to create articles
3. Connecting to real data sources
4. Configuring authentication

---

**Built with ❤️ for professional news reporting**

For support and updates, visit [Convex Documentation](https://docs.convex.dev)
#   h i r w a a m b a s a d e u r  
 #   h i r w a a m b a s a d e u r  
 #   h i r w a a m b a s a d e u r  
 