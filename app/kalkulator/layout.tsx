import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../../src/features/calculator/styles/calculator.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-calculator",
});

type CalculatorLayoutProps = {
  children: ReactNode;
};

export default function CalculatorLayout({
  children,
}: CalculatorLayoutProps) {
  return (
    <div
      className={`${plusJakartaSans.className} ${plusJakartaSans.variable} calculator-route`}
    >
      {children}
    </div>
  );
}
