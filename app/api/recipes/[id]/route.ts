import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { recipes, recipeIngredients, rawMaterials } from '@/db/schema';
import { eq } from 'drizzle-orm';

function genIngId() {
  return `ri-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    if (!recipe) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const ingredients = await db
      .select({
        id: recipeIngredients.id,
        recipeId: recipeIngredients.recipeId,
        rawMaterialId: recipeIngredients.rawMaterialId,
        rawMaterialName: rawMaterials.name,
        unit: rawMaterials.unit,
        quantity: recipeIngredients.quantity,
      })
      .from(recipeIngredients)
      .innerJoin(rawMaterials, eq(recipeIngredients.rawMaterialId, rawMaterials.id))
      .where(eq(recipeIngredients.recipeId, id));

    return NextResponse.json({
      ...recipe,
      ingredients: ingredients.map((i) => ({ ...i, quantity: parseFloat(i.quantity) })),
    });
  } catch (err) {
    console.error('[GET /api/recipes/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, description, ingredients } = body;

    await db.update(recipes).set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
    }).where(eq(recipes.id, id));

    // Replace all ingredients if provided
    if (ingredients && Array.isArray(ingredients)) {
      await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
      for (const ing of ingredients) {
        await db.insert(recipeIngredients).values({
          id: genIngId(),
          recipeId: id,
          rawMaterialId: ing.rawMaterialId,
          quantity: String(ing.quantity),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PUT /api/recipes/[id]]', err);
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Cascade deletes recipeIngredients automatically
    await db.delete(recipes).where(eq(recipes.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/recipes/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  }
}
