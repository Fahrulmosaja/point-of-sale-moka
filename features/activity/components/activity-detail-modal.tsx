'use client';

import { Order } from '@/types/order.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';

interface ActivityDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onRefund: (orderId: string) => void;
}

const typeMap: Record<string, string> = {
  dine_in: 'Dine In',
  take_away: 'Take Away',
  online: 'Online',
};

export function ActivityDetailModal({
  order,
  open,
  onClose,
  onRefund,
}: ActivityDetailModalProps) {
  const handleRefund = () => {
    if (!order) return;
    onRefund(order.id);
    toast.success(`Refund for ${order.invoiceNumber} has been processed.`);
    onClose();
  };

  if (!order) return null;

  const isRefundable = order.status === 'completed';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            {order.invoiceNumber}
            <Badge
              variant="outline"
              className={
                order.status === 'refunded'
                  ? 'text-destructive border-destructive/30 text-xs'
                  : order.status === 'completed'
                    ? 'text-emerald-500 border-emerald-500/30 text-xs'
                    : 'text-xs'
              }
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {formatDate(order.date)} · {typeMap[order.type]} · {order.paymentMethod} · {order.cashierName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-medium">{item.product?.name ?? 'Unknown Item'}</p>
                <p className="text-muted-foreground text-xs">
                  {formatCurrency(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}

          <Separator className="my-2" />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax (10%)</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <Separator className="my-1" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
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
                    This will mark invoice <strong>{order.invoiceNumber}</strong> as refunded. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRefund}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
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
