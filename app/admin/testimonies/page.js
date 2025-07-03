"use client";

import { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiVideo,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiMessageSquare,
} from "react-icons/fi";

export default function AdminTestimoniesPage() {
  const router = useRouter();
  const [testimonies, setTestimonies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    quote: "",
    videoUrl: "",
  });
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTestimonies();
  }, []);

  const fetchTestimonies = async () => {
    try {
      const response = await fetch("/api/testimonies");
      const data = await response.json();
      setTestimonies(data);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      description: "",
      quote: "",
      videoUrl: "",
    });
    setThumbnailUrl("");
    setEditingTestimony(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = editingTestimony
        ? `/api/testimonies/${editingTestimony._id}`
        : "/api/testimonies";
      const method = editingTestimony ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          thumbnailUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save testimony");
      }

      await fetchTestimonies();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (testimony) => {
    setEditingTestimony(testimony);
    setFormData({
      name: testimony.name,
      role: testimony.role,
      description: testimony.description,
      quote: testimony.quote,
      videoUrl: testimony.videoUrl,
    });
    setThumbnailUrl(testimony.thumbnailUrl || "");
    setShowForm(true);
  };

  const handleDelete = async (testimonyId) => {
    if (!confirm("Are you sure you want to delete this testimony?")) return;

    try {
      const response = await fetch(`/api/testimonies/${testimonyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete testimony");
      }

      await fetchTestimonies();
    } catch (error) {
      console.error("Error deleting testimony:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-tertiary">Manage Testimonies</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 hover:bg-primary-dark text-white px-5 py-3 rounded-lg font-semibold shadow shadow-[#FFC94A] transition-all duration-200"
        >
          <FiPlus /> Add Testimony
        </button>
      </motion.div>

      {/* Add/Edit Testimony Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl shadow shadow-[#FFC94A] p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-tertiary">
                {editingTestimony ? "Edit Testimony" : "Add New Testimony"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Person's Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Church Member, Youth Leader"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brief Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="A brief description of the person or their testimony"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimony Quote
                  </label>
                  <textarea
                    name="quote"
                    value={formData.quote}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    placeholder="The main quote or testimony text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image
                  </label>
                  <CldUploadWidget
                    uploadPreset="testimony_thumbnails"
                    onUpload={(result) => {
                      setThumbnailUrl(result.info.secure_url);
                    }}
                    options={{
                      maxFiles: 1,
                      sources: ["local", "camera"],
                      styles: {
                        palette: {
                          window: "#FFFFFF",
                          windowBorder: "#FFC94A",
                          tabIcon: "#FFC94A",
                          menuIcons: "#5A616A",
                          textDark: "#000000",
                          textLight: "#FFFFFF",
                          link: "#FFC94A",
                          action: "#FFC94A",
                          inactiveTabIcon: "#0E2F5A",
                          error: "#F44235",
                          inProgress: "#FFC94A",
                          complete: "#20B832",
                          inProgress: "#FFC94A",
                        },
                      },
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={open}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors"
                      >
                        {thumbnailUrl
                          ? "Thumbnail uploaded ✓"
                          : "Click to upload thumbnail"}
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold shadow shadow-[#FFC94A] transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading
                    ? "Saving..."
                    : editingTestimony
                    ? "Update Testimony"
                    : "Create Testimony"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonies List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-secondary">All Testimonies</h2>
        {testimonies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-500"
          >
            No testimonies found. Create your first testimony!
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {testimonies.map((testimony, index) => (
              <motion.div
                key={testimony._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl shadow shadow-[#FFC94A] p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold underline">
                        {testimony.name}
                      </h3>
                      <span className="px-3 py-1 text-sm rounded-full rounded-md p-2 shadow shadow-[#FFC94A] text-black bg-white">
                        {testimony.role}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <FiMessageSquare className="text-primary mt-1 flex-shrink-0" />
                        <p className="italic">"{testimony.quote}"</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        {testimony.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiVideo className="text-primary" />
                      <span>Video testimony available</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(testimony)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimony._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
