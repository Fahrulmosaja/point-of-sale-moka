import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { productMenus } from "@/db/schema";
import { isNull } from "drizzle-orm";

// Categories are now derived from productMenus.category strings
export async function GET() {
  try {
    const products = await db
      .select({ category: productMenus.category })
      .from(productMenus)
      .where(isNull(productMenus.deletedAt));

    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category)),
    )
      .sort()
      .map((name) => ({ id: name, name }));

    return NextResponse.json(uniqueCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
