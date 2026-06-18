import { db } from "@/db/index";
import {
  productMenus,
  recipes,
  recipeIngredients,
  rawMaterials,
} from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import {
  calculateProductStock,
  calculateLowStockThreshold,
  getStockStatus,
} from "@/lib/stock-calculator";

function genId() {
  return `pm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const ProductMenuService = {
  async getProductMenus(activeOnly = false) {
    const query = db
      .select()
      .from(productMenus)
      .where(isNull(productMenus.deletedAt))
      .orderBy(productMenus.name);

    const products = await query;
    const activeProducts = activeOnly
      ? products.filter((p) => p.isActive)
      : products;

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
      .innerJoin(
        rawMaterials,
        eq(recipeIngredients.rawMaterialId, rawMaterials.id),
      );

    const allRecipes = await db.select().from(recipes);

    return activeProducts.map((product) => {
      const recipe = allRecipes.find((r) => r.id === product.recipeId);
      const ingredients = allIngredients.filter(
        (i) => i.recipeId === product.recipeId,
      );

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
        recipeName: recipe?.name ?? "",
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
  },

  async createProductMenu(body: any) {
    const { name, category, price, recipeId, imageUrl, isActive } = body;

    if (!name || !category || !price || !recipeId) {
      throw new Error("Missing required fields");
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

    return { id };
  },

  async updateProductMenu(id: string, body: any) {
    const { name, category, price, recipeId, imageUrl, isActive, isFavorite } = body;

    await db.update(productMenus).set({
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price: String(price) }),
      ...(recipeId !== undefined && { recipeId }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
      ...(isFavorite !== undefined && { isFavorite }),
      updatedAt: new Date(),
    }).where(eq(productMenus.id, id));

    return { success: true };
  },

  async deleteProductMenu(id: string) {
    await db.update(productMenus).set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(productMenus.id, id));

    return { success: true };
  }
};
