# Moka POS Clone

A modern Point of Sale (POS) application inspired by Moka POS, built with Next.js, TypeScript, Drizzle ORM, and Neon PostgreSQL.

## Overview

This project simulates a real-world coffee shop POS system with integrated inventory management.

The application is designed around a recipe-driven inventory architecture where:

```text
Raw Material
    ↓
Recipe
    ↓
Product Menu
    ↓
Point Of Sale
    ↓
Sales Transaction
    ↓
Inventory Deduction
```

Every sale automatically deducts inventory based on the recipe assigned to each product.

---

## Features

### Point Of Sale

- Product catalog
- Category filtering
- Search products
- Favorite products
- Cart management
- Dine In / Take Away orders
- Checkout flow
- Automatic inventory deduction
- Low stock warning
- Out of stock prevention

### Inventory Management

#### Raw Materials

Manage ingredients and stock levels.

Examples:

- Coffee Beans
- Fresh Milk
- Oat Milk
- Matcha Powder
- Chocolate Powder
- Caramel Syrup

Supported units:

- gr
- ml
- pcs

#### Recipes

Define ingredients required for each menu item.

Example:

```text
Caffe Latte
├── Coffee Beans (18gr)
└── Fresh Milk (150ml)
```

#### Product Menus

Sellable products displayed in POS.

Example:

- Caffe Latte
- Cappuccino
- Matcha Latte
- Americano
- Chocolate

### Sales

- Transaction history
- Order tracking
- Payment recording
- Sales details

### Inventory Transactions

Track all inventory movements.

Supported transaction types:

```text
IN
OUT
ADJUSTMENT
REFUND
VOID
```

---

## Tech Stack

### Frontend

- Next.js 16
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- TanStack Query

### Backend

- Next.js Route Handlers
- Drizzle ORM
- PostgreSQL

### Database

- Neon PostgreSQL

### Deployment

- Vercel

---

## Database Architecture

### Core Flow

```text
raw_materials
      │
      ▼
recipe_ingredients
      ▲
      │
recipes
      │
      ▼
product_menus
      │
      ▼
sale_items
      │
      ▼
sales
```

### Inventory Flow

```text
raw_materials
      │
      ▼
inventory_transactions
```

---

## Project Structure

```text
src/
│
├── app/
│   ├── (dashboard)/
│   ├── api/
│   ├── favicon.ico
│   ├── global.caa
│   ├── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── inventory/
│   ├── pos/
│   ├── activity/
│   ├── online-orders/
│   └── settings/
│
├── db/
│   ├── schema
│   ├── seed
│   ├── migrations
│   └── index.ts
│
├── hooks/
│
├── lib/
│   ├── api-handler.ts
│   ├── api.ts
│   ├── date-utils.ts
│   ├── stock-calculator.ts
│   └── utils.ts
│
├── stores/
│
└── types/
```

---

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_neon_database_url
```

---

## Local Development

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm run dev
```

---

## Database Migration

Generate migration:

```bash
npx drizzle-kit generate
```

Push schema:

```bash
npx drizzle-kit push
```

Open Drizzle Studio:

```bash
npx drizzle-kit studio
```

---

## Inventory Logic

### Product Availability

Product stock is calculated dynamically from raw materials.

Example:

```text
Recipe:

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
5000 / 18 = 277

2000 / 150 = 13
```

Result:

```text
Available Stock = 13
```

The lowest available ingredient determines the product availability.

---

## Future Roadmap

- Supplier Management
- Purchase Orders
- Stock Opname
- Waste Tracking
- Multi Outlet Support
- Analytics Dashboard
- Customer Management
- Loyalty Program

---

## License

This project is built for educational and portfolio purposes.
