import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { sales, saleItems, productMenus } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Legacy /api/orders route — now reads from sales table
export async function GET() {
  try {
    const allSales = await db.select().from(sales).orderBy(desc(sales.date));

    const allItems = await db
      .select({
        id: saleItems.id,
        saleId: saleItems.saleId,
        productMenuId: saleItems.productMenuId,
        productMenuName: productMenus.name,
        quantity: saleItems.quantity,
        unitPrice: saleItems.unitPrice,
        notes: saleItems.notes,
      })
      .from(saleItems)
      .innerJoin(productMenus, eq(saleItems.productMenuId, productMenus.id));

    const result = allSales.map((sale) => ({
      ...sale,
      subtotal: parseFloat(sale.subtotal),
      tax: parseFloat(sale.tax),
      total: parseFloat(sale.total),
      items: allItems
        .filter((i) => i.saleId === sale.id)
        .map((i) => ({
          ...i,
          quantity: parseFloat(i.quantity),
          unitPrice: parseFloat(i.unitPrice),
        })),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
