import { NextRequest } from "next/server";
import { RecipeService } from "@/features/inventory/api/recipe-service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return await RecipeService.getRecipeById(id);
});

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await req.json();
  return await RecipeService.updateRecipe(id, body);
});

export const DELETE = withErrorHandler(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return await RecipeService.deleteRecipe(id);
});
