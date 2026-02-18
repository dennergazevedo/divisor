import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

type JwtPayload = {
  userId: string;
  email: string;
};

type ExperimentRow = {
  id: string;
  name: string;
  is_active: boolean;
  ends_at: string | null;
  created_at: string;
};

type VariantRow = {
  experiment_id: string;
  value: string;
  percent: number;
};

export const runtime = "nodejs";

export async function GET(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const { searchParams } = new URL(req.url);

    const tenantId = searchParams.get("tenantId");
    const activeParam = searchParams.get("active");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 },
      );
    }

    let isActiveFilter: boolean | null = null;

    if (activeParam !== null) {
      if (activeParam !== "true" && activeParam !== "false") {
        return NextResponse.json(
          { error: "active must be true or false" },
          { status: 400 },
        );
      }

      isActiveFilter = activeParam === "true";
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

    const experimentsResult =
      isActiveFilter === null
        ? await sql`
      SELECT
        id,
        name,
        is_active,
        ends_at,
        created_at
      FROM experiments
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `
        : await sql`
      SELECT
        id,
        name,
        is_active,
        ends_at,
        created_at
      FROM experiments
      WHERE tenant_id = ${tenantId}
        AND is_active = ${isActiveFilter}
      ORDER BY created_at DESC
    `;

    const experiments = experimentsResult as ExperimentRow[];

    if (experiments.length === 0) {
      return NextResponse.json({ experiments: [] });
    }

    const experimentIds = experiments.map((e) => e.id);

    const variantsResult = await sql`
  SELECT
    experiment_id,
    value,
    percent
  FROM experiment_variants
  WHERE experiment_id = ANY(${experimentIds})
  ORDER BY value ASC
`;

    const variants = variantsResult as VariantRow[];

    const variantsByExperiment = new Map<string, VariantRow[]>();

    for (const variant of variants) {
      const list = variantsByExperiment.get(variant.experiment_id) ?? [];
      list.push(variant);
      variantsByExperiment.set(variant.experiment_id, list);
    }

    const result = experiments.map((experiment) => ({
      ...experiment,
      variants: variantsByExperiment.get(experiment.id) ?? [],
    }));

    return NextResponse.json({ experiments: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to list experiments" },
      { status: 500 },
    );
  }
}
