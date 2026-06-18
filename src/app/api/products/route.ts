import { NextResponse } from "next/server";
import { ProductService } from "@/features/products/service";
import { withErrorHandler } from "@/lib/api-handler";

// Legacy route: redirect consumers to /api/product-menus
export const GET = withErrorHandler(async () => {
  const data = await ProductService.getProducts();
  return NextResponse.json(data);
});
