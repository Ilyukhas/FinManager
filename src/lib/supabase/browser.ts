"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

export function createBrowserSupabase() {
  const { url, anon } = getSupabaseEnv();
  return createBrowserClient(url, anon);
}
