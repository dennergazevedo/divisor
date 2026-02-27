import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const users = await sql`
      SELECT id, password_hash, provider_id
      FROM users
      WHERE id = ${payload.userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    if (user.provider_id) {
      return NextResponse.json(
        { error: "Accounts linked with Google cannot change password here" },
        { status: 400 },
      );
    }

    const passwordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Current password incorrect" },
        { status: 400 },
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password_hash = ${hashedNewPassword}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating password" },
      { status: 500 },
    );
  }
}
