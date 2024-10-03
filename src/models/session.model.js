import mongoose from 'mongoose';

// Message Schema
const messageSchema = mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    origin: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
  },
});

const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    sessionType: {
      type: String,
      required: true,
      unique: false
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

// Create models
const Session = mongoose.model("Session", SessionSchema);

export default Session;
