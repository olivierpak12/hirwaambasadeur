import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Get all advertisements
export const getAllAds = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('advertisements')
      .order('desc')
      .collect();
  },
});

// Get ads by placement
export const getAdsByPlacement = query({
  args: { placement: v.union(
    v.literal('header_banner'),
    v.literal('sidebar'),
    v.literal('footer'),
    v.literal('article_middle')
  )},
  handler: async (ctx, { placement }) => {
    return await ctx.db
      .query('advertisements')
      .filter((q) => q.eq(q.field('placement'), placement))
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

// Get active ads
export const getActiveAds = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('advertisements')
      .filter((q) => q.eq(q.field('isActive'), true))
      .collect();
  },
});

// Create advertisement
export const createAd = mutation({
  args: {
    title: v.string(),
    placement: v.union(
      v.literal('header_banner'),
      v.literal('sidebar'),
      v.literal('footer'),
      v.literal('article_middle')
    ),
    imageUrl: v.string(),
    altText: v.string(),
    linkUrl: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const adId = await ctx.db.insert('advertisements', {
      ...args,
      views: 0,
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    });
    return adId;
  },
});

// Update advertisement
export const updateAd = mutation({
  args: {
    adId: v.id('advertisements'),
    title: v.optional(v.string()),
    placement: v.optional(v.union(
      v.literal('header_banner'),
      v.literal('sidebar'),
      v.literal('footer'),
      v.literal('article_middle')
    )),
    imageUrl: v.optional(v.string()),
    altText: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { adId, ...updates }) => {
    await ctx.db.patch(adId, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return adId;
  },
});

// Delete advertisement
export const deleteAd = mutation({
  args: { adId: v.id('advertisements') },
  handler: async (ctx, { adId }) => {
    await ctx.db.delete(adId);
  },
});

// Track ad view
export const trackAdView = mutation({
  args: { adId: v.id('advertisements') },
  handler: async (ctx, { adId }) => {
    const ad = await ctx.db.get(adId);
    if (!ad) return;
    
    await ctx.db.patch(adId, {
      views: (ad.views || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  },
});

// Track ad click
export const trackAdClick = mutation({
  args: { adId: v.id('advertisements') },
  handler: async (ctx, { adId }) => {
    const ad = await ctx.db.get(adId);
    if (!ad) return;
    
    await ctx.db.patch(adId, {
      clicks: (ad.clicks || 0) + 1,
      views: (ad.views || 0) + 1,
      updatedAt: new Date().toISOString(),
    });
  },
});
