import mongoose from "mongoose";

const PrayerRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  scheduledStartTime: { type: String, required: true },
  scheduledEndTime: { type: String, required: true },
  roomId: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  isScheduled: { type: Boolean, default: true },
  createdBy: { type: String, required: true }, // Clerk user ID
  participants: [
    {
      userId: String,
      name: String,
      joinedAt: Date,
      leftAt: Date,
    },
  ],
  maxParticipants: { type: Number, default: 50 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
PrayerRoomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PrayerRoom =
  mongoose.models.PrayerRoom || mongoose.model("PrayerRoom", PrayerRoomSchema);
export default PrayerRoom;
