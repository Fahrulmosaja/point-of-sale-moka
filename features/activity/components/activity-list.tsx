'use client';

import { useState, useMemo } from 'react';
import { useOrdersStore } from '@/stores/orders-store';
import { Order } from '@/types/order.types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ActivityTable } from './activity-table';
import { ActivityDetailModal } from './activity-detail-modal';

export function ActivityList() {
  const { orders, refundOrder } = useOrdersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const lowerQuery = searchQuery.toLowerCase();
    return orders.filter(
      (order) =>
        order.invoiceNumber.toLowerCase().includes(lowerQuery) ||
        order.cashierName.toLowerCase().includes(lowerQuery) ||
        order.paymentMethod.toLowerCase().includes(lowerQuery)
    );
  }, [orders, searchQuery]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleRefund = (orderId: string) => {
    refundOrder(orderId);
    // Keep the modal open but update the displayed order's status
    setSelectedOrder((prev) => (prev ? { ...prev, status: 'refunded' as const } : null));
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

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

      <ActivityTable orders={filteredOrders} onViewDetail={handleViewDetail} />

      <ActivityDetailModal
        order={selectedOrder}
        open={modalOpen}
        onClose={handleCloseModal}
        onRefund={handleRefund}
      />
    </div>
  );
}
