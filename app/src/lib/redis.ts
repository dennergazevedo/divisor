export async function resetSessions(userId: string): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error("Redis environment variables are not set");
    return;
  }

  const key = `divisor_plan:sessions:${userId}`;

  try {
    const res = await fetch(`${url}/del/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error(
        `Failed to reset sessions for user ${userId}:`,
        await res.text(),
      );
    }
  } catch (error) {
    console.error(`Error resetting sessions for user ${userId}:`, error);
  }
}
