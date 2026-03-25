import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Journalist queries and mutations
// These are now active Convex server functions.

export const getAllAuthors = query({
  handler: async (ctx) => {
    const authors = await ctx.db.query('authors').collect();
    return await Promise.all(authors.map((author) => enrichAuthor(ctx, author)));
  },
});

export const getAuthorById = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    const author = await ctx.db.get(authorId);
    return await enrichAuthor(ctx, author);
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
      { name: 'Hirwa Ambassadeur', email: 'admin@hirwaambassadeur.com', bio: 'Administrator and editor' },
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
    photoStorageId: v.optional(v.id('_storage')),
    canCreateArticles: v.optional(v.boolean()),
    canEditPhotos: v.optional(v.boolean()),
  },
  handler: async (ctx, { name, email, bio, photo, photoStorageId, canCreateArticles, canEditPhotos }) => {
    const now = new Date().toISOString();
    
    // Resolve photo URL from storage ID if provided
    let finalPhoto = photo || '';
    if (photoStorageId) {
      try {
        const resolvedUrl = await ctx.storage.getUrl(photoStorageId);
        if (resolvedUrl) {
          finalPhoto = resolvedUrl;
        }
      } catch (err) {
        console.error('Error resolving photo URL during creation:', err);
      }
    }
    
    const authorId = await ctx.db.insert('authors', {
      name,
      email,
      bio: bio || '',
      photo: finalPhoto,
      photoStorageId,
      canCreateArticles: canCreateArticles ?? true,
      canEditPhotos: canEditPhotos ?? false,
      isActive: true,
      createdAt: now,
      updatedAt: now,
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
    photoStorageId: v.optional(v.id('_storage')),
    canCreateArticles: v.optional(v.boolean()),
    canEditPhotos: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { authorId, name, email, bio, photo, photoStorageId, canCreateArticles, canEditPhotos, isActive }) => {
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };
    
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (bio !== undefined) updates.bio = bio;
    if (canCreateArticles !== undefined) updates.canCreateArticles = canCreateArticles;
    if (canEditPhotos !== undefined) updates.canEditPhotos = canEditPhotos;
    if (isActive !== undefined) updates.isActive = isActive;
    
    // Handle photo updates
    if (photoStorageId !== undefined) {
      updates.photoStorageId = photoStorageId;
      // Resolve photo URL from storage ID if provided
      if (photoStorageId) {
        try {
          const resolvedUrl = await ctx.storage.getUrl(photoStorageId);
          updates.photo = resolvedUrl || (photo || '');
        } catch (err) {
          console.error('Error resolving photo URL during update:', err);
          updates.photo = photo || '';
        }
      } else {
        updates.photo = photo || '';
      }
    } else if (photo !== undefined) {
      updates.photo = photo;
    }
    
    await ctx.db.patch(authorId, updates);
    return authorId;
  },
});

export const getActiveAuthors = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('authors')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

export const getAuthorsByPermission = query({
  args: { permission: v.string() },
  handler: async (ctx, { permission }) => {
    const field = permission === 'articles' ? 'canCreateArticles' : 'canEditPhotos';
    return await ctx.db
      .query('authors')
      .filter((q) => q.and(
        q.eq(q.field('isActive'), true),
        q.eq(q.field(field), true)
      ))
      .collect();
  },
});

export const deleteAuthor = mutation({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    await ctx.db.delete(authorId);
  },
});

// Helper function to enrich author with signed photo URL
async function enrichAuthor(ctx: any, author: any) {
  if (!author) return null;
  
  let photo = author.photo; // Default to existing photo URL
  
  // If there's a storage ID, get the signed URL
  if (author.photoStorageId) {
    try {
      photo = await ctx.storage.getUrl(author.photoStorageId);
    } catch (err) {
      console.error('Error getting photo URL:', err);
    }
  }
  
  return {
    ...author,
    photo, // Replace photo with signed URL
  };
}

export const getAuthorWithPhoto = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    const author = await ctx.db.get(authorId);
    return enrichAuthor(ctx, author);
  },
});

export const getAllAuthorsWithPhotos = query({
  handler: async (ctx) => {
    const authors = await ctx.db.query('authors').collect();
    return Promise.all(authors.map(author => enrichAuthor(ctx, author)));
  },
});
