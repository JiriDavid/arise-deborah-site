"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const categories = [
  "All",
  "Sunday Service",
  "Bible Study",
  "Events",,
  "Ministry",
];

const heroHighlights = [
  { label: "Weekly streams", value: "4" },
  { label: "Podcast plays", value: "18k" },
  { label: "Cities tuning in", value: "27" },
];

export default function SermonsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [sermons, setSermons] = useState([]);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const response = await fetch("/api/sermons");
        const data = await response.json();
        setSermons(data);
      } catch (error) {
        console.error("Error fetching sermons:", error);
      }
    };
    fetchSermons();
  }, []);

  const filteredSermons = useMemo(() => {
    return sermons.filter((sermon) => {
      const title = sermon.title || "Untitled";
      const preacher = sermon.preacher || "Arise Team";
      const description = sermon.description || "";
      const matchesCategory =
        selectedCategory === "All" || sermon.category === selectedCategory;
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, sermons]);

  return (
    <div className="min-h-screen bg-[#0d0906 text-white pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#25130b] via-[#34160a] to-[#461a09] p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
            Latest messages
          </p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="md:text-4xl font-semibold leading-tight text-xl">
                Sermons that disciple women for prayer, leadership, and impact.
              </h1>
              <p className="text-white/80">
                Search the archive, filter by gathering, and stream in video or
                audio formats anywhere in the world.
              </p>
            </div>
            <button className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-[#FFC94A] hover:text-[#FFC94A]">
              Subscribe to podcast →
            </button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {heroHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="text-3xl font-semibold text-[#FFC94A]">
                  {highlight.value}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {highlight.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Search / Filters */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, preacher, scripture"
                className="w-full rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[#FFC94A] focus:outline-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
                ⌕
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    selectedCategory === category
                      ? "border-[#FFC94A] bg-[#FFC94A]/20 text-[#FFC94A]"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Sermon Grid */}
        <section className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredSermons.map((sermon, index) => (
            <motion.article
              key={sermon._id || `${sermon.title}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="relative h-64">
                <Image
                  src={sermon.thumbnailUrl || "/sermon.jpg"}
                  alt={sermon.title || "Sermon thumbnail"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20" />
                <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                  {sermon.category || "Gathering"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedSermon({ ...sermon, type: "video" })
                    }
                    className="rounded-full border border-white/30 bg-black/40 px-4 py-3 text-xl text-white hover:border-[#FFC94A]"
                  >
                    ▶
                  </button>
                  {sermon.audioUrl && (
                    <button
                      onClick={() =>
                        setSelectedSermon({ ...sermon, type: "audio" })
                      }
                      className="rounded-full border border-white/30 bg-black/40 px-4 py-3 text-xl text-white hover:border-[#FFC94A]"
                    >
                      ♪
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <span>
                    {sermon.date
                      ? format(new Date(sermon.date), "MMM d, yyyy")
                      : "Date TBA"}
                  </span>
                  <span>{sermon.scripture || ""}</span>
                </div>
                <h3 className="text-2xl font-semibold text-white">
                  {sermon.title || "Untitled Message"}
                </h3>
                <p className="text-white/70 line-clamp-3">
                  {sermon.description || "Message summary coming soon."}
                </p>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>👤 {sermon.preacher || "Arise Team"}</span>
                  <span>⏱ {sermon.duration || "45 min"}</span>
                </div>
              </div>
            </motion.article>
          ))}
          {filteredSermons.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-white/70">
              No sermons match that filter yet. Try another keyword.
            </div>
          )}
        </section>

        {/* Archive CTA */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-[#2e170b] from-[#120a06] via-[#1c0d07] to-[#2a1007] p-8 text-center">
          <h3 className="text-2xl font-semibold">Need older teachings?</h3>
          <p className="mt-3 text-white/70">
            Our archive spans five years of conferences, bible studies, and
            marketplace intensives. Drop our media team a note and we will send
            curated playlists.
          </p>
          <button className="mt-6 inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover-border-[#FFC94A]">
            Request archive access
          </button>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedSermon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-[#120a06] p-6"
            >
              <button
                onClick={() => setSelectedSermon(null)}
                className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white/70 hover:text-white"
              >
                ✕
              </button>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
                    {selectedSermon.category || "Featured"}
                  </p>
                  <h3 className="text-3xl font-semibold text-white">
                    {selectedSermon.title}
                  </h3>
                  <p className="text-white/70">
                    {selectedSermon.preacher || "Arise Team"}
                    {selectedSermon.scripture
                      ? ` · ${selectedSermon.scripture}`
                      : ""}
                  </p>
                </div>
                {selectedSermon.type === "video" ? (
                  <CldVideoPlayer
                    width="100%"
                    height="500"
                    aspectRatio="16:9"
                    src={selectedSermon.videoUrl}
                    controls
                    autoPlay
                    className="rounded-2xl"
                  />
                ) : (
                  <audio
                    controls
                    autoPlay
                    className="w-full rounded-2xl"
                    src={selectedSermon.audioUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
