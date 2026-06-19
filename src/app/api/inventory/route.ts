import { NextResponse } from "next/server";
import { InventoryService } from "@/features/inventory/api/get-inventory";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async () => {
  const result = await InventoryService.getInventory();
  return NextResponse.json(result);
});
