// app/layout.tsx
"use client";

import "../styles/globals.css";

export const metadata = {
  title: "Inventario de Sistemas",
  description: "Gestión de inventario con Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

