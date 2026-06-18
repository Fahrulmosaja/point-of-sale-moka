'use client';

import { useState, useMemo } from 'react';
import { Order, OrderStatus } from '@/types/order.types';
import { ORDERS } from '@/constants/orders.constant';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { OnlineOrderFilters } from './online-order-filters';
import { OnlineOrderCard } from './online-order-card';
import { OnlineOrderDetailSheet } from './online-order-detail-sheet';

type FilterValue = 'all' | OrderStatus;

const ONLINE_ORDERS = ORDERS.filter((o) => o.type === 'online');

export function OnlineOrderList() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const counts = useMemo<Record<FilterValue, number>>(() => {
    return {
      all: ONLINE_ORDERS.length,
      pending: ONLINE_ORDERS.filter((o) => o.status === 'pending').length,
      completed: ONLINE_ORDERS.filter((o) => o.status === 'completed').length,
      cancelled: ONLINE_ORDERS.filter((o) => o.status === 'cancelled').length,
      refunded: ONLINE_ORDERS.filter((o) => o.status === 'refunded').length,
    };
  }, []);

  const filteredOrders = useMemo(() => {
    let result = ONLINE_ORDERS;

    if (activeFilter !== 'all') {
      result = result.filter((o) => o.status === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.invoiceNumber.toLowerCase().includes(q) ||
          o.paymentMethod.toLowerCase().includes(q)
      );
    }

    // Pending first
    return [...result].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [activeFilter, searchQuery]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <OnlineOrderFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoice or payment..."
            className="pl-8 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OnlineOrderCard
              key={order.id}
              order={order}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No online orders found.</p>
        </div>
      )}

      {/* Detail Drawer */}
      <OnlineOrderDetailSheet
        order={selectedOrder}
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
