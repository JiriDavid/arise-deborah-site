"use client";

import { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/prayer-rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
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
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
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
