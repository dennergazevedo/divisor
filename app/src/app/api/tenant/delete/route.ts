import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { sql } from "@/lib/db";

export async function DELETE(req: Request) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const { tenantId } = await req.json();

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 },
      );
    }

    // Check if user is the owner of the tenant
    const membership = await sql`
      SELECT role FROM tenant_members
      WHERE tenant_id = ${tenantId} AND user_id = ${payload.userId}
    `;

    if (!membership.length || membership[0].role !== "owner") {
      return NextResponse.json(
        { error: "Only the owner can delete the tenant" },
        { status: 403 },
      );
    }

    // Use a transaction to delete members and then the tenant
    await sql.transaction((tx) => [
      tx`DELETE FROM tenant_members WHERE tenant_id = ${tenantId}`,
      tx`DELETE FROM tenants WHERE id = ${tenantId}`,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 },
    );
  }
}
