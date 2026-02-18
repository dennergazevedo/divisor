import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const users = await sql`
      SELECT id, email, password_hash
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = users[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const tenants = await sql`
      SELECT
        t.id,
        t.name,
        tm.role
      FROM tenant_members tm
      INNER JOIN tenants t ON t.id = tm.tenant_id
      WHERE tm.user_id = ${user.id}
    `;

    const invites = await sql`
      SELECT
        ti.id,
        ti.tenant_id,
        t.name AS tenant_name,
        ti.role,
        ti.created_at
      FROM tenant_invites ti
      INNER JOIN tenants t ON t.id = ti.tenant_id
      WHERE ti.email = ${user.email}
        AND ti.accepted_at IS NULL
      ORDER BY ti.created_at DESC
    `;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = signJwt({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      tenants,
      invites,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 24 * 7),
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
