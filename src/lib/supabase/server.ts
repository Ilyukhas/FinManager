import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { getSupabaseEnv } from "./env";

export function createServerSupabase(cookies: ReadonlyRequestCookies) {
  const { url, anon } = getSupabaseEnv();

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // Next.js route handlers can set cookies via cookies().set, but in Server Components we don't set.
        try {
          cookies.set({ name, value, ...options });
        } catch {}
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookies.set({ name, value: "", ...options });
        } catch {}
      },
    },
  });
}
