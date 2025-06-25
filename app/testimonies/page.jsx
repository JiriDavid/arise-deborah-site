"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Community Member",
    quote: "Arise Deborah has transformed my spiritual journey with their inspiring events and supportive community.",
    image: "/testimony.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Volunteer",
    quote: "The opportunity to serve with Arise Deborah has been life-changing. Their mission truly makes a difference.",
    image: "/testimony.jpg",
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Program Participant",
    quote: "The programs offered by Arise Deborah helped me grow in faith and connect with amazing people.",
    image: "/testimony.jpg",
  },
];

export default function Testimonies() {
  return (
    <div className="min-h-screen ">
      <div className="py-16 px-6 pt-24">
        {/* Breadcrumb Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="relative w-[90%] h-[60vh] mx-auto">
              <Image
                src="/prayer.jpg"
                alt="Testimonies Header"
                fill
                className="object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center">
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-white hover:text-gray-200"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-1 text-sm font-medium text-white md:ml-2">
                          Testimonies
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
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
          <p className="text-lg text-whitw max-w-2xl mx-auto">
            Hear from our community members about their experiences with Arise Deborah
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className=" rounded-xl shadow-md shadow-[#FFC94A] overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-white italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-white">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}