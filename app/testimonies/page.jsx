"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";



export default function TestimoniesPage() {
  const [selectedTestimony, setSelectedTestimony] = useState(null);
  const [testimonies, setTestimonies] = useState([]);

  useEffect(() => {
    const fetchTestimonies = async () => {
      const response = await fetch("/api/testimonies");
      const data = await response.json();
      setTestimonies(data);
    };
    fetchTestimonies();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="relative w-[90%] h-[60vh] mx-auto">
            <Image
              src="/prayer.jpg"
              alt="Testimonies Header"
              fill
              className="object-cover rounded-xl shadow-lg"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link
                      href="/"
                      className="text-sm font-medium text-white hover:text-gray-200"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-white mx-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-white">
                        Testimonies
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Testimonies
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Hear from our community members about their experiences with Arise
            Deborah.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              onClick={() => setSelectedTestimony(testimonial)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer rounded-xl shadow-md shadow-[#FFC94A] overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={testimonial.thumbnailUrl}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 rounded-full shadow-md text-lg">
                    ▶️
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="italic mb-4">
                  "{testimonial.description}"
                </p>
                <h3 className="text-lg font-semibold text-tertiary">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-accent">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimony Modal */}
        <AnimatePresence>
          {selectedTestimony && (
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
                className="rounded-lg w-full max-w-3xl p-6 relative"
              >
                <button
                  onClick={() => setSelectedTestimony(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-700 text-xl"
                >
                  ✖
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedTestimony.name}
                </h2>
                <p className="text-white mb-4 italic">
                  "{selectedTestimony.quote}"
                </p>
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC94A] text-white text-sm font-medium rounded-md">
                    🎥 Testimony Video
                  </span>
                </div>
                <CldVideoPlayer
                  width="100%"
                  height="500"
                  aspectRatio="16:9"
                  src={selectedTestimony.videoUrl}
                  controls
                  autoPlay
                  className="rounded-lg"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
