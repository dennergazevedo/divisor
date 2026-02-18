import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
};

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

function isValidDomain(domain: string): boolean {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain);
}

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { name, url } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid tenant name" },
        { status: 400 },
      );
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid tenant URL" },
        { status: 400 },
      );
    }

    const normalizedUrl = normalizeDomain(url);

    if (!isValidDomain(normalizedUrl)) {
      return NextResponse.json(
        { error: "Invalid tenant URL" },
        { status: 400 },
      );
    }

    const results = await sql.transaction((tx) => [
      tx`
        INSERT INTO tenants (name, url)
        VALUES (${name}, ${normalizedUrl})
        RETURNING id, name, url
      `,
      tx`
        INSERT INTO tenant_members (tenant_id, user_id, role)
        VALUES (
          (SELECT id FROM tenants WHERE url = ${normalizedUrl}),
          ${payload.userId},
          'owner'
        )
      `,
    ]);

    const tenant = results[0][0];

    return NextResponse.json({ tenant });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A tenant with this URL already exists." },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Error creating tenant." },
      { status: 500 },
    );
  }
}
