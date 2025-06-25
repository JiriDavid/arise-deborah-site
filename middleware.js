import { clerkMiddleware } from "@clerk/nextjs/server";

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
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)", // exclude static assets
  ],
};
