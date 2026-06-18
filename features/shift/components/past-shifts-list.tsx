import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatTime } from "@/lib/date-utils";
import { ShiftData } from "@/constants/shift.constant";

interface PastShiftsListProps {
  shifts: ShiftData[];
}

export function PastShiftsList({ shifts }: PastShiftsListProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">Previous Shift</h2>
      </div>
      {shifts.map((past) => (
        <Card key={past.id} className="opacity-80">
          <CardContent className="pt-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{past.cashierName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(past.startTime)} –{" "}
                  {past.endTime ? formatTime(past.endTime) : "—"}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Ended
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Transactions</p>
                <p className="font-semibold">{past.totalTransactions}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Revenue</p>
                <p className="font-semibold">
                  {formatCurrency(past.totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
