'use client';

import { Order } from '@/types/order.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';

interface ActivityTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
}

const statusVariantMap: Record<string, { label: string; className: string }> = {
  completed: {
    label: 'Completed',
    className: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-muted text-muted-foreground',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  },
};

const typeMap: Record<string, string> = {
  dine_in: 'Dine In',
  take_away: 'Take Away',
  online: 'Online',
};

export function ActivityTable({ orders, onViewDetail }: ActivityTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const statusInfo = statusVariantMap[order.status] ?? statusVariantMap.completed;
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-semibold">{order.invoiceNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(order.date)}</TableCell>
                  <TableCell>{typeMap[order.type]}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
