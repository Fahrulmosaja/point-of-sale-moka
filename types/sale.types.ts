export type OrderType = 'dine_in' | 'take_away' | 'online';
export type SaleStatus = 'completed' | 'refunded' | 'void';

export interface SaleItem {
  id: string;
  saleId: string;
  productMenuId: string;
  productMenuName: string;
  quantity: number;
  unitPrice: number;
  notes?: string | null;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  type: OrderType;
  status: SaleStatus;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashierName: string;
  createdAt: string;
  items: SaleItem[];
}

export interface CheckoutInput {
  orderType: OrderType;
  paymentMethod: string;
  cashierName: string;
  items: {
    productMenuId: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
  }[];
}
