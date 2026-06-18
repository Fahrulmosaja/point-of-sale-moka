"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: {
  value: ThemeOption;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "light",
    label: "Light",
    description: "Clean and bright workspace.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easier on the eyes at night.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follows your OS preference.",
    icon: Monitor,
  },
];

export function SettingsAppearance() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const handleSelect = (value: ThemeOption) => {
    setTheme(value);
    toast.success(`Theme changed to ${value}`, {
      description: THEME_OPTIONS.find((o) => o.value === value)?.description,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how BrewFlow POS looks on this device.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = mounted && theme === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "group relative flex flex-col items-start gap-4 rounded-xl border p-5 text-left",
                "transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
              )}>
              {/* Check mark */}
              {isActive && (
                <span className="absolute top-3.5 right-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </span>
              )}

              {/* Preview mockup */}
              <div
                className={cn(
                  "w-full h-20 rounded-lg border overflow-hidden flex flex-col",
                  option.value === "light" ? "bg-white border-gray-200" : "",
                  option.value === "dark" ? "bg-zinc-900 border-zinc-700" : "",
                  option.value === "system"
                    ? "bg-gradient-to-br from-white to-zinc-900 border-border"
                    : "",
                )}>
                {/* Mockup sidebar strip */}
                <div className="flex h-full">
                  <div
                    className={cn(
                      "w-8 h-full flex flex-col gap-1.5 p-1.5",
                      option.value === "light" ? "bg-gray-100" : "",
                      option.value === "dark" ? "bg-zinc-800" : "",
                      option.value === "system"
                        ? "bg-gray-100/50 backdrop-blur"
                        : "",
                    )}>
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 rounded-full",
                          option.value === "light"
                            ? "bg-gray-300"
                            : "bg-zinc-600",
                          i === 0 && "w-full",
                          i === 1 && "w-3/4",
                          i === 2 && "w-full",
                          i === 3 && "w-2/3",
                        )}
                      />
                    ))}
                  </div>
                  {/* Mockup content area */}
                  <div className="flex-1 p-2 flex flex-col gap-1.5">
                    <div
                      className={cn(
                        "h-2 rounded w-3/4",
                        option.value === "light"
                          ? "bg-gray-200"
                          : "bg-zinc-700",
                      )}
                    />
                    <div
                      className={cn(
                        "h-2 rounded w-1/2",
                        option.value === "light"
                          ? "bg-gray-100"
                          : "bg-zinc-800",
                      )}
                    />
                    <div className={cn("mt-1 grid grid-cols-3 gap-1", "")}>
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-6 rounded",
                            option.value === "light"
                              ? "bg-gray-100 border border-gray-200"
                              : "bg-zinc-800 border border-zinc-700",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isActive && "text-primary",
                    )}>
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
