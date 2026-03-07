import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/about",
  "/zoom-meetings",
  "/sermons",
  "/events",
  "/contact",
  "/api/sermons",
  "/login",
  "/sign-up",
];

export default clerkMiddleware(
  (auth, req) => {
    const { pathname } = req.nextUrl;
    const isLegacyAdminPrayerRoute =
      pathname === "/admin/prayer-rooms" ||
      pathname.startsWith("/admin/prayer-rooms/");
    const isLegacyPrayerRoute =
      pathname === "/prayer-rooms" || pathname.startsWith("/prayer-rooms/");

    if (isLegacyAdminPrayerRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/admin/events";
      return NextResponse.redirect(redirectUrl);
    }

    if (isLegacyPrayerRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/zoom-meetings";
      return NextResponse.redirect(redirectUrl);
    }
  },
  {
    publicRoutes,
  },
);

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\..*).*)", // exclude static assets
  ],
};
