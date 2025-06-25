"use client";

import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Image from "next/image";
import { FiUsers, FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";
import "next-cloudinary/dist/cld-video-player.css";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
  });

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRegistration = (e) => {
    e.preventDefault();
    console.log("Registration submitted:", formData);
    setShowRegistration(false);
  };


  return (
    <>
      <div className="min-h-screen bg-secondary pt-12">
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
                  Upcoming Events
                </h1>
                <p className="mt-6 text-lg leading-8 text-white/90">
                  Join us for worship, fellowship, and community events that inspire and connect.
                </p>
              </motion.div>
              <motion.div
                className="relative aspect-video rounded-3xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Image
                  src="/fallback.png"
                  alt="Worship gathering"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/40" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {events.map((event,index) => (
              <motion.article
                key={event.id || index}
                className="group relative bg-secondary-light rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    {format(new Date(event.date), "MMM d")}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-2 text-primary/90 text-sm font-medium">
                      <FiUsers className="w-4 h-4" />
                      {event.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary mb-3">
                    {event.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm text-white/80 mb-4">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>

                  <p className="text-white/90 mb-5">{event.description}</p>

                  {event.registrationRequired ? (
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegistration(true);
                      }}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-[#FFC94A]"
                    >
                      <span>Register Now</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-accent flex items-center gap-2 text-[#FFC94A]">
                      <FiArrowRight className="w-4 h-4" />
                      <span>Walk-ins Welcome</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary-light rounded-xl p-8 max-w-md w-full border border-primary/20"
            >
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Register for {selectedEvent.title}
                </h2>
                <p className="text-white/80">{selectedEvent.description}</p>
              </div>
              
              <form onSubmit={handleRegistration} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      className="w-full bg-secondary/50 border border-primary/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary"
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({ ...formData, numberOfGuests: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowRegistration(false)}
                    className="px-5 py-2.5 text-white/80 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-secondary px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <FiArrowRight className="w-4 h-4" />
                    Submit Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}