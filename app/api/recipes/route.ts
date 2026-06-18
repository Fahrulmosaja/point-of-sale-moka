import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import { recipes, recipeIngredients, rawMaterials } from "@/db/schema";
import { eq } from "drizzle-orm";

function genId() {
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function genIngId() {
  return `ri-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes).orderBy(recipes.name);

    // Join ingredients + raw material name
    const allIngredients = await db
      .select({
        id: recipeIngredients.id,
        recipeId: recipeIngredients.recipeId,
        rawMaterialId: recipeIngredients.rawMaterialId,
        rawMaterialName: rawMaterials.name,
        unit: rawMaterials.unit,
        quantity: recipeIngredients.quantity,
      })
      .from(recipeIngredients)
      .innerJoin(
        rawMaterials,
        eq(recipeIngredients.rawMaterialId, rawMaterials.id),
      );

    const result = allRecipes.map((recipe) => ({
      ...recipe,
      ingredients: allIngredients
        .filter((i) => i.recipeId === recipe.id)
        .map((i) => ({
          ...i,
          quantity: parseFloat(i.quantity),
        })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/recipes]", err);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, ingredients } = body;

    if (!name || !ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Name and at least one ingredient are required" },
        { status: 400 },
      );
    }

    const id = genId();
    const now = new Date();

    await db
      .insert(recipes)
      .values({
        id,
        name,
        description: description || null,
        createdAt: now,
        updatedAt: now,
      });

    for (const ing of ingredients) {
      await db.insert(recipeIngredients).values({
        id: genIngId(),
        recipeId: id,
        rawMaterialId: ing.rawMaterialId,
        quantity: String(ing.quantity),
      });
    }

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/recipes]", err);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 },
    );
  }
}
