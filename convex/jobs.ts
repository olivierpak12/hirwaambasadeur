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
  args: { jobId: v.id('jobs') },
  handler: async (ctx, { jobId }) => {
    return await ctx.db.get(jobId);
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
    jobId: v.id('jobs'),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    coverLetter: v.optional(v.string()),
    resumeStorageId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const appId = await ctx.db.insert('jobApplications', {
      ...args,
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
