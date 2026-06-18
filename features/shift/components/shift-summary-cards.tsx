import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ShiftData } from '@/constants/shift.constant';

interface ShiftSummaryCardsProps {
  shift: ShiftData;
}

export function ShiftSummaryCards({ shift }: ShiftSummaryCardsProps) {
  const cashTotal = shift.paymentBreakdown.find(p => p.method === 'Cash')?.amount || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Transactions
          </CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{shift.totalTransactions}</div>
          <p className="text-xs text-muted-foreground mt-1">orders processed this shift</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(shift.totalRevenue)}</div>
          <p className="text-xs text-muted-foreground mt-1">gross revenue this shift</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cash Drawer
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatCurrency(shift.cashDrawerStart + cashTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            opened with {formatCurrency(shift.cashDrawerStart)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
