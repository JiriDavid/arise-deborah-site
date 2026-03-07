"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const zoomMeetings = [
  {
    title: "Early Morning Prayer",
    time: "5:00 AM - 6:00 AM",
    timezone: "UK Time (GMT/BST)",
    zoomLink: "https://us06web.zoom.us/j/11111111111",
  },
  {
    title: "Midday Intercession",
    time: "12:00 PM - 1:00 PM",
    timezone: "UK Time (GMT/BST)",
    zoomLink: "https://us06web.zoom.us/j/22222222222",
  },
  {
    title: "Evening Revival Prayer",
    time: "8:00 PM - 9:00 PM",
    timezone: "UK Time (GMT/BST)",
    zoomLink: "https://us06web.zoom.us/j/33333333333",
  },
];

export default function ZoomMeetingsPage() {
  return (
    <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-primary/30 bg-gradient-to-r from-[#2b1b0f] to-[#3a1f0c] p-8 shadow-xl sm:p-10"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
            Daily Prayer Schedule
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-[#FFE5B4] sm:text-5xl">
            Join Our Zoom Meetings Throughout the Day
          </h1>
          <p className="mt-4 max-w-3xl text-base text-white/80 sm:text-lg">
            Gather with the community for morning, midday, and evening prayer
            sessions. Pick a time slot and join instantly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-white/80"
            >
              3 Daily Sessions
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-white/80"
            >
              UK Time (GMT/BST)
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.36 }}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-white/80"
            >
              Zoom Access Links
            </motion.span>
          </div>
        </motion.section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {zoomMeetings.map((meeting, index) => (
            <motion.article
              key={meeting.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex h-full flex-col justify-between rounded-3xl border border-[#fbe0b6]/70 bg-[#fff8ec]/20 p-6 shadow-lg"
            >
              <div>
                <span className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">
                  Session {index + 1}
                </span>

                <h2 className="mt-4 text-2xl font-semibold text-tertiary">
                  {meeting.title}
                </h2>

                <div className="mt-4 space-y-2 text-accent">
                  <p className="text-base font-medium">{meeting.time}</p>
                  <p className="text-sm">{meeting.timezone}</p>
                </div>
              </div>

              <Link
                href={meeting.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#FFC94A] px-5 py-3 font-semibold text-[#2B1B0F] shadow-lg shadow-[#FFC94A]/30 transition hover:bg-[#ffd778]"
              >
                Join on Zoom
              </Link>
            </motion.article>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl border border-primary/30 p-6 text-center sm:p-8"
        >
          <p className="text-sm text-accent">
            Tip: Save this page to quickly access your preferred prayer session
            each day.
          </p>
        </motion.section>
      </div>
    </main>
  );
}
