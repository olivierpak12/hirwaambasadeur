import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { verifyPassword, hashPassword } from './passwordUtils';

// Author authentication functions
export const verifyAuthorLogin = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    // Normalize email for case-insensitive comparison
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Author login attempt for email:', normalizedEmail);
    
    // Find author by email (case-insensitive)
    const authors = await ctx.db
      .query('authors')
      .collect();
    
    const author = authors.find(a => a.email.toLowerCase() === normalizedEmail);
    console.log('Author found:', !!author);
    
    if (!author) {
      console.log('Author not found');
      return { success: false, message: 'Author not found' };
    }

    if (!author.canCreateArticles) {
      console.log('Author does not have create permission');
      return { success: false, message: 'This account does not have article creation permission' };
    }

    if (!author.isActive) {
      console.log('Author account is inactive');
      return { success: false, message: 'This account is inactive' };
    }

    // Verify password against stored hash
    console.log('Verifying author password...');
    console.log('Password provided:', !!password);
    console.log('Author has password hash:', !!author.password);
    
    if (!author.password) {
      console.log('No password set for author');
      return { success: false, message: 'Password not set for this account' };
    }

    const passwordValid = await verifyPassword(password.trim(), author.password);
    console.log('Password valid:', passwordValid);
    
    if (!passwordValid) {
      console.log('Invalid password');
      return { success: false, message: 'Invalid email or password' };
    }
    
    console.log('Author login successful');
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
