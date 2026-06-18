"use client";

import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation.constant";
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosStore } from "@/stores/pos-store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LowStockNotification } from "@/components/low-stock-notification";

export function Header() {
  const pathname = usePathname();
  const isPosPage = pathname.startsWith("/point-of-sale");

  const currentNav = NAVIGATION.find((nav) => pathname.startsWith(nav.href));
  const pageTitle = currentNav ? currentNav.name : "BrewFlow POS";

  const { searchQuery, setSearchQuery } = usePosStore();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 justify-between">
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        {isPosPage ? (
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        ) : (
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Low Stock Notification Bell — always visible */}
        <LowStockNotification />

        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
