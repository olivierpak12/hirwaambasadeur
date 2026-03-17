import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Authors/Journalists
  authors: defineTable({
    name: v.string(),
    email: v.string(),
    bio: v.string(),
    photo: v.optional(v.string()),
    createdAt: v.string(),
  }),

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
    featuredImageId: v.optional(v.id('_storage')),
    featuredImage: v.optional(v.string()),
    categoryId: v.id('categories'),
    authorId: v.id('authors'),
    publishedAt: v.optional(v.string()),
    updatedAt: v.string(),
    views: v.number(),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    tags: v.optional(v.array(v.string())),
    featured: v.boolean(),
  }).index('by_category', ['categoryId']),

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
    createdAt: v.string(),
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
});
