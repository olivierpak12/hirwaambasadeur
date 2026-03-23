#!/usr/bin/env node
import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function seedCategories() {
  try {
    console.log("🚀 Seeding categories...");
    const result = await client.mutation(api.categories.seedCategories);
    console.log("✅ Categories seeded successfully!");
    console.log("Number of categories created:", result);
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    process.exit(1);
  }
}

seedCategories();