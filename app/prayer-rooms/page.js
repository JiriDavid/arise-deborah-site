"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { FiVideo, FiUsers, FiCalendar, FiClock, FiPlus } from "react-icons/fi";

const MINUTES_IN_DAY = 24 * 60;

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(":").map(Number);
  if ([hours, minutes].some((value) => Number.isNaN(value))) return null;
  return hours * 60 + minutes;
};

const isWithinDailyWindow = (room) => {
  if (!room?.isRecurringDaily) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = parseTimeToMinutes(room.scheduledStartTime) ?? 0;
  const endMinutes =
    parseTimeToMinutes(room.scheduledEndTime) ?? MINUTES_IN_DAY - 1;

  if (startMinutes === endMinutes) return true;
  if (startMinutes < endMinutes) {
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  }
  return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
};

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

    if (room.isActive) {
      return {
        status: "live",
        color: "bg-red-500",
        text: "LIVE",
        canJoin: true,
      };
    }

    if (room.isRecurringDaily) {
      if (isWithinDailyWindow(room)) {
        return {
          status: "active",
          color: "bg-green-500",
          text: "IN SESSION",
          canJoin: true,
        };
      }
      return {
        status: "daily",
        color: "bg-purple-600",
        text: "DAILY",
        canJoin: false,
      };
    }

    if (!room.date) {
      return {
        status: "unscheduled",
        color: "bg-gray-500",
        text: "UNSCHEDULED",
        canJoin: false,
      };
    }

    const roomDate = new Date(room.date);
    const [startHour, startMinute] = (room.scheduledStartTime || "00:00").split(
      ":"
    );
    const [endHour, endMinute] = (room.scheduledEndTime || "00:00").split(":");

    const startTime = new Date(roomDate);
    startTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));

    const endTime = new Date(roomDate);
    endTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));

    if (now >= startTime && now <= endTime) {
      return {
        status: "active",
        color: "bg-green-500",
        text: "IN SESSION",
        canJoin: true,
      };
    }
    if (now < startTime) {
      return {
        status: "scheduled",
        color: "bg-blue-500",
        text: "SCHEDULED",
        canJoin: false,
      };
    }
    return {
      status: "ended",
      color: "bg-gray-500",
      text: "ENDED",
      canJoin: false,
    };
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
            const dateDisplay = room.isRecurringDaily
              ? "Available Daily"
              : room.date
              ? format(new Date(room.date), "PPP")
              : "Date TBD";
            const timeDisplay = `${room.scheduledStartTime || "--:--"} - ${
              room.scheduledEndTime || "--:--"
            }`;
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
                  {room.isRecurringDaily && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 mb-2">
                      Daily Window
                    </span>
                  )}
                  <p className="text-accent mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-accent">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      {dateDisplay}
                    </div>
                    <div className="flex items-center text-sm text-accent">
                      <FiClock className="w-4 h-4 mr-2" />
                      {room.isRecurringDaily
                        ? `Daily • ${timeDisplay}`
                        : timeDisplay}
                    </div>
                    <div className="flex items-center text-sm text-accent">
                      <FiUsers className="w-4 h-4 mr-2" />
                      {room.participants?.length || 0} participants
                    </div>
                  </div>

                  {roomStatus.canJoin ? (
                    <Link
                      href={`/prayer-rooms/${room._id}`}
                      className="w-full bg-green-700 text-white py-3 px-4 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiVideo size={20} />
                      Join Prayer Session
                    </Link>
                  ) : (
                    <div className="w-full bg-gray-200 text-gray-600 py-3 px-4 rounded-lg text-center">
                      {roomStatus.status === "scheduled"
                        ? `Starts at ${room.scheduledStartTime}`
                        : roomStatus.status === "daily"
                        ? `Reopens daily at ${room.scheduledStartTime}`
                        : roomStatus.status === "ended"
                        ? "Session Ended"
                        : "Not currently available"}
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
