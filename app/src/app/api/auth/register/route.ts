import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signJwt } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${normalizedEmail}, ${passwordHash}, ${name ?? null})
      RETURNING id, email
    `;

    const token = signJwt({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(process.env.JWT_EXPIRES_IN ?? 60 * 60 * 24 * 7),
    });

    return response;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email já cadastrado" },
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
