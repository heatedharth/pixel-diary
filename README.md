# 🎮 Pixel Diary

> A personal diary made by a gamer for gamers to track what games you've played, are playing, and want to play. A one stop shop to keep all your gaming info in one place!

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [External API Features (Assignment)](#external-api-features-assignment)
- [How to Run](#how-to-run)
- [Features](#features)
- [File Structure](#file-structure)
- [Project Plan](#project-plan)
- [What I Learned](#what-i-learned)

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
| **Authentication** | Supabase Auth |
| **Database** | Supabase Postgres |
| **Media Storage** | Supabase Storage |
| **External API #1** | RAWG Video Games Database API |
| **External API #2** | YouTube Data API v3 |
| **Hosting** | GitHub Pages |
| **Version Control** | Git + GitHub |

---

## 🌐 External API Features (Assignment)

This project integrates **2 external APIs**:

### 1: RAWG Video Games Database API (Add Game Autofill)

**What it does:**
- In the Add/Edit Game modal on `library.html`, users can search real game titles from RAWG.
- Selecting a result auto-fills:
  - Game title
  - Cover image URL
  - Genre
  - Platform(s)

**Why it helps:**
- Speeds up adding games
- Reduces manual typing errors
- Makes entries more consistent

---

### 2: YouTube Data API v3 (Auto Trailer on Game Detail)

**What it does:**
- On `game-detail.html`, the app automatically searches YouTube for:
  - `"<game title> official trailer"`
- It embeds a trailer video directly in the game detail page.

**Why it helps:**
- Adds richer context for each game
- Makes game pages more interactive and media-rich

---

## ▶️ How to Run

### 1: Clone the project
```bash
git clone https://github.com/heatedharth/pixel-diary.git
cd pixel-diary
```

### 2: Configure Supabase
Edit `supabase.config.js`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 3: Configure external API keys
Add your keys in your config file (where your app currently reads them), for example:
- `RAWG_API_KEY`
- `YOUTUBE_API_KEY`

### 4: Restrict your YouTube key (recommended)
In Google Cloud Console:
- Application restrictions: **Websites**
- Allowed referrer(s): your GitHub Pages domain (example: `https://yourusername.github.io/*`)
- API restrictions: **YouTube Data API v3 only**

### 5: Run locally
Use any local static server (example with VS Code Live Server), then open:
- `index.html`

### 6: Deploy to GitHub Pages
Push to your Pages branch and verify:
- RAWG search autofill works in Library modal
- Trailer appears on Game Detail page

---

## ✨ Features

### 🗂️ Create, Edit, and Delete Games
Users can add games to their personal library with details like title, genre, platform, cover art, and play time. Every entry can be edited or removed at any time.

### 🔍 Search and Filter
A live search bar lets users find games by title instantly. Filter controls allow narrowing the library by genre, play status, or star rating.

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
Users can upload screenshots and video clips directly to a game entry. Files are stored in Supabase Storage and displayed in a media gallery on the game detail page.

### 🔐 Sign Up, Log In, and Log Out
Full user authentication via Supabase Auth. Users create an account with email and password, log in securely, and log out from any page. Protected pages redirect unauthenticated users to the login screen.

### 👤 Customizable User Profile
Each user has a profile page where they can set a username, bio, avatar image, and banner. A stats section shows total games, games played, and favorites count.

### ☁️ Cloud Database
All game data, reviews, and profile information are stored in Supabase and tied to each user's account.

---

## 📁 File Structure

```text
pixel-diary/
├── index.html
├── supabase.config.js
├── README.md
├── .gitignore
│
├── pages/
│   ├── library.html
│   ├── game-detail.html
│   ├── login.html
│   ├── signup.html
│   └── profile.html
│
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   ├── auth.css
│   │   ├── library.css
│   │   ├── game-detail.css
│   │   └── profile.css
│   │
│   └── js/
│       ├── app.js
│       ├── db.js
│       ├── auth.js
│       ├── games.js
│       ├── search-filter.js
│       ├── sort.js
│       ├── reviews.js
│       ├── media.js
│       ├── profile.js
│       ├── profile-page.js
│       ├── ui.js
│       ├── library.js
│       ├── game-detail.js
│       └── external-apis.js
```

---

## 🗓️ Project Plan

The development approach is **a couple core features per day**, fully working before moving on. Minor polish and secondary features are added only after the core feature is functional.

| Day | Core Feature |
|-----|-------------|
| **Day 1** | Supabase setup + Authentication + Game CRUD |
| **Day 2** | Game Library display + Search + Filter |
| **Day 3** | Sorting + Ratings + Reviews |
| **Day 4** | Media Uploads + User Profile |
| **Day 5** | UI Polish + Testing + Bug Fixes |
| **Day 6** | External API Integration (RAWG + YouTube) |

---

## 🧠 What I Learned

AI is really useful for getting a jumpstart on what I want to build; however, it needs coaching, and I can't just feed it all the info I want at the same time. To build efficiently, I have to take on features one by one, so it doesn't get confused and make a bunch of bugs within the code. Once all the features were built, I found it easier to manually find bugs myself than ask the AI to do it; some things are best left to humans. However, it is extremely excellent at fixing said bugs and finding bugs within the code.

---

*Built with 💖 for gamers, by a gamer.*