import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kalkulator obligacji skarbowych - Finanse Bardzo Osobiste",
  description:
    "Kalkulator obligacji skarbowych dla Finanse Bardzo Osobiste.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}

