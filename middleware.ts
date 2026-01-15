import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/auth"; // We might need a purely edge-compatible verification if 'lib/auth' uses bcrypt (which is not edge-friendly). 
// 'jsonwebtoken' and 'bcryptjs' might have issues in Edge Runtime.
// For middleware, it's safer to use 'jose' or rely on cookie presence for basic check + server component/api check.
// BUT, sticking to "verifyAccessToken" imports might break if it imports "bcryptjs".
// Let's modify 'lib/auth.ts' to split edge-safe code or just use a simple cookie check here, 
// and do full validation in layout/page/api.
// OR, use 'jose' for JWT verification in middleware.
// For this task, I will attempt to separate concerns or just use 'jose' here strictly.

import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_change_me_in_prod"
);

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // Paths that are public
    const publicPaths = ["/login", "/register", "/api/auth/login", "/api/auth/register", "/"];
    if (publicPaths.includes(pathname)) {
        if (token && pathname !== "/") {
            // If already logged in and trying to access auth pages, redirect to dashboard?
            // Let's keep it simple: allow access but maybe redirect from login if already logged in.
            // For now, do nothing.
        }
        return NextResponse.next();
    }

    // Paths that need protection
    const protectedPaths = ["/admin", "/teacher", "/student"];
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);

            const userRole = payload.role as string;

            if (pathname.startsWith("/admin") && userRole !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
            if (pathname.startsWith("/teacher") && userRole !== "teacher") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
            if (pathname.startsWith("/student") && userRole !== "student") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            // Token invalid
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/login", "/register"],
};
