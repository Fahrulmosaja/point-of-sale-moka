'use client';

import { InventoryItem } from '@/types/inventory.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const hasProducts = items.some((i) => i.type === 'product');

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'out_of_stock':
        return (
          <Badge variant="destructive" className="gap-1.5 flex items-center w-fit">
            <AlertCircle className="h-3.5 w-3.5" />
            Out of Stock
          </Badge>
        );
      case 'low_stock':
        return (
          <Badge variant="outline" className="gap-1.5 border-amber-500 text-amber-500 flex items-center w-fit">
            <AlertTriangle className="h-3.5 w-3.5" />
            Low Stock
          </Badge>
        );
      case 'healthy':
        return (
          <Badge variant="secondary" className="gap-1.5 flex items-center w-fit">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Healthy
          </Badge>
        );
    }
  };



  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Stock Level</TableHead>
            <TableHead>Status</TableHead>
            {hasProducts && (
              <TableHead>Required Materials</TableHead>
            )}
            <TableHead className="text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={hasProducts ? 5 : 4} className="h-24 text-center text-muted-foreground">
                No inventory items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {item.stock} <span className="text-muted-foreground font-normal text-sm">{item.unit}</span>
                    </span>
                    {item.status !== 'healthy' && (
                      <span className="text-xs text-muted-foreground">Min: {item.minStock} {item.unit}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                {hasProducts && (
                  <TableCell>
                    {item.requiredMaterials && item.requiredMaterials.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.requiredMaterials.map((mat) => (
                          <Badge
                            key={mat.materialId}
                            variant="outline"
                            className="text-[10px] py-0 h-5 font-normal text-muted-foreground"
                          >
                            {mat.materialName} ({mat.amountPerUnit}{mat.unit})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right text-muted-foreground">
                  {formatDate(item.lastUpdated)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
