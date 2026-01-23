
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const fetchCodeforcesData = require("./fetchers/codeforces.fetcher");
const fetchLeetCodeData = require("./fetchers/leetcode.fetcher");
const calculateStreak = require("./engine/streak.engine");
const Profile = require("./models/profile.model");
console.log("fetchCodeforcesData:", fetchCodeforcesData);

const app = express();

// middleware
//app.use(cors({ origin: "*" }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

// test route
app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/test/leetcode/:username", async (req, res) => {
  try {
    const data = await fetchLeetCodeData(req.params.username);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/refresh/codeforces/:handle", async (req, res) => {
  try {
    const data = await fetchCodeforcesData(req.params.handle);
    const streak = calculateStreak(data.submissions);

    const profile = await Profile.findOneAndUpdate(
      { platform: "codeforces", handle: data.handle },
      {
        platform: "codeforces",
        handle: data.handle,
        streak,
        score: streak,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Profile refreshed",
      profile,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get("/leaderboard", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({
      score: -1,
      streak: -1,
      lastUpdated: 1,
    });

    const leaderboard = profiles.map((profile, index) => ({
      rank: index + 1,
      platform: profile.platform,
      handle: profile.handle,
      score: profile.score,
      streak: profile.streak,
      lastUpdated: profile.lastUpdated,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
});

//const fetchLeetCodeData = require("./fetchers/leetcode.fetcher");

app.get("/refresh/combined/:cfHandle/:lcHandle", async (req, res) => {
  try {
    const cfData = await fetchCodeforcesData(req.params.cfHandle);
    const lcData = {
  totalSolved: 0,
  ranking: null,
};

    const cfStreak = calculateStreak(cfData.submissions);

    const combinedStreak = Math.max(cfStreak, 0); // lc streak added later
    const combinedScore = cfStreak + lcData.totalSolved;

    const profile = await Profile.findOneAndUpdate(
      {
        platform: "combined",
        handle: `${cfData.handle}|${lcData.handle}`,
      },
      {
        platform: "combined",
        handle: `${cfData.handle}|${lcData.handle}`,
        streak: cfStreak,
        score: cfStreak,
        leetcode: {
          totalSolved: lcData.totalSolved,
          ranking: lcData.ranking,
        },
        combinedStreak,
        combinedScore,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Combined profile refreshed",
      profile,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/profile/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // fetch all profiles related to this username
    const profiles = await Profile.find({
      handle: { $regex: username, $options: "i" },
    });

    if (!profiles.length) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // leaderboard ordering
    const leaderboard = await Profile.find().sort({
      combinedScore: -1,
      combinedStreak: -1,
      lastUpdated: 1,
    });

    const rankMap = {};
    leaderboard.forEach((p, index) => {
      rankMap[p._id.toString()] = index + 1;
    });

    const response = profiles.map((p) => ({
      platform: p.platform,
      handle: p.handle,
      streak: p.streak,
      score: p.score,
      leetcode: p.leetcode,
      combinedStreak: p.combinedStreak,
      combinedScore: p.combinedScore,
      rank: rankMap[p._id.toString()] || null,
      lastUpdated: p.lastUpdated,
    }));

    res.json({
      username,
      profiles: response,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});