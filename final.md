# Inventory Management System v1.0

## Goal

Build a complete recipe-driven inventory system fully integrated with POS.

The system must ensure that:

* Raw Material is the only source of truth for inventory stock.
* Recipes define material consumption.
* Product Menu represents sellable products.
* Product stock is calculated dynamically.
* POS automatically consumes inventory.
* Inventory status is always accurate.
* Product Menu automatically appears in POS after activation.

---

# Architecture

```text
Raw Material
     │
     ▼
Recipe
     │
     ▼
Product Menu
     │
     ▼
Point Of Sale
     │
     ▼
Sale Transaction
     │
     ▼
Inventory Transaction
     │
     ▼
Stock Deduction
```

---

# Core Principles

## Rule 1

Only Raw Material stores inventory quantities.

Never store stock inside Product Menu.

---

## Rule 2

Every Product Menu must have exactly one Recipe.

---

## Rule 3

Every Recipe must contain at least one Raw Material.

---

## Rule 4

Product availability is calculated from Recipe + Raw Material.

---

## Rule 5

Every inventory movement must create an Inventory Transaction record.

---

# Entity Design

## Raw Material

Represents inventory purchased from suppliers.

### Fields

```ts
{
  id: string;
  name: string;
  category: string;
  unit: "gr" | "ml" | "pcs";
  currentStock: Decimal;
  minimumStock: Decimal;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Supported Units

```text
gr
ml
pcs
```

Examples:

```text
Coffee Beans → gr
Fresh Milk → ml
Caramel Syrup → ml
Croissant → pcs
Ice Cube → gr
```

---

## Recipe

Recipe acts as a bridge between Product Menu and Raw Material.

### Fields

```ts
{
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Recipe Ingredient

### Fields

```ts
{
  id: string;
  recipeId: string;
  rawMaterialId: string;
  quantity: Decimal;
}
```

Example:

```text
Caffe Latte

Coffee Beans - House Blend → 18gr
Fresh Milk → 150ml
```

---

## Product Menu

Represents sellable products.

### Fields

```ts
{
  id: string;
  name: string;
  category: string;
  price: Decimal;
  recipeId: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Important

Do NOT store:

```ts
stock
inventory
availableStock
remainingStock
```

inside Product Menu.

Stock must be computed dynamically.

---

## Inventory Transaction

Tracks every inventory movement.

### Fields

```ts
{
  id: string;
  rawMaterialId: string;
  type:
    | "IN"
    | "OUT"
    | "ADJUSTMENT"
    | "REFUND"
    | "VOID";

  quantity: Decimal;

  referenceType?: string;
  referenceId?: string;

  notes?: string;

  createdAt: Date;
}
```

---

# CRUD Workflow

## Step 1

Create Raw Material

Example:

```text
Coffee Beans - House Blend
Fresh Milk
Caramel Syrup
Matcha Powder
Croissant
```

---

## Step 2

Create Recipe

Example:

```text
Recipe:
Caffe Latte
```

Ingredients:

```text
Coffee Beans - House Blend (18gr)
Fresh Milk (150ml)
```

---

## Step 3

Create Product Menu

Example:

```text
Name:
Caffe Latte

Category:
Espresso Based

Price:
30000

Recipe:
Caffe Latte Recipe

Active:
true
```

---

## Step 4

Automatically Sync To POS

When:

```text
isActive = true
```

The menu automatically appears inside POS.

No manual sync required.

---

# Product Stock Calculation

Product stock is derived from Recipe.

Example:

Recipe:

```text
Coffee Beans = 18gr
Fresh Milk = 150ml
```

Inventory:

```text
Coffee Beans = 5000gr
Fresh Milk = 2000ml
```

Calculation:

```text
floor(5000 / 18) = 277

floor(2000 / 150) = 13
```

Result:

```text
Available Stock = 13
```

Formula:

```text
Product Stock
=
MIN(
  currentStock / requiredQuantity
)
```

for all ingredients.

---

# Product Status Logic

## Healthy

```text
availableStock > lowStockThreshold
```

Example:

```text
Available Stock = 50
Threshold = 10
```

Result:

```text
Healthy
```

---

## Low Stock

```text
availableStock <= lowStockThreshold
```

Example:

```text
Available Stock = 5
Threshold = 10
```

Result:

```text
Low Stock
```

---

## Out Of Stock

If any ingredient:

```text
currentStock <= 0
```

Result:

```text
Available Stock = 0
Status = Out Of Stock
```

---

# Product Menu Table

Columns:

```text
Item Name
Available Stock
Status
Recipe
Required Materials
Last Updated
```

Example:

```text
Caffe Latte

Available Stock:
13

Required Materials:
• Coffee Beans - House Blend (18gr)
• Fresh Milk (150ml)
```

Required Materials must always reference Raw Materials.

Never display:

```text
Espresso Shot
```

as inventory.

For MVP:

```text
Coffee Beans
→ Latte

Coffee Beans
→ Americano

Coffee Beans
→ Cappuccino
```

directly.

No semi-finished goods system.

---

# Raw Material Table

Columns:

```text
Item Name
Current Stock
Minimum Stock
Unit
Status
Used By
Last Updated
```

Example:

```text
Fresh Milk

Used By:
• Caffe Latte
• Cappuccino
• Caramel Macchiato
• Vanilla Latte
```

---

# POS Logic

## Product Visibility

Only:

```text
isActive = true
```

products appear in POS.

---

## Healthy Product

Product can be sold normally.

No warning displayed.

---

## Low Stock Product

Product remains sellable.

Display small warning badge:

```text
⚠ Low Stock
```

on product card.

---

When cashier clicks product:

Show toast:

```text
Matcha Latte is running low!

Only 2 servings remaining.

[ Check Inventory ]
```

---

## Out Of Stock Product

Display:

```text
Out Of Stock
```

Product card becomes:

```text
disabled
opacity 50%
cursor-not-allowed
```

User cannot add item to cart.

---

## Favorite Action

Favorite must NOT trigger inventory checks.

Reason:

```text
Favorite
=
UI Preference

Not Inventory Activity
```

Inventory validation only happens during:

```text
Add To Cart
Checkout
```

---

# Checkout Logic

When:

```text
1x Caffe Latte
```

is sold.

Recipe:

```text
Coffee Beans = 18gr
Fresh Milk = 150ml
```

System automatically:

### Step 1

Create Sale

### Step 2

Create Inventory Transactions

```text
Coffee Beans -= 18gr
Fresh Milk -= 150ml
```

### Step 3

Update Raw Material Stock

### Step 4

Recalculate Product Availability

### Step 5

Refresh Product Status

### Step 6

Trigger Low Stock Alerts

---

# Refund Logic

When:

```text
1x Caffe Latte refunded
```

System creates:

```text
REFUND
```

transactions.

Inventory restored:

```text
Coffee Beans += 18gr
Fresh Milk += 150ml
```

---

# Database Constraints

## Quantity

```sql
quantity > 0
```

---

## Current Stock

```sql
current_stock >= 0
```

---

## Minimum Stock

```sql
minimum_stock >= 0
```

---

## Product Menu

Must always have:

```text
recipeId
```

---

## Recipe

Must contain at least one ingredient.

---

# Numeric Precision

All inventory quantities must use:

```sql
numeric(12,2)
```

Never use:

```sql
integer
```

for stock calculations.

---

# Soft Delete

Use:

```ts
deletedAt
```

instead of hard delete.

Required for:

* Sales History
* Inventory History
* Audit Trail

---

# Drizzle ORM Structure

```text
raw_materials

recipes

recipe_ingredients

product_menus

inventory_transactions

sales

sale_items
```

Relationships:

```text
recipes
 1 ─── N recipe_ingredients

raw_materials
 1 ─── N recipe_ingredients

recipes
 1 ─── 1 product_menus

raw_materials
 1 ─── N inventory_transactions

sales
 1 ─── N sale_items
```

---

# Future Extensions

This architecture must support future modules without requiring major refactoring:

* Supplier Management
* Purchase Orders
* Stock Opname
* Waste Tracking
* Production Module
* Analytics
* Multi Outlet Inventory
* Inventory Transfer
* Audit Logs

---

# Expected Outcome

The system becomes a complete inventory ecosystem.

```text
Raw Material
     ↓
Recipe
     ↓
Product Menu
     ↓
POS
     ↓
Sale
     ↓
Inventory Transaction
     ↓
Inventory Deduction
```

Benefits:

* Single source of truth
* Real-time stock calculation
* Accurate inventory deduction
* Clean POS integration
* Scalable Neon + Drizzle architecture
* Future-ready inventory management
* Consistent user experience between Inventory and POS

```
```
