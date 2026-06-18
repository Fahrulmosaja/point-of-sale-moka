import { NextRequest } from "next/server";
import { RecipeService } from "@/features/inventory/api/recipe-service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async () => {
  return await RecipeService.getRecipes();
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  return await RecipeService.createRecipe(body);
});
