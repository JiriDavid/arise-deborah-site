"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSermonPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    preacher: "",
    videoUrl: "",
    audioUrl: "",
    thumbnailUrl: "",
    category: "",
    tags: "",
    duration: "",
    scripture: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/sermons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()),
      }),
    });

    if (response.ok) {
      router.push("/sermons");
    } else {
      alert("Failed to upload sermon.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4  mt-20">Upload New Sermon</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          "title",
          "description",
          "date",
          "preacher",
          "videoUrl",
          "audioUrl",
          "thumbnailUrl",
          "category",
          "tags",
          "duration",
          "scripture",
        ].map((field) => (
          <input
            key={field}
            type={field === "date" ? "date" : "text"}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            required={["audioUrl"].includes(field) ? false : true}
            className="w-full border px-3 py-2 rounded outline-none"
          />
        ))}
        <button type="submit" className="bg-amber-300 text-white px-4 py-2 rounded">
          Upload Sermon
        </button>
      </form>
    </div>
  );
}
