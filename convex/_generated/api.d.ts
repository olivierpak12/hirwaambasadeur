/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ads from "../ads.js";
import type * as aiEconomicAnalyses from "../aiEconomicAnalyses.js";
import type * as aiStories from "../aiStories.js";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as authorAuth from "../authorAuth.js";
import type * as authors from "../authors.js";
import type * as categories from "../categories.js";
import type * as files from "../files.js";
import type * as jobs from "../jobs.js";
import type * as passwordUtils from "../passwordUtils.js";
import type * as sendAuthorCredentials from "../sendAuthorCredentials.js";
import type * as sendSubscriptionConfirmation from "../sendSubscriptionConfirmation.js";
import type * as sendVerificationEmail from "../sendVerificationEmail.js";
import type * as setup from "../setup.js";
import type * as submissions from "../submissions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as writingPermissions from "../writingPermissions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ads: typeof ads;
  aiEconomicAnalyses: typeof aiEconomicAnalyses;
  aiStories: typeof aiStories;
  articles: typeof articles;
  auth: typeof auth;
  authorAuth: typeof authorAuth;
  authors: typeof authors;
  categories: typeof categories;
  files: typeof files;
  jobs: typeof jobs;
  passwordUtils: typeof passwordUtils;
  sendAuthorCredentials: typeof sendAuthorCredentials;
  sendSubscriptionConfirmation: typeof sendSubscriptionConfirmation;
  sendVerificationEmail: typeof sendVerificationEmail;
  setup: typeof setup;
  submissions: typeof submissions;
  subscriptions: typeof subscriptions;
  writingPermissions: typeof writingPermissions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
