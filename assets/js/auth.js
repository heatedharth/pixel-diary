// ============================================================
// auth.js — Authentication (Supabase Auth)
// Handles sign up, log in, log out, and password reset.
// Depends on: supabase.config.js (supabaseClient), db.js
// ============================================================

// ── Sign Up ──────────────────────────────────────────────────
async function signUp(username, email, password) {
  try {
    // 1. Create Supabase Auth user
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return error.message;

    const user = data.user;

    // 2. Create a profile row in the profiles table
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        id: user.id,
        username: username,
        email: email,
        bio: "",
        avatarURL: "",
        bannerURL: ""
      });

    if (profileError) return profileError.message;

    // 3. Redirect to library
    window.location.href = "library.html";

  } catch (err) {
    return err.message;
  }
}

// ── Log In ───────────────────────────────────────────────────
async function logIn(email, password) {
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    window.location.href = "library.html";
  } catch (err) {
    return err.message;
  }
}

// ── Log Out ──────────────────────────────────────────────────
async function logOut() {
  try {
    await supabaseClient.auth.signOut();
  } catch (err) {
    console.error("Logout error:", err.message);
  } finally {
    // Always redirect regardless of whether signOut succeeded
    const isInSubfolder = window.location.pathname.includes("/pages/");
    window.location.href = isInSubfolder ? "../index.html" : "index.html";
  }
}

// ── Password Reset ───────────────────────────────────────────
async function resetPassword(email) {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) return error.message;
    return null; // null = success
  } catch (err) {
    return err.message;
  }
}