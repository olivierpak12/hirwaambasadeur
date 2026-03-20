#!/usr/bin/env node
import { ConvexClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function setupAdmin() {
  try {
    console.log("🚀 Creating super admin account...");
    
    const result = await client.mutation(api.auth.createSuperAdmin, {
      email: "admin@hirwa.com",
      password: "admin123",
      name: "Admin User",
    });

    console.log("✅ Success!");
    console.log("Admin ID:", result.adminId);
    console.log(result.message);
    console.log("\n📝 You can now login with:");
    console.log("  Email: admin@hirwa.com");
    console.log("  Password: admin123");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
