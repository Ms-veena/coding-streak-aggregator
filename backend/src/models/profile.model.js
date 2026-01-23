const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
leetcode: {
  totalSolved: { type: Number, default: 0 },
  ranking: { type: Number },
},

combinedStreak: {
  type: Number,
  default: 0,
},

combinedScore: {
  type: Number,
  default: 0,
},
  platform: {
    type: String,
    enum: ["codeforces", "leetcode"],
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  streak: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// prevent duplicates per platform+handle
profileSchema.index({ platform: 1, handle: 1 }, { unique: true });

module.exports = mongoose.model("Profile", profileSchema);
