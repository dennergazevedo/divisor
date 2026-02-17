import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
  tenantIds: string[];
};

export async function GET() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 🔎 Buscar tenants completos
    const tenants = await sql`
      SELECT id, name, slug
      FROM tenants
      WHERE id = ANY(${payload.tenantIds})
        AND is_active = true
    `;

    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
      },
      tenants,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(null, { status: 401 });
  }
}
