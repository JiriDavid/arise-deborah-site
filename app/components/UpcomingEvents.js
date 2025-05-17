"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

const events = [
  {
    id: 1,
    title: "Sunday Service",
    date: new Date(2024, 2, 24, 10, 0),
    description: "Join us for worship and the Word every Sunday morning.",
    location: "Main Sanctuary",
    type: "service",
  },
  {
    id: 2,
    title: "Youth Night",
    date: new Date(2024, 2, 27, 19, 0),
    description:
      "A special evening for our youth with worship, games, and fellowship.",
    location: "Youth Center",
    type: "youth",
  },
  {
    id: 3,
    title: "Bible Study",
    date: new Date(2024, 2, 28, 19, 0),
    description:
      "Weekly Bible study focusing on spiritual growth and understanding.",
    location: "Fellowship Hall",
    type: "study",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-tertiary mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-accent max-w-2xl mx-auto">
            Join us for these upcoming gatherings and be part of our community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className=" rounded-lg shadow-sm border border-primary/20 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-primary rounded-md borde bg-[#795458] border-primary p-2">
                    {format(event.date, "MMM d, yyyy")}
                  </span>
                  <span className="text-sm text-accent font-bold">
                    {format(event.date, "h:mm a")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-tertiary mb-2">
                  {event.title}
                </h3>
                <p className="text-accent mb-4">{event.description}</p>
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      className="text-[#FFC94A]"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      className="text-[#FFC94A]"
                    />
                  </svg>
                  {event.location}
                </div>
                <Link
                  href="/events"
                  className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-[#FFC94A]" 
                >
                  Learn More
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/events"
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-white transition-colors duration-200"
          >
            View All Events
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
