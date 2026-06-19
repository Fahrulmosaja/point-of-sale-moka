"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { RawMaterial } from "@/types/raw-material.types";
import { ProductMenu } from "@/types/product-menu.types";
import { api } from "@/lib/api";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RawMaterialsTable } from "./raw-materials-table";
import { ProductMenuTable } from "./product-menu-table";
import { RawMaterialForm } from "./raw-material-form";
import { RecipeForm } from "./recipe-form";
import { ProductMenuForm } from "./product-menu-form";
import { InventoryControls, StockFilter } from "./inventory-controls";
import { InventoryDeleteDialog } from "./inventory-delete-dialog";
import { InventoryTabLoading } from "./inventory-tab-loading";

type DeleteTarget = { type: "rm" | "pm"; id: string; name: string };

export function InventoryOverview() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"raw-materials" | "product-menus">(
    "raw-materials",
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockFilter>("all");

  const [rmFormOpen, setRmFormOpen] = useState(false);
  const [rmEdit, setRmEdit] = useState<RawMaterial | null>(null);
  const [recipeFormOpen, setRecipeFormOpen] = useState(false);
  const [pmFormOpen, setPmFormOpen] = useState(false);
  const [pmEdit, setPmEdit] = useState<ProductMenu | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const { data: rawMaterials = [], isLoading: rmLoading } = useQuery<RawMaterial[]>({
    queryKey: ["raw-materials"],
    queryFn: () => api.get("/raw-materials").then((r) => r.data),
  });

  const { data: productMenus = [], isLoading: pmLoading } = useQuery<ProductMenu[]>({
    queryKey: ["product-menus"],
    queryFn: () => api.get("/product-menus").then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: "rm" | "pm"; id: string }) =>
      type === "rm"
        ? api.delete(`/raw-materials/${id}`)
        : api.delete(`/product-menus/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["raw-materials"] });
      queryClient.invalidateQueries({ queryKey: ["product-menus"] });
      toast.success("Deleted successfully");
      setDeleteTarget(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filteredRm = rawMaterials.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredPm = productMenus.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || item.stockStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const rmAlerts = rawMaterials.filter((i) => i.status !== "healthy").length;
  const pmAlerts = productMenus.filter((i) => i.stockStatus !== "healthy").length;
  const filteredCount =
    activeTab === "raw-materials" ? filteredRm.length : filteredPm.length;

  return (
    <>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <InventoryControls
          activeTab={activeTab}
          rmAlerts={rmAlerts}
          pmAlerts={pmAlerts}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          filteredCount={filteredCount}
          onAddRm={() => {
            setRmEdit(null);
            setRmFormOpen(true);
          }}
          onAddRecipe={() => setRecipeFormOpen(true)}
          onAddPm={() => {
            setPmEdit(null);
            setPmFormOpen(true);
          }}
        />

        <TabsContent value="raw-materials" className="mt-0">
          {rmLoading ? (
            <InventoryTabLoading />
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

        <TabsContent value="product-menus" className="mt-0">
          {pmLoading ? (
            <InventoryTabLoading />
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

      <RawMaterialForm
        open={rmFormOpen}
        onClose={() => {
          setRmFormOpen(false);
          setRmEdit(null);
        }}
        editItem={rmEdit}
      />
      <RecipeForm open={recipeFormOpen} onClose={() => setRecipeFormOpen(false)} />
      <ProductMenuForm
        open={pmFormOpen}
        onClose={() => {
          setPmFormOpen(false);
          setPmEdit(null);
        }}
        editItem={pmEdit}
      />

      <InventoryDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        targetName={deleteTarget?.name}
        onConfirm={() =>
          deleteTarget &&
          deleteMutation.mutate({ type: deleteTarget.type, id: deleteTarget.id })
        }
      />
    </>
  );
}
