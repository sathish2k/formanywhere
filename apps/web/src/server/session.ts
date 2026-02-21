/**
 * Server Functions — Session & Auth
 *
 * These run exclusively on the server via "use server" directive.
 * They read the session from middleware event.locals (set in middleware.ts),
 * eliminating redundant client-side auth API calls.
 */
import { query, redirect } from "@solidjs/router";
// @ts-expect-error - getRequestEvent exists in solid-js/web at runtime but TS bundler resolution doesn't re-export it properly from client.d.ts
import { getRequestEvent } from "solid-js/web";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

/**
 * Get current session user from middleware locals.
 * Returns null if not authenticated.
 * Cached with key "session" — deduplicated across multiple calls per request.
 */
export const getSession = query(async (): Promise<SessionUser | null> => {
  "use server";
  const event = getRequestEvent();
  return event?.locals?.user ?? null;
}, "session");

/**
 * Get session or redirect to sign-in.
 * Use this in protected route preloaders to enforce authentication server-side.
 */
export const getProtectedSession = query(async (): Promise<SessionUser> => {
  "use server";
  const event = getRequestEvent();
  const user = event?.locals?.user;
  if (!user) {
    throw redirect("/signin");
  }
  return user;
}, "protected-session");
