/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as articles from "../articles.js";
import type * as authors from "../authors.js";
import type * as categories from "../categories.js";
import type * as files from "../files.js";
import type * as sendSubscriptionConfirmation from "../sendSubscriptionConfirmation.js";
import type * as sendVerificationEmail from "../sendVerificationEmail.js";
import type * as submissions from "../submissions.js";
import type * as subscriptions from "../subscriptions.js";
import type * as writingPermissions from "../writingPermissions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  authors: typeof authors;
  categories: typeof categories;
  files: typeof files;
  sendSubscriptionConfirmation: typeof sendSubscriptionConfirmation;
  sendVerificationEmail: typeof sendVerificationEmail;
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
