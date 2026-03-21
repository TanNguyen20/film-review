import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import { headers } from "next/headers";
import { initDatabase } from "@/lib/init-db";

const MAX_CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const MIN_CHUNK_SIZE = 5 * 1024 * 1024; // 5 MB

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

    const formData = await req.formData();
    const videoFile = formData.get("video") as File | null;
    const title = (formData.get("title") as string) || "";
    const privacyLevel =
      (formData.get("privacy_level") as string) || "SELF_ONLY";
    const disableComment = formData.get("disable_comment") === "true";
    const disableDuet = formData.get("disable_duet") === "true";
    const disableStitch = formData.get("disable_stitch") === "true";

    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    const videoSize = videoBuffer.length;

    // Calculate chunk parameters
    let chunkSize: number;
    let totalChunkCount: number;

    if (videoSize <= MIN_CHUNK_SIZE) {
      // Small file: upload as whole
      chunkSize = videoSize;
      totalChunkCount = 1;
    } else {
      chunkSize = MAX_CHUNK_SIZE;
      totalChunkCount = Math.floor(videoSize / chunkSize);
      // If there's a remainder, it gets merged into the last chunk
      if (videoSize % chunkSize > 0 && videoSize % chunkSize < MIN_CHUNK_SIZE) {
        // Merge remainder into last chunk (last chunk will be larger)
      } else if (videoSize % chunkSize >= MIN_CHUNK_SIZE) {
        totalChunkCount += 1;
      }
      // Ensure at least 1 chunk
      if (totalChunkCount === 0) totalChunkCount = 1;
    }

    // Step 1: Initialize the Direct Post
    const initResponse = await fetch(
      "https://open.tiktokapis.com/v2/post/publish/video/init/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          post_info: {
            title,
            privacy_level: privacyLevel,
            disable_duet: disableDuet,
            disable_comment: disableComment,
            disable_stitch: disableStitch,
          },
          source_info: {
            source: "FILE_UPLOAD",
            video_size: videoSize,
            chunk_size: chunkSize,
            total_chunk_count: totalChunkCount,
          },
        }),
      }
    );

    const initData = await initResponse.json();

    if (initData.error?.code !== "ok") {
      return NextResponse.json(
        {
          error: initData.error?.message || "Failed to initialize upload",
          code: initData.error?.code,
        },
        { status: initResponse.status }
      );
    }

    const { publish_id, upload_url } = initData.data;

    // Step 2: Upload video data to upload_url
    if (totalChunkCount === 1) {
      // Single upload
      const uploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": getContentType(videoFile.name),
          "Content-Length": videoSize.toString(),
          "Content-Range": `bytes 0-${videoSize - 1}/${videoSize}`,
        },
        body: videoBuffer,
      });

      if (!uploadResponse.ok && uploadResponse.status !== 201) {
        return NextResponse.json(
          { error: "Failed to upload video to TikTok" },
          { status: uploadResponse.status }
        );
      }
    } else {
      // Chunked upload
      for (let i = 0; i < totalChunkCount; i++) {
        const start = i * chunkSize;
        const isLastChunk = i === totalChunkCount - 1;
        const end = isLastChunk ? videoSize - 1 : start + chunkSize - 1;
        const chunk = videoBuffer.subarray(start, end + 1);

        const uploadResponse = await fetch(upload_url, {
          method: "PUT",
          headers: {
            "Content-Type": getContentType(videoFile.name),
            "Content-Length": chunk.length.toString(),
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          },
          body: chunk,
        });

        // 206 = partial content (more chunks), 201 = all done
        if (
          !uploadResponse.ok &&
          uploadResponse.status !== 201 &&
          uploadResponse.status !== 206
        ) {
          return NextResponse.json(
            {
              error: `Failed to upload chunk ${i + 1}/${totalChunkCount}`,
            },
            { status: uploadResponse.status }
          );
        }
      }
    }

    // Step 3: Save to database
    await initDatabase();

    const insertResult = await query(
      `INSERT INTO tiktok_videos (user_id, tiktok_publish_id, title, description, privacy_level, video_filename, video_size, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
       RETURNING id`,
      [
        session.user.id,
        publish_id,
        title,
        title,
        privacyLevel,
        videoFile.name,
        videoSize,
      ]
    );

    return NextResponse.json({
      success: true,
      publish_id,
      video_id: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getContentType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "mp4":
      return "video/mp4";
    case "webm":
      return "video/webm";
    case "mov":
      return "video/quicktime";
    default:
      return "video/mp4";
  }
}
