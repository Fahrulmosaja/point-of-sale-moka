import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/index';
import { productMenus, recipes, recipeIngredients, rawMaterials } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';
import {
  calculateProductStock,
  calculateLowStockThreshold,
  getStockStatus,
} from '@/lib/stock-calculator';

function genId() {
  return `pm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function buildProductMenuResponse(activeOnly = false) {
  const query = db
    .select()
    .from(productMenus)
    .where(isNull(productMenus.deletedAt))
    .orderBy(productMenus.name);

  const products = await query;
  const activeProducts = activeOnly ? products.filter((p) => p.isActive) : products;

  // Fetch all ingredients with raw material stock in one query
  const allIngredients = await db
    .select({
      id: recipeIngredients.id,
      recipeId: recipeIngredients.recipeId,
      rawMaterialId: recipeIngredients.rawMaterialId,
      rawMaterialName: rawMaterials.name,
      unit: rawMaterials.unit,
      quantity: recipeIngredients.quantity,
      currentStock: rawMaterials.currentStock,
      minimumStock: rawMaterials.minimumStock,
    })
    .from(recipeIngredients)
    .innerJoin(rawMaterials, eq(recipeIngredients.rawMaterialId, rawMaterials.id));

  const allRecipes = await db.select().from(recipes);

  return activeProducts.map((product) => {
    const recipe = allRecipes.find((r) => r.id === product.recipeId);
    const ingredients = allIngredients.filter((i) => i.recipeId === product.recipeId);

    const ingredientsForCalc = ingredients.map((i) => ({
      quantity: parseFloat(i.quantity),
      currentStock: parseFloat(i.currentStock),
      minimumStock: parseFloat(i.minimumStock),
    }));

    const availableStock = calculateProductStock(ingredientsForCalc);
    const lowStockThreshold = calculateLowStockThreshold(ingredientsForCalc);
    const stockStatus = getStockStatus(availableStock, lowStockThreshold);

    return {
      ...product,
      price: parseFloat(product.price),
      recipeName: recipe?.name ?? '',
      availableStock,
      stockStatus,
      ingredients: ingredients.map((i) => ({
        id: i.id,
        recipeId: i.recipeId,
        rawMaterialId: i.rawMaterialId,
        rawMaterialName: i.rawMaterialName,
        unit: i.unit,
        quantity: parseFloat(i.quantity),
      })),
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';
    const result = await buildProductMenuResponse(activeOnly);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/product-menus]', err);
    return NextResponse.json({ error: 'Failed to fetch product menus' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, recipeId, imageUrl, isActive } = body;

    if (!name || !category || !price || !recipeId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = genId();
    const now = new Date();

    await db.insert(productMenus).values({
      id,
      name,
      category,
      price: String(price),
      recipeId,
      imageUrl: imageUrl || null,
      isActive: isActive ?? true,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/product-menus]', err);
    return NextResponse.json({ error: 'Failed to create product menu' }, { status: 500 });
  }
}
