import { query } from "./db";

export async function createNotification({
  userId,
  actorName,
  type,
  videoId,
  videoTitle,
  message,
}: {
  userId: string;
  actorName: string;
  type: "like" | "comment";
  videoId: string;
  videoTitle: string;
  message: string;
}) {
  await query(
    `INSERT INTO notifications (user_id, actor_name, type, video_id, video_title, message)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, actorName, type, videoId, videoTitle, message]
  );
}
