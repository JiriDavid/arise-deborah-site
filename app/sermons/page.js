"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const sermons = [
  {
    id: 1,
    title: "Walking in Faith",
    preacher: "Pastor John Smith",
    date: new Date(2024, 2, 24),
    description:
      "Understanding how to walk in faith through life's challenges and victories.",
    category: "Faith",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "sermons/walking-in-faith",
    audioUrl: "sermons/walking-in-faith-audio",
    scripture: "Hebrews 11:1-6",
  },
  {
    id: 2,
    title: "The Power of Prayer",
    preacher: "Pastor Sarah Johnson",
    date: new Date(2024, 2, 17),
    description:
      "Discovering the transformative power of prayer in our daily lives.",
    category: "Prayer",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    videoUrl: "sermons/power-of-prayer",
    audioUrl: "sermons/power-of-prayer-audio",
    scripture: "James 5:13-16",
  },
  {
    id: 3,
    title: "Living in God's Love",
    preacher: "Pastor Michael Brown",
    date: new Date(2024, 2, 10),
    description:
      "Understanding and experiencing God's unconditional love for us.",
    category: "Love",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80",
    videoUrl: "sermons/living-in-gods-love",
    audioUrl: "sermons/living-in-gods-love-audio",
    scripture: "1 John 4:7-12",
  },
  {
    id: 4,
    title: "The Fruit of the Spirit",
    preacher: "Pastor Emily Davis",
    date: new Date(2024, 2, 3),
    description:
      "Exploring the nine fruits of the Spirit and their impact on our lives.",
    category: "Spiritual Growth",
    image:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    videoUrl: "sermons/fruit-of-the-spirit",
    audioUrl: "sermons/fruit-of-the-spirit-audio",
    scripture: "Galatians 5:22-23",
  },
  {
    id: 5,
    title: "Finding Peace in Christ",
    preacher: "Pastor David Wilson",
    date: new Date(2024, 1, 27),
    description:
      "Learning to find true peace through our relationship with Jesus Christ.",
    category: "Peace",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "sermons/finding-peace-in-christ",
    audioUrl: "sermons/finding-peace-in-christ-audio",
    scripture: "Philippians 4:6-7",
  },
];

const categories = [
  "All",
  "Faith",
  "Prayer",
  "Love",
  "Spiritual Growth",
  "Peace",
];

export default function SermonsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);

  const filteredSermons = sermons.filter((sermon) => {
    const matchesCategory =
      selectedCategory === "All" || sermon.category === selectedCategory;
    const matchesSearch =
      sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto mt-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold text-tertiary mb-4">Sermons</h1>
            <p className="text-lg text-accent max-w-2xl mx-auto">
              Watch or listen to our latest messages and be inspired by God's
              Word.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search sermons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap border border-primary/20  ${
                      selectedCategory === category
                        ? "bg-[#795458] text-white"
                        : " text-accent hover:bg-primary/10"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg- rounded-lg shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={sermon.image}
                    alt={sermon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          setSelectedSermon({ ...sermon, type: "video" })
                        }
                        className="p-2 bg-w rounded-full hover:bg-whit transition-colors"
                      >
                        <svg
                          className="w-6 h-6 text-tertiary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setSelectedSermon({ ...sermon, type: "audio" })
                        }
                        className="p-2 bg-whit0 rounded-full hover:bg-whte transition-colors"
                      >
                        <svg
                          className="w-6 h-6 text-tertiary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      {format(sermon.date, "MMM d, yyyy")}
                    </span>
                    <span className="text-sm font-medium text-accent">
                      {sermon.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-tertiary mb-2">
                    {sermon.title}
                  </h3>
                  <p className="text-accent mb-4">{sermon.description}</p>
                  <div className="flex items-center text-sm text-accent mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {sermon.preacher}
                  </div>
                  <div className="flex items-center text-sm text-accent">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    {sermon.scripture}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-white transition-colors duration-200">
              Load More
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedSermon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-4xl relative"
            >
              <button
                onClick={() => setSelectedSermon(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-tertiary mb-4">
                  {selectedSermon.title}
                </h2>
                {selectedSermon.type === "video" ? (
                  <CldVideoPlayer
                    width="100%"
                    height="500"
                    src={selectedSermon.videoUrl}
                    controls
                    autoPlay
                    className="rounded-lg"
                  />
                ) : (
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CldVideoPlayer
                      width="100%"
                      height="200"
                      src={selectedSermon.audioUrl}
                      controls
                      autoPlay
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
