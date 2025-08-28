import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Minimal middleware for debugging
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and images for performance
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
