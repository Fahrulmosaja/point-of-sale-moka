import { db } from "@/db/index";
import { rawMaterials } from "@/db/schema";
import { isNull } from "drizzle-orm";
import { getRawMaterialStatus } from "@/lib/stock-calculator";

export const InventoryService = {
  async getInventory() {
    const items = await db
      .select()
      .from(rawMaterials)
      .where(isNull(rawMaterials.deletedAt));

    const result = items.map((item) => ({
      ...item,
      currentStock: parseFloat(item.currentStock),
      minimumStock: parseFloat(item.minimumStock),
      status: getRawMaterialStatus(
        parseFloat(item.currentStock),
        parseFloat(item.minimumStock),
      ),
    }));

    return result;
  }
};
