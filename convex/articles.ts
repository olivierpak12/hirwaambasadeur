import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Enrich articles with related entities and resolve storage URLs for images.
async function enrichArticle(ctx: any, article: any) {
  const author = await ctx.db.get(article.authorId);
  const category = await ctx.db.get(article.categoryId);

  // Handle the 'featured' flag and related image storage IDs
  // Schema can have:
  // - featuredImageIds (array of storage IDs)
  // - featuredImageId (single storage ID, legacy)
  // - featuredImage (direct URL string, from seed data)
  let featuredImages: string[] | undefined;

  // Check for direct URL first (from seed data or legacy storage)
  if (article.featuredImage && typeof article.featuredImage === 'string' && /^https?:\/\//.test(article.featuredImage)) {
    console.log(`[ENRICH] "${article.title}": Using remote URL from featuredImage property`);
    featuredImages = [article.featuredImage];
  } else if (article.featuredImageIds && Array.isArray(article.featuredImageIds) && article.featuredImageIds.length > 0) {
    // Resolve multiple storage IDs
    console.log(`[ENRICH] "${article.title}": Resolving ${article.featuredImageIds.length} featured image IDs`);
    try {
      const urls = await Promise.all(
        article.featuredImageIds.map(async (storageId: any) => {
          try {
            const url = await ctx.storage.getUrl(storageId);
            if (url) {
              console.log(`[ENRICH] ✓ Resolved storage ID`);
              return url;
            } else {
              console.warn(`[ENRICH] ✗ Storage ID returned null`);
              return null;
            }
          } catch (e) {
            console.error(`[ENRICH] ✗ Failed to resolve image ID:`, String(e).substring(0, 100));
            return null;
          }
        })
      );
      const filtered = urls.filter(Boolean) as string[];
      if (filtered.length > 0) {
        console.log(`[ENRICH] ✓ Resolved ${filtered.length}/${article.featuredImageIds.length} images`);
        featuredImages = filtered;
      } else {
        console.warn(`[ENRICH] ⚠️ No images resolved from ${article.featuredImageIds.length} IDs`);
      }
    } catch (e) {
      console.error(`[ENRICH] ✗ Error processing featuredImageIds:`, e);
    }
  } else if (article.featuredImageId) {
    // Fallback to single storage ID (legacy)
    console.log(`[ENRICH] "${article.title}": Resolving single featured image ID`);
    try {
      const url = await ctx.storage.getUrl(article.featuredImageId);
      if (url) {
        console.log(`[ENRICH] ✓ Single image resolved`);
        featuredImages = [url];
      } else {
        console.warn(`[ENRICH] ✗ featuredImageId returned null`);
      }
    } catch (e) {
      console.error(`[ENRICH] ✗ Failed to resolve featuredImageId:`, e);
    }
  } else {
    console.log(`[ENRICH] "${article.title}": No featured image data found (checked featuredImage, featuredImageIds, featuredImageId)`);
  }

  let images: { url: string; caption?: string }[] | undefined;
  if (Array.isArray(article.images) && article.images.length > 0) {
    console.log(`[ENRICH] "${article.title}": Processing ${article.images.length} gallery images`);
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
      console.log(`[ENRICH] Using first gallery image as featured (fallback)`);
      featuredImages = [images[0].url];
    }
  }

  // Get comment and like counts
  const commentCount = (await ctx.db.query('comments').filter((q: any) => q.eq(q.field('articleId'), article._id)).collect()).length;
  const likeCount = (await ctx.db.query('likes').filter((q: any) => q.eq(q.field('articleId'), article._id)).collect()).length;

  // The enriched article can return featured as either a single URL or array
  const resolvedFeaturedImage = featuredImages && featuredImages.length > 0 ? featuredImages[0] : undefined;

  // DEBUG: Log what we're returning
  console.log(`[ENRICH] "${article.title}": Returning featured=${!!resolvedFeaturedImage}, featuredImages.length=${featuredImages?.length || 0}, images=${images?.length || 0}`);
  if (!resolvedFeaturedImage) {
    console.warn(`[ENRICH WARNING] "${article.title}": No featured image resolved. Database had: featuredImage=${!!article.featuredImage}, featuredImageIds=${article.featuredImageIds?.length || 0}, featuredImageId=${!!article.featuredImageId}`);
  }

  return {
    ...article,
    featured: resolvedFeaturedImage || undefined,  // Return single URL (for backward compat) or undefined
    featuredImages,  // Also include the array for components that want it
    featuredImage: resolvedFeaturedImage || undefined,  // Include this for legacy components
    images,
    author: author ?? undefined,
    category: category ?? undefined,
    commentCount,
    likeCount,
  };
}

