import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type VariantInput = {
  value: string;
  percent: number;
};

type UpdateExperimentBody = {
  experimentId: string;
  tenantId: string;
  name: string;
  isActive: boolean;
  endsAt?: string | null;
  variants: VariantInput[];
};

export async function PUT(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body: UpdateExperimentBody = await req.json();
    const { experimentId, tenantId, name, isActive, endsAt, variants } = body;

    if (
      !experimentId ||
      !tenantId ||
      !name ||
      typeof isActive !== "boolean" ||
      !Array.isArray(variants) ||
      variants.length < 2
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const totalPercent = variants.reduce(
      (sum: number, v: VariantInput) => sum + v.percent,
      0,
    );

    if (totalPercent !== 100) {
      return NextResponse.json(
        { error: "Variant percentages must sum to 100" },
        { status: 400 },
      );
    }

    const uniqueValues = new Set(variants.map((v) => v.value));

    if (uniqueValues.size !== variants.length) {
      return NextResponse.json(
        { error: "Variant values must be unique" },
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

    await sql.transaction((tx) => [
      tx`
        UPDATE experiments
        SET
          name = ${name},
          is_active = ${isActive},
          ends_at = ${endsAt ? new Date(endsAt) : null}
        WHERE id = ${experimentId}
          AND tenant_id = ${tenantId}
      `,
      tx`
        DELETE FROM experiment_variants
        WHERE experiment_id = ${experimentId}
      `,
      ...variants.map(
        (variant: VariantInput) =>
          tx`
          INSERT INTO experiment_variants (experiment_id, value, percent)
          VALUES (${experimentId}, ${variant.value}, ${variant.percent})
        `,
      ),
    ]);

    return NextResponse.json({ status: "updated" });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { error: "Experiment name already exists" },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: "Failed to update experiment" },
      { status: 500 },
    );
  }
}
