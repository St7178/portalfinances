import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LoginBackdrop } from "@/components/auth/LoginBackdrop";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { signIn } from "@/lib/auth/config";

const DEMO_MODE = !process.env.AUTH_GOOGLE_ID;

export default function LoginPage() {
  return (
    <main className="dark relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <LoginBackdrop />

      <div className="relative w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={56}
            height={56}
            className="size-14 rounded-2xl shadow-lg shadow-primary/25"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">{siteConfig.name}</h1>
            <p className="text-sm text-muted-foreground">{siteConfig.tagline}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card/70 p-6 shadow-xl shadow-black/20 backdrop-blur supports-backdrop-filter:bg-card/60">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button type="submit" size="lg" className="w-full gap-2" disabled={DEMO_MODE}>
              <GoogleIcon className="size-4" />
              Continuar con Google
            </Button>
          </form>

          {DEMO_MODE && (
            <>
              <p className="text-center text-xs text-muted-foreground">
                Configura <code className="text-foreground">AUTH_GOOGLE_ID</code> para activar el
                inicio de sesión — ver <code className="text-foreground">SETUP.md</code>.
              </p>
              <Button asChild variant="secondary" size="lg" className="w-full gap-2">
                <Link href="/">
                  <Sparkles className="size-4" />
                  Explorar en modo demo
                </Link>
              </Button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Acceso restringido a correos autorizados.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a10.99 10.99 0 0 0-9.82 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
