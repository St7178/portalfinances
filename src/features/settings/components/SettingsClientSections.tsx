"use client";

import { Bell, Check, LogOut, Moon, Pencil, Sun, SunMoon, Wallet, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toggleEmailNotifications } from "@/features/settings/actions/toggle-email-notifications";
import { updateMonthlySalary } from "@/features/settings/actions/update-monthly-salary";
import { CURRENCY, EXPENSE_CATEGORIES, LOCALE } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: SunMoon },
];

interface SettingsClientSectionsProps {
  initialNotifyEmail: boolean;
  initialMonthlySalary: number;
  suggestedSalary: number;
}

export function SettingsClientSections({
  initialNotifyEmail,
  initialMonthlySalary,
  suggestedSalary,
}: SettingsClientSectionsProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([...EXPENSE_CATEGORIES]);
  const [newCategory, setNewCategory] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(initialNotifyEmail);
  const [monthlySalary, setMonthlySalary] = useState(initialMonthlySalary);
  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState(
    String(initialMonthlySalary || suggestedSalary || ""),
  );
  const [savingSalary, setSavingSalary] = useState(false);

  useEffect(() => setMounted(true), []);

  function addCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
  }

  function handleNotifyToggle(checked: boolean) {
    setNotifyEmail(checked);
    void toggleEmailNotifications(checked);
  }

  async function handleSaveSalary() {
    const amount = Number(salaryInput);
    if (!Number.isFinite(amount) || amount < 0) {
      toast.error("Ingresa un valor válido");
      return;
    }
    setSavingSalary(true);
    const result = await updateMonthlySalary(amount);
    setSavingSalary(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setMonthlySalary(amount);
    setEditingSalary(false);
    toast.success("Salario actualizado", {
      description: result.demo
        ? "Modo demo: conecta Firebase para guardar datos reales."
        : undefined,
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Elige cómo se ve la aplicación.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs font-medium transition-colors",
                  mounted && theme === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                <opt.icon className="size-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salario mensual</CardTitle>
          <CardDescription>
            Un valor fijo que se asume cada mes hasta que lo actualices — no necesitas registrar un
            ingreso nuevo cada vez que te paguen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {editingSalary ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                autoFocus
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveSalary()}
                placeholder="0"
                className="max-w-48"
              />
              <Button size="icon" onClick={handleSaveSalary} disabled={savingSalary}>
                <Check className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setEditingSalary(false);
                  setSalaryInput(String(monthlySalary || suggestedSalary || ""));
                }}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Wallet className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium tabular-nums">
                    {monthlySalary > 0 ? formatCurrency(monthlySalary) : "Sin configurar"}
                  </p>
                  {monthlySalary === 0 && suggestedSalary > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Sugerencia según tu último ingreso: {formatCurrency(suggestedSalary)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => setEditingSalary(true)}
              >
                <Pencil className="size-3.5" />
                Editar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Recordatorios por correo de tus gastos fijos próximos a vencer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Bell className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Recordatorios por correo</p>
                <p className="text-xs text-muted-foreground">
                  Un correo el día antes de que venza un gasto fijo activo.
                </p>
              </div>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={handleNotifyToggle} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías de gastos</CardTitle>
          <CardDescription>
            Personaliza las categorías disponibles al agregar un gasto.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1.5">
                {category}
                <button
                  type="button"
                  onClick={() => setCategories((prev) => prev.filter((c) => c !== category))}
                  className="rounded-full p-0.5 hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="Nueva categoría"
              className="max-w-56"
            />
            <Button variant="outline" onClick={addCategory}>
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Región</CardTitle>
          <CardDescription>Moneda y formato usados en toda la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Moneda</p>
            <p className="font-medium">{CURRENCY}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Formato regional</p>
            <p className="font-medium">{LOCALE}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Button
            variant="destructive"
            className="gap-1.5"
            onClick={() => import("next-auth/react").then(({ signOut }) => signOut())}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
