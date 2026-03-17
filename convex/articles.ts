import { query } from './_generated/server';
import { v } from 'convex/values';

export const getPublishedArticles = query({
  handler: async (ctx) => {
    const articles = await ctx.db
      .query('articles')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc')
      .take(20);

    const enriched = await Promise.all(
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        const category = await ctx.db.get(article.categoryId);
        return { ...article, author: author ?? undefined, category: category ?? undefined };
      })
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
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        const category = await ctx.db.get(article.categoryId);
        return { ...article, author: author ?? undefined, category: category ?? undefined };
      })
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
    const author = await ctx.db.get(article.authorId);
    const category = await ctx.db.get(article.categoryId);
    return { ...article, author: author ?? undefined, category: category ?? undefined };
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
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        const category = await ctx.db.get(article.categoryId);
        return { ...article, author: author ?? undefined, category: category ?? undefined };
      })
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
      articles.map(async (article) => {
        const category = await ctx.db.get(article.categoryId);
        return { ...article, category };
      })
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
      articles.map(async (article) => {
        const author = await ctx.db.get(article.authorId);
        const category = await ctx.db.get(article.categoryId);
        return { ...article, author: author ?? undefined, category: category ?? undefined };
      })
    );

    return enriched;
  },
});
