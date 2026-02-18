import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

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

    const { tenantId, userId, role } = await req.json();

    if (!tenantId || !userId || !role) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!["admin", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (userId === payload.userId) {
      return NextResponse.json(
        { error: "You cannot change your own permissions." },
        { status: 400 },
      );
    }

    const requester = await sql`
      SELECT role
      FROM tenant_members
      WHERE tenant_id = ${tenantId}
        AND user_id = ${payload.userId}
      LIMIT 1
    `;

    if (requester.length === 0 || requester[0].role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const target = await sql`
      SELECT role
      FROM tenant_members
      WHERE tenant_id = ${tenantId}
        AND user_id = ${userId}
      LIMIT 1
    `;

    if (target.length === 0) {
      return NextResponse.json(
        { error: "User does not belong to the tenant." },
        { status: 404 },
      );
    }

    if (target[0].role === "owner") {
      return NextResponse.json(
        { error: "You cannot change another owner's permissions." },
        { status: 400 },
      );
    }

    await sql`
      UPDATE tenant_members
      SET role = ${role}
      WHERE tenant_id = ${tenantId}
        AND user_id = ${userId}
    `;

    return NextResponse.json({ status: "updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating permissions." },
      { status: 500 },
    );
  }
}
