"use client";

import { RawMaterial, Unit } from "@/types/raw-material.types";
import { useRawMaterialForm } from "../hooks/use-raw-material-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormDialogFooter } from "./form-dialog-footer";

interface RawMaterialFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: RawMaterial | null;
}

export function RawMaterialForm({ open, onClose, editItem }: RawMaterialFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    selectedUnit,
    errors,
    isSubmitting,
    reset,
    isEditing,
  } = useRawMaterialForm({ editItem, onClose });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Raw Material" : "Add Raw Material"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="rm-name">Name</Label>
            <Input
              id="rm-name"
              placeholder="e.g. Coffee Beans - House Blend"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rm-category">Category</Label>
            <Input
              id="rm-category"
              placeholder="e.g. Beans, Dairy, Syrup"
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Unit</Label>
            <Select
              value={selectedUnit}
              onValueChange={(v) => setValue("unit", v as Unit)}>
              <SelectTrigger id="rm-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gr">gr (grams)</SelectItem>
                <SelectItem value="ml">ml (milliliters)</SelectItem>
                <SelectItem value="pcs">pcs (pieces)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="rm-stock">Current Stock ({selectedUnit})</Label>
              <Input
                id="rm-stock"
                type="number"
                min="0"
                step="0.01"
                {...register("currentStock", {
                  required: true,
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be ≥ 0" },
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rm-minstk">Min Stock ({selectedUnit})</Label>
              <Input
                id="rm-minstk"
                type="number"
                min="10"
                step="0.01"
                {...register("minimumStock", {
                  required: true,
                  valueAsNumber: true,
                  min: { value: 10, message: "Must be ≥ 10" },
                })}
              />
            </div>
          </div>

          <FormDialogFooter
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onCancel={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
