"use client";

import { Menu, Wallet2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { bottomNav, mainNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full w-72 data-[vaul-drawer-direction=left]:rounded-r-2xl">
        <DrawerHeader className="flex flex-row items-center gap-2 border-b border-border px-4 py-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet2 className="size-4" />
          </div>
          <DrawerTitle className="text-sm font-semibold">{siteConfig.name}</DrawerTitle>
        </DrawerHeader>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {[...mainNav, ...bottomNav].map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground/70 transition-colors",
                  active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
