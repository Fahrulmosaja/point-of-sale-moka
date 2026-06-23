"use client";

import { Recipe } from "@/types/recipe.types";
import { ProductMenu } from "@/types/product-menu.types";
import { formatDate } from "@/lib/date-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryTableActions } from "./inventory-table-actions";
import { Link2, Link2Off } from "lucide-react";

interface RecipeTableProps {
  items: Recipe[];
  productMenus: ProductMenu[];
  onEdit?: (item: Recipe) => void;
  onDelete?: (item: Recipe) => void;
}

export function RecipeTable({ items, productMenus, onEdit, onDelete }: RecipeTableProps) {
  const linkedMenuMap = new Map<string, string[]>();
  for (const pm of productMenus) {
    if (!linkedMenuMap.has(pm.recipeId)) {
      linkedMenuMap.set(pm.recipeId, []);
    }
    linkedMenuMap.get(pm.recipeId)!.push(pm.name);
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {/* {(onEdit || onDelete) && <TableHead className="w-20" />} */}
            <TableHead>Action</TableHead>
            <TableHead>Recipe Name</TableHead>
            <TableHead className="text-center">Ingredients</TableHead>
            <TableHead>Raw Materials Used</TableHead>
            <TableHead>Linked Product Menu</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No recipes found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              const linkedMenus = linkedMenuMap.get(item.id) ?? [];
              const isLinked = linkedMenus.length > 0;

              return (
                <TableRow key={item.id}>
                  <InventoryTableActions
                    onEdit={onEdit ? () => onEdit(item) : undefined}
                    onDelete={onDelete ? () => onDelete(item) : undefined}
                  />
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="secondary" className="tabular-nums">
                      {item.ingredients.length}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {item.ingredients.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.ingredients.map((ing) => (
                          <Badge
                            key={ing.id}
                            variant="outline"
                            className="text-[10px] py-0 h-5 font-normal text-muted-foreground">
                            {ing.rawMaterialName} ({ing.quantity}
                            {ing.unit})
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isLinked ? (
                      <div className="flex flex-wrap gap-1">
                        {linkedMenus.map((name) => (
                          <Badge
                            key={name}
                            variant="outline"
                            className="text-[10px] py-0 h-5 font-normal border-emerald-500 text-emerald-600 dark:text-emerald-400">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {isLinked ? (
                      <Badge
                        variant="secondary"
                        className="gap-1.5 flex items-center w-fit">
                        <Link2 className="h-3.5 w-3.5 text-emerald-500" />
                        Linked
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-muted-foreground/40 text-muted-foreground flex items-center w-fit">
                        <Link2Off className="h-3.5 w-3.5" />
                        Unlinked
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(item.updatedAt)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
