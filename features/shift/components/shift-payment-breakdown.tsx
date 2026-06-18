import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { ShiftData } from '@/constants/shift.constant';

interface ShiftPaymentBreakdownProps {
  shift: ShiftData;
}

export function ShiftPaymentBreakdown({ shift }: ShiftPaymentBreakdownProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Payment Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {shift.paymentBreakdown.map((item, idx) => (
          <div key={item.method}>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{item.method}</span>
                <Badge variant="secondary" className="text-xs">
                  {item.count} orders
                </Badge>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
            </div>
            {idx < shift.paymentBreakdown.length - 1 && <Separator />}
          </div>
        ))}
        <Separator className="mt-1 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">Total</span>
          <span className="text-sm font-bold">{formatCurrency(shift.totalRevenue)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
