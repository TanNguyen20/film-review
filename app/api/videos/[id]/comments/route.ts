import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { initDatabase } from "@/lib/init-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;

    const result = await query(
      `SELECT id, user_id, user_name, content, created_at
       FROM video_comments
       WHERE video_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [id]
    );

    return NextResponse.json({ comments: result.rows });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be under 1000 characters" },
        { status: 400 }
      );
    }

    await initDatabase();

    const result = await query(
      `INSERT INTO video_comments (video_id, user_id, user_name, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, user_name, content, created_at`,
      [id, session.user.id, session.user.name || "Anonymous", content]
    );

    return NextResponse.json({ comment: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
