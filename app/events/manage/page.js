"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    image: "",
    description: "",
    category: "",
    registrationRequired: false,
  });
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingEvent ? "PUT" : "POST";
    const url = editingEvent ? `/api/events/${editingEvent._id}` : "/api/events";
    
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (editingEvent) {
      setEvents(events.map((ev) => (ev._id === data._id ? data : ev)));
    } else {
      setEvents([...events, data]);
    }

    setForm({
      title: "",
      date: "",
      time: "",
      location: "",
      image: "",
      description: "",
      category: "",
      registrationRequired: false,
    });
    setEditingEvent(null);
  };

  const deleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents(events.filter((ev) => ev._id !== id));
  };

  const startEdit = (event) => {
    setForm(event);
    setEditingEvent(event);
  };

  return (
    <>
      
      <div className="p-8 bg-secondary min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6 text-primary mt-20">Manage Events</h1>

        {/* Event Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-secondary-light p-6 rounded-xl shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-4">{editingEvent ? "Edit Event" : "Add New Event"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input placeholder="Date" type="date" required className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <input placeholder="Time" required className="input" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            <input placeholder="Location" required className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input placeholder="Image Path" className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <input placeholder="Category" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <textarea placeholder="Description" className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.registrationRequired} onChange={(e) => setForm({ ...form, registrationRequired: e.target.checked })} />
            Registration Required
          </label>
          <button type="submit" className="bg-primary px-6 py-2 rounded-lg hover:bg-primary/80 transition-all text-secondary font-semibold">
            {editingEvent ? "Update" : "Add Event"}
          </button>
        </form>

        {/* Events List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-secondary-light p-4 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-primary">{event.title}</h3>
              <p className="text-sm text-white/80">{event.date} at {event.time}</p>
              <p className="text-white mt-2">{event.description}</p>
              <div className="mt-4 flex gap-3">
                <button onClick={() => startEdit(event)} className="text-yellow-400 hover:underline flex items-center gap-1">
                  <FiEdit2 /> Edit
                </button>
                <button onClick={() => deleteEvent(event._id)} className="text-red-500 hover:underline flex items-center gap-1">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
