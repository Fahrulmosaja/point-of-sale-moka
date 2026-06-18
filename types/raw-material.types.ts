export type Unit = 'gr' | 'ml' | 'pcs';
export type StockStatus = 'healthy' | 'low_stock' | 'out_of_stock';

export interface RawMaterial {
  id: string;
  name: string;
  category: string;
  unit: Unit;
  currentStock: number;
  minimumStock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Computed on the server
  status: StockStatus;
  /** Product menus that use this raw material */
  usedBy?: string[];
}

export interface CreateRawMaterialInput {
  name: string;
  category: string;
  unit: Unit;
  currentStock: number;
  minimumStock: number;
}

export interface UpdateRawMaterialInput extends Partial<CreateRawMaterialInput> {
  isActive?: boolean;
}
