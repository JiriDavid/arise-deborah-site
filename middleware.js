import { clerkMiddleware } from "@clerk/nextjs/server";

const publicRoutes = [
  "/",
  "/about",
  "/prayer-rooms",
  "/sermons",
  "/events",
  "/contact",
  "/api/sermons",
  "/api/prayer-rooms",
  "/login",
  "/sign-up",
];

export default clerkMiddleware({
  publicRoutes,
});

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)", // exclude static assets
  ],
};
