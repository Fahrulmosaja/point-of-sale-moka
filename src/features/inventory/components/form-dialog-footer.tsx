import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormDialogFooterProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

export function FormDialogFooter({
  isSubmitting,
  isEditing,
  onCancel,
}: FormDialogFooterProps) {
  return (
    <DialogFooter className="mt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
      </Button>
    </DialogFooter>
  );
}
