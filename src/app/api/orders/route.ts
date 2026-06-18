import { NextResponse } from "next/server";
import { OrderService } from "@/features/pos/api/order-service";
import { withErrorHandler } from "@/lib/api-handler";

// Legacy /api/orders route — now reads from sales table
export const GET = withErrorHandler(async () => {
  const result = await OrderService.getOrders();
  return NextResponse.json(result);
});
