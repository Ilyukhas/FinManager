import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok } from "@/app/api/_utils";

export async function GET() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return ok({ user: data.user });
}
