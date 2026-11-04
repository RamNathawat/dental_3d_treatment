import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://yrjulcwnabnhgtqebrtn.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_REBvv8NOv8KPkDHw3mVnnQ_rzM2165H";

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /dashboard — redirect unauthenticated visitors to /auth/login
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect root "/" to /dashboard if logged in, or /auth/login if not
  if (pathname === "/") {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = user ? "/dashboard" : "/auth/login";
    return NextResponse.redirect(targetUrl);
  }

  // If user is already logged in and visits /auth/login or /auth/signup, redirect to /dashboard
  if ((pathname === "/auth/login" || pathname === "/auth/signup") && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const middleware = proxy;

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/login", "/auth/signup"],
};
