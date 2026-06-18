export type InventoryType = 'product' | 'raw_material';
export type StockStatus = 'healthy' | 'low_stock' | 'out_of_stock';

export interface RequiredMaterial {
  materialId: string;
  materialName: string;
  amountPerUnit: number;
  unit: string;
}

export interface InventoryItem {
  id: string;
  /** For type='product', links back to the Product id in products.constant */
  productId?: string;
  name: string;
  type: InventoryType;
  stock: number;
  minStock: number;
  unit: string;
  status: StockStatus;
  /** Only relevant for type='product' — raw materials consumed per sale */
  requiredMaterials?: RequiredMaterial[];
  lastUpdated: string;
}
