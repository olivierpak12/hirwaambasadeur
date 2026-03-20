#!/usr/bin/env node
/**
 * Setup script to create the first super admin account
 */

const args = {
  email: "admin@hirwa.com",
  password: "admin123",
  name: "Admin User"
};

console.log("Creating super admin with:");
console.log(JSON.stringify(args, null, 2));
