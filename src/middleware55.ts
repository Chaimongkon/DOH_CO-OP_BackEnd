import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Define routes that should be excluded from authentication
  const excludedPaths = [
    "/Login",
    "/Register",
    "/api/auth",
    "/api/auth/",
    "/api/auth/:path*",
  ];

  // Check if the current path is excluded
  const isExcluded = excludedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isExcluded) {
    return NextResponse.next();
  }

  // If the user is not authenticated and is accessing a protected route, redirect to /login
  if (!token) {
    const loginUrl = new URL("/Login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Apply middleware only to specific paths
export const config = {
  matcher: ["/Protected/:path*", "/"],
};
