import { NextResponse } from "next/server";
import { InventoryService } from "@/features/inventory/service";
import { withErrorHandler } from "@/lib/api-handler";

// Legacy route: now returns raw materials
export const GET = withErrorHandler(async () => {
  const result = await InventoryService.getInventory();
  return NextResponse.json(result);
});
