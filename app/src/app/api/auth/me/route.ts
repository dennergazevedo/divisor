import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const [user] = await sql`
      SELECT id, email, name, plan_status, current_plan
      FROM users
      WHERE id = ${payload.userId}
      LIMIT 1
    `;

    if (!user) {
      return NextResponse.json(null, { status: 401 });
    }

    const tenants = await sql`
      SELECT
        t.id,
        t.name,
        t.url,
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
    `;

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan_status: user.plan_status,
        current_plan: user.current_plan,
      },
      tenants,
      invites,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 401 });
  }
}
