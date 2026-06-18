import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Clock, LogOut } from "lucide-react";
import { formatTime, formatDuration } from "@/lib/date-utils";
import { ShiftData } from "@/constants/shift.constant";

interface ShiftHeaderProps {
  shift: ShiftData;
  shiftEnded: boolean;
  onEndShift: () => void;
}

export function ShiftHeader({
  shift,
  shiftEnded,
  onEndShift,
}: ShiftHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{shift.cashierName}</span>
            {!shiftEnded ? (
              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 border text-xs">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Ended
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
            <Clock className="h-3.5 w-3.5" />
            Started at {formatTime(shift.startTime)}
            {!shiftEnded && (
              <span className="text-muted-foreground/60">
                · {formatDuration(shift.startTime)} elapsed
              </span>
            )}
          </div>
        </div>
      </div>
      {!shiftEnded && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2 shrink-0">
              <LogOut className="h-4 w-4" />
              End Shift
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End current shift?</AlertDialogTitle>
              <AlertDialogDescription>
                This will close the shift for{" "}
                <strong>{shift.cashierName}</strong>. All transactions will be
                saved. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onEndShift}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                End Shift
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
