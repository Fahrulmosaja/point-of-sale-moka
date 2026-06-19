import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export type StockFilter = "all" | "healthy" | "low_stock" | "out_of_stock";
export type RecipeFilter = "all" | "linked" | "unlinked";
export type ActiveInventoryTab = "raw-materials" | "recipes" | "product-menus";

interface InventoryControlsProps {
  activeTab: ActiveInventoryTab;
  rmAlerts: number;
  recipeAlerts: number;
  pmAlerts: number;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: StockFilter;
  onStatusFilterChange: (val: StockFilter) => void;
  recipeFilter: RecipeFilter;
  onRecipeFilterChange: (val: RecipeFilter) => void;
  filteredCount: number;
  onAddRm: () => void;
  onAddRecipe: () => void;
  onAddPm: () => void;
}

export function InventoryControls({
  activeTab,
  rmAlerts,
  recipeAlerts,
  pmAlerts,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  recipeFilter,
  onRecipeFilterChange,
  filteredCount,
  onAddRm,
  onAddRecipe,
  onAddPm,
}: InventoryControlsProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <TabsList className="h-9">
          <TabsTrigger value="raw-materials" className="gap-2 text-sm">
            Raw Materials
            {rmAlerts > 0 && (
              <Badge variant="destructive" className="h-4 text-[10px] px-1 ml-2">
                {rmAlerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="recipes" className="gap-2 text-sm">
            Recipes
            {recipeAlerts > 0 && (
              <Badge
                variant="outline"
                className="h-4 text-[10px] px-1 ml-2 border-amber-500 text-amber-500">
                {recipeAlerts}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="product-menus" className="gap-2 text-sm">
            Product Menus
            {pmAlerts > 0 && (
              <Badge variant="destructive" className="h-4 text-[10px] px-1 ml-2">
                {pmAlerts}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          {activeTab === "raw-materials" && (
            <Button size="sm" onClick={onAddRm} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Material
            </Button>
          )}
          {activeTab === "recipes" && (
            <Button size="sm" onClick={onAddRecipe} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Recipe
            </Button>
          )}
          {activeTab === "product-menus" && (
            <Button size="sm" onClick={onAddPm} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {activeTab === "recipes" ? (
          <Select
            value={recipeFilter}
            onValueChange={(v) => onRecipeFilterChange(v as RecipeFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="linked">Linked</SelectItem>
              <SelectItem value="unlinked">Unlinked</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={statusFilter}
            onValueChange={(v) => onStatusFilterChange(v as StockFilter)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {activeTab !== "recipes" && statusFilter !== "all" && (
        <p className="text-sm text-muted-foreground -mt-1">
          Showing <strong>{statusFilter.replace("_", " ")}</strong> · {filteredCount}{" "}
          item(s)
        </p>
      )}
      {activeTab === "recipes" && recipeFilter !== "all" && (
        <p className="text-sm text-muted-foreground -mt-1">
          Showing <strong>{recipeFilter}</strong> · {filteredCount} item(s)
        </p>
      )}
    </div>
  );
}
