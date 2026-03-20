import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const isValidEmail = (email: string) => {
  // Standard email validation - allows most valid email formats
  // Including: localpart+tag@domain.co.uk, first.last@example.com, etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  // Additional checks
  if (email.length < 5 || email.length > 254) {
    return false;
  }
  // Ensure no consecutive dots, no leading/trailing dots in local part
  const [localPart] = email.split('@');
  if (!localPart || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
    return false;
  }
  return true;
};
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const createSubscription = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, { email, source, code }) => {
    const normalized = email.trim().toLowerCase();
    
    if (!normalized) {
      throw new Error('Email is required');
    }
    
    if (!isValidEmail(normalized)) {
      throw new Error(`Invalid email address: "${normalized}"`);
    }

    const codeToStore = code || generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const existing = await ctx.db
      .query('subscriptions')
      .filter((q) => q.eq(q.field('email'), normalized))
      .take(1);

    if (existing.length) {
      const sub = existing[0];
      if (sub.verified) {
        return { id: sub._id, alreadyExists: true, verified: true };
      }

      await ctx.db.patch(sub._id, {
        verificationCode: codeToStore,
        codeExpiresAt: expiresAt,
        subscribedAt: new Date().toISOString(),
        source,
      });

      return {
        id: sub._id,
        alreadyExists: true,
        verified: false,
        debugCode: process.env.NODE_ENV !== 'production' ? codeToStore : undefined,
      };
    }

    const inserted = await ctx.db.insert('subscriptions', {
      email: normalized,
      subscribedAt: new Date().toISOString(),
      source,
      verified: false,
      verificationCode: codeToStore,
      codeExpiresAt: expiresAt,
    });

    return {
      id: inserted,
      alreadyExists: false,
      verified: false,
      debugCode: process.env.NODE_ENV !== 'production' ? codeToStore : undefined,
    };
  },
});

export const verifySubscription = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, { email, code }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !isValidEmail(normalized)) {
      throw new Error('Invalid email');
    }

    const subs = await ctx.db
      .query('subscriptions')
      .filter((q) => q.eq(q.field('email'), normalized))
      .take(1);

    const sub = subs[0];
    if (!sub) {
      return { success: false, message: 'Subscription not found.' };
    }

    if (sub.verified) {
      return { success: true, message: 'Already verified.', alreadyVerified: true };
    }

    if (!sub.verificationCode || !sub.codeExpiresAt) {
      return { success: false, message: 'No verification code found, please request a new one.' };
    }

    if (sub.codeExpiresAt && new Date(sub.codeExpiresAt).getTime() < Date.now()) {
      return { success: false, message: 'This code has expired. Please request a new one.' };
    }

    if (sub.verificationCode !== code.trim()) {
      return { success: false, message: 'Invalid verification code.' };
    }

    await ctx.db.patch(sub._id, {
      verified: true,
      verificationCode: undefined,
      codeExpiresAt: undefined,
    });

    return { success: true, message: 'Subscription confirmed.' };
  },
});

export const getSubscriptionByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    const subs = await ctx.db
      .query('subscriptions')
      .filter((q) => q.eq(q.field('email'), normalized))
      .take(1);

    return subs[0] || null;
  },
});
