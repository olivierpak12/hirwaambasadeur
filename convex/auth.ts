import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

/**
 * Simple password hashing using TextEncoder (works in browser and Node)
 * For production, use bcryptjs: npm install bcryptjs
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'hirwa-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

/**
 * Generate secure session token (browser-compatible)
 */
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get expiration time (30 days from now)
 */
function getExpirationTime(): string {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);
  return expiry.toISOString();
}

/**
 * Admin Login
 */
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    // Find admin by email
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (!admin || !admin.isActive) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    if (!(await verifyPassword(args.password, admin.passwordHash))) {
      throw new Error('Invalid email or password');
    }

    // Generate session token
    const token = generateToken();
    const expiresAt = getExpirationTime();

    // Create session in database
    const sessionId = await ctx.db.insert('adminSessions', {
      adminId: admin._id,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    });

    // Update last login
    await ctx.db.patch(admin._id, {
      lastLogin: new Date().toISOString(),
    });

    return {
      success: true,
      sessionId,
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  },
});

/**
 * Verify session and get current admin
 */
export const getCurrentAdmin = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    if (!args.token) return null;

    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) return null;

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }

    // Get admin details
    const admin = await ctx.db.get(session.adminId);
    if (!admin || !admin.isActive) return null;

    return {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },
});

/**
 * Admin Logout
 */
export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

/**
 * Create initial super admin (should only be called once during setup)
 * Password: admin123 (change this!)
 */
export const createSuperAdmin = mutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    // Check if super admin already exists
    const existing = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (existing) {
      throw new Error('Admin with this email already exists');
    }

    const adminId = await ctx.db.insert('admins', {
      email: args.email.toLowerCase(),
      passwordHash: await hashPassword(args.password),
      name: args.name,
      role: 'super_admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      adminId,
      message: 'Super admin created successfully',
    };
  },
});

/**
 * Create additional admin users (only super admin can do this)
 */
export const createAdmin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.string(),
    role: v.union(v.literal('admin'), v.literal('editor')),
    currentAdminToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify current user is super admin
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.currentAdminToken))
      .first();

    if (!session) throw new Error('Unauthorized');

    const currentAdmin = await ctx.db.get(session.adminId);
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      throw new Error('Only super admin can create new admins');
    }

    // Check if email already exists
    const existing = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (existing) {
      throw new Error('Admin with this email already exists');
    }

    const adminId = await ctx.db.insert('admins', {
      email: args.email.toLowerCase(),
      passwordHash: await hashPassword(args.password),
      name: args.name,
      role: args.role,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      adminId,
      message: `${args.role} created successfully`,
    };
  },
});

/**
 * Change admin password
 */
export const changePassword = mutation({
  args: { token: v.string(), oldPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) throw new Error('Unauthorized');

    const admin = await ctx.db.get(session.adminId);
    if (!admin) throw new Error('Admin not found');

    // Verify old password
    if (!verifyPassword(args.oldPassword, admin.passwordHash)) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    await ctx.db.patch(admin._id, {
      passwordHash: await hashPassword(args.newPassword),
    });

    return { success: true, message: 'Password changed successfully' };
  },
});

/**
 * List all admins (super admin only)
 */
export const listAdmins = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) throw new Error('Unauthorized');

    const currentAdmin = await ctx.db.get(session.adminId);
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      throw new Error('Only super admin can list admins');
    }

    const admins = await ctx.db.query('admins').collect();
    return admins.map((a) => ({
      _id: a._id,
      email: a.email,
      name: a.name,
      role: a.role,
      isActive: a.isActive,
      lastLogin: a.lastLogin,
      createdAt: a.createdAt,
    }));
  },
});

/**
 * Deactivate admin account (super admin only)
 */
export const deactivateAdmin = mutation({
  args: { token: v.string(), adminIdToDeactivate: v.id('admins') },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query('adminSessions')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!session) throw new Error('Unauthorized');

    const currentAdmin = await ctx.db.get(session.adminId);
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
      throw new Error('Only super admin can deactivate admins');
    }

    await ctx.db.patch(args.adminIdToDeactivate, { isActive: false });
    return { success: true, message: 'Admin deactivated' };
  },
});

/**
 * DEBUG: Check all admins in database
 */
export const debugGetAllAdmins = query({
  args: {},
  handler: async (ctx) => {
    const admins = await ctx.db.query('admins').collect();
    return admins.map((a) => ({
      _id: a._id,
      email: a.email,
      name: a.name,
      role: a.role,
      isActive: a.isActive,
      createdAt: a.createdAt,
    }));
  },
});

/**
 * DEBUG: Test password hashing
 */
export const debugTestPassword = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query('admins')
      .withIndex('by_email', (q) => q.eq('email', args.email.toLowerCase()))
      .first();

    if (!admin) {
      return { found: false, message: 'Admin not found' };
    }

    const passwordHash = await hashPassword(args.password);
    const passwordMatches = await verifyPassword(args.password, admin.passwordHash);

    return {
      found: true,
      email: admin.email,
      isActive: admin.isActive,
      passwordMatches,
      inputPassword: args.password,
      computedHash: passwordHash,
      storedHash: admin.passwordHash,
    };
  },
});
