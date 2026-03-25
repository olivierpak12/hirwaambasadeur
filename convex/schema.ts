import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Authors/Journalists (keeping table name as 'authors' for backward compatibility)
  authors: defineTable({
    name: v.string(),
    email: v.string(),
    bio: v.string(),
    photo: v.optional(v.string()),
    photoStorageId: v.optional(v.id('_storage')),
    canCreateArticles: v.optional(v.boolean()),
    canEditPhotos: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
  }).index('by_email', ['email']),

  // News Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    createdAt: v.string(),
  }),

  // Articles
  articles: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    // ✅ Direct URL strings (for Unsplash or other external images)
    featuredImage: v.optional(v.string()),
    // ✅ Store multiple featured image storageIds
    featuredImageIds: v.optional(v.array(v.id('_storage'))),
    // ✅ Backward compatibility for existing articles
    featuredImageId: v.optional(v.id('_storage')),
    images: v.optional(v.array(v.object({
      storageId: v.id('_storage'),
      caption: v.optional(v.string()),
    }))),
    categoryId: v.id('categories'),
    authorId: v.id('authors'),
    publishedAt: v.optional(v.string()),
    updatedAt: v.string(),
    views: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    tags: v.optional(v.array(v.string())),
    featured: v.boolean(),
    youtubeUrl: v.optional(v.string()),
  }).index('by_category', ['categoryId']),

  // Article Comments
  comments: defineTable({
    articleId: v.id('articles'),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    content: v.string(),
    createdAt: v.string(),
    parentId: v.optional(v.id('comments')), // For nested replies
  }).index('by_article', ['articleId']),

  // Article Likes
  likes: defineTable({
    articleId: v.id('articles'),
    userId: v.optional(v.string()), // Could be IP or session ID for anonymous users
    createdAt: v.string(),
  }).index('by_article', ['articleId']),

  // Article Submissions
  submissions: defineTable({
    title: v.string(),
    content: v.string(),
    categoryId: v.id('categories'),
    authorName: v.string(),
    authorEmail: v.string(),
    image: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    submittedAt: v.string(),
    rejectionReason: v.optional(v.string()),
  }).index('by_status', ['status']),

  // Contact Messages
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.string(),
    status: v.union(v.literal('new'), v.literal('read'), v.literal('responded')),
  }).index('by_status', ['status']),

  // Newsletter subscriptions
  subscriptions: defineTable({
    email: v.string(),
    subscribedAt: v.string(),
    source: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    verificationCode: v.optional(v.string()),
    codeExpiresAt: v.optional(v.string()),
  }).index('by_email', ['email']),

  // Advertisement placements
  advertisements: defineTable({
    title: v.string(),
    placement: v.union(
      v.literal('header_banner'),
      v.literal('sidebar'),
      v.literal('footer'),
      v.literal('article_middle')
    ),
    imageUrl: v.string(),
    altText: v.string(),
    linkUrl: v.optional(v.string()),
    isActive: v.boolean(),
    views: v.number(),
    clicks: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_placement', ['placement']),

  // Writing Permissions Requests
  writingPermissions: defineTable({
    writerName: v.string(),
    email: v.string(),
    category: v.string(),
    reason: v.string(),
    credentials: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    requestedAt: v.string(),
    reviewedAt: v.optional(v.string()),
    reviewedBy: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
    approvedUntil: v.optional(v.string()),
  }).index('by_status', ['status']).index('by_email', ['email']),

  // Admin Users for Authentication
  admins: defineTable({
    email: v.string(),
    passwordHash: v.string(), // bcrypt hash
    name: v.string(),
    role: v.union(v.literal('super_admin'), v.literal('admin'), v.literal('editor')),
    isActive: v.boolean(),
    lastLogin: v.optional(v.string()),
    createdAt: v.string(),
  }).index('by_email', ['email']),

  // Admin Sessions for login state
  adminSessions: defineTable({
    adminId: v.id('admins'),
    token: v.string(),
    expiresAt: v.string(),
    createdAt: v.string(),
  }).index('by_token', ['token']).index('by_admin', ['adminId']),

  // Job Postings for Hiring
  jobs: defineTable({
    title: v.string(),
    department: v.string(),
    type: v.union(v.literal('Full-time'), v.literal('Part-time'), v.literal('Contract'), v.literal('Freelance')),
    location: v.string(),
    description: v.string(),
    requirements: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    status: v.union(v.literal('open'), v.literal('closed')),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index('by_status', ['status']),

  // Job Applications
  jobApplications: defineTable({
    jobId: v.id('jobs'),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
    resumeStorageId: v.optional(v.id('_storage')),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
    appliedAt: v.string(),
    reviewedAt: v.optional(v.string()),
  }).index('by_job', ['jobId']).index('by_status', ['status']),

  // AI Generated Funny Stories
  aiStories: defineTable({
    englishText: v.string(),
    kinyarwandaText: v.string(),
    frenchText: v.string(),
    generatedAt: v.string(),
    isActive: v.boolean(),
  }).index('by_active', ['isActive']),
});