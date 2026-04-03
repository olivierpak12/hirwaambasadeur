import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { verifyPassword, hashPassword } from './passwordUtils';

// Author authentication functions
export const verifyAuthorLogin = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // Normalize email for case-insensitive comparison
    const normalizedEmail = email.trim().toLowerCase();
    
    // Find author by email (case-insensitive)
    const authors = await ctx.db
      .query('authors')
      .collect();
    
    const author = authors.find(a => a.email.toLowerCase() === normalizedEmail);
    
    if (!author) {
      return { success: false, message: 'Author not found' };
    }

    if (!author.canCreateArticles) {
      return { success: false, message: 'This account does not have article creation permission' };
    }

    if (!author.isActive) {
      return { success: false, message: 'This account is inactive' };
    }

    // Verify password against stored hash
    if (!author.password) {
      return { success: false, message: 'Password not set for this account' };
    }

    const passwordValid = await verifyPassword(password, author.password);
    if (!passwordValid) {
      return { success: false, message: 'Invalid email or password' };
    }
    
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
