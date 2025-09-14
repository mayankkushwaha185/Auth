import { NextResponse } from "next/server";

const authPaths = ["/account/login", "/account/register"];

export async function middleware(request) {
  try {
    const isAuthenticated = request.cookies.get("is_auth")?.value;
    const path = request.nextUrl.pathname;

    // If authenticated and trying to visit login/register → Redirect to profile
    if (isAuthenticated && authPaths.includes(path)) {
      return NextResponse.redirect(new URL("/user/profile", request.url));
    }

    // If not authenticated and trying to visit protected routes → Redirect to login
    if (!isAuthenticated && path.startsWith("/user")) {
      return NextResponse.redirect(new URL("/account/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.next(); // Fallback to avoid breaking the app
  }
}

export const config = {
  matcher: ["/user/:path*", "/account/login", "/account/register"],
};
