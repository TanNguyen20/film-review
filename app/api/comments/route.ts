import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initDatabase } from "@/lib/init-db";

export async function GET() {
  try {
    await initDatabase();

    // Get recent comments with video info and like counts
    const result = await query(
      `SELECT
        c.id,
        c.video_id,
        c.user_id,
        c.user_name,
        c.content,
        c.created_at,
        v.title as video_title,
        v.genre as video_genre,
        COALESCE(lc.likes_count, 0)::int as likes_count,
        COALESCE(cc.comments_count, 0)::int as comments_count
       FROM video_comments c
       JOIN tiktok_videos v ON v.id = c.video_id
       LEFT JOIN (
         SELECT video_id, COUNT(*) as likes_count FROM video_likes GROUP BY video_id
       ) lc ON lc.video_id = c.video_id
       LEFT JOIN (
         SELECT video_id, COUNT(*) as comments_count FROM video_comments GROUP BY video_id
       ) cc ON cc.video_id = c.video_id
       ORDER BY c.created_at DESC
       LIMIT 20`
    );

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error("Fetch recent comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
