// This is a basic admin dashboard setup using Next.js (App Router), MongoDB, and Cloudinary
// Assumptions:
// - You have authentication already set up
// - You have models: Sermon, Event
// - This is a Client Component under /app/(admin)/dashboard/page.jsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiVideo, FiCalendar, FiUsers, FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Placeholder for prayer requests
  const [prayerRequests, setPrayerRequests] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sermonRes, eventRes, testimonyRes] = await Promise.all([
          axios.get("/api/sermons"),
          axios.get("/api/events"),
          axios.get("/api/testimonies"),
        ]);
        setSermons(sermonRes.data);
        setEvents(eventRes.data);
        setTestimonies(testimonyRes.data);
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

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary text-white rounded-xl shadow p-6 flex items-center gap-4 shadow-[#FFC94A]"
        >
          <FiVideo size={36} className="opacity-80" />
          <div>
            <div className="text-2xl font-bold">{sermons.length}</div>
            <div className="text-lg">Total Sermons</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-secondary text-white rounded-xl shadow p-6 flex items-center gap-4 shadow-[#FFC94A]"
        >
          <FiCalendar size={36} className="opacity-80" />
          <div>
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-lg">Total Events</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-tertiary text-white rounded-xl shadow p-6 flex items-center gap-4 shadow-[#FFC94A]"
        >
          <FiUsers size={36} className="opacity-80" />
          <div>
            <div className="text-2xl font-bold">{testimonies.length}</div>
            <div className="text-lg">Testimonies</div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => router.push("/admin/sermons")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-lg font-semibold shadow shadow-[#FFC94A] transition-all duration-200"
        >
          <FiPlus /> Add Sermon
        </button>
        <button
          onClick={() => router.push("/admin/events")}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-5 py-3 rounded-lg font-semibold shadow shadow-[#FFC94A] transition-all duration-200"
        >
          <FiPlus /> Add Event
        </button>
        <button
          onClick={() => router.push("/admin/testimonies")}
          className="flex items-center gap-2 bg-tertiary hover:bg-tertiary-dark text-white px-5 py-3 rounded-lg font-semibold shadow shadow-[#FFC94A] transition-all duration-200"
        >
          <FiPlus /> Add Testimony
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-xl shadow p-6 shadow-[#FFC94A]"
        >
          <h2 className="text-xl font-bold mb-4 text-tertiary">
            Recent Sermons
          </h2>
          <ul className="space-y-3">
            {sermons.slice(0, 5).map((sermon) => (
              <li
                key={sermon._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{sermon.title}</span>
                <span className="text-xs ">
                  {sermon.date?.slice(0, 10)}
                </span>
              </li>
            ))}
            {sermons.length === 0 && (
              <li className="text-gray-400">No recent sermons.</li>
            )}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="rounded-xl shadow shadow-[#FFC94A] p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-secondary">
            Upcoming Events
          </h2>
          <ul className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <li
                key={event._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">{event.title}</span>
                <span className="text-xs ">
                  {event.date?.slice(0, 10)}
                </span>
              </li>
            ))}
            {events.length === 0 && (
              <li className="">No upcoming events.</li>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
