import { NextResponse } from "next/server";
import { CategoryService } from "@/features/pos/api/get-categories";
import { withErrorHandler } from "@/lib/api-handler";

// Categories are now derived from productMenus.category strings
export const GET = withErrorHandler(async () => {
  const uniqueCategories = await CategoryService.getCategories();
  return NextResponse.json(uniqueCategories);
});
