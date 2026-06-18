import { db } from "@/db/index";
import { recipes, recipeIngredients, rawMaterials } from "@/db/schema";
import { eq } from "drizzle-orm";

function genId() {
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function genIngId() {
  return `ri-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const RecipeService = {
  async getRecipes() {
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

    return result;
  },

  async createRecipe(body: any) {
    const { name, description, ingredients } = body;

    if (!name || !ingredients || ingredients.length === 0) {
      throw new Error("Name and at least one ingredient are required");
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

    return { id };
  },

  async getRecipeById(id: string) {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    if (!recipe) throw new Error("Not found");

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
      .innerJoin(
        rawMaterials,
        eq(recipeIngredients.rawMaterialId, rawMaterials.id),
      )
      .where(eq(recipeIngredients.recipeId, id));

    return {
      ...recipe,
      ingredients: ingredients.map((i) => ({
        ...i,
        quantity: parseFloat(i.quantity),
      })),
    };
  },

  async updateRecipe(id: string, body: any) {
    const { name, description, ingredients } = body;

    await db
      .update(recipes)
      .set({
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        updatedAt: new Date(),
      })
      .where(eq(recipes.id, id));

    // Replace all ingredients if provided
    if (ingredients && Array.isArray(ingredients)) {
      await db
        .delete(recipeIngredients)
        .where(eq(recipeIngredients.recipeId, id));
      for (const ing of ingredients) {
        await db.insert(recipeIngredients).values({
          id: genIngId(),
          recipeId: id,
          rawMaterialId: ing.rawMaterialId,
          quantity: String(ing.quantity),
        });
      }
    }

    return { success: true };
  },

  async deleteRecipe(id: string) {
    // Cascade deletes recipeIngredients automatically
    await db.delete(recipes).where(eq(recipes.id, id));
    return { success: true };
  }
};
