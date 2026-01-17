import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



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
        // If on login/register pages with a token, verify it first
        if (token && pathname !== "/") {
            try {
                await jwtVerify(token, JWT_SECRET);
                // Token is valid, redirect to home
                return NextResponse.redirect(new URL("/", req.url));
            } catch (error) {
                // Token is invalid, clear it and allow access to auth pages
                const response = NextResponse.next();
                response.cookies.set("token", "", {
                    httpOnly: true,
                    path: "/",
                    maxAge: 0,
                    expires: new Date(0)
                });
                return response;
            }
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
            // Token invalid, clear it and redirect to login
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.set("token", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
                expires: new Date(0)
            });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/login", "/register"],
};
