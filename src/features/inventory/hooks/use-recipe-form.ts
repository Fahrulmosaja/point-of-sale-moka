import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe, CreateRecipeInput } from "@/types/recipe.types";
import { RawMaterial } from "@/types/raw-material.types";
import { api } from "@/lib/api";
import { toast } from "sonner";

type IngredientRow = { rawMaterialId: string; quantity: number };
type FormValues = {
  name: string;
  description: string;
  ingredients: IngredientRow[];
};

interface UseRecipeFormProps {
  editItem?: Recipe | null;
  onClose: () => void;
}

export function useRecipeForm({ editItem, onClose }: UseRecipeFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;

  const { data: rawMaterials = [] } = useQuery<RawMaterial[]>({
    queryKey: ["raw-materials"],
    queryFn: () => api.get("/raw-materials").then((r) => r.data),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
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

  const mutation = useMutation({
    mutationFn: async (payload: CreateRecipeInput) => {
      if (isEditing && editItem) {
        return api.put(`/recipes/${editItem.id}`, payload);
      }
      return api.post("/recipes", payload);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Recipe updated" : "Recipe created");
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Operation failed");
    },
  });

  const onSubmit = (values: FormValues) => {
    const validIngredients = values.ingredients.filter(
      (i) => i.rawMaterialId && i.quantity > 0,
    );
    if (validIngredients.length === 0) {
      toast.error("At least one ingredient is required");
      return;
    }
    const payload: CreateRecipeInput = {
      name: values.name,
      description: values.description || undefined,
      ingredients: validIngredients,
    };
    mutation.mutate(payload);
  };

  const ingredients = watch("ingredients");

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    fields,
    append,
    remove,
    ingredients,
    errors,
    isSubmitting: mutation.isPending,
    reset,
    isEditing,
    rawMaterials,
  };
}
