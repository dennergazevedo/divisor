import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, tenant } = body;

    if (!email || !password || !tenant) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    let tenantId: string;

    // 🔁 CASO 1 — tenant.id informado
    if (tenant.id) {
      const [existingTenant] = await sql`
        SELECT id FROM tenants WHERE id = ${tenant.id}
      `;

      if (!existingTenant) {
        return NextResponse.json(
          { error: "Tenant não encontrado" },
          { status: 404 },
        );
      }

      tenantId = existingTenant.id;
    }

    // 🆕 CASO 2 — criar tenant
    else if (tenant.name && tenant.slug) {
      const normalizedSlug = tenant.slug.trim().toLowerCase();

      const results = await sql.transaction((tx) => [
        tx`
          INSERT INTO tenants (name, slug)
          VALUES (${tenant.name}, ${normalizedSlug})
          ON CONFLICT (slug) DO NOTHING
          RETURNING id
        `,
        tx`
          SELECT id FROM tenants WHERE slug = ${normalizedSlug}
        `,
      ]);

      tenantId = results[0][0]?.id ?? results[1][0]?.id;

      if (!tenantId) {
        throw new Error("Erro ao criar ou localizar tenant");
      }
    } else {
      return NextResponse.json({ error: "Tenant inválido" }, { status: 400 });
    }

    // 👤 Criar usuário
    const [user] = await sql`
      INSERT INTO users (email, password_hash, tenant_id)
      VALUES (${normalizedEmail}, ${passwordHash}, ${tenantId})
      RETURNING id, email, tenant_id
    `;

    // 🔐 Gerar token
    const token = signJwt({
      userId: user.id,
      tenantIds: [user.tenant_id],
      email: user.email,
    });

    // 🍪 Criar response com cookie HTTP-only
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        tenantId: user.tenant_id,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 604800),
    });

    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email já cadastrado neste tenant" },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 },
    );
  }
}
