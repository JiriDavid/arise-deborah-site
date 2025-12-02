import mongoose from "mongoose";

const PrayerRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: {
    type: Date,
    required: function requiredDate() {
      return !this.isRecurringDaily;
    },
  },
  scheduledStartTime: { type: String, required: true },
  scheduledEndTime: { type: String, required: true },
  roomId: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  isScheduled: { type: Boolean, default: true },
  isRecurringDaily: { type: Boolean, default: false },
  autoRecordAudio: { type: Boolean, default: true },
  timezone: { type: String, default: null },
  timezoneOffsetMinutes: { type: Number, default: null },
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
  recordings: [
    {
      url: String,
      publicId: String,
      startedAt: Date,
      endedAt: Date,
      durationMs: Number,
      sizeBytes: Number,
      startedBy: String,
      uploadedBy: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  activeRecording: {
    status: {
      type: String,
      enum: ["idle", "recording"],
      default: "idle",
    },
    startedAt: { type: Date, default: null },
    startedBy: { type: String, default: null },
    clientRecorderToken: { type: String, default: null },
  },
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
