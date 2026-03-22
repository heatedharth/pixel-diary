# 🎮 Pixel Diary

> A personal diary made by a gamer for gamers to track what games you've played, are playing, and want to play. A one stop shop to keep all your gaming info in one place!

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [File Structure](#file-structure)
- [Project Plan](#project-plan)
- [Future Roadmap](#future-roadmap)

---

## 🌸 About the Project

**Pixel Diary** is a browser-based game tracking web app built for gamers who want a personal, organized space to log their gaming journey. Users can build a game library, track play status, write reviews, upload media, and customize their own profile — all saved to the cloud so it's accessible anywhere.

The aesthetic is cute, kawaii-inspired, and geared toward making game tracking feel personal and fun rather than clinical.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 |
| **Styling** | CSS3 (custom properties, flexbox, grid) |
| **Fonts** | Jersey 10 (header), Just Me Again Down Here (body) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Firestore (cloud, NoSQL) |
| **Media Storage** | Firebase Storage |
| **Hosting** | GitHub Pages |
| **Version Control** | Git + GitHub |

---

## ✨ Features

### 🗂️ Create, Edit, and Delete Games
Users can add games to their personal library with details like title, genre, platform, cover art, and play time. Every entry can be edited or removed at any time.

### 🔍 Search and Filter
A live search bar lets users find games by title instantly. Filter controls allow narrowing the library by genre, play status, or star rating.

### 📊 Dynamic Content Display
The game library renders dynamically from the database — no page reloads needed. Game cards update in real time when data changes.

### 🔀 Sorting
Users can sort their library by:
- A → Z / Z → A (alphabetical)
- Most to least played (by hours)
- By genre
- By star rating
- By date added (newest first)

### ⭐ Ratings and Reviews
Each game entry supports a 1–5 star rating and a personal written review. Reviews can be added, edited, or deleted at any time.

### 📸 Media Uploads
Users can upload screenshots and video clips directly to a game entry. Files are stored in Firebase Storage and displayed in a media gallery on the game detail page.

### 🔐 Sign Up, Log In, and Log Out
Full user authentication via Firebase Auth. Users create an account with email and password, log in securely, and log out from any page. Protected pages redirect unauthenticated users to the login screen.

### 👤 Customizable User Profile
Each user has a profile page where they can set a username, bio, avatar image, and banner. A stats section shows total games, games played, and favorites count.

### ☁️ Cloud Database
All game data, reviews, and profile information are stored in Firebase Firestore. Data is tied to each user's account and syncs across devices in real time.

---

## 📁 File Structure

```
pixel-diary/
├── index.html                  ← Landing page (hero, features, CTA)
├── firebase.config.js          ← Firebase project credentials (gitignored)
├── .gitignore
├── README.md
│
├── pages/
│   ├── library.html            ← Main game dashboard (search, filter, grid)
│   ├── game-detail.html        ← Individual game page (status, review, media)
│   ├── login.html              ← Login form
│   ├── signup.html             ← Sign up form
│   └── profile.html            ← User profile page
│
├── assets/
│   ├── css/
│   │   ├── main.css            ← Global styles, kawaii theme variables
│   │   ├── auth.css            ← Login and signup page styles
│   │   ├── library.css         ← Library grid and filter bar styles
│   │   ├── game-detail.css     ← Game detail page styles
│   │   └── profile.css         ← Profile page styles
│   │
│   ├── js/
│   │   ├── app.js              ← App entry point, auth state listener
│   │   ├── router.js           ← Client-side navigation and routing
│   │   ├── db.js               ← Firebase/Firestore initialization and helpers
│   │   ├── auth.js             ← Sign up, log in, log out, password reset
│   │   ├── games.js            ← Game CRUD (create, read, update, delete)
│   │   ├── search-filter.js    ← Search and filter logic
│   │   ├── sort.js             ← Sorting functions
│   │   ├── reviews.js          ← Ratings and review CRUD
│   │   ├── media.js            ← File upload and retrieval (Firebase Storage)
│   │   ├── profile.js          ← Profile read/update, avatar/banner upload
│   │   └── ui.js               ← DOM rendering, modals, toasts, loading states
│   │
│   └── images/
│       └── uploads/            ← Local image assets (gitignored, stored in Firebase)
```

---

## 🗓️ Project Plan

The development approach is **a couple core features per day**, fully working before moving on. Minor polish and secondary features are added only after the core feature is functional.

| Day | Core Feature |
|-----|-------------|
| **Day 1** | Firebase setup + Authentication + Sign up, log in, log out working + Game CRUD + Add, edit, delete a game entry from Firestore |
| **Day 2** | Game Library display + Dynamic card grid rendering from database + Search and Filter + Live search, genre filter, status filter |
| **Day 3** | Sorting (A-Z, by rating, by most played, by date added) + Ratings and Reviews + Star rating widget, written review, edit/delete |
| **Day 4** | Media Uploads + Image/clip upload to Firebase Storage, gallery display + User Profile + Profile page, avatar, bio, banner, stats |
| **Day 5** | UI Polish + Kawaii styling, responsive layout, transitions + Testing + Bug Fixes + Cross-browser checks, edge case handling, final cleanup |

### NOTES

All FireBase mentions are replaced with Supabase.

### WHAT I LEARNED

AI is really useful for getting a jumpstart on what I want to build; however, it needs coaching, and I can't just feed it all the info I want at the same time. To build efficiently, I have to take on features one by one, so it doesn't get confused and make a bunch of bugs within the code. Once all the features were built, I found it easier to manually find bugs myself than ask the AI to do it; some things are best left to humans. However, it is extremely excellent at fixing said bugs and finding bugs within the code.

---

*Built with 💖 for gamers, by a gamer.*
