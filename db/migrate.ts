import 'dotenv/config';
import { db } from './index';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('🔧 Running migration...');

  // Drop old tables (cascade clears FKs automatically)
  await db.execute(sql`DROP TABLE IF EXISTS order_items CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS orders CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS inventory CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS products CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS categories CASCADE`);

  // Drop old enums if they exist
  await db.execute(sql`DROP TYPE IF EXISTS unit CASCADE`);
  await db.execute(sql`DROP TYPE IF EXISTS inventory_tx_type CASCADE`);
  await db.execute(sql`DROP TYPE IF EXISTS order_type CASCADE`);

  // Create enums
  await db.execute(sql`CREATE TYPE unit AS ENUM ('gr', 'ml', 'pcs')`);
  await db.execute(sql`CREATE TYPE inventory_tx_type AS ENUM ('IN', 'OUT', 'ADJUSTMENT', 'REFUND', 'VOID')`);
  await db.execute(sql`CREATE TYPE order_type AS ENUM ('dine_in', 'take_away', 'online')`);

  // raw_materials
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS raw_materials (
      id VARCHAR PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      unit unit NOT NULL,
      current_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
      minimum_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  // recipes
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS recipes (
      id VARCHAR PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // recipe_ingredients
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS recipe_ingredients (
      id VARCHAR PRIMARY KEY,
      recipe_id VARCHAR NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      raw_material_id VARCHAR NOT NULL REFERENCES raw_materials(id),
      quantity NUMERIC(12,2) NOT NULL
    )
  `);

  // product_menus
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS product_menus (
      id VARCHAR PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      price NUMERIC(12,2) NOT NULL,
      recipe_id VARCHAR NOT NULL REFERENCES recipes(id),
      image_url TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      is_favorite BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      deleted_at TIMESTAMP
    )
  `);

  // inventory_transactions
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS inventory_transactions (
      id VARCHAR PRIMARY KEY,
      raw_material_id VARCHAR NOT NULL REFERENCES raw_materials(id),
      type inventory_tx_type NOT NULL,
      quantity NUMERIC(12,2) NOT NULL,
      reference_type VARCHAR(50),
      reference_id VARCHAR(255),
      notes TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // sales
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sales (
      id VARCHAR PRIMARY KEY,
      invoice_number VARCHAR(50) NOT NULL,
      date TIMESTAMP NOT NULL DEFAULT NOW(),
      type order_type NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'completed',
      subtotal NUMERIC(12,2) NOT NULL,
      tax NUMERIC(12,2) NOT NULL,
      total NUMERIC(12,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      cashier_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);

  // sale_items
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS sale_items (
      id VARCHAR PRIMARY KEY,
      sale_id VARCHAR NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
      product_menu_id VARCHAR NOT NULL REFERENCES product_menus(id),
      quantity NUMERIC(12,2) NOT NULL,
      unit_price NUMERIC(12,2) NOT NULL,
      notes TEXT
    )
  `);

  console.log('✅ Migration complete!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
