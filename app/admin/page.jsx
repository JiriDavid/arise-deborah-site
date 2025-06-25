// This is a basic admin dashboard setup using Next.js (App Router), MongoDB, and Cloudinary
// Assumptions:
// - You have authentication already set up
// - You have models: Sermon, Event
// - This is a Client Component under /app/(admin)/dashboard/page.jsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [sermonRes, eventRes] = await Promise.all([
          axios.get("/api/sermons"),
          axios.get("/api/events"),
        ]);
        setSermons(sermonRes.data);
        setEvents(eventRes.data);
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
      } else {
        setEvents(events.filter((e) => e._id !== id));
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🎧 Sermons</h2>
        {sermons.length === 0 ? (
          <p>No sermons found.</p>
        ) : (
          <ul className="space-y-3">
            {sermons.map((sermon) => (
              <li
                key={sermon._id}
                className="bg-gray-100 p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <p className="font-medium">{sermon.title}</p>
                  <small>{sermon.date}</small>
                </div>
                <button
                  onClick={() => handleDelete("sermons", sermon._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📅 Events</h2>
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((event) => (
              <li
                key={event._id}
                className="bg-gray-100 p-4 rounded-lg shadow flex justify-between"
              >
                <div>
                  <p className="font-medium">{event.name}</p>
                  <small>{event.date}</small>
                </div>
                <button
                  onClick={() => handleDelete("events", event._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
