# Coding Streak Aggregator

This project tracks and combines coding activity across multiple competitive
programming platforms in one place.

The goal is to give a clear view of a user's consistency, effort, and relative
standing instead of forcing them to check multiple websites.

## Platforms Supported
- Codeforces
- LeetCode

## MVP Features
- Individual coding streaks per platform
- Individual platform ranks
- Combined coding streak across platforms
- Combined global rank based on overall activity

## Project Status
Backend setup in progress.

# Coding Streak Aggregator

A full-stack web application that tracks and combines coding activity across multiple competitive programming platforms into a single profile and leaderboard.

Currently supported platforms:
- Codeforces
- LeetCode

---

## 🚀 What this project does

This project allows users to:
- Enter their **Codeforces** and **LeetCode** handles
- Fetch live data from both platforms
- Compute individual and combined scores
- View:
  - Platform-wise stats
  - Combined profile
  - Global rank among all users in the system

The goal is to provide a **single, unified view** of a programmer’s consistency and activity.

---

## 🧠 Key Features

### Backend
- Fetches Codeforces data using official API
- Fetches LeetCode data using GraphQL
- Computes:
  - Coding streaks
  - Scores
  - Combined score
- Stores data in MongoDB
- Ranks users globally
- Clean REST APIs:
  - `/refresh/combined/:cfHandle/:lcHandle`
  - `/profile/:username`
  - `/leaderboard`

### Frontend
- Built with React (Vite)
- Simple, clean UI
- Two-handle input (Codeforces + LeetCode)
- One-click refresh & profile generation
- Combined profile highlighted for clarity

---

## 🏗️ Project Structure



---

## 🧪 How to run locally

### Backend
```bash
cd backend
npm install
npm run dev

### frontend
cd frontend
npm install
npm run dev
