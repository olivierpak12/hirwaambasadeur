import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Enrich articles with related entities and resolve storage URLs for images.
async function enrichArticle(ctx: any, article: any) {
  const author = await ctx.db.get(article.authorId);
  const category = await ctx.db.get(article.categoryId);

  // Prefer explicit remote URLs when present (legacy data); otherwise resolve storage IDs.
  let featuredImages: string[] | undefined;
  const hasRemoteFeaturedImage =
    typeof article.featuredImage === 'string' && /^https?:\/\//.test(article.featuredImage);
  if (hasRemoteFeaturedImage) {
    featuredImages = [article.featuredImage];
  } else if (article.featuredImageIds && Array.isArray(article.featuredImageIds)) {
    try {
      const urls = await Promise.all(
        article.featuredImageIds.map(async (id: any) => {
          try {
            const url = await ctx.storage.getUrl(id);
            return url;
          } catch (e) {
            console.error('Failed to get featured image URL:', e);
            return null;
          }
        })
      );
      featuredImages = urls.filter(Boolean) as string[];
    } catch (e) {
      console.error('Failed to get featured images URLs:', e);
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

    // If no explicit featured images were set, fall back to the first gallery image.
    if ((!featuredImages || featuredImages.length === 0) && images && images.length > 0) {
      featuredImages = [images[0].url];
    }
  }

  // Get comment and like counts
  const commentCount = (await ctx.db.query('comments').filter((q: any) => q.eq(q.field('articleId'), article._id)).collect()).length;
  const likeCount = (await ctx.db.query('likes').filter((q: any) => q.eq(q.field('articleId'), article._id)).collect()).length;

  return {
    ...article,
    featuredImages,
    images,
    author: author ?? undefined,
    category: category ?? undefined,
    commentCount,
    likeCount,
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
    featuredImageIds: v.optional(v.array(v.id('_storage'))),
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
    const { featuredImageIds, images, featuredImage, ...articleData } = args;

    const sanitizedImages = images?.length
      ? images.map((img) => ({ storageId: img.storageId, caption: img.caption }))
      : undefined;

    return await ctx.db.insert('articles', {
      ...articleData,
      featuredImageIds,
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

export const addComment = mutation({
  args: {
    articleId: v.id('articles'),
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    content: v.string(),
    parentId: v.optional(v.id('comments')),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert('comments', {
      ...args,
      createdAt: now,
    });
  },
});

export const getComments = query({
  args: {
    articleId: v.id('articles'),
  },
  handler: async (ctx, { articleId }) => {
    const comments = await ctx.db
      .query('comments')
      .filter((q) => q.eq(q.field('articleId'), articleId))
      .order('asc')
      .collect();

    // Build a tree structure for nested comments
    const commentMap = new Map();
    const rootComments: any[] = [];

    comments.forEach((comment) => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    comments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment._id);
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  },
});

export const addLike = mutation({
  args: {
    articleId: v.id('articles'),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { articleId, userId }) => {
    const now = new Date().toISOString();
    
    // Check if user already liked this article
    const existingLike = await ctx.db
      .query('likes')
      .filter((q) => q.eq(q.field('articleId'), articleId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    if (existingLike) {
      // User already liked, remove the like
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    } else {
      // Add new like
      await ctx.db.insert('likes', {
        articleId,
        userId,
        createdAt: now,
      });
      return { liked: true };
    }
  },
});

export const getLikeStatus = query({
  args: {
    articleId: v.id('articles'),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { articleId, userId }) => {
    const like = await ctx.db
      .query('likes')
      .filter((q) => q.eq(q.field('articleId'), articleId))
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();

    return { liked: !!like };
  },
});
