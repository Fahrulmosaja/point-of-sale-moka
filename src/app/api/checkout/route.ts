import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/index";
import {
  sales,
  saleItems,
  inventoryTransactions,
  rawMaterials,
  productMenus,
  recipeIngredients,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { CheckoutInput } from "@/types/sale.types";

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

let invoiceCounter = 100;
function nextInvoice() {
  invoiceCounter += 1;
  return `INV-${String(invoiceCounter).padStart(4, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutInput = await req.json();
    const { orderType, paymentMethod, cashierName, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    const now = new Date();
    const saleId = genId("sale");
    const invoiceNumber = nextInvoice();

    // ── Step 1: Create Sale ──────────────────────────────────────────────────
    await db.insert(sales).values({
      id: saleId,
      invoiceNumber,
      date: now,
      type: orderType,
      status: "completed",
      subtotal: String(subtotal),
      tax: String(tax),
      total: String(total),
      paymentMethod,
      cashierName,
      createdAt: now,
    });

    // ── Step 2: Create Sale Items ────────────────────────────────────────────
    for (const item of items) {
      await db.insert(saleItems).values({
        id: genId("si"),
        saleId,
        productMenuId: item.productMenuId,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
        notes: item.notes || null,
      });
    }

    // ── Step 3 & 4: Create Inventory Transactions + Deduct Raw Material Stock ──
    for (const item of items) {
      // Get recipe ingredients for this product
      const [product] = await db
        .select({ recipeId: productMenus.recipeId })
        .from(productMenus)
        .where(eq(productMenus.id, item.productMenuId));

      if (!product) continue;

      const ingredients = await db
        .select({
          rawMaterialId: recipeIngredients.rawMaterialId,
          quantity: recipeIngredients.quantity,
        })
        .from(recipeIngredients)
        .where(eq(recipeIngredients.recipeId, product.recipeId));

      for (const ing of ingredients) {
        const deductQty = parseFloat(ing.quantity) * item.quantity;

        // Create OUT transaction
        await db.insert(inventoryTransactions).values({
          id: genId("itx"),
          rawMaterialId: ing.rawMaterialId,
          type: "OUT",
          quantity: String(deductQty),
          referenceType: "SALE",
          referenceId: saleId,
          notes: `Sale ${invoiceNumber}`,
          createdAt: now,
        });

        // Deduct from raw material stock (floor at 0)
        await db
          .update(rawMaterials)
          .set({
            currentStock: sql`GREATEST(0, ${rawMaterials.currentStock} - ${String(deductQty)})`,
            updatedAt: now,
          })
          .where(eq(rawMaterials.id, ing.rawMaterialId));
      }
    }

    return NextResponse.json({
      success: true,
      saleId,
      invoiceNumber,
      total,
    });
  } catch (err) {
    console.error("[POST /api/checkout]", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
