export function InventoryTabLoading() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 rounded-md bg-muted animate-pulse" />
      ))}
    </div>
  );
}
