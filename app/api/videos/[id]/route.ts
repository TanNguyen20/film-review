import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the video exists and belongs to the authenticated user
    const result = await query(
      `SELECT id, user_id FROM tiktok_videos WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const video = result.rows[0];
    if (video.user_id !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own videos" },
        { status: 403 }
      );
    }

    // Delete the video
    await query(`DELETE FROM tiktok_videos WHERE id = $1`, [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
