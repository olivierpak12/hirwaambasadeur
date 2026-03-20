#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

const args = {
  email: "admin@hirwa.com",
  password: "admin123",
  name: "Admin User"
};

const jsonArg = JSON.stringify(args);

console.log("🚀 Creating super admin account...");

const proc = spawnSync('npx', ['convex', 'run', 'auth:createSuperAdmin', jsonArg], {
  cwd: path.resolve(__dirname),
  stdio: 'inherit',
  encoding: 'utf-8'
});

if (proc.status === 0) {
  console.log("\n✅ Admin account created successfully!");
  console.log("\n📝 You can now login with:");
  console.log("  Email: admin@hirwa.com");
  console.log("  Password: admin123");
  process.exit(0);
} else {
  console.error("\n❌ Failed to create admin account");
  process.exit(1);
}
