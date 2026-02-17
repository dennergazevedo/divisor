import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1️⃣ Buscar todos os usuários com esse email
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

    // 2️⃣ Validar senha (qualquer um serve, a senha é a mesma)
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

    // 3️⃣ Buscar tenants associados
    const tenantIds = users.map((u) => u.tenant_id);

    const tenants = await sql`
      SELECT id, name, slug
      FROM tenants
      WHERE id = ANY(${tenantIds})
        AND is_active = true
    `;

    return NextResponse.json({
      user: {
        email: users[0].email,
      },
      tenants,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
