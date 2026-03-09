// ============================================================
// games.js — Game CRUD Operations
// All reads/writes to the user's games subcollection.
// Depends on: db.js (db, gamesCol, gameDoc)
// ============================================================

// ── Add Game ────────────────────────────────────────────────
async function addGame(uid, gameData) {
    try {
        const docRef = await gamesCol(uid).add({
            ...gameData,
            favorite: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return { id: docRef.id, error: null };
    } catch (error) {
        return { id: null, error: error.message };
    }
}

// ── Get All Games ────────────────────────────────────────────
async function getGames(uid) {
    try {
        const snapshot = await gamesCol(uid).orderBy("createdAt", "desc").get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("getGames error:", error.message);
        return [];
    }
}

// ── Get Single Game ──────────────────────────────────────────
async function getGameById(uid, gameId) {
    try {
        const doc = await gameDoc(uid, gameId).get();
        if (doc.exists) return { id: doc.id, ...doc.data() };
        return null;
    } catch (error) {
        console.error("getGameById error:", error.message);
        return null;
    }
}

// ── Update Game ──────────────────────────────────────────────
async function updateGame(uid, gameId, updatedData) {
    try {
        await gameDoc(uid, gameId).update({
            ...updatedData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return null; // null = success
    } catch (error) {
        return error.message;
    }
}

// ── Delete Game ──────────────────────────────────────────────
async function deleteGame(uid, gameId) {
    try {
        await gameDoc(uid, gameId).delete();
        return null;
    } catch (error) {
        return error.message;
    }
}

// ── Toggle Favorite ──────────────────────────────────────────
async function toggleFavorite(uid, gameId, currentValue) {
    try {
        await gameDoc(uid, gameId).update({
            favorite: !currentValue,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return null;
    } catch (error) {
        return error.message;
    }
}

// ── Update Play Status ───────────────────────────────────────
async function updatePlayStatus(uid, gameId, status) {
    try {
        await gameDoc(uid, gameId).update({
            status: status,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return null;
    } catch (error) {
        return error.message;
    }
}