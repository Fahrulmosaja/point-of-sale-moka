import { useCartStore } from "@/stores/cart-store";
import { Product } from "@/types/product.types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  computeRawMaterialConsumed,
  computeEffectiveStock,
} from "@/lib/stock-calculator";

import { useQueryClient } from "@tanstack/react-query";

export function useCartOperations() {
  const { items, orderType, addItem, clearCart } = useCartStore();
  const queryClient = useQueryClient();

  const handleAddItem = (product: Product, quantity = 1, notes?: string) => {
    if (product.stockStatus === "out_of_stock") {
      toast.error(`${product.name} is out of stock!`);
      return;
    }

    const consumed = computeRawMaterialConsumed(items);
    const effectiveStock = computeEffectiveStock(product, consumed);
    if (effectiveStock <= 0) {
      toast.error(`Stock limit reached for ${product.name}!`, {
        description: `All available stock has been reserved in the cart.`,
      });
      return;
    }

    addItem(product, quantity, notes);
  };

  const handleCheckout = async (paymentMethod: string) => {
    if (items.length === 0) return;

    try {
      const response = await api.post("/checkout", {
        orderType,
        paymentMethod,
        cashierName: "Jane Doe",
        items: items.map((item) => ({
          productMenuId: item.productMenuId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
        })),
      });

      const { invoiceNumber, total } = response.data;

      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(total);

      toast.success(`${invoiceNumber} — Checkout successful!`, {
        description: `Total paid: ${formatted}`,
      });

      clearCart();

      // Refresh POS product list so stock counts update immediately
      queryClient.invalidateQueries({ queryKey: ["product-menus"] });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      toast.error("Checkout failed", { description: message });
    }
  };

  return { handleAddItem, handleCheckout };
}
