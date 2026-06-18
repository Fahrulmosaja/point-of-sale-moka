// Keep for backwards-compat with cart store — maps to ProductMenu at runtime
import { StockStatus } from "./raw-material.types";
import { RecipeIngredient } from "./recipe.types";

export interface Category {
  id: string;
  name: string;
}

/** POS-facing product (maps from ProductMenu, computed stock included) */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  recipeId: string;
  imageUrl?: string | null;
  isActive: boolean;
  isFavorite: boolean;
  availableStock: number;
  stockStatus: StockStatus;
  ingredients: RecipeIngredient[];
}
