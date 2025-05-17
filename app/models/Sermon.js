import mongoose from "mongoose";

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  preacher: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
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
  tags: [
    {
      type: String,
    },
  ],
  duration: {
    type: String,
    required: true,
  },
  scripture: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
sermonSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Sermon = mongoose.models.Sermon || mongoose.model("Sermon", sermonSchema);

export default Sermon;
