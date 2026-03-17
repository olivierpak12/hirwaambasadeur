import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Author queries and mutations
// These are now active Convex server functions.

export const getAllAuthors = query({
  handler: async (ctx) => {
    return await ctx.db.query('authors').collect();
  },
});

export const getAuthorById = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    return await ctx.db.get(authorId);
  },
});

export const getAuthorWithArticles = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    const author = await ctx.db.get(authorId);
    if (!author) return null;
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('authorId'), authorId))
      .collect();
    return {
      ...author,
      articles,
    };
  },
});

export const seedAuthors = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query('authors').collect();
    if (existing.length > 0) return; // Already seeded

    const authors = [
      { name: 'Admin', email: 'admin@hirwaambassadeur.com', bio: 'Administrator and editor' },
    ];

    for (const author of authors) {
      await ctx.db.insert('authors', {
        ...author,
        createdAt: new Date().toISOString(),
      });
    }

    return authors.length;
  },
});

export const createAuthor = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    photo: v.optional(v.string()),
  },
  handler: async (ctx, { name, email, bio, photo }) => {
    const authorId = await ctx.db.insert('authors', {
      name,
      email,
      bio: bio || '',
      photo: photo || '',
      createdAt: new Date().toISOString(),
    });
    return authorId;
  },
});

export const updateAuthor = mutation({
  args: {
    authorId: v.id('authors'),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    bio: v.optional(v.string()),
    photo: v.optional(v.string()),
  },
  handler: async (ctx, { authorId, ...updates }) => {
    await ctx.db.patch(authorId, updates);
    return authorId;
  },
});

export const deleteAuthor = mutation({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    await ctx.db.delete(authorId);
  },
});
