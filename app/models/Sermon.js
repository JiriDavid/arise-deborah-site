import mongoose, { Schema } from "mongoose";

const sermonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  preacher: { type: String, required: true },
  videoUrl: { type: String, default: null },
  audioUrl: { type: String, default: null },
  thumbnailUrl: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Sunday Service",
      "Bible Study",
      "Special Event",
      "Youth Service",
      "Women's Ministry",
    ],
  },
  tags: [{ type: String }],
  duration: { type: String, required: true },
  scripture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Ensure either audio or video is present
sermonSchema.pre("validate", function (next) {
  if (!this.videoUrl && !this.audioUrl) {
    return next(new Error("Either videoUrl or audioUrl must be provided."));
  }
  next();
});

// Update updatedAt on save
sermonSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Sermon = mongoose.models.Sermon || mongoose.model("Sermon", sermonSchema);
export default Sermon;
