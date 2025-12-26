"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";

const schema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormData) {
    setErr(null);
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message ?? "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(to_bottom,rgba(14,165,233,.08),transparent)] dark:bg-[linear-gradient(to_bottom,rgba(56,189,248,.12),transparent)]">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-5 py-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link className="text-sm text-slate-600 hover:underline dark:text-slate-300" href="/">
            На главную
          </Link>
        </div>

        <Card>
          <h1 className="text-xl font-semibold">Вход</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Войдите, чтобы открыть дашборд.
          </p>

          <form className="mt-5 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={form.formState.errors.email?.message}
              {...form.register("email")}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              error={form.formState.errors.password?.message}
              {...form.register("password")}
            />

            {err ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                {err}
              </p>
            ) : null}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Входим..." : "Войти"}
            </Button>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Нет аккаунта?{" "}
              <Link className="font-medium text-slate-900 underline-offset-4 hover:underline dark:text-white" href="/auth/register">
                Зарегистрироваться
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}
