import { query } from "./db";

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS tiktok_videos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id TEXT NOT NULL,
      tiktok_publish_id TEXT,
      tiktok_video_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      genre TEXT,
      privacy_level TEXT DEFAULT 'SELF_ONLY',
      video_filename TEXT,
      video_size BIGINT,
      status TEXT DEFAULT 'pending',
      tiktok_video_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Add columns to existing tables (safe to run multiple times)
  await query(`ALTER TABLE tiktok_videos ADD COLUMN IF NOT EXISTS tiktok_video_id TEXT;`);
  await query(`ALTER TABLE tiktok_videos ADD COLUMN IF NOT EXISTS genre TEXT;`);

  // Comments on videos
  await query(`
    CREATE TABLE IF NOT EXISTS video_comments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL DEFAULT 'Anonymous',
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // Likes on videos (one per user per video)
  await query(`
    CREATE TABLE IF NOT EXISTS video_likes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      video_id UUID NOT NULL REFERENCES tiktok_videos(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(video_id, user_id)
    );
  `);
}
