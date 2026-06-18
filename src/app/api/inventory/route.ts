import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { rawMaterials } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { getRawMaterialStatus } from "@/lib/stock-calculator";

// Legacy route: now returns raw materials
export async function GET() {
  try {
    const items = await db
      .select()
      .from(rawMaterials)
      .where(isNull(rawMaterials.deletedAt));

    const result = items.map((item) => ({
      ...item,
      currentStock: parseFloat(item.currentStock),
      minimumStock: parseFloat(item.minimumStock),
      status: getRawMaterialStatus(
        parseFloat(item.currentStock),
        parseFloat(item.minimumStock),
      ),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 },
    );
  }
}
