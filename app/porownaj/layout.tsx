import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../../src/features/calculator/styles/calculator.css";
import "../../src/features/comparison/styles/comparison.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-calculator",
});

type ComparisonLayoutProps = {
  children: ReactNode;
};

export default function ComparisonLayout({
  children,
}: ComparisonLayoutProps) {
  return (
    <div
      className={`${plusJakartaSans.className} ${plusJakartaSans.variable} calculator-route comparison-route`}
    >
      {children}
    </div>
  );
}
