"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FiPlus, FiCalendar, FiClock } from "react-icons/fi";

export default function AdminPrayerRoomsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    maxParticipants: 50,
    tags: "",
    isRecurringDaily: false,
    timezone: "UTC",
    timezoneOffsetMinutes: 0,
    autoRecordAudio: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin check is now handled by the layout

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const now = new Date();
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || formData.timezone;
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    // Round start time to next 5 minutes
    const startMinutes = Math.ceil(now.getMinutes() / 5) * 5;
    now.setMinutes(startMinutes);
    const startTime = now.toTimeString().slice(0, 5); // HH:MM
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000).toTimeString().slice(0, 5); // +2 hours
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    setFormData((prev) => ({
      ...prev,
      timezone,
      timezoneOffsetMinutes,
      date: prev.date || today, // Set default date if not set
      scheduledStartTime: prev.scheduledStartTime || startTime,
      scheduledEndTime: prev.scheduledEndTime || endTime,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.isRecurringDaily ? null : formData.date || null,
        scheduledStartTime: formData.scheduledStartTime,
        scheduledEndTime: formData.scheduledEndTime,
        maxParticipants: Number(formData.maxParticipants) || 1,
        isRecurringDaily: formData.isRecurringDaily,
        tags: tagsArray,
        timezone: formData.timezone,
        timezoneOffsetMinutes: Number(formData.timezoneOffsetMinutes) || 0,
        autoRecordAudio: formData.autoRecordAudio,
      };

      const response = await fetch("/api/prayer-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create prayer room");
      }

      router.push("/prayer-rooms");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="max-w-2xl mx-auto">
        {/* Debug Info - Remove this in production */}
        {/* <div className=" border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Debug Info (Admin Check)
          </h3>
          <p className="text-sm text-yellow-700">
            User ID: {user?.id}
            <br />
            Email: {user?.primaryEmailAddress?.emailAddress}
            <br />
            Role: {user?.publicMetadata?.role || "Not set"}
            <br />
            Is Admin: {user?.publicMetadata?.isAdmin ? "Yes" : "No"}
            <br />
            <strong>Note:</strong> You need role: 'admin' or isAdmin: true in
            Clerk user metadata
          </p>
        </div> */}

        <div className="flex items-center gap-3 mb-8">
          <FiPlus size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-tertiary">
              Create Prayer Room
            </h1>
            <p className="text-accent">
              Set up a new live prayer session for the community
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg rounded-xl shadow-lg p-8 space-y-6 border border-yellow-400"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Room Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g., Morning Prayer Session"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the prayer session..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <FiCalendar className="inline w-4 h-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required={!formData.isRecurringDaily}
                disabled={formData.isRecurringDaily}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {formData.isRecurringDaily && (
                <p className="text-xs text-gray-500 mt-1">
                  Daily rooms ignore a specific date and reopen every day at the
                  scheduled times.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <FiClock className="inline w-4 h-4 mr-1" />
                Start Time
              </label>
              <input
                type="time"
                name="scheduledStartTime"
                value={formData.scheduledStartTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <FiClock className="inline w-4 h-4 mr-1" />
                End Time
              </label>
              <input
                type="time"
                name="scheduledEndTime"
                value={formData.scheduledEndTime}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="morning, worship, community (comma-separated)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
            <div>
              <p className="text-sm font-semibold text-tertiary">
                Make this a daily room
              </p>
              <p className="text-xs text-accent">
                Daily rooms reopen every day at the times above. The specific
                calendar date is ignored.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isRecurringDaily}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRecurringDaily: e.target.checked,
                  }))
                }
              />
              <span
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                  formData.isRecurringDaily ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    formData.isRecurringDaily ? "translate-x-6" : ""
                  }`}
                ></span>
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between gap-4 border rounded-lg p-4">
            <div>
              <p className="text-sm font-semibold text-tertiary">
                Archive audio automatically
              </p>
              <p className="text-xs text-accent">
                When enabled, the session audio is recorded and stored in the
                members archive for replay.
              </p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.autoRecordAudio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    autoRecordAudio: e.target.checked,
                  }))
                }
              />
              <span
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                  formData.autoRecordAudio ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                    formData.autoRecordAudio ? "translate-x-6" : ""
                  }`}
                ></span>
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus size={20} />
                  Create Prayer Room
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/prayer-rooms")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
