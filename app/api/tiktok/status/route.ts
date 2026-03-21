import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";

async function getTikTokAccessToken(userId: string): Promise<string | null> {
  const result = await query(
    `SELECT "accessToken" FROM "account" WHERE "userId" = $1 AND "providerId" = 'tiktok' LIMIT 1`,
    [userId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].accessToken as string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = await getTikTokAccessToken(session.user.id);
    if (!accessToken) {
      return NextResponse.json(
        { error: "TikTok account not linked" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { publish_id } = body;

    if (!publish_id) {
      return NextResponse.json(
        { error: "publish_id is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ publish_id }),
      }
    );

    const data = await response.json();

    // Update local database status if we have this record
    if (data.data?.status) {
      const statusMap: Record<string, string> = {
        PROCESSING_UPLOAD: "uploading",
        PROCESSING_DOWNLOAD: "uploading",
        SEND_TO_USER_INBOX: "published",
        PUBLISH_COMPLETE: "published",
        FAILED: "failed",
      };
      const mappedStatus = statusMap[data.data.status] || data.data.status;

      await query(
        `UPDATE tiktok_videos SET status = $1, updated_at = NOW() WHERE tiktok_publish_id = $2`,
        [mappedStatus, publish_id]
      );
    }

    return NextResponse.json({ data: data.data, error: data.error });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
