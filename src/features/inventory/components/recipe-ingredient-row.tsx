import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RawMaterialOption {
  id: string;
  name: string;
  unit: string;
}

interface RecipeIngredientRowProps {
  index: number;
  rawMaterialId: string;
  rawMaterials: RawMaterialOption[];
  showDelete: boolean;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onRemove: () => void;
}

export function RecipeIngredientRow({
  index,
  rawMaterialId,
  rawMaterials,
  showDelete,
  register,
  setValue,
  onRemove,
}: RecipeIngredientRowProps) {
  return (
    <div className="flex gap-2 items-start">
      <Select
        value={rawMaterialId ?? ""}
        onValueChange={(v) => setValue(`ingredients.${index}.rawMaterialId`, v)}>
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
        {...register(`ingredients.${index}.quantity`, {
          valueAsNumber: true,
          min: 0.01,
        })}
      />
      {showDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
          onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
