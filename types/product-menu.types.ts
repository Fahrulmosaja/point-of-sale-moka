import { StockStatus } from './raw-material.types';
import { RecipeIngredient } from './recipe.types';

export interface ProductMenu {
  id: string;
  name: string;
  category: string;
  price: number;
  recipeId: string;
  recipeName: string;
  imageUrl?: string | null;
  isActive: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Computed dynamically from ingredients
  availableStock: number;
  stockStatus: StockStatus;
  ingredients: RecipeIngredient[];
}

export interface CreateProductMenuInput {
  name: string;
  category: string;
  price: number;
  recipeId: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateProductMenuInput extends Partial<CreateProductMenuInput> {
  isFavorite?: boolean;
}
