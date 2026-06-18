import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  text,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const unitEnum = pgEnum("unit", ["gr", "ml", "pcs"]);

export const inventoryTxTypeEnum = pgEnum("inventory_tx_type", [
  "IN",
  "OUT",
  "ADJUSTMENT",
  "REFUND",
  "VOID",
]);

export const orderTypeEnum = pgEnum("order_type", [
  "dine_in",
  "take_away",
  "online",
]);

// ─── Raw Materials ─────────────────────────────────────────────────────────────

export const rawMaterials = pgTable("raw_materials", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  unit: unitEnum("unit").notNull(),
  currentStock: numeric("current_stock", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  minimumStock: numeric("minimum_stock", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// ─── Recipes ───────────────────────────────────────────────────────────────────

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Recipe Ingredients ────────────────────────────────────────────────────────

export const recipeIngredients = pgTable("recipe_ingredients", {
  id: varchar("id").primaryKey(),
  recipeId: varchar("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  rawMaterialId: varchar("raw_material_id")
    .notNull()
    .references(() => rawMaterials.id),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
});

// ─── Product Menus ─────────────────────────────────────────────────────────────

export const productMenus = pgTable("product_menus", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  recipeId: varchar("recipe_id")
    .notNull()
    .references(() => recipes.id),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  isFavorite: boolean("is_favorite").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

// ─── Inventory Transactions ────────────────────────────────────────────────────

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey(),
  rawMaterialId: varchar("raw_material_id")
    .notNull()
    .references(() => rawMaterials.id),
  type: inventoryTxTypeEnum("type").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: varchar("reference_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Sales ─────────────────────────────────────────────────────────────────────

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
  type: orderTypeEnum("type").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  cashierName: varchar("cashier_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Sale Items ────────────────────────────────────────────────────────────────

export const saleItems = pgTable("sale_items", {
  id: varchar("id").primaryKey(),
  saleId: varchar("sale_id")
    .notNull()
    .references(() => sales.id, { onDelete: "cascade" }),
  productMenuId: varchar("product_menu_id")
    .notNull()
    .references(() => productMenus.id),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
});

// ─── Relations ─────────────────────────────────────────────────────────────────

export const recipesRelations = relations(recipes, ({ many }) => ({
  ingredients: many(recipeIngredients),
  productMenus: many(productMenus),
}));

export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    rawMaterial: one(rawMaterials, {
      fields: [recipeIngredients.rawMaterialId],
      references: [rawMaterials.id],
    }),
  }),
);

export const rawMaterialsRelations = relations(rawMaterials, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
  inventoryTransactions: many(inventoryTransactions),
}));

export const productMenusRelations = relations(
  productMenus,
  ({ one, many }) => ({
    recipe: one(recipes, {
      fields: [productMenus.recipeId],
      references: [recipes.id],
    }),
    saleItems: many(saleItems),
  }),
);

export const inventoryTransactionsRelations = relations(
  inventoryTransactions,
  ({ one }) => ({
    rawMaterial: one(rawMaterials, {
      fields: [inventoryTransactions.rawMaterialId],
      references: [rawMaterials.id],
    }),
  }),
);

export const salesRelations = relations(sales, ({ many }) => ({
  items: many(saleItems),
}));

export const saleItemsRelations = relations(saleItems, ({ one }) => ({
  sale: one(sales, {
    fields: [saleItems.saleId],
    references: [sales.id],
  }),
  productMenu: one(productMenus, {
    fields: [saleItems.productMenuId],
    references: [productMenus.id],
  }),
}));
