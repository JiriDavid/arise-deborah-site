"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSermonsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    preacher: "",
    category: "Sunday Service",
    scripture: "",
    duration: "",
    tags: "",
  });
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
  };

  const handleThumbnailUrlChange = (e) => {
    setThumbnailUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic URL validation
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    if (!urlPattern.test(videoUrl)) {
      setError("Please enter a valid video URL");
      setIsLoading(false);
      return;
    }
    if (!urlPattern.test(thumbnailUrl)) {
      setError("Please enter a valid thumbnail URL");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/sermons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          videoUrl,
          thumbnailUrl,
          date: new Date(),
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create sermon");
      }

      router.refresh();
      setFormData({
        title: "",
        description: "",
        preacher: "",
        category: "Sunday Service",
        scripture: "",
        duration: "",
        tags: "",
      });
      setVideoUrl("");
      setThumbnailUrl("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Sermons</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preacher</label>
          <input
            type="text"
            name="preacher"
            value={formData.preacher}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="Sunday Service">Sunday Service</option>
            <option value="Bible Study">Bible Study</option>
            <option value="Special Event">Special Event</option>
            <option value="Youth Service">Youth Service</option>
            <option value="Women's Ministry">Women's Ministry</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Scripture</label>
          <input
            type="text"
            name="scripture"
            value={formData.scripture}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            required
            placeholder="e.g., 45:00"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Separate tags with commas"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Video URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={handleVideoUrlChange}
            required
            placeholder="e.g., https://example.com/video.mp4"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {videoUrl && (
            <p className="mt-2 text-sm text-green-600">Video URL added</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={thumbnailUrl}
            onChange={handleThumbnailUrlChange}
            required
            placeholder="e.g., https://example.com/thumbnail.jpg"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {thumbnailUrl && (
            <p className="mt-2 text-sm text-green-600">Thumbnail URL added</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !videoUrl || !thumbnailUrl}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Sermon"}
        </button>
      </form>
    </div>
  );
}
