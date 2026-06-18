"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  RawMaterial,
  Unit,
} from "@/types/raw-material.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RawMaterialFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: RawMaterial | null;
}

type FormValues = {
  name: string;
  category: string;
  unit: Unit;
  currentStock: number;
  minimumStock: number;
};

export function RawMaterialForm({
  open,
  onClose,
  editItem,
}: RawMaterialFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      category: "",
      unit: "gr",
      currentStock: 0,
      minimumStock: 0,
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        name: editItem.name,
        category: editItem.category,
        unit: editItem.unit,
        currentStock: editItem.currentStock,
        minimumStock: editItem.minimumStock,
      });
    } else {
      reset({
        name: "",
        category: "",
        unit: "gr",
        currentStock: 0,
        minimumStock: 0,
      });
    }
  }, [editItem, reset]);

  const selectedUnit = watch("unit");

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await api.put(`/raw-materials/${editItem.id}`, values);
        toast.success("Raw material updated");
      } else {
        await api.post("/raw-materials", values);
        toast.success("Raw material created");
      }
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Operation failed";
      toast.error(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Raw Material" : "Add Raw Material"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-2">
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
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
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
                min="0"
                step="0.01"
                {...register("minimumStock", {
                  required: true,
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be ≥ 0" },
                })}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
