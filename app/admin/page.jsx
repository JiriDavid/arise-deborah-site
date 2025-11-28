// This is a basic admin dashboard setup using Next.js (App Router), MongoDB, and Cloudinary
// Assumptions:
// - You have authentication already set up
// - You have models: Sermon, Event
// - This is a Client Component under /app/(admin)/dashboard/page.jsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  FiVideo,
  FiCalendar,
  FiUsers,
  FiPlus,
  FiEdit3,
  FiActivity,
  FiMessageCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useUser();
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [prayerRooms, setPrayerRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Placeholder for prayer requests
  const [prayerRequests, setPrayerRequests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sermonRes, eventRes, testimonyRes, prayerRoomRes] =
          await Promise.all([
            axios.get("/api/sermons"),
            axios.get("/api/events"),
            axios.get("/api/testimonies"),
            axios.get("/api/prayer-rooms"),
          ]);
        setSermons(sermonRes.data);
        setEvents(eventRes.data);
        setTestimonies(testimonyRes.data);
        setPrayerRooms(prayerRoomRes.data);
        // Placeholder: setPrayerRequests([]) or fetch if available
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/${type}/${id}`);
      if (type === "sermons") {
        setSermons(sermons.filter((s) => s._id !== id));
      } else if (type === "events") {
        setEvents(events.filter((e) => e._id !== id));
      } else if (type === "testimonies") {
        setTestimonies(testimonies.filter((t) => t._id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-tertiary">
        Preparing your command center...
      </div>
    );

  const dashboardStats = [
    {
      title: "Total Sermons",
      value: sermons.length,
      accent: "from-[#5DE0E6] to-[#004AAD]",
      icon: <FiVideo size={24} />,
      subtitle: "Uploaded talks",
    },
    {
      title: "Upcoming Events",
      value: events.length,
      accent: "from-[#FBB034] to-[#FF0080]",
      icon: <FiCalendar size={24} />,
      subtitle: "Community moments",
    },
    {
      title: "Testimonies",
      value: testimonies.length,
      accent: "from-[#8E2DE2] to-[#4A00E0]",
      icon: <FiUsers size={24} />,
      subtitle: "Stories of faith",
    },
    {
      title: "Prayer Rooms",
      value: prayerRooms.length,
      accent: "from-[#52E5E7] to-[#130CB7]",
      icon: <FiActivity size={24} />,
      subtitle: "Live sessions",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-3xl  border-[#FFC94A]/30 bg-gradientto-r from-[#1f1005] via-[#2b1b0f] to-[#3a1f0c] p-4 text-white ">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="uppercase tracking-[0.35em] text-xs text-[#FFC94A]">
              Admin Control Deck
            </p>
            <h1 className="text-4xl font-bold mt-3 text-[#FFE5B4]">
              Welcome back, {user?.firstName || "Leader"}
            </h1>
            <p className="text-white/80 max-w-2xl">
              Use this space to shepherd sermons, events, testimonies, and
              prayer rooms with precision while staying rooted in the Arise
              Deborah palette.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/admin/prayer-rooms")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFC94A] px-6 py-3 font-semibold text-[#2B1B0F] shadow-lg shadow-[#FFC94A]/40"
            >
              <FiEdit3 /> Quick Draft
            </button>
            <button
              onClick={() => router.push("/admin/events")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-6 py-3 text-white/80 hover:text-white"
            >
              <FiCalendar /> Calendar View
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-[#c08b5c]/30 b-[#2b1b0f]/60 p-5 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">{stat.subtitle}</span>
                <span className="text-[#FFC94A]">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold mt-4 text-[#FFE5B4]">
                {stat.value}
              </p>
              <p className="text-sm text-white/60">{stat.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Publish Sermon",
            href: "/admin/sermons",
            color: "bg-[#2B1B0F]",
          },
          {
            label: "Schedule Event",
            href: "/admin/events",
            color: "bg-[#51361d]",
          },
          {
            label: "Collect Testimony",
            href: "/admin/testimonies",
            color: "bg-[#6b4425]",
          },
          {
            label: "Launch Prayer Room",
            href: "/admin/prayer-rooms",
            color: "bg-[#8a5a2e]",
          },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(action.href)}
            className={`${action.color} rounded-2xl px-6 py-5 text-left text-white shadow-lg shadow-black/30 border border-white/10 hover:translate-y-[-4px] transition`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{action.label}</span>
              <FiPlus />
            </div>
            <p className="text-sm text-white/70 mt-1">Open workflow</p>
          </motion.button>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#c08b5c]/30 bg-whit text-tertiary p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Content Stream
              </p>
              <h2 className="text-2xl font-semibold text-tertiary">
                Recent Sermons
              </h2>
            </div>
            <button
              onClick={() => router.push("/admin/sermons")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <ul className="space-y-4">
            {sermons.slice(0, 5).map((sermon) => (
              <li
                key={sermon._id}
                className="rounded-2xl border border-[#f5d6a3]/70 bg-[#fffaf p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-tertiary">{sermon.title}</p>
                  <p className="text-xs text-accent">
                    {sermon.date?.slice(0, 10) || "Date TBD"}
                  </p>
                </div>
                <span className="text-xs text-secondary">Ready</span>
              </li>
            ))}
            {sermons.length === 0 && (
              <li className="text-accent">No recent sermons.</li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#f5d6a3]/60  p-6 text-tertiary shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                Schedule Radar
              </p>
              <h2 className="text-2xl font-semibold text-tertiary">
                Upcoming Events
              </h2>
            </div>
            <button
              onClick={() => router.push("/admin/events")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <ul className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <li
                key={event._id}
                className="rounded-2xl border border-[#fbe0b6]  p-4"
              >
                <p className="font-semibold text-tertiary">{event.title}</p>
                <div className="text-xs text-accent flex items-center justify-between mt-1">
                  <span>{event.date?.slice(0, 10) || "Date TBD"}</span>
                  <span>{event.location || "Online"}</span>
                </div>
              </li>
            ))}
            {events.length === 0 && (
              <li className="text-accent">No upcoming events.</li>
            )}
          </ul>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-[#c08b5c]/30 bg-gradient-to-r from-[#3c2718] to-[#2b1b0f] p-6 text-white"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#FFC94A]">
              Community Pulse
            </p>
            <h2 className="text-2xl font-semibold text-[#FFE5B4]">
              Feedback & Testimonies
            </h2>
            <p className="text-white/80 text-sm">
              Latest stories shared by the community across platforms.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/testimonies")}
            className="inline-flex items-center gap-2 rounded-full border border-[#FFC94A]/60 px-4 py-2 text-sm text-white"
          >
            <FiMessageCircle /> Manage
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonies.slice(0, 3).map((testimony) => (
            <div
              key={testimony._id}
              className="rounded-2xl bg-white/10 p-4 h-full flex flex-col gap-2 border border-white/10"
            >
              <p className="text-sm text-white/90">
                “{testimony.content?.slice(0, 120) || "Story coming soon..."}”
              </p>
              <span className="text-xs text-white/50">
                {testimony.name || "Anonymous"}
              </span>
            </div>
          ))}
          {testimonies.length === 0 && (
            <p className="text-white/70">No testimonies shared yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
