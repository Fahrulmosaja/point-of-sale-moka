'use client';

import { ProductMenu } from '@/types/product-menu.types';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/utils';

interface ProductMenuTableProps {
  items: ProductMenu[];
  onEdit?: (item: ProductMenu) => void;
  onDelete?: (item: ProductMenu) => void;
}

function StockBadge({ status }: { status: ProductMenu['stockStatus'] }) {
  switch (status) {
    case 'out_of_stock':
      return (
        <Badge variant="destructive" className="gap-1.5 flex items-center w-fit">
          <AlertCircle className="h-3.5 w-3.5" /> Out of Stock
        </Badge>
      );
    case 'low_stock':
      return (
        <Badge variant="outline" className="gap-1.5 border-amber-500 text-amber-500 flex items-center w-fit">
          <AlertTriangle className="h-3.5 w-3.5" /> Low Stock
        </Badge>
      );
    case 'healthy':
      return (
        <Badge variant="secondary" className="gap-1.5 flex items-center w-fit">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Healthy
        </Badge>
      );
  }
}

export function ProductMenuTable({ items, onEdit, onDelete }: ProductMenuTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Recipe</TableHead>
            <TableHead>Required Materials</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-20" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No product menus found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <span className="font-semibold">{item.availableStock}</span>
                  <span className="text-xs text-muted-foreground ml-1">servings</span>
                </TableCell>
                <TableCell><StockBadge status={item.stockStatus} /></TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{item.recipeName}</span>
                </TableCell>
                <TableCell>
                  {item.ingredients.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.ingredients.map((ing) => (
                        <Badge
                          key={ing.id}
                          variant="outline"
                          className="text-[10px] py-0 h-5 font-normal text-muted-foreground"
                        >
                          {ing.rawMaterialName} ({ing.quantity}{ing.unit})
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatDate(item.updatedAt)}
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      {onEdit && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(item)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
