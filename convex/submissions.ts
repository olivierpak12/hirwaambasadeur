import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// SUBMISSIONS

export const getAllSubmissions = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('submissions')
      .order('desc')
      .collect();
  },
});

export const getSubmissionsByStatus = query({
  args: { status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')) },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query('submissions')
      .filter((q) => q.eq(q.field('status'), status))
      .order('desc')
      .collect();
  },
});

export const createSubmission = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    categoryId: v.id('categories'),
    authorName: v.string(),
    authorEmail: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert('submissions', {
      ...args,
      status: 'pending' as const,
      submittedAt: new Date().toISOString(),
    });
    return submissionId;
  },
});

export const approveSubmission = mutation({
  args: {
    submissionId: v.id('submissions'),
    authorId: v.id('authors'),
    slug: v.string(),
    excerpt: v.string(),
  },
  handler: async (ctx, { submissionId, authorId, slug, excerpt }) => {
    const submission = await ctx.db.get(submissionId);
    if (!submission) return null;
    const articleId = await ctx.db.insert('articles', {
      title: submission.title,
      slug,
      content: submission.content,
      excerpt,
      categoryId: submission.categoryId,
      authorId,
      featuredImage: submission.image,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      status: 'published' as const,
      featured: false,
    });
    await ctx.db.patch(submissionId, {
      status: 'approved' as const,
    });
    return { submissionId, articleId };
  },
});

export const rejectSubmission = mutation({
  args: {
    submissionId: v.id('submissions'),
    rejectionReason: v.string(),
  },
  handler: async (ctx, { submissionId, rejectionReason }) => {
    await ctx.db.patch(submissionId, {
      status: 'rejected' as const,
      rejectionReason,
    });
    return submissionId;
  },
});

export const deleteSubmission = mutation({
  args: { submissionId: v.id('submissions') },
  handler: async (ctx, { submissionId }) => {
    await ctx.db.delete(submissionId);
  },
});

// CONTACTS

export const getAllContacts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('contacts')
      .order('desc')
      .collect();
  },
});

export const getContactsByStatus = query({
  args: { status: v.union(v.literal('new'), v.literal('read'), v.literal('responded')) },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query('contacts')
      .filter((q) => q.eq(q.field('status'), status))
      .order('desc')
      .collect();
  },
});

export const createContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactId = await ctx.db.insert('contacts', {
      ...args,
      createdAt: new Date().toISOString(),
      status: 'new' as const,
    });
    return contactId;
  },
});

export const updateContactStatus = mutation({
  args: {
    contactId: v.id('contacts'),
    status: v.union(v.literal('new'), v.literal('read'), v.literal('responded')),
  },
  handler: async (ctx, { contactId, status }) => {
    await ctx.db.patch(contactId, { status });
    return contactId;
  },
});

export const deleteContact = mutation({
  args: { contactId: v.id('contacts') },
  handler: async (ctx, { contactId }) => {
    await ctx.db.delete(contactId);
  },
});
