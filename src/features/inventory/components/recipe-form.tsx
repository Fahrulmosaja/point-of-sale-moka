"use client";

import { Plus } from "lucide-react";

import { Recipe } from "@/types/recipe.types";
import { useRecipeForm } from "../hooks/use-recipe-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecipeIngredientRow } from "./recipe-ingredient-row";
import { FormDialogFooter } from "./form-dialog-footer";

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: Recipe | null;
}

export function RecipeForm({ open, onClose, editItem }: RecipeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    fields,
    append,
    remove,
    ingredients,
    errors,
    isSubmitting,
    reset,
    isEditing,
    rawMaterials,
  } = useRecipeForm({ editItem, onClose });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Recipe" : "Create Recipe"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="rec-name">Recipe Name</Label>
            <Input
              id="rec-name"
              placeholder="e.g. Caffe Latte Recipe"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rec-desc">Description (optional)</Label>
            <Input
              id="rec-desc"
              placeholder="Brief description..."
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ rawMaterialId: "", quantity: 0 })}
                className="gap-1 h-7 text-xs">
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            {fields.map((field, idx) => (
              <RecipeIngredientRow
                key={field.id}
                index={idx}
                rawMaterialId={ingredients[idx]?.rawMaterialId ?? ""}
                rawMaterials={rawMaterials}
                showDelete={fields.length > 1}
                register={register}
                setValue={setValue}
                onRemove={() => remove(idx)}
              />
            ))}
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
