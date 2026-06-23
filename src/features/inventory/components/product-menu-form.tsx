"use client";

import { ProductMenu } from "@/types/product-menu.types";
import { useProductMenuForm } from "../hooks/use-product-menu-form";

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

interface ProductMenuFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: ProductMenu | null;
}

const CATEGORIES = ["Espresso Based", "Non-Coffee", "Tea", "Food", "Snacks", "Beverages"];

export function ProductMenuForm({ open, onClose, editItem }: ProductMenuFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    selectedRecipeId,
    selectedCategory,
    errors,
    isSubmitting,
    reset,
    isEditing,
    recipes,
  } = useProductMenuForm({ editItem, onClose });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product Menu" : "Add Product Menu"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="pm-name">Product Name</Label>
            <Input
              id="pm-name"
              placeholder="e.g. Caffe Latte"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger id="pm-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pm-price">Price (IDR)</Label>
            <Input
              id="pm-price"
              type="number"
              min="0"
              step="500"
              placeholder="e.g. 32000"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 1, message: "Price must be > 0" },
              })}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pm-image">Image URL (optional)</Label>
            <Input id="pm-image" placeholder="https://..." {...register("imageUrl")} />
          </div>

          <div className="grid gap-2">
            <Label>Recipe</Label>
            <Select
              value={selectedRecipeId}
              onValueChange={(v) => setValue("recipeId", v)}>
              <SelectTrigger id="pm-recipe">
                <SelectValue placeholder="Select recipe" />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((rec) => (
                  <SelectItem key={rec.id} value={rec.id}>
                    {rec.name}
                    {rec.ingredients.length > 0 && (
                      <span className="text-muted-foreground text-xs ml-1">
                        ({rec.ingredients.length} ingredients)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Every product menu must have exactly one recipe.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="pm-active"
              type="checkbox"
              className="h-4 w-4 accent-primary"
              {...register("isActive")}
            />
            <Label htmlFor="pm-active" className="cursor-pointer">
              Active (appears in POS)
            </Label>
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
