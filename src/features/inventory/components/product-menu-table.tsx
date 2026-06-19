"use client";

import { ProductMenu } from "@/types/product-menu.types";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryStatusBadge } from "./inventory-status-badge";
import { InventoryTableActions } from "./inventory-table-actions";

interface ProductMenuTableProps {
  items: ProductMenu[];
  onEdit?: (item: ProductMenu) => void;
  onDelete?: (item: ProductMenu) => void;
}

export function ProductMenuTable({ items, onEdit, onDelete }: ProductMenuTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Linked Recipe</TableHead>
            <TableHead>Available Servings</TableHead>
            <TableHead>Status</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-20" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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

                <TableCell className="font-medium">
                  {formatCurrency(item.price)}
                </TableCell>

                <TableCell>
                  {item.recipeName ? (
                    <Badge
                      variant="outline"
                      className="text-xs font-normal border-primary/40 text-primary">
                      {item.recipeName}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                <TableCell>
                  <span className="font-semibold">{item.availableStock}</span>
                  <span className="text-xs text-muted-foreground ml-1">servings</span>
                </TableCell>

                <TableCell>
                  <InventoryStatusBadge status={item.stockStatus} />
                </TableCell>

                <InventoryTableActions
                  onEdit={onEdit ? () => onEdit(item) : undefined}
                  onDelete={onDelete ? () => onDelete(item) : undefined}
                />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