export const getPublishedArticles = query({
  returns: v.any(),
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc')
      .take(20);

    return Promise.all(articles.map((article) => enrichArticle(ctx, article) as any));
  },
});

export const getAllArticles = query({
  returns: v.any(),
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .order('desc')
      .collect();

    return Promise.all(articles.map((article) => enrichArticle(ctx, article) as any));
  },
});

export const getArticleBySlug = query({
  args: { slug: v.string() },
  returns: v.any(), // Allow enriched fields (featuredImage, featuredImages, images)
  handler: async (ctx, { slug }) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('slug'), slug))
      .take(1);

    if (!articles.length) return null;
    return enrichArticle(ctx, articles[0]) as any;
  },
});

export const getArticlesByCategory = query({
  args: { categorySlug: v.string() },
  returns: v.any(),
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

    return Promise.all(articles.map((article) => enrichArticle(ctx, article) as any));
  },
});

export const getAuthorById = query({
  args: { authorId: v.id('authors') },
  returns: v.any(),
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
      articles.map((article) => enrichArticle(ctx, article) as any)
    );

    return { ...author, articles: enrichedArticles };
  },
});

export const getAuthorByName = query({
  args: { authorName: v.string() },
  returns: v.any(),
  handler: async (ctx, { authorName }) => {
    const author = await ctx.db
      .query('authors')
      .filter((q) => q.eq(q.field('name'), authorName))
      .first();

    if (!author) return null;

    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('authorId'), author._id))
      .order('desc')
      .take(20);

    const enrichedArticles = await Promise.all(
      articles.map((article) => enrichArticle(ctx, article) as any)
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
  returns: v.any(),
  handler: async (ctx, { articleId, categoryId, limit = 3 }) => {
    if (!categoryId || !articleId) return [];
    
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .filter((q) => q.eq(q.field('categoryId'), categoryId))
      .filter((q) => q.neq(q.field('_id'), articleId))
      .order('desc')
      .take(limit);

    return Promise.all(articles.map((article) => enrichArticle(ctx, article) as any));
  },
});

export const getAuthorArticles = query({
  args: { authorId: v.id('authors') },
  returns: v.any(),
  handler: async (ctx, { authorId }) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('authorId'), authorId))
      .order('desc')
      .collect();

    return Promise.all(
      articles.map((article) => enrichArticle(ctx, article) as any)
    );
  },
});

