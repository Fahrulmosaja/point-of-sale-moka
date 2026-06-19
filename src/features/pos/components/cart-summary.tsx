"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useCartOperations } from "../hooks/use-cart-operations";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingCart, CreditCard } from "lucide-react";

export function CartSummary() {
  const { items } = useCartStore();
  const { handleCheckout } = useCartOperations();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const onConfirmCheckout = async () => {
    setIsCheckingOut(true);
    await handleCheckout("Cash");
    setIsCheckingOut(false);
  };

  return (
    <div className="mt-auto p-6 bg-muted/20">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            id="checkout-btn"
            className="w-full mt-6"
            size="lg"
            disabled={items.length === 0 || isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Checkout"}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <CreditCard className="size-5 text-primary" />
            </div>
            <AlertDialogTitle className="text-center text-base font-semibold">
              Confirm
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to checkout?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="size-3.5" />
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <Separator className="my-1.5" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel id="checkout-cancel-btn" className="flex-1">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              id="checkout-confirm-btn"
              className="flex-1 bg-primary hover:bg-primary/90 font-semibold"
              onClick={onConfirmCheckout}>
              Yes, Process Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
