"use client";

import { Order, OrderStatus } from "@/types/order.types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDateTime } from "@/lib/date-utils";

interface OnlineOrderDetailSheetProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "Pending",
      className: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    },
    completed: {
      label: "Completed",
      className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    refunded: {
      label: "Refunded",
      className: "bg-muted text-muted-foreground border-border",
    },
  };

export function OnlineOrderDetailSheet({
  order,
  open,
  onClose,
}: OnlineOrderDetailSheetProps) {
  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">
              {order.invoiceNumber}
            </SheetTitle>
            <Badge
              variant="outline"
              className={cn("text-xs font-medium", statusConfig.className)}>
              {statusConfig.label}
            </Badge>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            {formatDateTime(order.date)}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Items Ordered
            </h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-bold shrink-0">
                      {item.quantity}
                    </span>
                    <span className="text-sm truncate">
                      {item.product?.name ?? "Unknown Item"}
                    </span>
                  </div>
                  <span className="text-sm font-medium shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
              Price Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
              Payment Details
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cashier</span>
              <span className="font-medium">{order.cashierName}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
