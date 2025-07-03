import { clerkMiddleware } from "@clerk/nextjs/server";

const publicRoutes = [
  "/",
  "/about",
  "/ministries",
  "/sermons",
  "/events",
  "/contact",
  "/api/sermons",
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