export const getLatestArticles = query({
  args: {
    excludeId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.any(),
  handler: async (ctx, { excludeId = '', limit = 3 }) => {
    let query = ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc');
    
    if (excludeId) {
      query = query.filter((q) => q.neq(q.field('_id'), excludeId));
    }
    
    const articles = await query.take(limit);
    return Promise.all(articles.map((article) => enrichArticle(ctx, article) as any));
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

export const updateArticle = mutation({
  args: {
    articleId: v.id('articles'),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    featuredImage: v.optional(v.string()),
    featuredImageIds: v.optional(v.array(v.id('_storage'))),
    categoryId: v.optional(v.id('categories')),
    tags: v.optional(v.array(v.string())),
    featured: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal('draft'), v.literal('published'), v.literal('archived'))),
  },
  handler: async (ctx, { articleId, ...updates }) => {
    console.log('updateArticle called with:', { articleId, updates });

    // Verify the article exists
    const existingArticle = await ctx.db.get(articleId);
    if (!existingArticle) {
      throw new Error(`Article with ID ${articleId} not found`);
    }

    // Validate required fields
    if (updates.title && updates.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    if (updates.slug && updates.slug.trim().length === 0) {
      throw new Error('Slug cannot be empty');
    }
    if (updates.content && updates.content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

    // Validate categoryId if provided
    if (updates.categoryId) {
      const category = await ctx.db.get(updates.categoryId);
      if (!category) {
        throw new Error(`Category with ID ${updates.categoryId} not found`);
      }
    }

    const now = new Date().toISOString();
    const finalUpdates = { ...updates, updatedAt: now };

    console.log('Final updates:', finalUpdates);

    await ctx.db.patch(articleId, finalUpdates);
    return articleId;
  },
});

export const deleteArticle = mutation({
  args: {
    articleId: v.id('articles'),
  },
  handler: async (ctx, { articleId }) => {
    // Delete all comments for this article
    const comments = await ctx.db
      .query('comments')
      .filter((q) => q.eq(q.field('articleId'), articleId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete all likes for this article
    const likes = await ctx.db
      .query('likes')
      .filter((q) => q.eq(q.field('articleId'), articleId))
      .collect();
    
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // Delete the article itself
    await ctx.db.delete(articleId);
    
    return { success: true };
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

/**
 * Seed demo articles with public image URLs
 * Call this manually from the browser console to populate sample data:
 * mutation(api.articles.seedDemoArticles).then(() => console.log('Demo articles created'))
 */
export const seedDemoArticles = mutation({
  handler: async (ctx) => {
    // Check if demo data was already created
    const existingCount = await ctx.db
      .query('articles')
      .collect()
      .then(items => items.length);

    if (existingCount > 0) {
      return { success: false, message: 'Articles already exist. Skipping seed.' };
    }

    // Create categories
    const categoryDemos = [
      { name: 'Technology', slug: 'technology', description: 'Latest tech news' },
      { name: 'Business', slug: 'business', description: 'Business insights' },
      { name: 'Africa', slug: 'africa', description: 'African news' },
    ];

    const categories: any = {};
    for (const cat of categoryDemos) {
      const catId = await ctx.db.insert('categories', {
        ...cat,
        createdAt: new Date().toISOString(),
      });
      categories[cat.slug] = catId;
    }

    // Create author
    const authorId = await ctx.db.insert('authors', {
      name: 'Demo Author',
      email: 'demo@hirwaambassadeur.com',
      bio: 'A demonstration author for sample content.',
      createdAt: new Date().toISOString(),
    });

    // Demo articles with public image URLs
    const demoArticles = [
      {
        title: 'Africa\'s Tech Revolution: Why Innovation Matters',
        slug: 'africa-tech-revolution',
        excerpt: 'African tech companies are reshaping the continent\'s future with groundbreaking innovations.',
        content: '<h2>The Rise of African Tech</h2><p>Africa is experiencing unprecedented growth in the technology sector...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        categoryId: categories['technology'],
        authorId,
        status: 'published' as const,
      },
      {
        title: 'Global Business Trends for 2026',
        slug: 'global-business-trends-2026',
        excerpt: 'Insights into the economic shifts shaping global commerce.',
        content: '<h2>2026 Business Outlook</h2><p>The global economy is entering a new phase...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        categoryId: categories['business'],
        authorId,
        status: 'published' as const,
      },
      {
        title: 'Breaking: Major Infrastructure Development in West Africa',
        slug: 'west-africa-infrastructure',
        excerpt: 'New rail and port projects promise to transform regional commerce.',
        content: '<h2>Infrastructure Development</h2><p>West African nations are investing heavily in modern infrastructure...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        categoryId: categories['africa'],
        authorId,
        status: 'published' as const,
      },
    ];

    // Insert articles with public image URLs
    const now = new Date().toISOString();
    const created = [];
    for (const article of demoArticles) {
      const articleId = await ctx.db.insert('articles', {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        // Store the public URL directly (legacy support)
        featuredImage: article.featuredImage,
        featuredImageIds: undefined, // Not using storage IDs for demo
        images: undefined,
        categoryId: article.categoryId,
        authorId: article.authorId,
        status: article.status,
        publishedAt: now,
        updatedAt: now,
        views: Math.floor(Math.random() * 5000),
        featured: Math.random() > 0.7,
        tags: ['demo', 'sample'],
      });
      created.push(articleId);
    }

    return {
      success: true,
      message: `Created ${created.length} demo articles with featured images`,
      articleIds: created,
    };
  },
});

/**
 * ADMIN: Clean database - removes all test/mock articles and related data
 * This deletes ALL articles, comments, likes, but keeps categories and authors
 * Usage: mutation(api.articles.cleanupTestArticles)
 */
export const cleanupTestArticles = mutation({
  handler: async (ctx) => {
    // Delete all likes
    const likes = await ctx.db.query('likes').collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    console.log(`[CLEANUP] Deleted ${likes.length} likes`);
    
    // Delete all comments
    const comments = await ctx.db.query('comments').collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    console.log(`[CLEANUP] Deleted ${comments.length} comments`);
    
    // Delete all articles
    const articles = await ctx.db.query('articles').collect();
    for (const article of articles) {
      await ctx.db.delete(article._id);
    }
    console.log(`[CLEANUP] Deleted ${articles.length} articles`);
    
    return {
      success: true,
      message: `Cleanup complete. Removed ${articles.length} articles, ${comments.length} comments, and ${likes.length} likes`,
      stats: {
        articlesDeleted: articles.length,
        commentsDeleted: comments.length,
        likesDeleted: likes.length,
      },
    };
  },
});

/**
 * ADMIN: Reset database and reseed with proper demo articles
 * This deletes ALL articles, comments, likes, categories, and authors, then recreates demo data
 * Usage: mutation(api.articles.resetAndReseedDemo)
 */
export const resetAndReseedDemo = mutation({
  handler: async (ctx) => {
    // Delete all likes
    const likes = await ctx.db.query('likes').collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    
    // Delete all comments
    const comments = await ctx.db.query('comments').collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    
    // Delete all articles
    const articles = await ctx.db.query('articles').collect();
    for (const article of articles) {
      await ctx.db.delete(article._id);
    }
    
    // Delete all authors
    const authors = await ctx.db.query('authors').collect();
    for (const author of authors) {
      await ctx.db.delete(author._id);
    }
    
    // Delete all categories
    const categories = await ctx.db.query('categories').collect();
    for (const category of categories) {
      await ctx.db.delete(category._id);
    }
    
    console.log('[RESET] Deleted all articles, comments, likes, authors, categories');
    
    // Now seed fresh demo data
    const categoryDemos = [
      { name: 'Technology', slug: 'technology', description: 'Latest tech news' },
      { name: 'Business', slug: 'business', description: 'Business insights' },
      { name: 'Africa', slug: 'africa', description: 'African news' },
    ];

    const catMap: any = {};
    for (const cat of categoryDemos) {
      const catId = await ctx.db.insert('categories', {
        ...cat,
        createdAt: new Date().toISOString(),
      });
      catMap[cat.slug] = catId;
    }

    // Create author
    const authorId = await ctx.db.insert('authors', {
      name: 'Staff Reporter',
      email: 'staff@hirwaambassadeur.com',
      bio: 'Professional journalist covering news and analysis across multiple sectors.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      createdAt: new Date().toISOString(),
    });

    // Demo articles with public Unsplash image URLs
    const demoArticles = [
      {
        title: 'Africa\'s Tech Revolution: Why Innovation Matters',
        slug: 'africa-tech-revolution',
        excerpt: 'African tech companies are reshaping the continent\'s future with groundbreaking innovations.',
        content: '<h2>The Rise of African Tech</h2><p>Africa is experiencing unprecedented growth in the technology sector with innovative startups and established companies leading the digital transformation.</p>',
        featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        categoryId: catMap['technology'],
        authorId,
        status: 'published' as const,
      },
      {
        title: 'Global Business Trends for 2026',
        slug: 'global-business-trends-2026',
        excerpt: 'Insights into the economic shifts shaping global commerce.',
        content: '<h2>2026 Business Outlook</h2><p>The global economy is entering a new phase with sustainability and digital innovation at the forefront.</p>',
        featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
        categoryId: catMap['business'],
        authorId,
        status: 'published' as const,
      },
      {
        title: 'Breaking: Major Infrastructure Development in West Africa',
        slug: 'west-africa-infrastructure',
        excerpt: 'New rail and port projects promise to transform regional commerce.',
        content: '<h2>Infrastructure Development</h2><p>West African nations are investing heavily in modern infrastructure to connect markets and improve trade efficiency.</p>',
        featuredImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
        categoryId: catMap['africa'],
        authorId,
        status: 'published' as const,
      },
    ];

    const now = new Date().toISOString();
    const created = [];
    for (const article of demoArticles) {
      const articleId = await ctx.db.insert('articles', {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: article.featuredImage,
        categoryId: article.categoryId,
        authorId: article.authorId,
        status: article.status,
        publishedAt: now,
        updatedAt: now,
        views: Math.floor(Math.random() * 5000) + 1000,
        featured: true,
        tags: ['featured', 'news'],
      });
      created.push(articleId);
      console.log(`[SEED] Created article: ${article.title}`);
    }

    return {
      success: true,
      message: `Reset complete. Created ${created.length} demo articles with featured images from Unsplash`,
      articleIds: created,
    };
  },
});

/**
 * Debug: Inspect article data in database
 * Shows raw data stored for a specific article slug
 * Usage: query(api.articles.debugArticleData, { slug: 'article-slug' })
 */
export const debugArticleData = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const article = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('slug'), slug))
      .take(1);

    if (!article.length) {
      return { success: false, message: 'Article not found' };
    }

    const raw = article[0];
    const author = await ctx.db.get(raw.authorId);
    const category = await ctx.db.get(raw.categoryId);

    // Try to resolve images like enrichArticle does
    let resolvedFeatured: any = null;
    let resolvedImages: any[] = [];

    // Check for direct URL
    const hasRemoteFeaturedImage =
      typeof raw.featuredImage === 'string' && /^https?:\/\//.test(raw.featuredImage);
    if (hasRemoteFeaturedImage) {
      resolvedFeatured = raw.featuredImage;
    } else if (raw.featuredImageId) {
      try {
        const url = await ctx.storage.getUrl(raw.featuredImageId);
        resolvedFeatured = { storageId: raw.featuredImageId, resolved: url || 'FAILED' };
      } catch (e) {
        resolvedFeatured = { storageId: raw.featuredImageId, error: String(e) };
      }
    } else if (raw.featuredImageIds && Array.isArray(raw.featuredImageIds)) {
      resolvedFeatured = await Promise.all(
        raw.featuredImageIds.map(async (id: any) => {
          try {
            const url = await ctx.storage.getUrl(id);
            return { storageId: id, resolved: url || 'FAILED' };
          } catch (e) {
            return { storageId: id, error: String(e) };
          }
        })
      );
    }

    return {
      success: true,
      raw_data: {
        title: raw.title,
        slug: raw.slug,
        // Image fields
        featuredImage: raw.featuredImage,
        featuredImageId: raw.featuredImageId,
        featuredImageIds: raw.featuredImageIds,
        images_count: raw.images?.length ?? 0,
        images_sample: raw.images?.slice(0, 2),
        // Metadata
        author: author?.name,
        category: category?.name,
        status: raw.status,
      },
      resolution_test: {
        message: 'Testing image resolution like enrichArticle() does',
        resolved_featured: resolvedFeatured,
        resolved_images_count: resolvedImages.length,
      },
      full_raw: raw, // Complete raw article for full inspection
    };
  },
});
