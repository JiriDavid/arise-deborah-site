"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "./components/UpcomingEvents";
import { SignInButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const featuredItems = [
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
  {
    title: "Testimonies",
    description: "Read stories of transformation from our global family.",
    link: "/testimonies",
    icon: "💬",
    bgImage: "/testimony.jpg",
  },
];

const communityStats = [
  { label: "Daily Prayer", value: "5AM", accent: "Faith Room" },
  { label: "Nations Reached", value: "18+", accent: "Global" },
  { label: "Sermons Online", value: "120+", accent: "Library" },
];

const ministryHighlights = [
  {
    title: "Mentorship Circles",
    description:
      "Monthly equipping rooms where women receive guidance, covering, and accountability.",
  },
  {
    title: "Prayer Rooms",
    description:
      "Simplified access to immersive LiveKit sessions for intercession, healing, and communion.",
  },
  {
    title: "Kingdom Initiatives",
    description:
      "Strategic outreaches, conferences, and community projects led by the Arise Deborah network.",
  },
];

const heroImages = [
  "/arise-5.jpeg",
  "/arise-6.jpeg",
  "/arise-8.jpeg",
  "/arise-10.jpeg",
  "/arise-11.jpeg",
  "/arise-9.jpeg",
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] pb-20">
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Arise Deborah"
              fill
              sizes="100vw"
              priority={index === 0}
              quality={90}
              className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 pt-28 pb-32 md:pt-36 md:pb-40">
          <motion.div
            className="text-center max-w-4xl text-[#E6B53D]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center gap-3 mb-6 sm:flex-row sm:justify-center sm:flex-wrap">
              <p className="uppercase tracking-[0.35em] text-xs sm:text-sm text-[#FFC94A]/90">
                Arise Deborah International
              </p>
              <div className="flex w-full flex-col gap-2 xs:flex-row xs:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="rounded-md bg-[#937a38] px-4 py-2 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#a28535] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Contact Us
                </Link>
                <SignInButton
                  mode="modal"
                  className="rounded-md bg-[#3a6b25] px-4 py-2 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-[#4a7b35] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-secondary cursor-pointer"
                >
                  Sign In
                </SignInButton>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              A House of Prayer, Leadership, and Revival
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-[#FFE9B5] mb-10">
              Faith-filled gatherings, prophetic prayer rooms, and spirit-led
              mentorship for women called to influence culture.
            </p>
          </motion.div>
        </div>
        <div className="relative z-20 w-full px-4 sm:px-6 -mt-16 md:-mt-24">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {communityStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-lg py-4 px-6 text-center"
              >
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#FFC94A]">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-white/70">{stat.accent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      {/* <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-accent mb-2">
            Featured Rhythms
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-tertiary">
            Encounters that shape your week
          </h2>
          <p className="text-accent mt-3">
            Daily prayer lobbies, on-demand sermons, and testimonies to build
            your faith.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {featuredItems.map((item) => (
            <motion.div
              key={item.title}
              className="text-center shadow-[#FFC94A]/50 p-8 rounded-3xl shadow-sm bg-cover bg-center text-white relative overflow-hidden"
              style={{ backgroundImage: `url(${item.bgImage})` }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 bg-black/50 rounded-3xl" />
              <div className="relative z-10 flex flex-col gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-white/80">{item.description}</p>
                </div>
                <Link
                  href={item.link}
                  className="inline-flex items-center justify-center gap-2 text-[#FFC94A] font-semibold"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Upcoming Events Section */}
      <UpcomingEvents />

      {/* Ministry Highlights */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-[#f5d6a3]/70  p-8 shadow-lg">
            <p className="text-xs uppercase tracking-[0.35em] text-secondary">
              Deepen Your Roots
            </p>
            <h3 className="text-3xl font-semibold text-tertiary mt-3">
              Ministries and rooms for women leading with grace
            </h3>
            <p className="text-accent mt-4">
              Whether you are cultivating a prayer altar at home, building
              influence in the marketplace, or guiding a community, Arise
              Deborah offers curated spaces to equip you.
            </p>
            <div className="mt-8 space-y-5">
              {ministryHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-[#fbe0b6]  p-5"
                >
                  <h4 className="text-xl font-semibold text-tertiary">
                    {highlight.title}
                  </h4>
                  <p className="text-accent mt-1">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#5f3a19] text-white p-8 flex flex-col gap-6 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#FFC94A]">
              Prayer Focus
            </p>
            <p className="text-2xl font-semibold">
              “We watch women rise daily with prophetic clarity, healing, and
              kingdom solutions.”
            </p>
            <p className="text-white/70 text-sm">
              - Apostle Dr Joice Chiyaka, Visionary
            </p>
            <Link
              href="/prayer-rooms"
              className="inline-flex items-center justify-center rounded-2xl bg-[#FFC94A] px-6 py-3 font-semibold text-[#2B1B0F] shadow-lg shadow-[#FFC94A]/30"
            >
              Explore Prayer Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-24 px-6 bg-secondary/10 shadow-sm mb-6 shadow-[#FFC94A] mx-6 rounded-lg">
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
      </section> */}
    </div>
  );
}
