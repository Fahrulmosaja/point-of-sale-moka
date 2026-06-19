"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      duration={6000}
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "group/toast flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg shadow-black/30 text-sm backdrop-blur-sm",
          title: "font-semibold text-sm leading-snug",
          description: "text-xs mt-0.5 leading-relaxed opacity-80",
          closeButton:
            "absolute top-2 right-2 rounded-md opacity-60 hover:opacity-100 transition-opacity",
          icon: "mt-0.5 shrink-0",
          // Success — deep emerald, readable on dark
          success:
            "bg-[#0d2b1f] border-[#16a34a]/40 text-emerald-100 [&>[data-icon]]:text-emerald-400",
          // Warning — rich amber, high contrast on dark
          warning:
            "bg-[#2b1d06] border-[#d97706]/40 text-amber-100 [&>[data-icon]]:text-amber-400",
          // Error — deep crimson
          error:
            "bg-[#2b0a0a] border-[#dc2626]/40 text-rose-100 [&>[data-icon]]:text-rose-400",
          // Info — muted blue
          info: "bg-[#0a1a2b] border-[#3b82f6]/40 text-sky-100 [&>[data-icon]]:text-sky-400",
          // Default / loading
          default: "bg-popover border-border text-popover-foreground",
          loader: "bg-popover border-border text-popover-foreground",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--width": "360px",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
