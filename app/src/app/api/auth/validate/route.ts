import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { resetSessions } from "@/lib/redis";

export const runtime = "nodejs";

export async function GET() {
  try {
    const updatedUsers = await sql`
      UPDATE users
      SET 
        plan_status = 'free', 
        current_plan = 'free', 
        expiration_date = NULL
      WHERE (expiration_date < NOW() OR plan_status != 'active')
        AND current_plan != 'free'
      RETURNING id
    `;

    // Reset sessions for each updated user
    for (const user of updatedUsers) {
      await resetSessions(user.id);
    }

    return NextResponse.json({
      success: true,
      message: `${updatedUsers.length} users corrected and sessions reset.`,
      updatedIds: updatedUsers.map((u) => u.id),
    });
  } catch (error) {
    console.error("Error validating users:", error);
    return NextResponse.json(
      { error: "Failed to validate users" },
      { status: 500 },
    );
  }
}
