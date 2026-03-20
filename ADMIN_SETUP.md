#!/usr/bin/env node
/**
 * Setup script to create the first super admin account
 * Usage: npx convex run auth:createSuperAdmin --args email password name
 * 
 * Example: npx convex run auth:createSuperAdmin --args admin@hirwa.com admin123 "Admin User"
 */

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Hirwa Ambassadeur - Create Super Admin               ║
╚════════════════════════════════════════════════════════════════╝

Usage: npx convex run auth:createSuperAdmin --args email password name

Arguments:
  email    - Email address for super admin account
  password - Password (min 8 characters recommended)
  name     - Display name

Example:
  npx convex run auth:createSuperAdmin --args admin@hirwa.com admin123 "Admin User"

⚠️  IMPORTANT:
  - Save your credentials securely
  - Change the default password on first login
  - Use strong passwords in production
`);
  process.exit(1);
}

console.log(`
📝 Creating super admin account...
Email: ${args[0]}
Name: ${args[2]}

This account will have full administrative privileges.
`);
