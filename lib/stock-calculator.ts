import { StockStatus } from "@/types/raw-material.types";

interface Ingredient {
  quantity: number; // required per serving
  currentStock: number; // current raw material stock
  minimumStock: number; // low-stock threshold for raw material
}

/**
 * Calculate how many servings of a product can be made.
 * Formula: MIN(floor(currentStock / requiredQty)) across all ingredients.
 * Returns 0 if any ingredient has stock <= 0.
 */
export function calculateProductStock(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 0;

  return ingredients.reduce((min, ing) => {
    if (ing.quantity <= 0) return 0;
    const canMake = Math.floor(ing.currentStock / ing.quantity);
    return Math.min(min, canMake);
  }, Infinity) as number;
}

/**
 * Determine stock status for a product given its available stock
 * and the per-ingredient thresholds.
 *
 * - out_of_stock : availableStock === 0
 * - low_stock    : availableStock <= lowStockThreshold
 * - healthy      : availableStock > lowStockThreshold
 */
export function getStockStatus(
  availableStock: number,
  lowStockThreshold: number,
): StockStatus {
  if (availableStock <= 0) return "out_of_stock";
  if (availableStock <= lowStockThreshold) return "low_stock";
  return "healthy";
}

/**
 * Calculate the low stock threshold for a product menu.
 * Derived as the minimum number of servings that can be made
 * before any ingredient hits its own minimumStock level.
 */
export function calculateLowStockThreshold(ingredients: Ingredient[]): number {
  if (ingredients.length === 0) return 0;
  return ingredients.reduce((min, ing) => {
    if (ing.quantity <= 0) return min;
    const threshold = Math.ceil(ing.minimumStock / ing.quantity);
    return Math.min(min, threshold);
  }, Infinity) as number;
}

/**
 * Get raw material status from its own stock.
 */
export function getRawMaterialStatus(
  currentStock: number,
  minimumStock: number,
): StockStatus {
  if (currentStock <= 0) return "out_of_stock";
  if (currentStock <= minimumStock) return "low_stock";
  return "healthy";
}
