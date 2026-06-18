import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { rawMaterials, recipeIngredients, productMenus } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { getRawMaterialStatus } from "@/lib/stock-calculator";

function nanoidId() {
  return `rm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function GET() {
  try {
    const materials = await db
      .select()
      .from(rawMaterials)
      .where(isNull(rawMaterials.deletedAt))
      .orderBy(rawMaterials.name);

    // Enrich: compute status + usedBy
    const allIngredients = await db
      .select({
        rawMaterialId: recipeIngredients.rawMaterialId,
        recipeId: recipeIngredients.recipeId,
      })
      .from(recipeIngredients);

    const allProducts = await db
      .select({
        id: productMenus.id,
        name: productMenus.name,
        recipeId: productMenus.recipeId,
      })
      .from(productMenus)
      .where(isNull(productMenus.deletedAt));

    const result = materials.map((m) => {
      const currentStock = parseFloat(m.currentStock);
      const minimumStock = parseFloat(m.minimumStock);
      const status = getRawMaterialStatus(currentStock, minimumStock);

      // Find all recipes using this material, then find product menus using those recipes
      const recipeIds = allIngredients
        .filter((i) => i.rawMaterialId === m.id)
        .map((i) => i.recipeId);
      const usedBy = allProducts
        .filter((p) => recipeIds.includes(p.recipeId))
        .map((p) => p.name);

      return {
        ...m,
        currentStock,
        minimumStock,
        status,
        usedBy,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/raw-materials]", err);
    return NextResponse.json(
      { error: "Failed to fetch raw materials" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, unit, currentStock, minimumStock } = body;

    if (
      !name ||
      !category ||
      !unit ||
      currentStock === undefined ||
      minimumStock === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const id = nanoidId();
    const now = new Date();

    await db.insert(rawMaterials).values({
      id,
      name,
      category,
      unit,
      currentStock: String(currentStock),
      minimumStock: String(minimumStock),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/raw-materials]", err);
    return NextResponse.json(
      { error: "Failed to create raw material" },
      { status: 500 },
    );
  }
}
