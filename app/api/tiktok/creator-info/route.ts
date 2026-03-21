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

    const response = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );

    const data = await response.json();

    if (data.error?.code !== "ok") {
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch creator info" },
        { status: response.status }
      );
    }

    return NextResponse.json({ data: data.data });
  } catch (error) {
    console.error("Creator info error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
