// db.js — Cloud Database (Firebase Firestore)
// - Initializes Firebase app with config from firebase.config.js
// - Exports Firestore db instance and Firebase Storage instance
// - Firestore collections:
//     users/{uid}          — user profile data
//     users/{uid}/games    — user's game entries (subcollection)
//     users/{uid}/reviews  — user's reviews (subcollection)
// - Helper: getCollection(), getDocument(), setDocument(), deleteDocument()
