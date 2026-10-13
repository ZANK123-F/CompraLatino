import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "CompraLatino",
  description: "Compra en YAuctions Japon desde Latinoamerica",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
