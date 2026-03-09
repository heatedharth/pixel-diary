// ============================================================
// auth.js — Authentication Logic
// Handles sign up, log in, log out, and password reset.
// Depends on: db.js (auth, db, userDoc)
// ============================================================

// ── Sign Up ─────────────────────────────────────────────────
async function signUp(username, email, password) {
  try {
    // 1. Create the Firebase Auth user
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2. Update Firebase Auth display name
    await user.updateProfile({ displayName: username });

    // 3. Create a Firestore profile document
    await userDoc(user.uid).set({
      uid: user.uid,
      username: username,
      email: email,
      bio: "",
      avatarURL: "",
      bannerURL: "",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 4. Redirect to the game library
    window.location.href = "library.html";

  } catch (error) {
    return error.message;
  }
}

// ── Log In ──────────────────────────────────────────────────
async function logIn(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "library.html";
  } catch (error) {
    return error.message;
  }
}

// ── Log Out ─────────────────────────────────────────────────
async function logOut() {
  try {
    await auth.signOut();
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Logout error:", error.message);
  }
}

// ── Password Reset ──────────────────────────────────────────
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    return null; // success
  } catch (error) {
    return error.message;
  }
}

// ── Get Current User ────────────────────────────────────────
function getCurrentUser() {
  return auth.currentUser;
}