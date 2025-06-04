"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
          <label className="block text-sm font-medium mb-2">Video Upload</label>
          <CldUploadWidget
            uploadPreset="sermon_videos"
            onUpload={(result) => {
              setVideoUrl(result.info.secure_url);
            }}
            options={{
              maxFiles: 1,
              resourceType: "video",
              sources: ["local", "camera"],
              showAdvancedOptions: true,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1",
                },
              },
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Video
              </button>
            )}
          </CldUploadWidget>
          {videoUrl && (
            <p className="mt-2 text-sm text-green-600">
              Video uploaded successfully
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail Upload
          </label>
          <CldUploadWidget
            uploadPreset="sermon_thumbnails"
            onUpload={(result) => {
              setThumbnailUrl(result.info.secure_url);
            }}
            options={{
              maxFiles: 1,
              resourceType: "image",
              sources: ["local", "camera"],
              showAdvancedOptions: true,
              styles: {
                palette: {
                  window: "#FFFFFF",
                  windowBorder: "#90A0B3",
                  tabIcon: "#0078FF",
                  menuIcons: "#5A616A",
                  textDark: "#000000",
                  textLight: "#FFFFFF",
                  link: "#0078FF",
                  action: "#FF620C",
                  inactiveTabIcon: "#0E2F5A",
                  error: "#F44235",
                  inProgress: "#0078FF",
                  complete: "#20B832",
                  sourceBg: "#E4EBF1",
                },
              },
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Thumbnail
              </button>
            )}
          </CldUploadWidget>
          {thumbnailUrl && (
            <p className="mt-2 text-sm text-green-600">
              Thumbnail uploaded successfully
            </p>
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
