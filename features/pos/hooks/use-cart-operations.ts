import { useCartStore } from '@/stores/cart-store';
import { useInventoryStore } from '@/stores/inventory-store';
import { useOrdersStore } from '@/stores/orders-store';
import { Product } from '@/types/product.types';
import { toast } from 'sonner';

// Keep track of invoice number outside to simulate a backend generator
let invoiceCounter = 9;

export function useCartOperations() {
  const { items, orderType, addItem, clearCart } = useCartStore();
  const inventoryItems = useInventoryStore((state) => state.items);
  const deductStock = useInventoryStore((state) => state.deductStock);
  const addOrder = useOrdersStore((state) => state.addOrder);

  const handleAddItem = (product: Product, quantity = 1, notes?: string) => {
    const inventoryItem = inventoryItems.find((inv) => inv.name === product.name);

    if (inventoryItem) {
      if (inventoryItem.status === 'out_of_stock') {
        toast.error(`${product.name} is out of stock!`);
        return;
      } else if (inventoryItem.status === 'low_stock') {
        toast.warning(
          `${product.name} is running low! (${inventoryItem.stock} ${inventoryItem.unit} remaining)`,
          {
            action: {
              label: 'Check Inventory',
              onClick: () => { window.location.href = '/inventory'; },
            },
          }
        );
      }
    }

    addItem(product, quantity, notes);
  };

  const handleCheckout = (paymentMethod: string) => {
    if (items.length === 0) return;

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    // 1. Build invoice number
    invoiceCounter += 1;
    const invoiceNumber = `INV-${String(invoiceCounter).padStart(3, '0')}`;

    // 2. Create order and push to orders store → Activity page sees it instantly
    addOrder({
      id: `ord-${Date.now()}`,
      invoiceNumber,
      date: new Date().toISOString(),
      type: orderType,
      status: 'completed',
      items: items.map((item) => ({ ...item })),
      subtotal,
      tax,
      total,
      paymentMethod,
      cashierName: 'Jane Doe',
    });

    // 3. Deduct inventory for items that have a matching inventory entry
    items.forEach((cartItem) => {
      const productId = cartItem.product?.id;
      const productName = cartItem.product?.name;
      if (!productName) return;
      const match = inventoryItems.find(
        (inv) => inv.type === 'product' && (inv.productId === productId || inv.name === productName)
      );
      if (match) {
        deductStock(match.name, cartItem.quantity);
      }
    });

    // 4. Show success toast and clear cart
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(total);

    toast.success(`${invoiceNumber} — Checkout successful!`, {
      description: `Total paid: ${formatted}`,
    });

    clearCart();
  };

  return {
    handleAddItem,
    handleCheckout,
  };
}
