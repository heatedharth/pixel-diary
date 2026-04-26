// ============================================================
// auth.js — Authentication (Supabase Auth)
// Handles sign up, log in, log out, and password reset.
// Depends on: supabase.config.js (supabaseClient), db.js
// ============================================================

// ── Sign Up ──────────────────────────────────────────────────
async function signUp(username, email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return error.message;

    const user = data.user;
    if (!user) {
      // Email confirmation flow can return null user in some configs
      return null;
    }

    // Try to create profile, but don't fail signup UX if RLS blocks it.
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        id: user.id,
        username,
        email,
        bio: "",
        avatarURL: "",
        bannerURL: ""
      });

    if (profileError) {
      console.warn("Profile insert skipped:", profileError.message);
      // do not return this error to UI
    }

    window.location.href = "library.html";
    return null;
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
    // Robustly find the root path regardless of deployment subfolder
    const parts = window.location.pathname.split("/");
    const pageIdx = parts.lastIndexOf("pages");
    const base = pageIdx > 0
      ? parts.slice(0, pageIdx).join("/")
      : parts.slice(0, -1).join("/");
    window.location.replace(base + "/index.html");
  }
}

// ── Password Reset ───────────────────────────────────────────
async function resetPassword(email) {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) return error.message;
    return null;
  } catch (err) {
    return err.message;
  }
}
