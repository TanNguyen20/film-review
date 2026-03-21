import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { initDatabase } from "@/lib/init-db";

export async function GET() {
  try {
    await initDatabase();

    const result = await query(
      `SELECT
        v.id,
        v.user_id,
        v.tiktok_publish_id,
        v.title,
        v.description,
        v.privacy_level,
        v.video_filename,
        v.video_size,
        v.status,
        v.created_at,
        v.updated_at
       FROM tiktok_videos v
       ORDER BY v.created_at DESC
       LIMIT 50`
    );

    return NextResponse.json({ videos: result.rows });
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
