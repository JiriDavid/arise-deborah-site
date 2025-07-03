import mongoose, { Schema } from "mongoose";

const testimonySchema = new Schema({
  role: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, default: null },
  audioUrl: { type: String, default: null },
  thumbnailUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure either audio or video is present
testimonySchema.pre("validate", function (next) {
  if (!this.videoUrl && !this.audioUrl) {
    return next(new Error("Either videoUrl or audioUrl must be provided."));
  }
  next();
});

// Update updatedAt on save
testimonySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Testimony = mongoose.models.Testimony || mongoose.model("Testimony", testimonySchema)
export default Testimony;
