import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../../src/features/calculator/styles/calculator.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

type CalculatorLayoutProps = {
  children: ReactNode;
};

export default function CalculatorLayout({
  children,
}: CalculatorLayoutProps) {
  return (
    <div className={`${plusJakartaSans.className} calculator-route`}>
      {children}
    </div>
  );
}

