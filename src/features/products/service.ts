import { db } from "@/db/index";
import { productMenus } from "@/db/schema";
import { isNull } from "drizzle-orm";

export const ProductService = {
  async getProducts() {
    const data = await db
      .select({
        id: productMenus.id,
        name: productMenus.name,
        category: productMenus.category,
      })
      .from(productMenus)
      .where(isNull(productMenus.deletedAt));
      
    return data;
  }
};
