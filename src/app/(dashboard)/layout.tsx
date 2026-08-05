import { CommandPalette } from "@/components/layout/CommandPalette";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { QuickAddModal } from "@/features/expenses/components/QuickAddModal";
import { auth } from "@/lib/auth/config";

const DEMO_USER = {
  name: "Steven",
  email: "modo-demo@finanzas.app",
  image: null,
};

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : process.env.AUTH_GOOGLE_ID
      ? null
      : DEMO_USER;

  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 px-4 pb-16 pt-4 md:px-8 md:pb-10 md:pt-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
      <CommandPalette />
      <QuickAddModal />
    </div>
  );
}
