import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../../src/features/calculator/styles/calculator.css";
import "../../src/features/comparison-legacy/styles/comparison.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-calculator",
});

type ComparisonLegacyLayoutProps = {
  children: ReactNode;
};

export default function ComparisonLegacyLayout({
  children,
}: ComparisonLegacyLayoutProps) {
  return (
    <div
      className={`${plusJakartaSans.className} ${plusJakartaSans.variable} calculator-route comparison-legacy-route`}
    >
      {children}
    </div>
  );
}
