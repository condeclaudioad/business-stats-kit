import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Business Stats",
  description: "Tu negocio digital, con contexto.",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
