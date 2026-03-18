// ============================================================
// supabase.config.js — Supabase Project Configuration
// ⚠️  Keys are safe because they are PUBLIC
// ============================================================
// HOW TO FILL THIS IN:
// 1. Go to https://supabase.com and create a free project
// 2. In your project go to Settings → API
// 3. Copy your Project URL and paste into SUPABASE_URL below
// 4. Copy your anon/public key and paste into SUPABASE_ANON_KEY
// 5. Go to Storage → Create a new bucket called: game-media
//    Set it to PUBLIC so download URLs work without extra auth
// ============================================================

const SUPABASE_URL = "https://xzxcizskmnapnbolblxm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TGYWrjTRQCv-NRMdXH-KBA_NDJBO9a0";

// Initialize the Supabase client
// supabase-js is loaded via CDN before this file
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
