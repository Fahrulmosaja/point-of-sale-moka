import { NextRequest } from "next/server";
import { ProductMenuService } from "@/features/product-menus/service";
import { withErrorHandler } from "@/lib/api-handler";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";
  return await ProductMenuService.getProductMenus(activeOnly);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  return await ProductMenuService.createProductMenu(body);
});
