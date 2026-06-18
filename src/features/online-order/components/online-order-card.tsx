"use client";

import { Order, OrderStatus } from "@/types/order.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, Eye, ShoppingBag } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { formatTime } from "@/lib/date-utils";

interface OnlineOrderCardProps {
  order: Order;
  onViewDetail: (order: Order) => void;
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

export function OnlineOrderCard({ order, onViewDetail }: OnlineOrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];
  const itemSummary = order.items
    .map((item) => `${item.quantity}x ${item.product?.name ?? "Unknown"}`)
    .join(", ");

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all duration-200",
        "hover:border-primary/50 hover:shadow-md hover:shadow-primary/5",
        order.status === "pending" && "border-amber-500/30",
      )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold tracking-tight">
            {order.invoiceNumber}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatTime(order.date)}
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-medium shrink-0",
            statusConfig.className,
          )}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Items summary */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <ShoppingBag className="h-4 w-4 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{itemSummary}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-base font-bold">
            {formatCurrency(order.total)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CreditCard className="h-3 w-3" />
            {order.paymentMethod}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetail(order)}
            className="gap-1.5 h-8 text-xs">
            <Eye className="h-3 w-3" />
            Detail
          </Button>
        </div>
      </div>
    </div>
  );
}
