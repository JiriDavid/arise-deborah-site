"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { FiVideo, FiUsers, FiCalendar, FiClock, FiPlus } from "react-icons/fi";

const MINUTES_IN_DAY = 24 * 60;
const DEFAULT_ROOM_TZ_OFFSET = Number.isFinite(
  Number(process.env.NEXT_PUBLIC_PRAYER_ROOMS_TZ_OFFSET_MINUTES)
)
  ? Number(process.env.NEXT_PUBLIC_PRAYER_ROOMS_TZ_OFFSET_MINUTES)
  : 0;

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(":").map(Number);
  if ([hours, minutes].some((value) => Number.isNaN(value))) return null;
  return hours * 60 + minutes;
};

const getRoomTimezoneOffset = (room) => {
  if (Number.isFinite(room?.timezoneOffsetMinutes)) {
    return room.timezoneOffsetMinutes;
  }
  return DEFAULT_ROOM_TZ_OFFSET;
};

const convertUTCToLocal = (date, timezoneOffsetMinutes = 0) => {
  if (!(date instanceof Date)) return null;
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) return null;
  return new Date(timestamp - timezoneOffsetMinutes * 60 * 1000);
};

const buildLocalDateWithTime = (
  dateInput,
  timeString,
  timezoneOffsetMinutes = 0
) => {
  if (!dateInput) return null;
  const baseDateUTC = new Date(dateInput);
  if (Number.isNaN(baseDateUTC.getTime())) return null;
  const [hours, minutes] = (timeString || "00:00").split(":").map(Number);
  if ([hours, minutes].some((value) => Number.isNaN(value))) return null;

  const year = baseDateUTC.getUTCFullYear();
  const month = baseDateUTC.getUTCMonth();
  const day = baseDateUTC.getUTCDate();
  const localTimestamp = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const offset = Number.isFinite(timezoneOffsetMinutes)
    ? timezoneOffsetMinutes
    : 0;
  return new Date(localTimestamp + offset * 60 * 1000);
};

const getRoomScheduleWindow = (room) => {
  if (!room?.date) return null;
  const offset = getRoomTimezoneOffset(room);
  const start = buildLocalDateWithTime(
    room.date,
    room.scheduledStartTime,
    offset
  );
  const end = buildLocalDateWithTime(room.date, room.scheduledEndTime, offset);

  if (!start || !end) return null;

  const adjustedEnd = new Date(end);
  if (adjustedEnd <= start) {
    adjustedEnd.setUTCDate(adjustedEnd.getUTCDate() + 1);
  }

  return { start, end: adjustedEnd };
};

const formatViewerLocalTime = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "--:--";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getDailyWindowForDisplay = (room, timezoneOffsetMinutes) => {
  if (!room?.isRecurringDaily) return null;
  const localNow = convertUTCToLocal(new Date(), timezoneOffsetMinutes);
  if (!localNow) return null;
  const year = localNow.getUTCFullYear();
  const month = String(localNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localNow.getUTCDate()).padStart(2, "0");
  const localDateString = `${year}-${month}-${day}`;

  const start = buildLocalDateWithTime(
    localDateString,
    room.scheduledStartTime,
    timezoneOffsetMinutes
  );
  const end = buildLocalDateWithTime(
    localDateString,
    room.scheduledEndTime,
    timezoneOffsetMinutes
  );

  if (!start || !end) return null;

  const adjustedEnd = new Date(end);
  if (adjustedEnd <= start) {
    adjustedEnd.setUTCDate(adjustedEnd.getUTCDate() + 1);
  }

  return { start, end: adjustedEnd };
};

const getRoomTimeDisplay = (room) => {
  const timezoneOffset = getRoomTimezoneOffset(room);
  const window = room.isRecurringDaily
    ? getDailyWindowForDisplay(room, timezoneOffset)
    : getRoomScheduleWindow(room);

  if (!window) {
    return `${room.scheduledStartTime || "--:--"} • ${
      room.scheduledEndTime || "--:--"
    }`;
  }

  const range = `${formatViewerLocalTime(
    window.start
  )} • ${formatViewerLocalTime(window.end)}`;
  return `${range} (your time)`;
};

const formatRoomDateDisplay = (room) => {
  if (room.isRecurringDaily) {
    return "Daily window";
  }
  if (!room.date) {
    return "Date TBA";
  }
  const localDate = convertUTCToLocal(
    new Date(room.date),
    getRoomTimezoneOffset(room)
  );
  if (!localDate) {
    return "Date TBA";
  }
  return format(localDate, "PPP");
};

