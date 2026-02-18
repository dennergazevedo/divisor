import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
};

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const invites = await sql`
      SELECT
        ti.id,
        ti.tenant_id,
        t.name AS tenant_name,
        ti.role,
        ti.created_at
      FROM tenant_invites ti
      INNER JOIN tenants t ON t.id = ti.tenant_id
      WHERE ti.email = ${payload.email}
        AND ti.accepted_at IS NULL
      ORDER BY ti.created_at DESC
    `;

    return NextResponse.json({ invites });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
