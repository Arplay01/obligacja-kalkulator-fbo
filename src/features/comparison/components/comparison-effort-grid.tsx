"use client";

import { type CSSProperties, useEffect, useState } from "react";
import type {
  ComparisonEffortRow,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import {
  DecisionMeter,
  formatDecisionLabel,
} from "@/features/comparison/components/decision-meter";
import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import { formatMoneyRounded } from "@/features/calculator/lib/formatters";

type ComparisonEffortGridProps = {
  rows: ComparisonEffortRow[];
  displayMode: ComparisonValueMode;
};

export function ComparisonEffortGrid({
  rows,
  displayMode,
}: ComparisonEffortGridProps) {
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsReadyToAnimate(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const maxProfit = Math.max(
    ...rows.map((row) => Math.max(Math.abs(row.profit), 1)),
    1,
  );

  return (
    <section className="comparison-effort" data-effort-section>
      <div className="comparison-effort__header">
        <div>
          <p className="micro-label">Wysiłek vs wynik</p>
          <h2 className="section-title">Więcej decyzji nie daje tu lepszego wyniku</h2>
        </div>
        <p className="helper-text comparison-effort__helper">
          Im dłuższy horyzont, tym mocniej rozjeżdża się wynik i liczba decyzji.
        </p>
      </div>

      <div className="comparison-effort__rows">
        {rows.map((row, index) => {
          const profitWidth = `${(Math.abs(row.profit) / maxProfit) * 100}%`;
          const animatedProfit = isReadyToAnimate ? row.profit : 0;

          return (
            <article
              key={row.id}
              className={`comparison-effort__row${row.isBest ? " comparison-effort__row--best" : ""}`}
              data-effort-row={row.id}
              style={
                {
                  "--comparison-effort-accent": row.color,
                  "--comparison-effort-delay": `${index * 70}ms`,
                } as CSSProperties & {
                  "--comparison-effort-accent": string;
                  "--comparison-effort-delay": string;
                }
              }
            >
              <div className="comparison-effort__instrument">
                <strong>{row.label}</strong>
                <span>{row.isBest ? "Najwyższy wynik w tym ustawieniu" : "Aktywna ścieżka"}</span>
              </div>

              <div className="comparison-effort__metric comparison-effort__metric--profit">
                <div className="comparison-effort__metric-head">
                  <span>Wynik</span>
                  <AnimatedNumberText
                    tag="strong"
                    className="comparison-effort__metric-value"
                    value={animatedProfit}
                    format={(value) => formatMoneyRounded(value, { signed: true })}
                  />
                </div>
                <div className="comparison-effort__bar-track">
                  <span
                    className="comparison-effort__bar-fill"
                    style={{
                      width: isReadyToAnimate ? profitWidth : "0%",
                      backgroundColor: row.color,
                    }}
                  />
                </div>
                <span className="comparison-effort__caption">
                  {displayMode === "real" ? "Realna zmiana" : "Zysk netto"}
                </span>
              </div>

              <div className="comparison-effort__metric comparison-effort__metric--decisions">
                <div className="comparison-effort__metric-head">
                  <span>Decyzje</span>
                  <strong>{formatDecisionLabel(row.decisions)}</strong>
                </div>
                <DecisionMeter count={row.decisions} className="comparison-effort__meter" />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
