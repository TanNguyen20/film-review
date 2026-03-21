import { query } from "./db";

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS tiktok_videos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id TEXT NOT NULL,
      tiktok_publish_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      privacy_level TEXT DEFAULT 'SELF_ONLY',
      video_filename TEXT,
      video_size BIGINT,
      status TEXT DEFAULT 'pending',
      tiktok_video_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
