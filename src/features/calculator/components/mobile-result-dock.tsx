"use client";

import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import { formatMoney } from "@/features/calculator/lib/formatters";

type MobileResultDockProps = {
  netProfit: number;
};

export function MobileResultDock({ netProfit }: MobileResultDockProps) {
  const toneClass =
    netProfit >= 0
      ? "mobile-result-dock--positive"
      : "mobile-result-dock--negative";

  return (
    <div
      className={`mobile-result-dock ${toneClass}`}
      aria-hidden="true"
      data-mobile-result-dock
    >
      <span className="mobile-result-dock__label">Twój zysk netto</span>
      <AnimatedNumberText
        tag="p"
        className="mobile-result-dock__value"
        value={netProfit}
        animateOnMount
        data-mobile-result-dock-value
        format={(value) => formatMoney(value, { signed: true })}
      />
    </div>
  );
}
