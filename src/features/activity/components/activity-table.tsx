"use client";

import { Sale } from "@/types/sale.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatDate } from "@/lib/date-utils";

interface ActivityTableProps {
  sales: Sale[];
  onViewDetail: (sale: Sale) => void;
}

const statusVariantMap: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  },
  refunded: {
    label: "Refunded",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  void: { label: "Void", className: "bg-muted text-muted-foreground" },
};

const typeMap: Record<string, string> = {
  dine_in: "Dine In",
  take_away: "Take Away",
  online: "Online",
};

export function ActivityTable({ sales, onViewDetail }: ActivityTableProps) {
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
          {sales.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground">
                No transactions found.
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => {
              const info =
                statusVariantMap[sale.status] ?? statusVariantMap.completed;
              return (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono font-semibold">
                    {sale.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(sale.date)}
                  </TableCell>
                  <TableCell>{typeMap[sale.type]}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs font-medium ${info.className}`}>
                      {info.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetail(sale)}>
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
