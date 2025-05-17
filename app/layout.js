import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arise Deborah Church",
  description:
    "Welcome to Arise Deborah Church - A place of worship, fellowship, and spiritual growth.",
};

export default function RootLayout({ children }) {
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
