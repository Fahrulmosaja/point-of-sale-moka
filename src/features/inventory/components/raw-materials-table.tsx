"use client";

import { RawMaterial } from "@/types/raw-material.types";
import { formatDate } from "@/lib/date-utils";
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

interface RawMaterialsTableProps {
  items: RawMaterial[];
  onEdit?: (item: RawMaterial) => void;
  onDelete?: (item: RawMaterial) => void;
}

export function RawMaterialsTable({ items, onEdit, onDelete }: RawMaterialsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {/* {(onEdit || onDelete) && <TableHead className="w-20" />} */}
            <TableHead>Action</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Used By</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                No raw materials found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <InventoryTableActions
                  onEdit={onEdit ? () => onEdit(item) : undefined}
                  onDelete={onDelete ? () => onDelete(item) : undefined}
                />
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span className="font-semibold">{item.currentStock}</span>
                  <span className="text-muted-foreground text-sm ml-1">{item.unit}</span>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {item.minimumStock} {item.unit}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {item.unit}
                  </Badge>
                </TableCell>
                <TableCell>
                  <InventoryStatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  {item.usedBy && item.usedBy.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.usedBy.map((name) => (
                        <Badge
                          key={name}
                          variant="outline"
                          className="text-[10px] font-normal text-muted-foreground">
                          {name}
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
