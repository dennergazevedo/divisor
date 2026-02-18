import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";
import crypto from "crypto";

type JwtPayload = {
  userId: string;
  email: string;
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { tenantId, email, role } = await req.json();

    if (!tenantId || typeof tenantId !== "string") {
      return NextResponse.json({ error: "Invalid tenantId" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!["admin", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const membership = await sql`
      SELECT role
      FROM tenant_members
      WHERE tenant_id = ${tenantId}
        AND user_id = ${payload.userId}
      LIMIT 1
    `;

    if (
      membership.length === 0 ||
      !["owner", "admin"].includes(membership[0].role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");

    const [invite] = await sql`
      INSERT INTO tenant_invites (tenant_id, email, role, token)
      VALUES (${tenantId}, ${normalizedEmail}, ${role}, ${inviteToken})
      RETURNING id, email, role, token, created_at
    `;

    return NextResponse.json({ invite });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "There is already an open invitation for this email." },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Error creating invitation." },
      { status: 500 },
    );
  }
}
