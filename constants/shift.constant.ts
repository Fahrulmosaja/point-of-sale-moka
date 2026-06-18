export interface ShiftPaymentBreakdown {
  method: string;
  amount: number;
  count: number;
}

export interface ShiftData {
  id: string;
  cashierName: string;
  startTime: string;
  endTime: string | null;
  totalTransactions: number;
  totalRevenue: number;
  cashDrawerStart: number;
  paymentBreakdown: ShiftPaymentBreakdown[];
}

export const CURRENT_SHIFT: ShiftData = {
  id: 'shift-001',
  cashierName: 'Jane Doe',
  startTime: new Date(
    new Date().setHours(8, 0, 0, 0)
  ).toISOString(),
  endTime: null, // Active shift
  totalTransactions: 24,
  totalRevenue: 1_847_500,
  cashDrawerStart: 500_000,
  paymentBreakdown: [
    { method: 'Cash', amount: 643_000, count: 8 },
    { method: 'QRIS', amount: 712_500, count: 9 },
    { method: 'Gopay', amount: 312_000, count: 4 },
    { method: 'OVO', amount: 180_000, count: 3 },
  ],
};

export const PAST_SHIFTS: ShiftData[] = [
  {
    id: 'shift-000',
    cashierName: 'John Smith',
    startTime: new Date(
      new Date(Date.now() - 86400000).setHours(8, 0, 0, 0)
    ).toISOString(),
    endTime: new Date(
      new Date(Date.now() - 86400000).setHours(16, 0, 0, 0)
    ).toISOString(),
    totalTransactions: 31,
    totalRevenue: 2_310_000,
    cashDrawerStart: 500_000,
    paymentBreakdown: [
      { method: 'Cash', amount: 820_000, count: 10 },
      { method: 'QRIS', amount: 950_000, count: 12 },
      { method: 'Gopay', amount: 390_000, count: 6 },
      { method: 'OVO', amount: 150_000, count: 3 },
    ],
  },
];
