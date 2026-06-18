import { OnlineOrderList } from "@/features/online-order/components/online-order-list";

export default function OnlineOrderPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Online Order</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track incoming online orders. Pending orders are
          prioritized at the top.
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <OnlineOrderList />
      </div>
    </div>
  );
}
