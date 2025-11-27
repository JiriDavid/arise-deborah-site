"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { FiVideo, FiUsers, FiCalendar, FiClock, FiPlus } from "react-icons/fi";

export default function PrayerRoomsPage() {
  const [prayerRooms, setPrayerRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const isAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.isAdmin === true;

  useEffect(() => {
    fetchPrayerRooms();
  }, []);

  const fetchPrayerRooms = async () => {
    try {
      const response = await fetch("/api/prayer-rooms");
      if (response.ok) {
        const data = await response.json();
        setPrayerRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch prayer rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatus = (room) => {
    const now = new Date();
    const roomDate = new Date(room.date);
    const [startHour, startMinute] = room.scheduledStartTime.split(":");
    const [endHour, endMinute] = room.scheduledEndTime.split(":");

    const startTime = new Date(roomDate);
    startTime.setHours(parseInt(startHour), parseInt(startMinute));

    const endTime = new Date(roomDate);
    endTime.setHours(parseInt(endHour), parseInt(endMinute));

    if (room.isActive)
      return { status: "live", color: "bg-red-500", text: "LIVE" };
    if (now >= startTime && now <= endTime)
      return { status: "active", color: "bg-green-500", text: "IN SESSION" };
    if (now < startTime)
      return { status: "scheduled", color: "bg-blue-500", text: "SCHEDULED" };
    return { status: "ended", color: "bg-gray-500", text: "ENDED" };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading prayer rooms...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-tertiary mb-2">
            Live Group Prayers
          </h1>
          <p className="text-accent">
            Join our community in prayer and worship
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin/prayer-rooms"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus size={20} />
            Create Room
          </Link>
        )}
      </div>

      {prayerRooms.length === 0 ? (
        <div className="text-center py-12">
          <FiVideo size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-tertiary mb-2">
            No Prayer Rooms Available
          </h3>
          <p className="text-accent">
            Check back later for upcoming prayer sessions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayerRooms.map((room, index) => {
            const roomStatus = getRoomStatus(room);
            return (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className=" border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${roomStatus.color}`}
                    >
                      {roomStatus.text}
                    </div>
                    {room.isActive && (
                      <div className="flex items-center text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                        LIVE
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-tertiary mb-2">
                    {room.title}
                  </h3>
                  <p className="text-accent mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-accent">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      {format(new Date(room.date), "PPP")}
                    </div>
                    <div className="flex items-center text-sm text-accent">
                      <FiClock className="w-4 h-4 mr-2" />
                      {room.scheduledStartTime} - {room.scheduledEndTime}
                    </div>
                    <div className="flex items-center text-sm text-accent">
                      <FiUsers className="w-4 h-4 mr-2" />
                      {room.participants?.length || 0} participants
                    </div>
                  </div>

                  {(roomStatus.status === "live" ||
                    roomStatus.status === "active") && (
                    <Link
                      href={`/prayer-rooms/${room._id}`}
                      className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiVideo size={20} />
                      Join Prayer Session
                    </Link>
                  )}

                  {roomStatus.status === "scheduled" && (
                    <div className="w-full bg-gray-200 text-gray-600 py-3 px-4 rounded-lg text-center">
                      Starts at {room.scheduledStartTime}
                    </div>
                  )}

                  {roomStatus.status === "ended" && (
                    <div className="w-full bg-gray-200 text-gray-600 py-3 px-4 rounded-lg text-center">
                      Session Ended
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
