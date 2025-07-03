// app/admin/login/page.js
"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* If signed in, redirect */}
      <SignedIn>
        <RedirectToDashboard router={router} />
      </SignedIn>

      {/* If signed out, show sign-in UI */}
      <SignedOut>
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-primary">Admin Login</h2>
          <div className="flex flex-col gap-4 items-center">
            <SignInButton mode="modal">
              <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-primary hover:text-primary-dark underline transition">
                Create an Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

function RedirectToDashboard({ router }) {
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!hasRedirected) {
      console.log("Redirecting to /admin/");
      setHasRedirected(true);
      router.replace("/admin/");
    }
  }, [router, hasRedirected]);

  return (
    <div className="text-lg text-primary">Redirecting to dashboard...</div>
  );
}
