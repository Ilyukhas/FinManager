import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = createServerSupabase(cookies());
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth/login");
  return data.user;
}
