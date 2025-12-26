import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    return req.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    res.cookies.set({ name, value, ...options });
                },
                remove(name, options) {
                    res.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    const { data } = await supabase.auth.getUser();

    const isPrivate =
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/transactions") ||
        req.nextUrl.pathname.startsWith("/investments") ||
        req.nextUrl.pathname.startsWith("/analytics") ||
        req.nextUrl.pathname.startsWith("/profile");

    if (isPrivate && !data.user) {
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ["/dashboard/:path*", "/transactions/:path*", "/investments/:path*", "/analytics/:path*", "/profile/:path*"],
};
