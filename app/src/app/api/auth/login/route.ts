import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1️⃣ Buscar usuários
    const users = await sql`
      SELECT id, email, password_hash, tenant_id
      FROM users
      WHERE LOWER(email) = ${normalizedEmail}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // 2️⃣ Validar senha
    const passwordValid = await bcrypt.compare(
      password,
      users[0].password_hash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 },
      );
    }

    // 3️⃣ Buscar tenants ativos
    const tenantIds = users.map((u) => u.tenant_id);

    const tenants = await sql`
      SELECT id, name, slug
      FROM tenants
      WHERE id = ANY(${tenantIds})
        AND is_active = true
    `;

    // 🔐 4️⃣ Gerar JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não definido");
    }

    const token = signJwt({
      userId: users[0].id,
      email: users[0].email,
      tenantIds: tenants.map((t) => t.id),
    });

    // 🍪 5️⃣ Salvar token em cookie HTTP-only
    const response = NextResponse.json({
      user: {
        email: users[0].email,
      },
      tenants,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 604800),
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
