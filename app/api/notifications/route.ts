import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { initDatabase } from "@/lib/init-db";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDatabase();

    const result = await query(
      `SELECT id, user_id, actor_name, type, video_id, video_title, message, read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [session.user.id]
    );

    const unreadCount = await query(
      `SELECT COUNT(*)::int as count FROM notifications WHERE user_id = $1 AND read = false`,
      [session.user.id]
    );

    return NextResponse.json({
      notifications: result.rows,
      unread_count: unreadCount.rows[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDatabase();

    await query(
      `UPDATE notifications SET read = true WHERE user_id = $1 AND read = false`,
      [session.user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
