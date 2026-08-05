export const siteConfig = {
  name: "MiCaja",
  tagline: "Tus finanzas, bajo control.",
  description: "Gestión de finanzas personales de nivel comercial.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;
