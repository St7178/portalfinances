"use client";

import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { AlertsPopover } from "@/components/layout/AlertsPopover";
import { CommandPaletteTrigger } from "@/components/layout/CommandPalette";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bottomNav, mainNav } from "@/config/navigation";
import { useUIStore } from "@/store/ui.store";
import type { AlertRule } from "@/types";

interface HeaderProps {
  user: { name: string | null; email: string | null; image: string | null } | null;
  alerts: AlertRule[];
}

export function Header({ user, alerts }: HeaderProps) {
  const pathname = usePathname();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const title = [...mainNav, ...bottomNav].find((item) => item.href === pathname)?.title ?? "";
  const isDemo = user?.email === "modo-demo@finanzas.app";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur-md md:px-8">
      <MobileNav />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>
        {isDemo && (
          <Badge
            variant="outline"
            className="hidden shrink-0 border-warning/40 text-warning sm:inline-flex"
          >
            Modo demo
          </Badge>
        )}
      </div>

      <div className="hidden md:block">
        <CommandPaletteTrigger />
      </div>

      <Button size="sm" className="gap-1.5" onClick={() => openQuickAdd("expense")}>
        <Plus className="size-4" />
        <span className="hidden sm:inline">Agregar</span>
      </Button>

      <AlertsPopover alerts={alerts} />
      <ThemeToggle />
    </header>
  );
}
