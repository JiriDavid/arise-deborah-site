import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "./components/LayoutProvider";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arise Deborah",
  description: "A place of worship and spiritual growth",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className}`}
          suppressHydrationWarning
        >
          <LayoutProvider>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            {/* <SignedIn>
              <UserButton />
            </SignedIn> */}
            {children}
          </LayoutProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
