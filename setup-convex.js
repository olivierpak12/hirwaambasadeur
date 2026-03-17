#!/usr/bin/env node
// Quick script to help set up Convex configuration
const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'convex.json');

if (!fs.existsSync(configPath)) {
  // Create convex.json if it doesn't exist
  const config = {
    "authUrl": "https://auth.convex.dev",
    "customHeaders": {},
    "functions": {
      "dir": "convex",
      "runtime": "node"
    },
    "projectUrl": "https://clear-herring-860.convex.cloud"
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✓ Created convex.json with configuration');
} else {
  console.log('✓ convex.json already exists');
}

console.log('\nTo complete setup:');
console.log('1. Visit: https://console.convex.dev');
console.log('2. Authenticate if needed');
console.log('3. Run: npx convex dev');
console.log('4. Select your "hirwaambassadeur" project');
console.log('5. The schema will deploy automatically');
