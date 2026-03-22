import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { initDatabase } from "@/lib/init-db";

// GET /api/watchlist — return full video objects in user's watchlist
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDatabase();

    const result = await query(
      `SELECT
        v.id,
        v.user_id,
        v.tiktok_publish_id,
        v.tiktok_video_id,
        v.tiktok_video_url,
        v.title,
        v.description,
        v.genre,
        v.privacy_level,
        v.video_filename,
        v.video_size,
        v.status,
        v.created_at,
        v.updated_at,
        COALESCE(lc.likes_count, 0)::int as likes_count,
        COALESCE(cc.comments_count, 0)::int as comments_count,
        w.created_at as watchlisted_at
       FROM watchlist w
       JOIN tiktok_videos v ON v.id = w.video_id
       LEFT JOIN (
         SELECT video_id, COUNT(*) as likes_count FROM video_likes GROUP BY video_id
       ) lc ON lc.video_id = v.id
       LEFT JOIN (
         SELECT video_id, COUNT(*) as comments_count FROM video_comments GROUP BY video_id
       ) cc ON cc.video_id = v.id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [session.user.id]
    );

    return NextResponse.json({ videos: result.rows });
  } catch (error) {
    console.error("Fetch watchlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/watchlist — toggle a video in/out of watchlist
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { videoId } = body;
    if (!videoId) {
      return NextResponse.json(
        { error: "videoId is required" },
        { status: 400 }
      );
    }

    await initDatabase();

    // Check if already in watchlist
    const existing = await query(
      `SELECT id FROM watchlist WHERE user_id = $1 AND video_id = $2`,
      [session.user.id, videoId]
    );

    if (existing.rows.length > 0) {
      // Remove from watchlist
      await query(
        `DELETE FROM watchlist WHERE user_id = $1 AND video_id = $2`,
        [session.user.id, videoId]
      );
      return NextResponse.json({ inWatchlist: false });
    } else {
      // Add to watchlist
      await query(
        `INSERT INTO watchlist (user_id, video_id) VALUES ($1, $2)`,
        [session.user.id, videoId]
      );
      return NextResponse.json({ inWatchlist: true });
    }
  } catch (error) {
    console.error("Toggle watchlist error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
