import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { ok, bad } from "@/app/api/_utils";

export async function GET() {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return bad("Unauthorized", 401);

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,type,created_at")
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  if (error) return bad(error.message, 400);
  return ok(data ?? []);
}

export async function POST(req: Request) {
  const supabase = createServerSupabase(cookies());
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return bad("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const type = body?.type === "INCOME" ? "INCOME" : "EXPENSE";
  if (!name) return bad("name is required");

  const { data, error } = await supabase
    .from("categories")
    .insert({ user_id: user.id, name, type })
    .select("id,name,type,created_at")
    .single();

  if (error) return bad(error.message, 400);
  return ok(data);
}
