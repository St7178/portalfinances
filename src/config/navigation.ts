import {
  Calendar,
  LayoutDashboard,
  LineChart,
  PiggyBank,
  Receipt,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";
import type { Route } from "next";

export interface NavItem {
  title: string;
  href: Route;
  icon: typeof LayoutDashboard;
  shortcut?: string;
}

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/" as Route, icon: LayoutDashboard, shortcut: "G D" },
  { title: "Gastos", href: "/expenses" as Route, icon: Receipt, shortcut: "G E" },
  { title: "Ingresos", href: "/income" as Route, icon: Wallet, shortcut: "G I" },
  { title: "Ahorros", href: "/savings" as Route, icon: PiggyBank, shortcut: "G S" },
  { title: "Calendario", href: "/calendar" as Route, icon: Calendar, shortcut: "G C" },
  { title: "Estadísticas", href: "/analytics" as Route, icon: LineChart, shortcut: "G A" },
  { title: "Asesor IA", href: "/ai" as Route, icon: Sparkles, shortcut: "G X" },
];

export const bottomNav: NavItem[] = [
  { title: "Configuración", href: "/settings" as Route, icon: Settings },
];
