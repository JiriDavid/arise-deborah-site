"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Add animation

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Prayer Rooms", href: "/prayer-rooms" },
  { name: "Sermons", href: "/sermons" },
  { name: "Events", href: "/events" },
  { name: "Testimonies", href: "/testimonies" },
  { name: "Giving", href: "/giving" },
  { name: "Contact", href: "/contact" },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 border-b border-[#FFC94A] text-[#FFC94A] transition backdrop-filter ${
        isScrolled ? "backdrop-blur-sm bg-black/30" : ""
      }`}
    >
      <nav
        className="mx-auto flex w-full items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo Section */}
        <div className="flex lg:flex-1 gap-4 items-center">
          <Link href="/" className="-m-1.5">
            <Image
              src="/arise-deborah-logo.jpg"
              alt="Arise Deborah"
              width={50}
              height={50}
              className="rounded-full h-14 w-14"
            />
          </Link>
          <span className="text-2xl font-bold text-tertiary hidden md:block">
            Arise Deborah International
          </span>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2.5 text-accent"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors duration-200 ${
                pathname === item.href
                  ? "text-primary"
                  : "text-accent hover:text-primary"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {/* User Profile Button for Desktop */}
          <div className="ml-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Background Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed inset-y-0 right-0 z-50 w-full  shadow-xl px-6 py-6"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between w-full">
                <Link
                  href="/"
                  className="text-2xl font-bold text-tertiary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Arise Deborah
                </Link>
                <button
                  type="button"
                  className="p-2.5 text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="mt-6 space-y-2 bg-[#C08B5C] w-full">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-accent hover:bg-primary/5 hover:text-primary"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Profile Button for Mobile */}
              <div className="mt-6">
                <UserButton afterSignOutUrl="/" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navigation;
