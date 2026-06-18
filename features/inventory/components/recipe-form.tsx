"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Recipe, CreateRecipeInput } from "@/types/recipe.types";
import { RawMaterial } from "@/types/raw-material.types";
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
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  editItem?: Recipe | null;
}

type IngredientRow = { rawMaterialId: string; quantity: number };
type FormValues = {
  name: string;
  description: string;
  ingredients: IngredientRow[];
};

export function RecipeForm({ open, onClose, editItem }: RecipeFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      ingredients: [{ rawMaterialId: "", quantity: 0 }],
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        name: editItem.name,
        description: editItem.description ?? "",
        ingredients: editItem.ingredients.map((i) => ({
          rawMaterialId: i.rawMaterialId,
          quantity: i.quantity,
        })),
      });
    } else {
      reset({
        name: "",
        description: "",
        ingredients: [{ rawMaterialId: "", quantity: 0 }],
      });
    }
  }, [editItem, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  useEffect(() => {
    api
      .get("/raw-materials")
      .then((r) => setRawMaterials(r.data))
      .catch(console.error);
  }, []);

  const onSubmit = async (values: FormValues) => {
    const validIngredients = values.ingredients.filter(
      (i) => i.rawMaterialId && i.quantity > 0,
    );
    if (validIngredients.length === 0) {
      toast.error("At least one ingredient is required");
      return;
    }
    try {
      const payload: CreateRecipeInput = {
        name: values.name,
        description: values.description || undefined,
        ingredients: validIngredients,
      };
      if (isEditing) {
        await api.put(`/recipes/${editItem.id}`, payload);
        toast.success("Recipe updated");
      } else {
        await api.post("/recipes", payload);
        toast.success("Recipe created");
      }
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      reset();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const ingredients = watch("ingredients");

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset();
          onClose();
        }
      }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Recipe" : "Create Recipe"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-2">
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
              <div key={field.id} className="flex gap-2 items-start">
                <Select
                  value={ingredients[idx]?.rawMaterialId ?? ""}
                  onValueChange={(v) =>
                    setValue(`ingredients.${idx}.rawMaterialId`, v)
                  }>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterials.map((rm) => (
                      <SelectItem key={rm.id} value={rm.id}>
                        {rm.name} ({rm.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="w-28"
                  placeholder="Qty"
                  {...register(`ingredients.${idx}.quantity`, {
                    valueAsNumber: true,
                    min: 0.01,
                  })}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                    onClick={() => remove(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
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
