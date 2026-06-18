"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProductMenu,
  CreateProductMenuInput,
} from "@/types/product-menu.types";
import { Recipe } from "@/types/recipe.types";
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

interface ProductMenuFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: ProductMenu | null;
}

type FormValues = {
  name: string;
  category: string;
  price: number;
  recipeId: string;
  imageUrl?: string;
  isActive: boolean;
};

const CATEGORIES = [
  "Espresso Based",
  "Non-Coffee",
  "Tea",
  "Food",
  "Snacks",
  "Beverages",
];

export function ProductMenuForm({
  open,
  onClose,
  editItem,
}: ProductMenuFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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
      price: 0,
      recipeId: "",
      imageUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        name: editItem.name,
        category: editItem.category,
        price: editItem.price,
        recipeId: editItem.recipeId,
        imageUrl: editItem.imageUrl ?? "",
        isActive: editItem.isActive,
      });
    } else {
      reset({
        name: "",
        category: "",
        price: 0,
        recipeId: "",
        imageUrl: "",
        isActive: true,
      });
    }
  }, [editItem, reset]);

  const selectedRecipeId = watch("recipeId");
  const selectedCategory = watch("category");

  useEffect(() => {
    api
      .get("/recipes")
      .then((r) => setRecipes(r.data))
      .catch(console.error);
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!values.recipeId) {
      toast.error("Please select a recipe");
      return;
    }
    try {
      const payload: CreateProductMenuInput = {
        name: values.name,
        category: values.category,
        price: values.price,
        recipeId: values.recipeId,
        imageUrl: values.imageUrl || undefined,
        isActive: values.isActive,
      };
      if (isEditing) {
        await api.put(`/product-menus/${editItem.id}`, payload);
        toast.success("Product menu updated");
      } else {
        await api.post("/product-menus", payload);
        toast.success("Product menu created");
      }
      queryClient.invalidateQueries({ queryKey: ["product-menus"] });
      reset();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
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
            {isEditing ? "Edit Product Menu" : "Add Product Menu"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-2">
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
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
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
            <Input
              id="pm-image"
              placeholder="https://..."
              {...register("imageUrl")}
            />
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
