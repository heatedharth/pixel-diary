// ============================================================
// media.js — Media Uploads via Supabase Storage
// Uploads to the "game-media" bucket in Supabase Storage.
// Metadata is saved to the games table as the mediaFiles
// JSONB column: [{ fileName, storagePath, url, type, uploadedAt }]
//
// Storage path: {uid}/{gameId}/{timestamp_filename}
// Depends on: supabase.config.js (supabaseClient)
// ============================================================

const BUCKET_NAME = "game-media";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Validate file type ────────────────────────────────────────
function validateFileType(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `File type not allowed. Accepted: JPG, PNG, GIF, WEBP, MP4, WEBM.`;
  }
  return null;
}

// ── Validate file size ────────────────────────────────────────
function validateFileSize(file) {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`;
  }
  return null;
}

// ── Upload a single file ──────────────────────────────────────
async function uploadMedia(uid, gameId, file, onProgress = null) {
  const typeError = validateFileType(file);
  if (typeError) return { error: typeError };

  const sizeError = validateFileSize(file);
  if (sizeError) return { error: sizeError };

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${timestamp}_${safeName}`;
  const storagePath = `${uid}/${gameId}/${fileName}`;

  if (onProgress) onProgress(0);

  // Upload to Supabase Storage
  const { error: uploadError } = await supabaseClient
    .storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) return { error: uploadError.message };

  if (onProgress) onProgress(100);

  // Get public URL
  const { data: urlData } = supabaseClient
    .storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const url = urlData.publicUrl;
  const type = ALLOWED_IMAGE_TYPES.includes(file.type) ? "image" : "video";

  const newItem = { fileName, storagePath, url, type, uploadedAt: new Date().toISOString() };

  // Fetch current mediaFiles, append, and update the row
  const { data: game, error: fetchError } = await supabaseClient
    .from("games")
    .select("mediaFiles")
    .eq("id", gameId)
    .eq("userId", uid)
    .single();

  if (fetchError) return { error: fetchError.message };

  const updatedFiles = [...(game.mediaFiles || []), newItem];

  const { error: updateError } = await supabaseClient
    .from("games")
    .update({ mediaFiles: updatedFiles, updatedAt: new Date().toISOString() })
    .eq("id", gameId)
    .eq("userId", uid);

  if (updateError) return { error: updateError.message };

  return { fileName, storagePath, url, type, error: null };
}

// ── Get media for a game ──────────────────────────────────────
function getMediaForGame(game) {
  return game.mediaFiles || [];
}

// ── Delete a single media file ────────────────────────────────
async function deleteMedia(uid, gameId, mediaItem) {
  // Remove from Supabase Storage
  const { error: storageError } = await supabaseClient
    .storage
    .from(BUCKET_NAME)
    .remove([mediaItem.storagePath]);

  if (storageError) return storageError.message;

  // Fetch current array, filter out deleted item, update row
  const { data: game, error: fetchError } = await supabaseClient
    .from("games")
    .select("mediaFiles")
    .eq("id", gameId)
    .eq("userId", uid)
    .single();

  if (fetchError) return fetchError.message;

  const updatedFiles = (game.mediaFiles || []).filter(
    f => f.storagePath !== mediaItem.storagePath
  );

  const { error: updateError } = await supabaseClient
    .from("games")
    .update({ mediaFiles: updatedFiles, updatedAt: new Date().toISOString() })
    .eq("id", gameId)
    .eq("userId", uid);

  return updateError ? updateError.message : null;
}