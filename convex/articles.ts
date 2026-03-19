import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Enrich articles with related entities and resolve storage URLs for images.
async function enrichArticle(ctx: any, article: any) {
  const author = await ctx.db.get(article.authorId);
  const category = await ctx.db.get(article.categoryId);

  // Prefer explicit remote URLs when present (legacy data); otherwise resolve storage IDs.
  let featuredImage: string | undefined;
  const hasRemoteFeaturedImage =
    typeof article.featuredImage === 'string' && /^https?:\/\//.test(article.featuredImage);
  if (hasRemoteFeaturedImage) {
    featuredImage = article.featuredImage;
  } else if (article.featuredImageId) {
    try {
      const url = await ctx.storage.getUrl(article.featuredImageId);
      if (url) featuredImage = url;
    } catch (e) {
      console.error('Failed to get featured image URL:', e);
    }
  }

  let images: { url: string; caption?: string }[] | undefined;
  if (Array.isArray(article.images) && article.images.length > 0) {
    images = (
      await Promise.all(
        article.images.map(async (img: any) => {
          // Legacy support: accept an explicit URL if provided
          if (typeof img?.url === 'string' && /^https?:\/\//.test(img.url)) {
            return { url: img.url, caption: img.caption };
          }
          if (img?.storageId) {
            try {
              const url = await ctx.storage.getUrl(img.storageId);
              return url ? { url, caption: img.caption } : null;
            } catch (e) {
              console.error('Failed to get gallery image URL:', e);
              return null;
            }
          }
          return null;
        })
      )
    ).filter(Boolean) as { url: string; caption?: string }[];

    // If no explicit featured image was set, fall back to the first gallery image.
    if (!featuredImage && images.length > 0) {
      featuredImage = images[0].url;
    }
  }

  return {
    ...article,
    featuredImage,
    images,
    author: author ?? undefined,
    category: category ?? undefined,
  };
}

export const getPublishedArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc')
      .take(20);

    return Promise.all(articles.map((article) => enrichArticle(ctx, article)));
  },
});

export const getAllArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .order('desc')
      .collect();

    return Promise.all(articles.map((article) => enrichArticle(ctx, article)));
  },
});

export const getArticleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('slug'), slug))
      .take(1);

    if (!articles.length) return null;
    return enrichArticle(ctx, articles[0]);
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

    return Promise.all(articles.map((article) => enrichArticle(ctx, article)));
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
      articles.map((article) => enrichArticle(ctx, article))
    );

    return { ...author, articles: enrichedArticles };
  },
});

export const getRelatedArticles = query({
  args: {
    articleId: v.string(),
    categoryId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { articleId, categoryId, limit = 3 }) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('categoryId'), categoryId))
      .filter((q) => q.neq(q.field('_id'), articleId))
      .order('desc')
      .take(limit);

    return Promise.all(articles.map((article) => enrichArticle(ctx, article)));
  },
});

export const createArticle = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    featuredImageId: v.optional(v.id('_storage')),
    // Legacy support: the UI may send blob URLs for preview, but we don't store them.
    featuredImage: v.optional(v.string()),
    images: v.optional(
      v.array(
        v.object({
          storageId: v.id('_storage'),
          url: v.optional(v.string()),
          caption: v.optional(v.string()),
        })
      )
    ),
    categoryId: v.id('categories'),
    authorId: v.id('authors'),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('archived')
    ),
    tags: v.optional(v.array(v.string())),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const { featuredImageId, images, featuredImage, ...articleData } = args;

    const sanitizedImages = images?.length
      ? images.map((img) => ({ storageId: img.storageId, caption: img.caption }))
      : undefined;

    return await ctx.db.insert('articles', {
      ...articleData,
      featuredImageId,
      images: sanitizedImages,
      publishedAt: args.status === 'published' ? now : undefined,
      updatedAt: now,
      views: 0,
    });
  },
});

export const updateArticleStatus = mutation({
  args: {
    articleId: v.id('articles'),
    status: v.union(
      v.literal('draft'),
      v.literal('published'),
      v.literal('archived')
    ),
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
