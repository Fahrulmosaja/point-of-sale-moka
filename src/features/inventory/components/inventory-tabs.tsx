"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { RawMaterial } from "@/types/raw-material.types";
import { ProductMenu } from "@/types/product-menu.types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { RawMaterialsTable } from "./raw-materials-table";
import { ProductMenuTable } from "./product-menu-table";
import { RawMaterialForm } from "./raw-material-form";
import { RecipeForm } from "./recipe-form";
import { ProductMenuForm } from "./product-menu-form";

type StockFilter = "all" | "healthy" | "low_stock" | "out_of_stock";

export function InventoryTabs() {
  const queryClient = useQueryClient();

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<"raw-materials" | "product-menus">(
    "raw-materials",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockFilter>("all");

  // ── Form dialogs ───────────────────────────────────────────────────────────
  const [rmFormOpen, setRmFormOpen] = useState(false);
  const [rmEdit, setRmEdit] = useState<RawMaterial | null>(null);
  const [recipeFormOpen, setRecipeFormOpen] = useState(false);
  const [pmFormOpen, setPmFormOpen] = useState(false);
  const [pmEdit, setPmEdit] = useState<ProductMenu | null>(null);

  // ── Delete confirm ─────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "rm" | "pm";
    id: string;
    name: string;
  } | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: rawMaterials = [], isLoading: rmLoading } = useQuery<
    RawMaterial[]
  >({
    queryKey: ["raw-materials"],
    queryFn: () => api.get("/raw-materials").then((r) => r.data),
  });

  const { data: productMenus = [], isLoading: pmLoading } = useQuery<
    ProductMenu[]
  >({
    queryKey: ["product-menus"],
    queryFn: () => api.get("/product-menus").then((r) => r.data),
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: "rm" | "pm"; id: string }) =>
      type === "rm"
        ? api.delete(`/raw-materials/${id}`)
        : api.delete(`/product-menus/${id}`),
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries({
        queryKey: [type === "rm" ? "raw-materials" : "product-menus"],
      });
      toast.success("Deleted successfully");
      setDeleteTarget(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ── Filtered data ──────────────────────────────────────────────────────────
  const filteredRm = rawMaterials.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredPm = productMenus.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || item.stockStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Counts ─────────────────────────────────────────────────────────────────
  const rmAlerts = rawMaterials.filter((i) => i.status !== "healthy").length;
  const pmAlerts = productMenus.filter(
    (i) => i.stockStatus !== "healthy",
  ).length;

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        {/* Header controls */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <TabsList className="h-9">
              <TabsTrigger value="raw-materials" className="gap-2 text-sm">
                Raw Materials
                {rmAlerts > 0 && (
                  <Badge variant="destructive" className="h-4 text-[10px] px-1">
                    {rmAlerts}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="product-menus" className="gap-2 text-sm">
                Product Menus
                {pmAlerts > 0 && (
                  <Badge variant="destructive" className="h-4 text-[10px] px-1">
                    {pmAlerts}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {activeTab === "raw-materials" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setRmEdit(null);
                    setRmFormOpen(true);
                  }}
                  className="gap-1.5">
                  <Plus className="h-4 w-4" /> Add Material
                </Button>
              )}
              {activeTab === "product-menus" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRecipeFormOpen(true)}
                    className="gap-1.5">
                    <Plus className="h-4 w-4" /> Add Recipe
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPmEdit(null);
                      setPmFormOpen(true);
                    }}
                    className="gap-1.5">
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StockFilter)}>
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
          </div>

          {statusFilter !== "all" && (
            <p className="text-sm text-muted-foreground -mt-1">
              Showing <strong>{statusFilter.replace("_", " ")}</strong> ·{" "}
              {activeTab === "raw-materials"
                ? filteredRm.length
                : filteredPm.length}{" "}
              item(s)
            </p>
          )}
        </div>

        {/* Raw Materials Tab */}
        <TabsContent value="raw-materials" className="mt-0">
          {rmLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-md bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <RawMaterialsTable
              items={filteredRm}
              onEdit={(item) => {
                setRmEdit(item);
                setRmFormOpen(true);
              }}
              onDelete={(item) =>
                setDeleteTarget({ type: "rm", id: item.id, name: item.name })
              }
            />
          )}
        </TabsContent>

        {/* Product Menus Tab */}
        <TabsContent value="product-menus" className="mt-0">
          {pmLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-md bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ProductMenuTable
              items={filteredPm}
              onEdit={(item) => {
                setPmEdit(item);
                setPmFormOpen(true);
              }}
              onDelete={(item) =>
                setDeleteTarget({ type: "pm", id: item.id, name: item.name })
              }
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <RawMaterialForm
        open={rmFormOpen}
        onClose={() => {
          setRmFormOpen(false);
          setRmEdit(null);
        }}
        editItem={rmEdit}
      />
      <RecipeForm
        open={recipeFormOpen}
        onClose={() => setRecipeFormOpen(false)}
      />
      <ProductMenuForm
        open={pmFormOpen}
        onClose={() => {
          setPmFormOpen(false);
          setPmEdit(null);
        }}
        editItem={pmEdit}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the item. Historical data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                deleteTarget &&
                deleteMutation.mutate({
                  type: deleteTarget.type,
                  id: deleteTarget.id,
                })
              }>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
