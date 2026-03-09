// ============================================================
// db.js — Firebase Initialization
// Initializes Firebase app, Auth, and Firestore.
// All other JS files import from here.
// ============================================================

// Firebase is loaded via CDN <script> tags on each page.
// firebase.config.js must be loaded before this file.

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Export shared instances
const auth = firebase.auth();
const db = firebase.firestore();

// ── Firestore Collection Helpers ────────────────────────────

/** Reference to a user's profile doc */
function userDoc(uid) {
    return db.collection("users").doc(uid);
}

/** Reference to a user's games subcollection */
function gamesCol(uid) {
    return db.collection("users").doc(uid).collection("games");
}

/** Reference to a single game doc */
function gameDoc(uid, gameId) {
    return gamesCol(uid).doc(gameId);
}