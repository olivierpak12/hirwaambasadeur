import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAllPermissionRequests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('writingPermissions').collect();
  },
});

export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('writingPermissions')
      .filter((q) => q.eq(q.field('status'), 'pending'))
      .collect();
  },
});

export const getApprovedWriters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('writingPermissions')
      .filter((q) => q.eq(q.field('status'), 'approved'))
      .collect();
  },
});

export const getPermissionByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query('writingPermissions')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();
  },
});

export const requestWritingPermission = mutation({
  args: {
    writerName: v.string(),
    email: v.string(),
    category: v.string(),
    reason: v.string(),
    credentials: v.optional(v.string()),
  },
  handler: async (ctx, { writerName, email, category, reason, credentials }) => {
    const existing = await ctx.db
      .query('writingPermissions')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing && existing.status === 'pending') {
      throw new Error('You already have a pending permission request');
    }

    const id = await ctx.db.insert('writingPermissions', {
      writerName,
      email,
      category,
      reason,
      credentials,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    });

    return id;
  },
});

export const approvePermission = mutation({
  args: {
    id: v.id('writingPermissions'),
    approvedBy: v.string(),
    expiryDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, approvedBy, expiryDate }) => {
    await ctx.db.patch(id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: approvedBy,
      approvedUntil: expiryDate,
    });
    return id;
  },
});

export const rejectPermission = mutation({
  args: {
    id: v.id('writingPermissions'),
    rejectReason: v.string(),
    rejectedBy: v.string(),
  },
  handler: async (ctx, { id, rejectReason, rejectedBy }) => {
    await ctx.db.patch(id, {
      status: 'rejected',
      rejectionReason: rejectReason,
      reviewedAt: new Date().toISOString(),
      reviewedBy: rejectedBy,
    });
    return id;
  },
});

export const revokePermission = mutation({
  args: { id: v.id('writingPermissions') },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      status: 'rejected',
      rejectionReason: 'Permission revoked by admin',
      reviewedAt: new Date().toISOString(),
    });
    return id;
  },
});

export const reReviewRequest = mutation({
  args: { id: v.id('writingPermissions') },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      status: 'pending',
      reviewedAt: undefined,
      reviewedBy: undefined,
      rejectionReason: undefined,
    });
    return id;
  },
});
