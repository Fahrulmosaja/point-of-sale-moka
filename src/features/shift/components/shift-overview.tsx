"use client";

import { useState } from "react";
import { CURRENT_SHIFT, PAST_SHIFTS } from "@/constants/shift.constant";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { ShiftHeader } from "./shift-header";
import { ShiftSummaryCards } from "./shift-summary-cards";
import { ShiftPaymentBreakdown } from "./shift-payment-breakdown";
import { PastShiftsList } from "./past-shifts-list";

export function ShiftOverview() {
  const [shiftEnded, setShiftEnded] = useState(false);
  const shift = CURRENT_SHIFT;

  const handleEndShift = () => {
    setShiftEnded(true);
    toast.success("Shift ended successfully", {
      description: `Total revenue: ${formatCurrency(shift.totalRevenue)}`,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <ShiftHeader
        shift={shift}
        shiftEnded={shiftEnded}
        onEndShift={handleEndShift}
      />

      <ShiftSummaryCards shift={shift} />

      <ShiftPaymentBreakdown shift={shift} />

      <PastShiftsList shifts={PAST_SHIFTS} />
    </div>
  );
}
