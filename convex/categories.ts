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

export const seedCategories = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('categories').collect();
    if (existing.length > 0) return; // Already seeded

    const categories = [
      { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
      { name: 'Business', slug: 'business', description: 'Business and economic news' },
      { name: 'Technology', slug: 'technology', description: 'Technology and innovation news' },
      { name: 'Health', slug: 'health', description: 'Health and medical news' },
      { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
      { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and celebrity news' },
      { name: 'Africa', slug: 'africa', description: 'News from Africa' },
      { name: 'World', slug: 'world', description: 'International news' },
    ];

    for (const cat of categories) {
      await ctx.db.insert('categories', {
        ...cat,
        createdAt: new Date().toISOString(),
      });
    }

    return categories.length;
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id('categories') },
  handler: async (ctx, { categoryId }) => {
    await ctx.db.delete(categoryId);
  },
});

export const reseedCategories = mutation({
  handler: async (ctx) => {
    // Delete all existing categories
    const existing = await ctx.db.query('categories').collect();
    for (const cat of existing) {
      await ctx.db.delete(cat._id);
    }

    // Reseed with all 8 categories
    const categories = [
      { name: 'Politics', slug: 'politics', description: 'Political news and analysis' },
      { name: 'Business', slug: 'business', description: 'Business and economic news' },
      { name: 'Technology', slug: 'technology', description: 'Technology and innovation news' },
      { name: 'Health', slug: 'health', description: 'Health and medical news' },
      { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
      { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment and celebrity news' },
      { name: 'Africa', slug: 'africa', description: 'News from Africa' },
      { name: 'World', slug: 'world', description: 'International news' },
    ];

    for (const cat of categories) {
      await ctx.db.insert('categories', {
        ...cat,
        createdAt: new Date().toISOString(),
      });
    }

    return categories.length;
  },
});
