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

    const { inviteId, accept } = await req.json();

    if (!inviteId || typeof inviteId !== "string") {
      return NextResponse.json({ error: "inviteId inválido" }, { status: 400 });
    }

    if (typeof accept !== "boolean") {
      return NextResponse.json({ error: "accept inválido" }, { status: 400 });
    }

    const invites = await sql`
      SELECT id, tenant_id, email, role
      FROM tenant_invites
      WHERE id = ${inviteId}
        AND accepted_at IS NULL
      LIMIT 1
    `;

    if (invites.length === 0) {
      return NextResponse.json(
        { error: "Convite não encontrado ou já processado" },
        { status: 404 },
      );
    }

    const invite = invites[0];

    if (invite.email !== payload.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!accept) {
      await sql`
        DELETE FROM tenant_invites
        WHERE id = ${inviteId}
      `;

      return NextResponse.json({ status: "declined" });
    }

    await sql.transaction((tx) => [
      tx`
        INSERT INTO tenant_members (tenant_id, user_id, role)
        VALUES (${invite.tenant_id}, ${payload.userId}, ${invite.role})
        ON CONFLICT (tenant_id, user_id) DO NOTHING
      `,
      tx`
        UPDATE tenant_invites
        SET accepted_at = now()
        WHERE id = ${inviteId}
      `,
    ]);

    return NextResponse.json({ status: "accepted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao processar convite" },
      { status: 500 },
    );
  }
}
