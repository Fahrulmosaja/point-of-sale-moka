'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInventoryStore } from '@/stores/inventory-store';
import { InventoryItem } from '@/types/inventory.types';
import { Bell, AlertTriangle, AlertCircle, Package, ArrowRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function LowStockNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const items = useInventoryStore((state) => state.items);

  const alertItems = items.filter(
    (item) => item.status === 'low_stock' || item.status === 'out_of_stock'
  );

  const outOfStockCount = alertItems.filter((i) => i.status === 'out_of_stock').length;
  const lowStockCount = alertItems.filter((i) => i.status === 'low_stock').length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusIcon = (item: InventoryItem) => {
    if (item.status === 'out_of_stock') {
      return <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />;
    }
    return <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />;
  };

  const getTypeLabel = (item: InventoryItem) => {
    return item.type === 'raw_material' ? 'Raw Material' : 'Product';
  };

  const handleGoToInventory = (tab?: string) => {
    setIsOpen(false);
    if (tab) {
      router.push(`/inventory?tab=${tab}`);
    } else {
      router.push('/inventory');
    }
  };

  if (alertItems.length === 0) {
    return (
      <div className="relative">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`${alertItems.length} stock alerts`}
      >
        <Bell className="h-5 w-5" />
        {/* Notification Badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground leading-none">
          {alertItems.length > 9 ? '9+' : alertItems.length}
        </span>
        {/* Pulse ring */}
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 animate-ping rounded-full bg-destructive opacity-30" />
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 z-50 rounded-xl border bg-popover shadow-xl overflow-hidden"
          role="dialog"
          aria-label="Stock alerts"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-sm">Stock Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              {outOfStockCount > 0 && (
                <Badge variant="destructive" className="text-[10px] h-5">
                  {outOfStockCount} Out
                </Badge>
              )}
              {lowStockCount > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] h-5 border-amber-500 text-amber-600"
                >
                  {lowStockCount} Low
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Item List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
            {/* Out of stock first */}
            {alertItems
              .sort((a, b) => {
                const order = { out_of_stock: 0, low_stock: 1, healthy: 2 };
                return order[a.status] - order[b.status];
              })
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors"
                >
                  {getStatusIcon(item)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(item)} ·{' '}
                      <span
                        className={
                          item.status === 'out_of_stock'
                            ? 'text-destructive font-medium'
                            : 'text-amber-600 font-medium'
                        }
                      >
                        {item.status === 'out_of_stock'
                          ? 'Out of Stock'
                          : `${item.stock} ${item.unit} left`}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col gap-1 p-3 border-t bg-muted/20">
            <Button
              variant="default"
              size="sm"
              className="w-full gap-2 justify-center"
              onClick={() => handleGoToInventory()}
            >
              View Full Inventory
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleGoToInventory('product')}
              >
                Products
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleGoToInventory('raw_material')}
              >
                Raw Materials
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
