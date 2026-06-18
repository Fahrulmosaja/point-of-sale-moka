import { ShiftOverview } from '@/features/shift/components/shift-overview';

export default function ShiftPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shift</h1>
        <p className="text-muted-foreground mt-2">
          View the current shift summary and payment breakdown.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <ShiftOverview />
      </div>
    </div>
  );
}
