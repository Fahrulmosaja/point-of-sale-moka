import { NextResponse } from "next/server";
import { SalesService } from "@/features/activity/api/sales-service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async () => {
  const result = await SalesService.getSales();
  return NextResponse.json(result);
});
