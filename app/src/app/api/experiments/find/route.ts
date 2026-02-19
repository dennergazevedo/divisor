import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const edgeSecret = req.headers.get("x-edge-secret");

    console.log("edgeSecret", edgeSecret);

    if (!edgeSecret || edgeSecret !== process.env.EDGE_INTERNAL_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const tenantId = searchParams.get("tenantId");
    const name = searchParams.get("name");

    if (!tenantId || !name) {
      return NextResponse.json(
        { error: "tenantId and name are required" },
        { status: 400 },
      );
    }

    const experimentsResult = await sql`
      SELECT
        id,
        name,
        is_active,
        ends_at,
        created_at
      FROM experiments
      WHERE tenant_id = ${tenantId}
        AND name = ${name}
      LIMIT 1
    `;

    if (experimentsResult.length === 0) {
      return NextResponse.json(
        { error: "Experiment not found" },
        { status: 404 },
      );
    }

    const experiment = experimentsResult[0] as ExperimentRow;

    if (!experiment.is_active) {
      return NextResponse.json(
        { error: "Experiment inactive" },
        { status: 404 },
      );
    }

    if (experiment.ends_at && new Date(experiment.ends_at) < new Date()) {
      return NextResponse.json(
        { error: "Experiment expired" },
        { status: 404 },
      );
    }

    const variantsResult = await sql`
      SELECT
        experiment_id,
        value,
        percent
      FROM experiment_variants
      WHERE experiment_id = ${experiment.id}
      ORDER BY value ASC
    `;

    const variants = variantsResult as VariantRow[];

    return NextResponse.json({
      id: experiment.id,
      name: experiment.name,
      isActive: experiment.is_active,
      endsAt: experiment.ends_at,
      variants: variants.map((v) => ({
        value: v.value,
        percent: v.percent,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch experiment" },
      { status: 500 },
    );
  }
}
