import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAllJobs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('jobs')
      .collect();
  },
});

export const getJobById = query({
  args: { jobId: v.string() },
  handler: async (ctx, { jobId }) => {
    // Accept both normalized Convex IDs and legacy string IDs for job routes.
    const normalizedId = ctx.db.normalizeId('jobs', jobId);
    if (normalizedId) {
      return await ctx.db.get(normalizedId);
    }

    // Fallback: try to resolve by a stored id-like string in _id field if the literal doesn't match
    const results = await ctx.db
      .query('jobs')
      .filter((q) => q.eq(q.field('_id'), jobId))
      .collect();
    return results.length > 0 ? results[0] : null;
  },
});

export const getOpenJobs = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('jobs')
      .filter((q) => q.eq(q.field('status'), 'open'))
      .collect();
  },
});

export const createJob = mutation({
  args: {
    title: v.string(),
    department: v.string(),
    type: v.union(v.literal('Full-time'), v.literal('Part-time'), v.literal('Contract'), v.literal('Freelance')),
    location: v.string(),
    description: v.string(),
    requirements: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    status: v.union(v.literal('open'), v.literal('closed')),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const jobId = await ctx.db.insert('jobs', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return jobId;
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id('jobs'),
    title: v.optional(v.string()),
    department: v.optional(v.string()),
    type: v.optional(v.union(v.literal('Full-time'), v.literal('Part-time'), v.literal('Contract'), v.literal('Freelance'))),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    requirements: v.optional(v.array(v.string())),
    benefits: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal('open'), v.literal('closed'))),
  },
  handler: async (ctx, { jobId, ...updates }) => {
    await ctx.db.patch(jobId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return jobId;
  },
});

export const deleteJob = mutation({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    await ctx.db.delete(jobId);
  },
});

export const getJobApplications = query({
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    return await ctx.db
      .query('jobApplications')
      .filter((q) => q.eq(q.field('jobId'), jobId))
      .collect();
  },
});

export const getAllApplications = query({
  handler: async (ctx) => {
    const applications = await ctx.db
      .query('jobApplications')
      .order('desc')
      .collect();

    // Enrich with job details
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const job = await ctx.db.get(app.jobId);
        return {
          ...app,
          jobTitle: job?.title || 'Unknown Job',
          jobDepartment: job?.department || '',
        };
      })
    );

    return enriched;
  },
});

export const createJobApplication = mutation({
  args: {
    jobId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
    resumeStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const normalizedJobId = ctx.db.normalizeId('jobs', args.jobId);
    if (!normalizedJobId) {
      throw new Error(`Invalid jobId: ${args.jobId}`);
    }

    const appId = await ctx.db.insert('jobApplications', {
      jobId: normalizedJobId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      coverLetter: args.coverLetter,
      resumeStorageId: args.resumeStorageId,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    });

    return appId;
  },
});

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id('jobApplications'),
    status: v.union(v.literal('pending'), v.literal('approved'), v.literal('rejected')),
  },
  handler: async (ctx, { applicationId, status }) => {
    await ctx.db.patch(applicationId, {
      status,
      reviewedAt: new Date().toISOString(),
    });
    return applicationId;
  },
});
