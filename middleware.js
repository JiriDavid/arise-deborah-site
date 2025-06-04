import { clerkMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
const publicRoutes = [
  "/",
  "/about",
  "/ministries",
  "/sermons",
  "/events",
  "/contact",
  "/api/sermons",
  "/admin/login",
  "/admin/sign-up",
];

export default clerkMiddleware({
  publicRoutes,
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
