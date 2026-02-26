import { NextRequest, NextResponse } from "next/server";
import { getExperimentPerformance } from "@/services/bigquery";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ experimentName: string }> }
) {
  try {
    const { experimentName } = await context.params;

    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Missing tenantId" },
        { status: 400 }
      );
    }

    const performance = await getExperimentPerformance(
      tenantId,
      experimentName
    );

    return NextResponse.json({ performance });
  } catch (error) {
    console.error("Error fetching experiment performance:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}