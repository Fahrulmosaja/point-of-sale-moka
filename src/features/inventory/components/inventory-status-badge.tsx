import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type StockStatus = "healthy" | "low_stock" | "out_of_stock";

interface InventoryStatusBadgeProps {
  status: StockStatus;
}

export function InventoryStatusBadge({ status }: InventoryStatusBadgeProps) {
  switch (status) {
    case "out_of_stock":
      return (
        <Badge variant="destructive" className="gap-1.5 flex items-center w-fit">
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
    default:
      return (
        <Badge variant="secondary" className="gap-1.5 flex items-center w-fit">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Healthy
        </Badge>
      );
  }
}
