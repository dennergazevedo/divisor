import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";
import { getPlanLimits } from "@/lib/plans";

export async function PATCH(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { tenantId, active } = await req.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    // Check if user is the owner of the tenant
    const membership = await sql`
      SELECT role FROM tenant_members
      WHERE tenant_id = ${tenantId} AND user_id = ${payload.userId}
    `;

    if (!membership.length || membership[0].role !== "owner") {
      return NextResponse.json(
        { error: "Only the owner can toggle tenant status" },
        { status: 403 },
      );
    }

    if (active) {
      // Enforcement: Check if user has reached their limit
      const user = await sql`
        SELECT current_plan
        FROM users
        WHERE id = ${payload.userId}
        LIMIT 1
      `;

      const limits = getPlanLimits(user[0]?.current_plan);

      const activeTenants = await sql`
        SELECT count(*) as count
        FROM tenants t
        JOIN tenant_members tm ON tm.tenant_id = t.id
        WHERE tm.user_id = ${payload.userId}
          AND tm.role = 'owner'
          AND t.active = true
      `;

      if (Number(activeTenants[0].count) >= limits.tenants) {
        return NextResponse.json(
          {
            error: "Active tenant limit reached",
            details: `Your current plan (${user[0]?.current_plan || "free"}) allows up to ${limits.tenants} active tenant(s).`,
          },
          { status: 403 },
        );
      }
    }

    await sql`
      UPDATE tenants
      SET active = ${!!active}
      WHERE id = ${tenantId}
    `;

    return NextResponse.json({ success: true, active: !!active });
  } catch (error) {
    console.error("Error updating tenant active status:", error);
    return NextResponse.json(
      { error: "Failed to update tenant status" },
      { status: 500 },
    );
  }
}
