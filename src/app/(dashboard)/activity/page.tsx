import { ActivityList } from "@/features/activity/components/activity-list";

export const metadata = {
  title: "Activity | Moka POS",
  description:
    "View and manage your transaction history. Search for past orders, view details, and process refunds with ease.",
};

export default function ActivityPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground mt-2">
          Search and manage past transactions. Click on any order to view details or
          process a refund.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <ActivityList />
      </div>
    </div>
  );
}
