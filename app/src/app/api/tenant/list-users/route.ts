import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type TenantMember = {
  user_id: string;
  email: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
};

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

    if (membership.length === 0) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membersResult = await sql`
      SELECT
        tm.user_id,
        u.email,
        tm.role,
        tm.created_at AS joined_at
      FROM tenant_members tm
      INNER JOIN users u ON u.id = tm.user_id
      WHERE tm.tenant_id = ${tenantId}
      ORDER BY tm.created_at ASC
    `;

    const members = membersResult as TenantMember[];

    return NextResponse.json({ members });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to list tenant members" },
      { status: 500 },
    );
  }
}
