"use client";

import { useAuth, useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCalendar,
  FiChevronRight,
  FiHome,
  FiLogOut,
  FiMenu,
  FiUsers,
  FiVideo,
  FiUser,
} from "react-icons/fi";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/sermons", label: "Sermons", icon: FiVideo },
  { href: "/admin/events", label: "Events", icon: FiCalendar },
  { href: "/admin/testimonies", label: "Testimonies", icon: FiUsers },
  { href: "/admin/prayer-rooms", label: "Prayer Rooms", icon: FiVideo },
];

export default function AdminLayout({ children }) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allowlistedEmails = useMemo(() => {
    const envValue = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
    if (!envValue) return [];
    return envValue
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  }, []);

  const userEmail =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";

  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.isAdmin === true ||
    allowlistedEmails.includes(userEmail);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/admin/login");
    } else if (!isAdmin) {
      router.push("/prayer-rooms");
    }
  }, [isLoaded, userId, isAdmin, router]);

  if (!isLoaded || !userId || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050203]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFC94A]"></div>
      </div>
    );
  }

  const handleNavigate = (href) => {
    router.push(href);
    setSidebarOpen(false);
  };

  return (
    <div className="relative flex min-h-screen t-to-br from-[#080402] via-[#120a05] to-[#1f1208] text-white">
      <Sidebar
        user={user}
        pathname={pathname}
        onNavigate={handleNavigate}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-72 xl:ml-80 flex flex-col">
        <TopNav user={user} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 lg:p-10">
          <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-2xl p-6 min-h-[calc(100vh-140px)] shadow-2xl shadow-black/30">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ user, pathname, onNavigate, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 xl:w-80 px-6 py-8 border-r border-white/5 bg-primary backdrop-blur-2xl shadow-2xl shadow-black/50">
        <SidebarContent
          user={user}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-primary lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-72 px-6 py-8 border-r border-white/10 bg-[#120a05]"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <SidebarContent
              user={user}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ user, pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-8">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src="/arise-deborah-logo.jpg"
          alt="Arise Deborah"
          width={56}
          height={56}
          className="rounded-full border border-[#FFC94A]/40"
        />
        <span className="text-lg font-semibold text-[#FFE5B4] leading-tight">
          Arise Deborah
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => onNavigate(href)}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                isActive
                  ? "bg-[#FFC94A]/20 text-white border border-[#FFC94A]/40"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold">
                <Icon className="text-[#FFC94A]" /> {label}
              </span>
              <FiChevronRight className="text-[#FFC94A]/60" />
            </button>
          );
        })}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#FFC94A]">
          Admin
        </p>
        <p className="text-white font-semibold mt-1">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-white/60 text-xs">
          {user?.primaryEmailAddress?.emailAddress}
        </p>

        <SignOutButton>
          <button className="mt-4 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <FiLogOut /> Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}

function TopNav({ user, onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-blac backdrop-blur-2xl">
      <div className="flex items-center justify-between px-4 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden rounded-full border border-white/20 p-2"
            onClick={onMenuToggle}
          >
            <FiMenu size={20} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Admin Command
            </p>
            <h2 className="text-lg font-semibold text-white">
              Steward the community
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 bg-blac">
            <FiCalendar className="text-[#FFC94A]" />
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-white">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-white/60">Admin</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#FFC94A]/20 border border-[#FFC94A]/40 flex items-center justify-center text-[#FFC94A]">
              <FiUser />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
