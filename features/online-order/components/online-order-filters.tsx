'use client';

import { OrderStatus } from '@/types/order.types';
import { cn } from '@/lib/utils';

type FilterValue = 'all' | OrderStatus;

interface OnlineOrderFiltersProps {
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  counts: Record<FilterValue, number>;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function OnlineOrderFilters({ activeFilter, onFilterChange, counts }: OnlineOrderFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
            activeFilter === filter.value
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground'
          )}
        >
          {filter.label}
          <span
            className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold',
              activeFilter === filter.value
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {counts[filter.value] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
