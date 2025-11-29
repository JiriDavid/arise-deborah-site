"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const categories = ["All", "Healing", "Provision", "Family", "Marketplace"];

export default function TestimoniesPage() {
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [testimonies, setTestimonies] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchTestimonies = async () => {
      const response = await fetch("/api/testimonies");
      const data = await response.json();
      setTestimonies(data);
    };
    fetchTestimonies();
  }, []);

  const filteredTestimonies = useMemo(() => {
    if (activeCategory === "All") return testimonies;
    return testimonies.filter((item) =>
      item.tags?.some(
        (tag) => tag.toLowerCase() === activeCategory.toLowerCase()
      )
    );
  }, [activeCategory, testimonies]);

  return (
    <div className="min-h-screen  text-white pt-32 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#2b1b0f] to-[#3a1f0c] p-10 mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A] mb-3">
            Stories from the altar
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Testimonies that build faith
              </h1>
              <p className="mt-3 text-white/80">
                Healings, breakthrough, restoration—captured in video and
                written stories from women across nations.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold"
            >
              Share your story
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["Healing rooms", "Marketplace wins", "Family revival"].map(
              (highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80"
                >
                  {highlight}
                </div>
              )
            )}
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                activeCategory === category
                  ? "border-[#FFC94A] bg-[#FFC94A]/20 text-[#FFC94A]"
                  : "border-white/10 text-white/70 hover:text-white hover:border-white/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredTestimonies.map((testimonial, index) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden shadow-lg"
            >
              <div className="relative h-56">
                <Image
                  src={testimonial.thumbnailUrl || "/testimony.jpg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedTestimony(testimonial)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-[#FFC94A] text-4xl"
                >
                  ▶
                </button>
                <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                  Video
                </div>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm uppercase tracking-[0.35em] text-[#FFC94A]">
                  {testimonial.role || "Testimony"}
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {testimonial.name}
                </h3>
                <p className="text-white/70 line-clamp-3">
                  {testimonial.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {testimonial.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedTestimony && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-4xl rounded-3xl border-white/10  p-6"
              >
                <button
                  onClick={() => setSelectedTestimony(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white/70 hover:text-white"
                >
                  ✕
                </button>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
                      {selectedTestimony.role || "Story"}
                    </p>
                    <h3 className="text-3xl font-semibold text-white">
                      {selectedTestimony.name}
                    </h3>
                    {/* <p className="text-white/70 italic">
                      “
                      {selectedTestimony.quote || selectedTestimony.description}
                      ”
                    </p> */}
                  </div>
                  <CldVideoPlayer
                    width="100%"
                    height="500"
                    aspectRatio="16:9"
                    src={selectedTestimony.videoUrl}
                    controls
                    autoPlay
                    className="rounded-2xl"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
