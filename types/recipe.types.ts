import { Unit } from './raw-material.types';

export interface RecipeIngredient {
  id: string;
  recipeId: string;
  rawMaterialId: string;
  rawMaterialName: string;
  unit: Unit;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  ingredients: RecipeIngredient[];
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: {
    rawMaterialId: string;
    quantity: number;
  }[];
}

export interface UpdateRecipeInput extends Partial<Omit<CreateRecipeInput, 'ingredients'>> {
  ingredients?: {
    rawMaterialId: string;
    quantity: number;
  }[];
}
