"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const categories = [
  "All",
  "Sunday Service",
  "Bible Study",
  "Special Event",
  "Youth Service",
  "Women's Ministry",
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
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
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

        {/* Search & Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Search sermons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 px-4 py-2 shadow-sm border-primary/20 rounded-md focus:outline-none outline-none shadow-[#FFC94A]"
            />
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap shadow-[#FFC94A] shadow-sm ${
                    selectedCategory === category
                      ? "bg-[#795458] text-whit"
                      : "text-accent hover:bg-primary/10 border-primary/20"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sermon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSermons.map((sermon, index) => (
            <motion.div
              key={sermon._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-whit rounded-lg shadow-sm  border-primary/20 overflow-hidden hover:shadow-md transition-shadow duration-300 shadow-[#FFC94A]"
            >
              <div className="relative h-48">
                <img
                  src={sermon.thumbnailUrl}
                  alt={sermon.title}
                  onError={(e) => (e.currentTarget.src = "/fallback.png")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setSelectedSermon({ ...sermon, type: "video" })
                    }
                    className="p-2 bg-whit rounded-full hover:bg-gray-200"
                  >
                    ▶️
                  </button>
                  <button
                    onClick={() =>
                      setSelectedSermon({ ...sermon, type: "audio" })
                    }
                    className="p-2 bg-whit rounded-full hover:bg-gray-200"
                  >
                    🎧
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary">
                    {format(new Date(sermon.date), "MMM d, yyyy")}
                  </span>
                  <span className="text-sm font-medium text-accent">
                    {sermon.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-tertiary mb-2">
                  {sermon.title}
                </h3>
                <p className="text-accent mb-4">{sermon.description}</p>
                <div className="text-sm text-accent mb-2">
                  👤 {sermon.preacher}
                </div>
                <div className="text-sm text-accent">📖 {sermon.scripture}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-6 py-3 shadow-sm shadow-primary/20 border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-white shadow-[#FFC94A] hover:shadow-md transition-shadow duration-300">
            Load More ⬇️
          </button>
        </motion.div>
      </div>

      {/* Modal */}
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
              className="bg-whit rounded-lg w-full max-w-4xl relative"
            >
              <button
                onClick={() => setSelectedSermon(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                ❌
              </button>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-tertiary mb-2">
                  {selectedSermon.title}
                </h2>

                <div className="mb-4">
                  {selectedSermon.type === "video" ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md">
                      🎥 Video Sermon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md">
                      🎧 Audio Sermon
                    </span>
                  )}
                </div>

                {selectedSermon.type === "video" ? (
                  <CldVideoPlayer
                    width="100%"
                    height="500"
                    aspectRatio="16:9"
                    src={selectedSermon.videoUrl}
                    controls
                    autoPlay
                    className="rounded-lg"
                  />
                ) : (
                  <audio
                    controls
                    autoPlay
                    className="w-full mt-2 rounded-lg"
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
