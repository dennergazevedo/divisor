import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    // Verify token and get user
    const users =
      await sql`SELECT id FROM users WHERE forgot_password_hash = ${token}`;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired recovery token." },
        { status: 400 },
      );
    }

    const userId = users[0].id;
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password and clear hash
    await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, 
          forgot_password_hash = NULL 
      WHERE id = ${userId}
    `;

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in reset-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
