"use client";

import { type CSSProperties, useEffect, useState } from "react";
import type {
  ComparisonEffortRow,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import {
  DecisionMeter,
} from "@/features/comparison/components/decision-meter";
import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import {
  formatInteger,
  formatMoneyRounded,
} from "@/features/calculator/lib/formatters";

type ComparisonEffortGridProps = {
  rows: ComparisonEffortRow[];
  displayMode: ComparisonValueMode;
};

function formatTimesToHandle(count: number) {
  if (count === 1) {
    return "1 raz";
  }

  return `${formatInteger(count)} razy`;
}

function getEffortDecisionNote(row: ComparisonEffortRow) {
  switch (row.id) {
    case "EDO":
      if (row.decisions === 1) {
        return "Kupujesz raz i możesz zostawić temat do końca horyzontu.";
      }

      return "Wracasz do tematu dopiero po pełnym cyklu 10 lat, więc łatwiej trzymać się planu.";
    case "COI":
      if (row.decisions === 1) {
        return "Na tym horyzoncie wystarczy jedna decyzja, ale odsetki z COI wpadają co roku na konto. Jeśli ich nie reinwestujesz, przestają pracować. Warto je dalej ulokować, np. w krótkoterminowe obligacje.";
      }

      return "Co 4 lata trzeba sprawdzić, co dalej zrobić z pieniędzmi i wybrać kolejną opcję. Do tego odsetki z COI wpadają co roku na konto - jeśli ich nie reinwestujesz, przestają pracować. Warto je dalej ulokować, np. w krótkoterminowe obligacje.";
    case "TOS":
      if (row.decisions === 1) {
        return "Na tym horyzoncie wystarczy jedna decyzja, ale przy dłuższym czasie wracasz do tematu co 3 lata.";
      }

      return "Co 3 lata wracasz do tematu, szukasz kolejnej sensownej opcji i decydujesz, gdzie przenieść środki.";
    case "DEPOSIT":
      return "Przy lokacie takie momenty wracają często - pilnujesz terminu, sprawdzasz najlepszą ofertę i często przenosisz pieniądze.";
  }
}

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
        <div className="comparison-effort__intro">
          <h2 className="section-title comparison-effort__title">
            Wynik to nie wszystko. Liczy się też, ile razy trzeba wrócić do tematu
          </h2>
          <p className="helper-text comparison-effort__helper">
            Każdy taki moment decyzji to: sprawdzenie różnych opcji, wybór
            odpowiedniej i często przelew pieniędzy. Im więcej takich momentów
            po drodze, tym łatwiej odłożyć temat na później, zostać na słabszej
            opcji i przerwać konsekwentne inwestowanie.
          </p>
        </div>
      </div>

      <div className="comparison-effort__rows">
        {rows.map((row, index) => {
          const profitWidth = `${(Math.abs(row.profit) / maxProfit) * 100}%`;
          const animatedProfit = isReadyToAnimate ? row.profit : 0;
          const decisionNote = getEffortDecisionNote(row);

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
                <span>
                  {row.isBest
                    ? "Najwyższy wynik w tym ustawieniu"
                    : "Trzeba wracać do tematu po drodze"}
                </span>
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
                {row.hasEarlyExit && row.earlyExitFee > 0 && (
                  <span className="comparison-effort__fee-note">
                    (w tym opłata: {formatMoneyRounded(-row.earlyExitFee, { signed: true })})
                  </span>
                )}
              </div>

              <div className="comparison-effort__metric comparison-effort__metric--decisions">
                <div className="comparison-effort__metric-head">
                  <span>Ile razy trzeba się tym zająć</span>
                  <strong>{formatTimesToHandle(row.decisions)}</strong>
                </div>
                <DecisionMeter count={row.decisions} className="comparison-effort__meter" />
                <span className="comparison-effort__decision-note">
                  {decisionNote}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
