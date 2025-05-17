"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import UpcomingEvents from "./components/UpcomingEvents";

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
        <div className="absolute inset-0 text-[#E6B53D] bg-black/50">
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
                  className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-tertiary shadow-sm hover:bg-primary-light focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary border-2 border-primary"
                >
                  Learn More
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md text-white bg-[#FFC94A] px-6 py-3 text-lg font-semibold text-tertiary border-primary shadow-sm hover:bg-primary focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Sunday Service",
                description:
                  "Join us every Sunday at 10:00 AM for worship and the Word.",
                link: "/events",
                icon: "⛪",
              },
              {
                title: "Latest Sermons",
                description: "Watch or listen to our latest messages online.",
                link: "/sermons",
                icon: "🎤",
              },
              {
                title: "Get Involved",
                description:
                  "Discover ways to serve and connect with our community.",
                link: "/ministries",
                icon: "🤝",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                className="text-center border-2 p-8 rounded-lg shadow-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-tertiary mb-2">
                  {item.title}
                </h3>
                <p className="text-accent mb-4">{item.description}</p>
                <Link
                  href={item.link}
                  className="text-primary hover:text-primary-dark font-medium text-[#FFC94A]"
                >
                  Learn More →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <UpcomingEvents />

      {/* Call to Action */}
      <div className="py-24 px-6 bg-secondary/10">
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
            className="rounded-md bg-primary px-6 py-3 text-lg font-semibold text-tertiary shadow-sm hover:bg-primary-light focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Plan Your Visit
          </Link>
        </div>
      </div>
    </div>
  );
}
