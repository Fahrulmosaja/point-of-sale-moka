"use client";

import { useState, useMemo, useEffect } from "react";
import { useSalesStore } from "@/stores/sales-store";
import { Sale } from "@/types/sale.types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ActivityTable } from "./activity-table";
import { ActivityDetailModal } from "./activity-detail-modal";

export function ActivityList() {
  const { sales, fetchSales, isLoading } = useSalesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const filteredSales = useMemo(() => {
    if (!searchQuery) return sales;
    const q = searchQuery.toLowerCase();
    return sales.filter(
      (s) =>
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.cashierName.toLowerCase().includes(q) ||
        s.paymentMethod.toLowerCase().includes(q),
    );
  }, [sales, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by invoice, cashier, payment..."
          className="pl-8 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <ActivityTable
          sales={filteredSales}
          onViewDetail={(sale) => {
            setSelectedSale(sale);
            setModalOpen(true);
          }}
        />
      )}

      <ActivityDetailModal
        sale={selectedSale}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSale(null);
        }}
      />
    </div>
  );
}
