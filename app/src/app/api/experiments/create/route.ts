import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type VariantInput = {
  value: string;
  percent: number;
};

type CreateExperimentBody = {
  tenantId: string;
  name: string;
  endsAt?: string | null;
  variants: VariantInput[];
};

export async function POST(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body: CreateExperimentBody = await req.json();

    const { tenantId, name, endsAt, variants } = body;

    if (!tenantId || !name || !Array.isArray(variants)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (variants.length < 2) {
      return NextResponse.json(
        { error: "The experiment needs at least 2 variants." },
        { status: 400 },
      );
    }

    const totalPercent = variants.reduce(
      (sum: number, v: VariantInput) => sum + v.percent,
      0,
    );

    if (totalPercent !== 100) {
      return NextResponse.json(
        { error: "The sum of the percentages must be 100." },
        { status: 400 },
      );
    }

    const uniqueValues = new Set(variants.map((v: VariantInput) => v.value));

    if (uniqueValues.size !== variants.length) {
      return NextResponse.json(
        { error: "Variant values ​​must be unique." },
        { status: 400 },
      );
    }

    const membership = await sql`
      SELECT role
      FROM tenant_members
      WHERE tenant_id = ${tenantId}
        AND user_id = ${payload.userId}
      LIMIT 1
    `;

    if (
      membership.length === 0 ||
      !["owner", "admin"].includes(membership[0].role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await sql.transaction((tx) => [
      tx`
        INSERT INTO experiments (tenant_id, name, ends_at)
        VALUES (
          ${tenantId},
          ${name},
          ${endsAt ? new Date(endsAt) : null}
        )
        RETURNING id, name, is_active, ends_at
      `,
      ...variants.map(
        (variant: VariantInput) =>
          tx`
          INSERT INTO experiment_variants (experiment_id, value, percent)
          VALUES (
            (SELECT id FROM experiments WHERE tenant_id = ${tenantId} AND name = ${name}),
            ${variant.value},
            ${variant.percent}
          )
        `,
      ),
    ]);

    const experiment = results[0][0];

    return NextResponse.json({
      experiment: {
        ...experiment,
        variants,
      },
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "An experiment with this name already exists." },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Error creating experiment." },
      { status: 500 },
    );
  }
}
