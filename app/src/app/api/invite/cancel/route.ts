import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
};

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { inviteId } = await req.json();

    if (!inviteId || typeof inviteId !== "string") {
      return NextResponse.json({ error: "Invalid inviteId" }, { status: 400 });
    }

    const invites = await sql`
      SELECT id, tenant_id
      FROM tenant_invites
      WHERE id = ${inviteId}
      LIMIT 1
    `;

    if (invites.length === 0) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    const invite = invites[0];

    const membership = await sql`
      SELECT role
      FROM tenant_members
      WHERE tenant_id = ${invite.tenant_id}
        AND user_id = ${payload.userId}
      LIMIT 1
    `;

    if (
      membership.length === 0 ||
      !["owner", "admin"].includes(membership[0].role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await sql`
      DELETE FROM tenant_invites
      WHERE id = ${inviteId}
    `;

    return NextResponse.json({ status: "canceled" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to cancel invite" },
      { status: 500 },
    );
  }
}