const isWithinDailyWindow = (room, timezoneOffsetMinutes = 0) => {
  if (!room?.isRecurringDaily) return false;
  const localNow = convertUTCToLocal(new Date(), timezoneOffsetMinutes);
  if (!localNow) return false;
  const nowMinutes = localNow.getUTCHours() * 60 + localNow.getUTCMinutes();
  const startMinutes = parseTimeToMinutes(room.scheduledStartTime);
  const endMinutes = parseTimeToMinutes(room.scheduledEndTime);

  if (startMinutes === null && endMinutes === null) {
    return true;
  }

  const start = startMinutes ?? 0;
  const end = endMinutes ?? MINUTES_IN_DAY - 1;

  if (start === end) {
    return true;
  }

  if (start < end) {
    return nowMinutes >= start && nowMinutes <= end;
  }

  return nowMinutes >= start || nowMinutes <= end;
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
    const timezoneOffset = getRoomTimezoneOffset(room);
    const scheduleWindow = getRoomScheduleWindow(room);

    if (room.isActive) {
      return {
        status: "live",
        color: "bg-red-500",
        text: "LIVE",
        canJoin: true,
      };
    }

    if (room.isRecurringDaily) {
      const withinDaily = isWithinDailyWindow(room, timezoneOffset);
      const windowForDisplay = getDailyWindowForDisplay(room, timezoneOffset);
      const nextStartLabel = windowForDisplay?.start
        ? formatViewerLocalTime(windowForDisplay.start)
        : room.scheduledStartTime;

      if (withinDaily) {
        return {
          status: "active",
          color: "bg-green-500",
          text: "IN SESSION",
          canJoin: true,
          nextStartLabel,
        };
      }
      return {
        status: "daily",
        color: "bg-purple-600",
        text: "DAILY",
        canJoin: false,
        nextStartLabel,
      };
    }

    if (!room.date || !scheduleWindow) {
      return {
        status: "unscheduled",
        color: "bg-gray-500",
        text: "UNSCHEDULED",
        canJoin: false,
      };
    }

    if (now >= scheduleWindow.start && now <= scheduleWindow.end) {
      return {
        status: "active",
        color: "bg-green-500",
        text: "IN SESSION",
        canJoin: true,
        nextStartLabel: formatViewerLocalTime(scheduleWindow.start),
      };
    }

    if (now < scheduleWindow.start) {
      return {
        status: "scheduled",
        color: "bg-blue-500",
        text: "SCHEDULED",
        canJoin: false,
        nextStartLabel: formatViewerLocalTime(scheduleWindow.start),
      };
    }

    return {
      status: "ended",
      color: "bg-gray-500",
      text: "ENDED",
      canJoin: false,
      nextStartLabel: formatViewerLocalTime(scheduleWindow.start),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen  text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/30 border-t-[#FFC94A]" />
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Loading prayer rooms
          </p>
        </div>
      </div>
    );
  }

  const joinableRooms = prayerRooms.filter(
    (room) => getRoomStatus(room).canJoin
  ).length;
  const dailyRooms = prayerRooms.filter((room) => room.isRecurringDaily).length;
  const totalParticipants = prayerRooms.reduce(
    (sum, room) => sum + (room.participants?.length || 0),
    0
  );

  const summary = [
    {
      label: "Active windows",
      value: joinableRooms.toString().padStart(2, "0"),
    },
    { label: "Daily towers", value: dailyRooms.toString().padStart(2, "0") },
    { label: "Intercessors", value: `${totalParticipants}+` },
  ];

  return (
    <div className="min-h-screen text-white pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#2b1208] via-[#3d1508] to-[#4f1907] p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-[#FFC94A]">
            Live prayer rooms
          </p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <h1 className="md:text-4xl font-semibold leading-tight text-xl">
                Step into watch rooms igniting intercession across nations.
              </h1>
              <p className="text-white/75">
                Join a scheduled room, stay for daily altars, or host the next
                vigil if you are part of the admin core.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#rooms"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-[#FFC94A] hover:text-[#FFC94A]"
              >
                Browse sessions →
              </Link>
              <Link
                href="/prayer-rooms/archive"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:border-[#FFC94A] hover:text-[#FFC94A]"
              >
                Listen to archive →
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/prayer-rooms"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFC94A] px-6 py-3 text-sm font-semibold text-black"
                >
                  <FiPlus />
                  Create room
                </Link>
              )}
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {summary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <p className="text-3xl font-semibold text-[#FFC94A]">
                  {item.value}
                </p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="rooms" className="mt-12">
          {prayerRooms.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
              <FiVideo size={48} className="mx-auto text-white/40 mb-4" />
              <h3 className="text-2xl font-semibold text-white">
                No rooms available
              </h3>
              <p className="mt-2 text-white/70">
                Check back for fresh schedules or subscribe so you get notified
                when a new session opens.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {prayerRooms.map((room, index) => {
                const roomStatus = getRoomStatus(room);
                const dateDisplay = formatRoomDateDisplay(room);
                const timeDisplay = getRoomTimeDisplay(room);

                return (
                  <motion.article
                    key={room._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white ${roomStatus.color}`}
                      >
                        {roomStatus.text}
                      </span>
                      {room.isActive && (
                        <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                          Broadcasting
                        </div>
                      )}
                    </div>
                    <div className="mt-5 space-y-3">
                      <h3 className="text-2xl font-semibold text-white">
                        {room.title}
                      </h3>
                      {room.isRecurringDaily && (
                        <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                          Daily altar
                        </span>
                      )}
                      <p className="text-white/70 line-clamp-3">
                        {room.description}
                      </p>
                    </div>
                    <div className="mt-6 space-y-2 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-[#FFC94A]" /> {dateDisplay}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#FFC94A]" />
                        {room.isRecurringDaily
                          ? `Daily • ${timeDisplay}`
                          : timeDisplay}
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="text-[#FFC94A]" />
                        {room.participants?.length || 0} intercessors
                      </div>
                    </div>
                    <div className="mt-6">
                      {roomStatus.canJoin ? (
                        <Link
                          href={`/prayer-rooms/${room._id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1f6f4a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a825a]"
                        >
                          <FiVideo /> Join prayer session
                        </Link>
                      ) : (
                        <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-3 text-center text-white/60">
                          {roomStatus.status === "scheduled"
                            ? `Starts at ${
                                roomStatus.nextStartLabel || "--:--"
                              }`
                            : roomStatus.status === "daily"
                            ? `Reopens daily at ${
                                roomStatus.nextStartLabel || "--:--"
                              }`
                            : roomStatus.status === "ended"
                            ? "Session ended"
                            : "Awaiting activation"}
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
