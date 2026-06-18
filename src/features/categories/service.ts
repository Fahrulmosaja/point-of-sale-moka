import { db } from "@/db/index";
import { productMenus } from "@/db/schema";
import { isNull } from "drizzle-orm";

export const CategoryService = {
  async getCategories() {
    const products = await db
      .select({ category: productMenus.category })
      .from(productMenus)
      .where(isNull(productMenus.deletedAt));

    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category)),
    )
      .sort()
      .map((name) => ({ id: name, name }));

    return uniqueCategories;
  }
};
