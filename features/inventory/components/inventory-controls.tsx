"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { InventoryType } from "@/types/inventory.types";
import { StatusFilter } from "../hooks/use-inventory-filters";

interface InventoryControlsProps {
  activeTab: InventoryType;
  handleTabChange: (value: string) => void;
  counts: {
    all: number;
    healthy: number;
    low_stock: number;
    out_of_stock: number;
  };
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function InventoryControls({
  activeTab,
  handleTabChange,
  counts,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: InventoryControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      {/* Type Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full sm:w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product" className="gap-2">
            Product Menu
            {counts.low_stock + counts.out_of_stock > 0 &&
              activeTab !== "product" && (
                <Badge
                  variant="destructive"
                  className="h-4 min-w-4 px-1 text-[10px] leading-none">
                  {counts.low_stock + counts.out_of_stock}
                </Badge>
              )}
          </TabsTrigger>
          <TabsTrigger value="raw_material" className="gap-2">
            Raw Material
            {counts.low_stock + counts.out_of_stock > 0 &&
              activeTab !== "raw_material" && (
                <Badge
                  variant="destructive"
                  className="h-4 min-w-4 px-1 text-[10px] leading-none">
                  {counts.low_stock + counts.out_of_stock}
                </Badge>
              )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + Status Filter */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger
            className="w-40 shrink-0 bg-background"
            id="status-filter">
            <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                All Status
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  {counts.all}
                </Badge>
              </span>
            </SelectItem>
            <SelectItem value="healthy">
              <span className="flex items-center gap-2">
                Healthy
                <Badge
                  variant="secondary"
                  className="h-4 px-1.5 text-[10px] text-emerald-600">
                  {counts.healthy}
                </Badge>
              </span>
            </SelectItem>
            <SelectItem value="low_stock">
              <span className="flex items-center gap-2">
                Low Stock
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] border-amber-500 text-amber-600">
                  {counts.low_stock}
                </Badge>
              </span>
            </SelectItem>
            <SelectItem value="out_of_stock">
              <span className="flex items-center gap-2">
                Out of Stock
                <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">
                  {counts.out_of_stock}
                </Badge>
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
