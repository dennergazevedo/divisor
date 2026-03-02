import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = (page - 1) * limit;

    const totalResult = await sql`
      SELECT COUNT(*) as count
      FROM tenant_members
      WHERE user_id = ${payload.userId}
    `;

    const total = parseInt(totalResult[0].count);

    const tenants = await sql`
      SELECT
        t.id,
        t.name,
        t.url,
        t.active,
        tm.role,
        (
          SELECT u2.current_plan 
          FROM tenant_members tm2 
          JOIN users u2 ON u2.id = tm2.user_id 
          WHERE tm2.tenant_id = t.id AND tm2.role = 'owner' 
          LIMIT 1
        ) as owner_plan
      FROM tenant_members tm
      INNER JOIN tenants t ON t.id = tm.tenant_id
      WHERE tm.user_id = ${payload.userId}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({
      tenants,
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
