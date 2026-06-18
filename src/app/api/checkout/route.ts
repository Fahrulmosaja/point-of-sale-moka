import { NextRequest } from "next/server";
import { CheckoutInput } from "@/types/sale.types";
import { CheckoutService } from "@/features/pos/api/checkout-service";
import { withErrorHandler } from "@/lib/api-handler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body: CheckoutInput = await req.json();
  return await CheckoutService.processCheckout(body);
});
