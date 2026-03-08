import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined");
    }

    const payload = jwt.verify(token, secret) as {
      userId: string;
      email: string;
    };

    await sql`
      UPDATE users
      SET first_access = FALSE
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 401 });
  }
}
