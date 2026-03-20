#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Create temp JSON file
const tempFile = path.join(__dirname, '.admin-setup-args.json');
const args = {
  email: 'admin@hirwa.com',
  password: 'admin123',
  name: 'Admin User'
};

fs.writeFileSync(tempFile, JSON.stringify(args));

try {
  console.log('🚀 Creating super admin account...\n');
  
  const result = spawnSync('npx', [
    'convex',
    'run',
    'auth:createSuperAdmin',
    JSON.stringify(args)
  ], {
    cwd: __dirname,
    stdio: 'inherit',
    encoding: 'utf-8',
    shell: false  // Don't use shell
  });

  if (result.status === 0) {
    console.log('\n✅ Admin account created successfully!');
    console.log('\n📝 Login credentials:');
    console.log('  Email: admin@hirwa.com');
    console.log('  Password: admin123');
  }
} finally {
  // Clean up
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}
