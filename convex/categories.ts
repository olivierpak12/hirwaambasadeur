import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getAllCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query('categories').collect();
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const categories = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('slug'), slug))
      .collect();
    return categories.length > 0 ? categories[0] : null;
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const categoryId = await ctx.db.insert('categories', {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return categoryId;
  },
});

export const updateCategory = mutation({
  args: {
    categoryId: v.id('categories'),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { categoryId, ...updates }) => {
    await ctx.db.patch(categoryId, updates);
    return categoryId;
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, { categoryId }) => {
    await ctx.db.delete(categoryId);
  },
});
