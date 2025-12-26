import { requireUser } from "@/lib/auth/require-user";
import { AppShell } from "@/components/app-shell/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(); // server-side check
  return <AppShell userEmail={user.email ?? ""}>{children}</AppShell>;
}
