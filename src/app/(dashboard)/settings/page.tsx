import { SettingsAppearance } from "@/features/settings/components/settings-appearance";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Settings | Moka POS",
  description: "Manage your Moka POS preferences.",
};

export default function SettingsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your Moka POS preferences.</p>
      </div>

      <div className="flex-1 overflow-auto max-w-3xl">
        <div className="flex flex-col gap-8">
          <SettingsAppearance />
          <Separator />

          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">Preferences</h2>
            <p className="text-sm text-muted-foreground">
              Additional preferences will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
