<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Hirwa Ambassadeur - Professional News Website

This is a Next.js-based professional online news website built with modern technologies.

### Technology Stack
- **Frontend**: Next.js 14+ with TypeScript and Tailwind CSS
- **Backend**: Convex (Backend-as-a-Service)
- **Database**: Convex DB (NoSQL)
- **File Storage**: Convex Storage
- **Authentication**: Ready for Convex Auth

### Project Features
1. Homepage with breaking news, featured articles, trending sidebar
2. News Categories: Politics, Business, Technology, Health, Sports, Entertainment, Africa, World
3. Full article pages with author profiles, sharing buttons, related articles
4. Author profiles displaying journalist information and their articles
5. Submit news page for journalists and contributors
6. Contact form for readers
7. Full-text search functionality
8. Admin dashboard for managing articles, authors, categories, submissions
9. Advertisement system (Google AdSense integration ready)
10. Responsive design for mobile, tablet, desktop
11. SEO optimized with meta tags and structured data
12. Newsletter subscription capability
13. AI-generated funny stories (daily, multilingual: English/Kinyarwanda/French)

### Key Pages Created
- `/` - Homepage with featured content
- `/article/[slug]` - Individual article pages
- `/categories/[slug]` - Category-specific news
- `/author/[id]` - Journalist profiles
- `/search` - Search functionality
- `/submit` - Article submission form
- `/contact` - Reader contact form
- `/dashboard/admin` - Admin management panel
- `/admin` - Admin dashboard with AI story management

### Development Commands
- `npm run dev` - Start Next.js development server (port 3000)
- `npx convex dev` - Start Convex backend development
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint checks

### Setup Instructions
1. Install dependencies: `npm install`
2. Ensure Convex is installed: `npm install convex`
3. Initialize Convex: `npx convex init` (requires convex.dev account)
4. Start both dev servers:
   - Terminal 1: `npm run dev`
   - Terminal 2: `npx convex dev`
5. Access site at http://localhost:3000

### Code Guidelines
- Use TypeScript for type safety throughout
- Follow Next.js best practices
- Use Tailwind CSS for all styling
- Use server components by default, only use 'use client' when needed
- Organize components by feature in subdirectories
- Keep database queries in Convex functions
- Update README.md when adding significant features

### Convex Database Schema
Tables created:
- `articles` - News articles with metadata
- `authors` - Journalist profiles
- `categories` - News categories
- `submissions` - User-submitted articles for review
- `contacts` - Reader messages
- `advertisements` - Ad placements and content
- `aiStories` - AI-generated funny stories in multiple languages

### AI Stories Feature
The website includes an AI-powered funny story generator that creates daily multilingual content:

- **Languages**: English, Kinyarwanda, and French
- **Generation**: Manual via admin panel or automated via API
- **Display**: Featured in homepage sidebar with language switching
- **Management**: Admin interface at `/admin` for story generation and history

To enable automatic 24-hour generation:
1. Set `AI_STORY_API_KEY` environment variable
2. Configure a cron job to call `POST /api/generate-ai-story` with the API key
3. For AI integration, replace placeholder functions with actual OpenAI/Google Translate APIs
- All pages use mock data for demonstration
- Replace mock data with real Convex queries when implementing
- Admin dashboard is accessible at `/dashboard/admin`
- Advertisement sections are placeholders ready for Google AdSense
- Site is fully responsive and mobile-first design
- All form submissions currently use mock handlers

