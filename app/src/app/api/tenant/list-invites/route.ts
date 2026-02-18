import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
};

type TenantInvite = {
  id: string;
  email: string;
  role: "owner" | "admin" | "member";
  created_at: string;
};

export const runtime = "nodejs";

export async function GET(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 },
      );
    }

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

    const invitesResult = await sql`
      SELECT
        id,
        email,
        role,
        created_at
      FROM tenant_invites
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    const invites = invitesResult as TenantInvite[];

    return NextResponse.json({ invites });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to list tenant invites" },
      { status: 500 },
    );
  }
}
