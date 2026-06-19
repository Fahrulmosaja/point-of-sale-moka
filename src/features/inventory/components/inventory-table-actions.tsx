import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";

interface InventoryTableActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function InventoryTableActions({ onEdit, onDelete }: InventoryTableActionsProps) {
  if (!onEdit && !onDelete) return null;

  return (
    <TableCell>
      <div className="flex gap-1 justify-end">
        {onEdit && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </TableCell>
  );
}
