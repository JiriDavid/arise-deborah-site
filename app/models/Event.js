// 1. EVENT MODEL (models/Event.js)
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String }, // Store local path or URL
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  registrationRequired: { type: Boolean, default: false },
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
