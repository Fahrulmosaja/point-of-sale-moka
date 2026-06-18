"use client";

import { RawMaterial } from "@/types/raw-material.types";
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
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDate } from "@/lib/date-utils";

interface RawMaterialsTableProps {
  items: RawMaterial[];
  onEdit?: (item: RawMaterial) => void;
  onDelete?: (item: RawMaterial) => void;
}

function StatusBadge({ status }: { status: RawMaterial["status"] }) {
  switch (status) {
    case "out_of_stock":
      return (
        <Badge
          variant="destructive"
          className="gap-1.5 flex items-center w-fit">
          <AlertCircle className="h-3.5 w-3.5" /> Out of Stock
        </Badge>
      );
    case "low_stock":
      return (
        <Badge
          variant="outline"
          className="gap-1.5 border-amber-500 text-amber-500 flex items-center w-fit">
          <AlertTriangle className="h-3.5 w-3.5" /> Low Stock
        </Badge>
      );
    case "healthy":
      return (
        <Badge variant="secondary" className="gap-1.5 flex items-center w-fit">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Healthy
        </Badge>
      );
  }
}

export function RawMaterialsTable({
  items,
  onEdit,
  onDelete,
}: RawMaterialsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Used By</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
            {(onEdit || onDelete) && <TableHead className="w-20" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground">
                No raw materials found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <span className="font-semibold">{item.currentStock}</span>
                  <span className="text-muted-foreground text-sm ml-1">
                    {item.unit}
                  </span>
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
                  <StatusBadge status={item.status} />
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
                {(onEdit || onDelete) && (
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(item)}>
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
