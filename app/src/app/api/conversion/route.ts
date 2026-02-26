import { NextRequest, NextResponse } from "next/server";
import { Logging } from "@google-cloud/logging";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 🔥 ajuste em produção
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tenantId, experimentName, variant, value, itensCount } =
      body;

    // Validate required fields
    if (!userId || !tenantId || !experimentName || !variant) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Initialize Google Cloud Logging
    const logging = new Logging({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(
          /\\n/g,
          "\n",
        ),
      },
    });

    const log = logging.log("conversion-logs");

    const metadata = {
      resource: { type: "global" },
      severity: "INFO",
    };

    const entry = log.entry(metadata, {
      userId,
      tenantId,
      experimentName,
      variant,
      value: value ?? 0,
      itensCount: itensCount ?? 0,
      timestamp: new Date().toISOString(),
    });

    await log.write(entry);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error logging to Google Cloud:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
