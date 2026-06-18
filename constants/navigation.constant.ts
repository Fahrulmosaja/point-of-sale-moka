import {
  Home,
  Package,
  Clock,
  ShoppingBag,
  Calendar,
  Settings,
} from "lucide-react";

export const NAVIGATION = [
  {
    name: "Point of Sale",
    href: "/point-of-sale",
    icon: Home,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Activity",
    href: "/activity",
    icon: Clock,
  },
  {
    name: "Online Order",
    href: "/online-order",
    icon: ShoppingBag,
  },
  {
    name: "Shift",
    href: "/shift",
    icon: Calendar,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
