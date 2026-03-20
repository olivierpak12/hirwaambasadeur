/**
 * Setup mutation - call this directly to initialize the first admin
 * Must be called with NO arguments
 * npx convex run setup:init
 */

import { mutation } from './_generated/server';

export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const email = 'admin@hirwa.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Check if admin already exists
    const existing = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', email.toLowerCase()))
      .first();

    if (existing) {
      return {
        success: false,
        message: 'Admin already exists',
        existing: {
          email: existing.email,
          name: existing.name,
        },
      };
    }

    // Simple hash for testing (SHA-256 compatible with auth.ts)
    const hashPassword = async (pwd: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(pwd + 'hirwa-salt-2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const passwordHash = await hashPassword(password);

    const adminId = await ctx.db.insert('admins', {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      adminId,
      message: '✅ Super admin created successfully!',
      credentials: {
        email,
        password,
      },
    };
  },
});

/**
 * Reset admin - delete old admin and recreate with correct email format
 * npx convex run setup:reset
 */
export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    const email = 'admin@hirwa.com';
    const password = 'admin123';
    const name = 'Admin User';

    // Find and delete existing admin
    const existing = await ctx.db
      .query('admins')
      .collect();

    for (const admin of existing) {
      // Delete admin sessions first
      const sessions = await ctx.db
        .query('adminSessions')
        .withIndex('by_admin', (q) => q.eq('adminId', admin._id))
        .collect();

      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }

      // Delete admin
      await ctx.db.delete(admin._id);
    }

    // Create new admin with lowercase email
    const hashPassword = async (pwd: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(pwd + 'hirwa-salt-2026');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const passwordHash = await hashPassword(password);

    const adminId = await ctx.db.insert('admins', {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      adminId,
      message: '✅ Admin reset successfully!',
      credentials: {
        email,
        password,
      },
    };
  },
});
