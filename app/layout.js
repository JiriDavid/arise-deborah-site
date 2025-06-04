import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arise Deborah",
  description: "A place of worship and spiritual growth",
};

export default function RootLayout({ children }) {
  // Check if the current path is an admin route
  const isAdminRoute =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  // If it's an admin route, render only the children without the main layout
  if (isAdminRoute) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }

  // For non-admin routes, render the full layout
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} bg-white`}
          suppressHydrationWarning
        >
          <div className="relative min-h-screen">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative">
               <Navigation /> 
              <main>{children}</main>
              <Footer />
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
