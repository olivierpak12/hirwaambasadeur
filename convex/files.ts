import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate a short-lived upload URL for the client to upload directly to Convex storage
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Get a public URL from a storage ID - use query for reliable URL generation
export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      const url = await ctx.storage.getUrl(args.storageId);
      return url;
    } catch (error) {
      console.error("Failed to get image URL:", error);
      return null;
    }
  },
});