"use client";

import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import {
  formatHoldingPeriodLabel,
  formatMoneyRounded,
} from "@/features/calculator/lib/formatters";

type MobileResultDockProps = {
  netProfit: number;
  termMonths: number;
};

export function MobileResultDock({
  netProfit,
  termMonths,
}: MobileResultDockProps) {
  const toneClass =
    netProfit >= 0
      ? "mobile-result-dock--positive"
      : "mobile-result-dock--negative";
  const netProfitLabel = `Szacowany zysk netto ${formatHoldingPeriodLabel(termMonths)}`;

  return (
    <div
      className={`mobile-result-dock ${toneClass}`}
      aria-hidden="true"
      data-mobile-result-dock
    >
      <span className="mobile-result-dock__label">{netProfitLabel}</span>
      <AnimatedNumberText
        tag="p"
        className="mobile-result-dock__value"
        value={netProfit}
        animateOnMount
        data-mobile-result-dock-value
        format={(value) => formatMoneyRounded(value, { signed: true })}
      />
    </div>
  );
}
