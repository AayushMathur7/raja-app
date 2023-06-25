/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@0.17.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { ApiFromModules } from "convex/server";
import type * as repo from "../repo";
import type * as tickets from "../tickets";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: ApiFromModules<{
  repo: typeof repo;
  tickets: typeof tickets;
}>;