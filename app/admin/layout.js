"use client";

import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiLogOut,
  FiVideo,
  FiCalendar,
  FiHome,
  FiUsers,
  FiUser,
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/admin/login");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 borde shadow shadow-white border-primary p-6 flex flex-col z-40">
        <div className="flex items-center mb-8 gap-6">
          <Link href="/" className="-m-1.5">
            <Image
              src="/arise-deborah-logo.jpg"
              alt="Arise Deborah"
              width={60}
              height={60}
              className="rounded-full h-14 w-26"
            />
          </Link>
          <span className="text-lg font-bold text-primary">
            Arise Deborah International
          </span>
        </div>
        <nav className="flex-1 space-y-8">
          <SidebarLink href="/admin" icon={<FiHome />} text="Dashboard" />
          <SidebarLink
            href="/admin/sermons"
            icon={<FiVideo />}
            text="Sermons"
          />
          <SidebarLink
            href="/admin/events"
            icon={<FiCalendar />}
            text="Events"
          />
          <SidebarLink
            href="/admin/testimonies"
            icon={<FiUsers />}
            text="Testimonies"
          />
        </nav>
        <SignOutButton>
          <button className="mt-10 flex items-center gap-2 text-accent hover:text-accent-dark font-semibold transition-colors">
            <FiLogOut /> Logout
          </button>
        </SignOutButton>
      </aside>

      {/* Main Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        {/* Top Bar */}
        <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md borde shadow-sm shadow-white border-primary">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2"
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <FiMenu size={24} className="text-primary" />
            </button>
            <span className="text-xl font-bold text-tertiary">
              Welcome Back, ADI Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FiUser className="text-primary" size={20} />
            <span className="text-sm font-medium text-tertiary">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, text }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 text-lg text-tertiary hover:text-primary font-medium transition-colors"
    >
      {icon} {text}
    </Link>
  );
}
