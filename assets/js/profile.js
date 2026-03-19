// ============================================================
// profile.js — User Profile (Supabase)
// Handles reading/updating profile data and avatar/banner uploads.
// Storage bucket: "avatars" (public)
// Storage path: avatars/{uid}/avatar_{timestamp}.ext
//               avatars/{uid}/banner_{timestamp}.ext
// Depends on: supabase.config.js (supabaseClient)
// ============================================================

const AVATAR_BUCKET = "avatars";

// ── Get Profile ───────────────────────────────────────────────
async function getProfile(uid) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .maybeSingle();  // returns null instead of error when no row found

  if (error) {
    console.error("getProfile error:", error.message);
    return null;
  }

  // If no profile row exists yet, create one from the auth user metadata
  if (!data) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const fallback = {
      id: uid,
      username: user?.user_metadata?.username || user?.email?.split("@")[0] || "",
      email: user?.email || "",
      bio: "",
      avatarURL: "",
      bannerURL: ""
    };
    const { error: insertError } = await supabaseClient
      .from("profiles")
      .upsert(fallback, { onConflict: "id" });

    if (insertError) console.error("Profile create error:", insertError.message);
    return fallback;
  }

  return data;
}

// ── Update Profile Fields ─────────────────────────────────────
// Uses upsert so if the profile row doesn't exist it gets created.
async function updateProfile(uid, { username, bio, avatarURL, bannerURL }) {
  const updates = { id: uid };
  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;
  if (avatarURL !== undefined) updates.avatarURL = avatarURL;
  if (bannerURL !== undefined) updates.bannerURL = bannerURL;

  const { error } = await supabaseClient
    .from("profiles")
    .upsert(updates, { onConflict: "id" });

  return error ? error.message : null;
}

// ── Upload Avatar ─────────────────────────────────────────────
async function uploadAvatar(uid, file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${uid}/avatar_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseClient
    .storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type
    });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabaseClient
    .storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path);

  const avatarURL = urlData.publicUrl;
  const saveError = await updateProfile(uid, { avatarURL });
  return saveError ? { error: saveError } : { avatarURL, error: null };
}

// ── Upload Banner ─────────────────────────────────────────────
async function uploadBanner(uid, file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${uid}/banner_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseClient
    .storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: file.type
    });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabaseClient
    .storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path);

  const bannerURL = urlData.publicUrl;
  const saveError = await updateProfile(uid, { bannerURL });
  return saveError ? { error: saveError } : { bannerURL, error: null };
}

// ── Get Profile Stats ─────────────────────────────────────────
// Queries the games table to compute counts for the stats bar.
async function getProfileStats(uid) {
  const { data, error } = await supabaseClient
    .from("games")
    .select("status, favorite")
    .eq("userId", uid);

  if (error || !data) return { total: 0, played: 0, playing: 0, plan: 0, favorites: 0 };

  return {
    total: data.length,
    played: data.filter(g => g.status === "played").length,
    playing: data.filter(g => g.status === "playing").length,
    plan: data.filter(g => g.status === "plan-to-play").length,
    favorites: data.filter(g => g.favorite === true).length
  };
}

// ── Get Favorite Games ────────────────────────────────────────
async function getFavoriteGames(uid) {
  const { data, error } = await supabaseClient
    .from("games")
    .select("id, title, coverURL, genre, status, rating")
    .eq("userId", uid)
    .eq("favorite", true)
    .order("createdAt", { ascending: false });

  if (error) return [];
  return data;
}