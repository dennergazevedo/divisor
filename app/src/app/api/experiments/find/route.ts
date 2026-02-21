import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const edgeSecret = req.headers.get("x-edge-secret");

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
        e.id,
        e.name,
        e.is_active,
        e.ends_at,
        e.created_at,
        u.plan_status,
        u.current_plan,
        u.expiration_date,
        u.id as user_id
      FROM experiments e
      JOIN tenant_members tm ON e.tenant_id = tm.tenant_id AND tm.role = 'owner'
      JOIN users u ON tm.user_id = u.id
      WHERE e.tenant_id = ${tenantId}
        AND e.name = ${name}
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
      owner: {
        plan_status: experiment.plan_status,
        current_plan: experiment.current_plan,
        expiration_date: experiment.expiration_date,
        user_id: experiment.user_id,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch experiment" },
      { status: 500 },
    );
  }
}
