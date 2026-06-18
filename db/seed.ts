import 'dotenv/config';
import { db } from './index';
import {
  rawMaterials,
  recipes,
  recipeIngredients,
  productMenus,
  inventoryTransactions,
} from './schema';

const now = new Date();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Raw Materials ──────────────────────────────────────────────────────────
  console.log('  → raw_materials');
  const rawMaterialData = [
    { id: 'rm-001', name: 'Coffee Beans - House Blend', category: 'Beans', unit: 'gr' as const, currentStock: '5000', minimumStock: '500' },
    { id: 'rm-002', name: 'Fresh Milk', category: 'Dairy', unit: 'ml' as const, currentStock: '8000', minimumStock: '1000' },
    { id: 'rm-003', name: 'Matcha Powder', category: 'Powder', unit: 'gr' as const, currentStock: '1000', minimumStock: '100' },
    { id: 'rm-004', name: 'Caramel Syrup', category: 'Syrup', unit: 'ml' as const, currentStock: '2000', minimumStock: '200' },
    { id: 'rm-005', name: 'Vanilla Syrup', category: 'Syrup', unit: 'ml' as const, currentStock: '1500', minimumStock: '200' },
    { id: 'rm-006', name: 'Ice Cubes', category: 'Other', unit: 'gr' as const, currentStock: '10000', minimumStock: '1000' },
    { id: 'rm-007', name: 'Croissant', category: 'Pastry', unit: 'pcs' as const, currentStock: '30', minimumStock: '5' },
    { id: 'rm-008', name: 'Chocolate Powder', category: 'Powder', unit: 'gr' as const, currentStock: '800', minimumStock: '100' },
  ];
  for (const item of rawMaterialData) {
    await db.insert(rawMaterials).values({
      ...item,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // ─── Initial Stock IN Transactions ─────────────────────────────────────────
  console.log('  → inventory_transactions (initial IN)');
  for (const item of rawMaterialData) {
    await db.insert(inventoryTransactions).values({
      id: `itx-init-${item.id}`,
      rawMaterialId: item.id,
      type: 'IN',
      quantity: item.currentStock,
      referenceType: 'INITIAL_STOCK',
      referenceId: null,
      notes: 'Initial stock seeded',
      createdAt: now,
    }).onConflictDoNothing();
  }

  // ─── Recipes ────────────────────────────────────────────────────────────────
  console.log('  → recipes');
  const recipeData = [
    { id: 'rec-001', name: 'Caffe Latte Recipe', description: 'Classic espresso with steamed milk' },
    { id: 'rec-002', name: 'Cappuccino Recipe', description: 'Equal parts espresso, steamed milk, and foam' },
    { id: 'rec-003', name: 'Matcha Latte Recipe', description: 'Ceremonial matcha with steamed milk' },
    { id: 'rec-004', name: 'Caramel Macchiato Recipe', description: 'Vanilla latte with caramel drizzle' },
    { id: 'rec-005', name: 'Croissant Plain Recipe', description: 'Plain butter croissant' },
  ];
  for (const recipe of recipeData) {
    await db.insert(recipes).values({
      ...recipe,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  // ─── Recipe Ingredients ─────────────────────────────────────────────────────
  console.log('  → recipe_ingredients');
  const ingredientData = [
    // Caffe Latte: 18gr beans + 150ml milk
    { id: 'ri-001', recipeId: 'rec-001', rawMaterialId: 'rm-001', quantity: '18' },
    { id: 'ri-002', recipeId: 'rec-001', rawMaterialId: 'rm-002', quantity: '150' },
    // Cappuccino: 18gr beans + 100ml milk
    { id: 'ri-003', recipeId: 'rec-002', rawMaterialId: 'rm-001', quantity: '18' },
    { id: 'ri-004', recipeId: 'rec-002', rawMaterialId: 'rm-002', quantity: '100' },
    // Matcha Latte: 10gr matcha + 200ml milk
    { id: 'ri-005', recipeId: 'rec-003', rawMaterialId: 'rm-003', quantity: '10' },
    { id: 'ri-006', recipeId: 'rec-003', rawMaterialId: 'rm-002', quantity: '200' },
    // Caramel Macchiato: 18gr beans + 150ml milk + 30ml caramel + 15ml vanilla
    { id: 'ri-007', recipeId: 'rec-004', rawMaterialId: 'rm-001', quantity: '18' },
    { id: 'ri-008', recipeId: 'rec-004', rawMaterialId: 'rm-002', quantity: '150' },
    { id: 'ri-009', recipeId: 'rec-004', rawMaterialId: 'rm-004', quantity: '30' },
    { id: 'ri-010', recipeId: 'rec-004', rawMaterialId: 'rm-005', quantity: '15' },
    // Croissant: 1 pcs
    { id: 'ri-011', recipeId: 'rec-005', rawMaterialId: 'rm-007', quantity: '1' },
  ];
  for (const ing of ingredientData) {
    await db.insert(recipeIngredients).values(ing).onConflictDoNothing();
  }

  // ─── Product Menus ──────────────────────────────────────────────────────────
  console.log('  → product_menus');
  const productMenuData = [
    { id: 'pm-001', name: 'Caffe Latte', category: 'Espresso Based', price: '32000', recipeId: 'rec-001', imageUrl: null, isActive: true, isFavorite: true },
    { id: 'pm-002', name: 'Cappuccino', category: 'Espresso Based', price: '30000', recipeId: 'rec-002', imageUrl: null, isActive: true, isFavorite: false },
    { id: 'pm-003', name: 'Matcha Latte', category: 'Non-Coffee', price: '35000', recipeId: 'rec-003', imageUrl: null, isActive: true, isFavorite: true },
    { id: 'pm-004', name: 'Caramel Macchiato', category: 'Espresso Based', price: '38000', recipeId: 'rec-004', imageUrl: null, isActive: true, isFavorite: false },
    { id: 'pm-005', name: 'Croissant', category: 'Food', price: '25000', recipeId: 'rec-005', imageUrl: null, isActive: true, isFavorite: false },
  ];
  for (const product of productMenuData) {
    await db.insert(productMenus).values({
      ...product,
      createdAt: now,
      updatedAt: now,
    }).onConflictDoNothing();
  }

  console.log('✅ Seeding complete!');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
