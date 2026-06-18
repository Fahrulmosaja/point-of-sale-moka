import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductMenu, CreateProductMenuInput } from "@/types/product-menu.types";
import { Recipe } from "@/types/recipe.types";
import { api } from "@/lib/api";
import { toast } from "sonner";

type FormValues = {
  name: string;
  category: string;
  price: number;
  recipeId: string;
  imageUrl?: string;
  isActive: boolean;
};

interface UseProductMenuFormProps {
  editItem?: ProductMenu | null;
  onClose: () => void;
}

export function useProductMenuForm({ editItem, onClose }: UseProductMenuFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: () => api.get("/recipes").then((r) => r.data),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
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

  const mutation = useMutation({
    mutationFn: async (payload: CreateProductMenuInput) => {
      if (isEditing && editItem) {
        return api.put(`/product-menus/${editItem.id}`, payload);
      }
      return api.post("/product-menus", payload);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Product menu updated" : "Product menu created");
      queryClient.invalidateQueries({ queryKey: ["product-menus"] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Operation failed");
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!values.recipeId) {
      toast.error("Please select a recipe");
      return;
    }
    const payload: CreateProductMenuInput = {
      name: values.name,
      category: values.category,
      price: values.price,
      recipeId: values.recipeId,
      imageUrl: values.imageUrl || undefined,
      isActive: values.isActive,
    };
    mutation.mutate(payload);
  };

  const selectedRecipeId = watch("recipeId");
  const selectedCategory = watch("category");

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    selectedRecipeId,
    selectedCategory,
    errors,
    isSubmitting: mutation.isPending,
    reset,
    isEditing,
    recipes,
  };
}
