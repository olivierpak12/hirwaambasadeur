import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Helper to enrich articles with author, category, and image URLs
async function enrichArticle(ctx: any, article: any) {
  const author = await ctx.db.get(article.authorId);
  const category = await ctx.db.get(article.categoryId);
  
  // Handle both new (featuredImageId) and old (featuredImage) formats
  let featuredImage = undefined;
  if (article.featuredImageId) {
    try {
      featuredImage = await ctx.storage.getUrl(article.featuredImageId);
    } catch (e) {
      // If storage ID is invalid, fall back to old URL
      featuredImage = article.featuredImage;
    }
  } else if (article.featuredImage) {
    // Old format - use URL directly
    featuredImage = article.featuredImage;
  }
  
  return { 
    ...article, 
    featuredImage,
    author: author ?? undefined, 
    category: category ?? undefined 
  };
}

export const getPublishedArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc')
      .take(20);

    const enriched = await Promise.all(
      articles.map(article => enrichArticle(ctx, article))
    );

    return enriched;
  },
});

export const getAllArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .order('desc')
      .collect();

    const enriched = await Promise.all(
      articles.map(article => enrichArticle(ctx, article))
    );

    return enriched;
  },
});

export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const q = ctx.db.query('articles').filter((q) => q.eq(q.field('slug'), slug));
    const articles = await q.take(1);
    if (!articles.length) return null;
    const article = articles[0];
    return enrichArticle(ctx, article);
  },
});

export const getArticlesByCategory = query({
  args: { categorySlug: v.string() },
  handler: async (ctx, { categorySlug }) => {
    const category = await ctx.db
      .query('categories')
      .filter((q) => q.eq(q.field('slug'), categorySlug))
      .take(1);

    if (!category.length) return [];

    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('categoryId'), category[0]._id))
      .order('desc')
      .take(20);

    const enriched = await Promise.all(
      articles.map(article => enrichArticle(ctx, article))
    );

    return enriched;
  },
});

export const getAuthorById = query({
  args: { authorId: v.id('authors') },
  handler: async (ctx, { authorId }) => {
    const author = await ctx.db.get(authorId);
    if (!author) return null;

    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('authorId'), authorId))
      .order('desc')
      .take(20);

    const enrichedArticles = await Promise.all(
      articles.map(article => enrichArticle(ctx, article))
    );

    return { ...author, articles: enrichedArticles };
  },
});

export const getRelatedArticles = query({
  args: { articleId: v.string(), categoryId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { articleId, categoryId, limit = 3 }) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('categoryId'), categoryId))
      .filter((q) => q.neq(q.field('_id'), articleId))
      .order('desc')
      .take(limit);

    const enriched = await Promise.all(
      articles.map(article => enrichArticle(ctx, article))
    );

    return enriched;
  },
});

export const createArticle = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    featuredImageId: v.optional(v.id('_storage')),
    categoryId: v.id('categories'),
    authorId: v.id('authors'),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
    tags: v.optional(v.array(v.string())),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const { featuredImageId, ...articleData } = args;
    return await ctx.db.insert('articles', {
      ...articleData,
      featuredImageId,
      publishedAt: args.status === 'published' ? now : undefined,
      updatedAt: now,
      views: 0,
    });
  },
});

export const updateArticleStatus = mutation({
  args: {
    articleId: v.id('articles'),
    status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
  },
  handler: async (ctx, { articleId, status }) => {
    const now = new Date().toISOString();
    await ctx.db.patch(articleId, {
      status,
      publishedAt: status === 'published' ? now : undefined,
      updatedAt: now,
    });
    return articleId;
  },
});
