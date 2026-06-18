import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RawMaterial, Unit } from "@/types/raw-material.types";
import { api } from "@/lib/api";
import { toast } from "sonner";

type FormValues = {
  name: string;
  category: string;
  unit: Unit;
  currentStock: number;
  minimumStock: number;
};

interface UseRawMaterialFormProps {
  editItem?: RawMaterial | null;
  onClose: () => void;
}

export function useRawMaterialForm({ editItem, onClose }: UseRawMaterialFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!editItem;

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

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isEditing && editItem) {
        return api.put(`/raw-materials/${editItem.id}`, values);
      }
      return api.post("/raw-materials", values);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Raw material updated" : "Raw material created");
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({ queryKey: ["product-menus"] });
      reset();
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Operation failed");
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  const selectedUnit = watch("unit");

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    setValue,
    selectedUnit,
    errors,
    isSubmitting: mutation.isPending,
    reset,
    isEditing,
  };
}
