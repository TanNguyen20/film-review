import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { initDatabase } from "@/lib/init-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;

    // Get like count
    const countResult = await query(
      `SELECT COUNT(*)::int as count FROM video_likes WHERE video_id = $1`,
      [id]
    );
    const count = countResult.rows[0]?.count ?? 0;

    // Check if current user has liked (optional auth)
    let liked = false;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      if (session?.user) {
        const likeCheck = await query(
          `SELECT id FROM video_likes WHERE video_id = $1 AND user_id = $2`,
          [id, session.user.id]
        );
        liked = likeCheck.rows.length > 0;
      }
    } catch {
      // Not authenticated — that's fine
    }

    return NextResponse.json({ count, liked });
  } catch (error) {
    console.error("Fetch likes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await initDatabase();

    // Check if already liked
    const existing = await query(
      `SELECT id FROM video_likes WHERE video_id = $1 AND user_id = $2`,
      [id, session.user.id]
    );

    if (existing.rows.length > 0) {
      // Unlike
      await query(
        `DELETE FROM video_likes WHERE video_id = $1 AND user_id = $2`,
        [id, session.user.id]
      );
    } else {
      // Like
      await query(
        `INSERT INTO video_likes (video_id, user_id) VALUES ($1, $2)`,
        [id, session.user.id]
      );
    }

    // Return updated count
    const countResult = await query(
      `SELECT COUNT(*)::int as count FROM video_likes WHERE video_id = $1`,
      [id]
    );

    return NextResponse.json({
      count: countResult.rows[0]?.count ?? 0,
      liked: existing.rows.length === 0, // toggled
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
