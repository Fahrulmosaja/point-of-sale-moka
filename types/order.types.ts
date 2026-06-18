import { Product } from "./product.types";

export type OrderType = "dine_in" | "take_away" | "online";
export type OrderStatus = "completed" | "refunded" | "cancelled" | "pending";

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  date: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashierName: string;
}
