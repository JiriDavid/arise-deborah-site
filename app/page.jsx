"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "./components/UpcomingEvents";
import { SignInButton, UserButton } from "@clerk/nextjs";

const items = [
  {
    title: "UK 5AM Prayer Session",
    description: "Join us everyday at 5:00 AM for prayers and the Word.",
    link: "/events",
    icon: "⛪",
    bgImage: "/prayer.jpg",
  },
  {
    title: "Latest Sermons",
    description: "Watch or listen to our latest messages online.",
    link: "/sermons",
    icon: "🎤",
    bgImage: "/sermon.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="relative h-screen">
        <Image
          src="/praise-3.jpeg"
          alt="Church interior"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 text-[#E6B53D] bg-black/40">
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-tertiary mb-6">
                Welcome to Arise Deborah International
              </h1>
              <p className="text-xl md:text-2xl text-accent mb-12 max-w-3xl mx-auto ">
                A place of worship, community, and spiritual growth where faith
                comes alive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/about"
                  className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-tertiary shadow-sm shadow-[#FFC94A] hover:bg-primary-light focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary hover:shadow-md"
                >
                  Learn More
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md text-white bg-[#E6B53D] px-6 py-3 text-lg font-semibold text-tertiary border-primary shadow-sm hover:bg-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Contact Us
                </Link>
                <div className="flex justify-center">
                  <SignInButton
                    mode="modal"
                    className="rounded-md bg-secondary px-6 py-3 text-lg font-semibold text-tertiary shadow-sm hover:bg-secondary-light focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    Sign In
                  </SignInButton>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {items.map((item) => (
              <motion.div
                key={item.title}
                className="text-center shadow-[#FFC94A] p-8 rounded-lg shadow-sm bg-cover bg-center text-white relative overflow-hidden"
                style={{ backgroundImage: `url(${item.bgImage})` }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/40 rounded-lg z-0" />
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="mb-4 text-white">{item.description}</p>
                  <Link
                    href={item.link}
                    className="text-[#FFC94A] hover:text-yellow-400 font-medium transition-transform duration-300 hover:translate-x-1"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <UpcomingEvents />

      {/* Call to Action */}
      <div className="py-24 px-6 bg-secondary/10 shadow-sm mb-6 shadow-[#FFC94A] mx-6 rounded-lg">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-tertiary sm:text-4xl mb-6">
            Join Us This Sunday
          </h2>
          <p className="text-lg text-accent mb-8 max-w-2xl mx-auto">
            Experience the warmth of our community and the power of worship.
            Everyone is welcome!
          </p>
          <Link
            href="/contact"
            className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-tertiary shadow-sm hover:bg-primary-light focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary hover:shadow-md shadow-[#FFC94A]"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
