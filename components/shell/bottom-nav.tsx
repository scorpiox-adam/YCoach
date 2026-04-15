"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Dumbbell, Salad, TrendingUp, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/training", label: "Training", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Salad },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/coach", label: "Coach", icon: Sparkles }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-nav-shell surface-panel fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between rounded-[2rem] px-2 pt-2"
      aria-label="Navigation principale"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-w-[60px] flex-1 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-2 text-[11px] font-semibold transition-colors",
              active
                ? "bg-[color:color-mix(in_oklab,oklch(var(--accent))_16%,white)] text-accent-strong"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
