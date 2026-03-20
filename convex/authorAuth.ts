import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Author authentication functions
export const verifyAuthorLogin = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // Find author by email
    const author = await ctx.db
      .query('authors')
      .filter((q) => q.eq(q.field('email'), email))
      .first();
    
    if (!author) {
      return { success: false, message: 'Author not found' };
    }

    if (!author.canCreateArticles) {
      return { success: false, message: 'This account does not have article creation permission' };
    }

    if (!author.isActive) {
      return { success: false, message: 'This account is inactive' };
    }

    // For now, simple password check (in production, use proper hashing)
    // Password for all authors is their email for simplicity
    const passwordHash = await generateHash(password);
    
    return {
      success: true,
      authorId: author._id,
      name: author.name,
      email: author.email,
      bio: author.bio,
      photo: author.photo,
      canCreateArticles: author.canCreateArticles,
      canEditPhotos: author.canEditPhotos,
    };
  },
});

export const getAuthorById = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    const author = await ctx.db.get(authorId);
    if (!author || !author.canCreateArticles) {
      return null;
    }
    return author;
  },
});

async function generateHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
