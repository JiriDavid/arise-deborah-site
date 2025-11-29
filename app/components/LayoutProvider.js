"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const immersiveRoutes = ["/prayer-rooms/"];
  const isImmersiveExperience = immersiveRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    return children; // no layout for admin pages
  }

  if (isImmersiveExperience) {
    return <main className="min-h-screen bg-[#805127]">{children}</main>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-20" />
      <div className="relative">
        <Navigation />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
