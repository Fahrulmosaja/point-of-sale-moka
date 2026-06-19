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

// ---------------------------------------------------------------------------
// Client-side helpers for ingredient-aware effective stock calculation
// ---------------------------------------------------------------------------

interface CartItemForStock {
  quantity: number;
  product: {
    ingredients: Array<{
      rawMaterialId: string;
      quantity: number; // amount of raw material per serving
    }>;
  };
}

/**
 * Build a map of how much of each raw material is "consumed" by the
 * current cart (local reservation — DB not touched yet).
 *
 * consumed[rawMaterialId] = total raw material units reserved by cart
 */
export function computeRawMaterialConsumed(
  cartItems: CartItemForStock[],
): Record<string, number> {
  const consumed: Record<string, number> = {};
  for (const cartItem of cartItems) {
    for (const ing of cartItem.product.ingredients) {
      consumed[ing.rawMaterialId] =
        (consumed[ing.rawMaterialId] ?? 0) + cartItem.quantity * ing.quantity;
    }
  }
  return consumed;
}

/**
 * Compute how many MORE servings of `product` can still be made after
 * accounting for raw material already reserved in the cart.
 *
 * Uses the same formula as the server's calculateProductStock.
 * Falls back to (availableStock) when ingredient.currentStock is absent.
 */
export function computeEffectiveStock(
  product: {
    availableStock: number;
    ingredients: Array<{
      rawMaterialId: string;
      quantity: number;
      currentStock?: number;
    }>;
  },
  consumed: Record<string, number>,
): number {
  // If ingredients don't carry currentStock, we can't do ingredient-aware calc.
  if (
    product.ingredients.length === 0 ||
    product.ingredients[0].currentStock === undefined
  ) {
    return product.availableStock;
  }

  const adjustedIngredients = product.ingredients.map((ing) => ({
    quantity: ing.quantity,
    currentStock: Math.max(
      0,
      (ing.currentStock ?? 0) - (consumed[ing.rawMaterialId] ?? 0),
    ),
    minimumStock: 0, // threshold not needed for availability calc
  }));

  return calculateProductStock(adjustedIngredients);
}
