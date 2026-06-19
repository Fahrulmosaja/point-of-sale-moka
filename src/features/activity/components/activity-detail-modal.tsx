"use client";

import { Sale } from "@/types/sale.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";
import { toast } from "sonner";

interface ActivityDetailModalProps {
  sale: Sale | null;
  open: boolean;
  onClose: () => void;
}

const typeMap: Record<string, string> = {
  dine_in: "Dine In",
  take_away: "Take Away",
  online: "Online",
};

export function ActivityDetailModal({ sale, open, onClose }: ActivityDetailModalProps) {
  if (!sale) return null;

  const isRefundable = sale.status === "completed";

  const handleRefund = async () => {
    toast.info("Refund feature coming soon.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            {sale.invoiceNumber}
            <Badge
              variant="outline"
              className={
                sale.status === "refunded"
                  ? "text-destructive border-destructive/30 text-xs"
                  : sale.status === "completed"
                    ? "text-emerald-500 border-emerald-500/30 text-xs"
                    : "text-xs"
              }>
              {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {formatDate(sale.date)} · {typeMap[sale.type]} · {sale.paymentMethod} ·{" "}
            {sale.cashierName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-2">
          {sale.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-medium">{item.productMenuName}</p>
                <p className="text-muted-foreground text-xs">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}

          <Separator className="my-2" />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>{formatCurrency(sale.tax)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(sale.total)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isRefundable && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Refund</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Process Refund?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark invoice <strong>{sale.invoiceNumber}</strong> as
                    refunded.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRefund}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirm Refund
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
