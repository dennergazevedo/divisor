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

    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = (page - 1) * limit;

    const totalResult = await sql`
      SELECT COUNT(*) as count
      FROM experiments
      WHERE tenant_id = ${tenantId}
        AND is_active = true
    `;

    const total = parseInt(totalResult[0].count);

    // Get active experiments from SQL database
    const experiments = await sql`
      SELECT
        id,
        name,
        is_active,
        ends_at,
        created_at
      FROM experiments
      WHERE tenant_id = ${tenantId}
        AND is_active = true
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return NextResponse.json({
      experiments: experiments.map((e) => ({ experimentName: e.name })),
      total,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to list performance experiments" },
      { status: 500 },
    );
  }
}
