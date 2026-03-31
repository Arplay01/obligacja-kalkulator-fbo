import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import type {
  ComparisonInstrumentResult,
  ComparisonSelectableInstrumentId,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import {
  DecisionMeter,
  formatDecisionLabel,
} from "@/features/comparison/components/decision-meter";
import { formatMoneyRounded } from "@/features/calculator/lib/formatters";

type ComparisonResultCardsProps = {
  results: ComparisonInstrumentResult[];
  bestInstrumentId: ComparisonSelectableInstrumentId | null;
  displayMode: ComparisonValueMode;
};

function getDisplayValue(
  result: ComparisonInstrumentResult,
  displayMode: ComparisonValueMode,
) {
  return displayMode === "real" ? result.finalReal : result.finalNet;
}

function getDisplayProfit(
  result: ComparisonInstrumentResult,
  displayMode: ComparisonValueMode,
) {
  return displayMode === "real" ? result.realProfit : result.netProfit;
}

export function ComparisonResultCards({
  results,
  bestInstrumentId,
  displayMode,
}: ComparisonResultCardsProps) {
  return (
    <section className="comparison-results" aria-label="Karty wynikowe">
      <div className="comparison-results__header">
        <div>
          <p className="micro-label">Na koniec scenariusza</p>
          <h2 className="section-title">Która ścieżka zostawia najwięcej?</h2>
        </div>
        <p className="helper-text comparison-results__helper">
          Obok wyniku finansowego zawsze widać też koszt decyzyjny.
        </p>
      </div>

      <div className="comparison-results__grid">
        {results.map((result) => {
          const isBest = result.id === bestInstrumentId;
          const displayValue = getDisplayValue(result, displayMode);
          const displayProfit = getDisplayProfit(result, displayMode);

          return (
            <article
              key={result.id}
              className={`comparison-card${isBest ? " comparison-card--best" : ""}`}
              data-comparison-card={result.id}
            >
              <div className="comparison-card__header">
                <div>
                  <p className="micro-label">{result.label}</p>
                  <p className="comparison-card__summary">{result.summary}</p>
                </div>
                {isBest ? (
                  <span className="comparison-card__badge">
                    Najwyższy wynik w tym scenariuszu
                  </span>
                ) : null}
              </div>

              <AnimatedNumberText
                tag="p"
                className="comparison-card__value"
                value={displayValue}
                format={(value) => formatMoneyRounded(value)}
              />

              <p className="comparison-card__value-label">
                {displayMode === "real" ? "Wartość po inflacji" : "Kwota netto na koniec"}
              </p>

              <p
                className={`comparison-card__profit${displayProfit >= 0 ? " comparison-card__profit--positive" : " comparison-card__profit--negative"}`}
              >
                {displayMode === "real" ? "Realna zmiana: " : "Zysk netto: "}
                <strong>{formatMoneyRounded(displayProfit, { signed: true })}</strong>
              </p>

              <div className="comparison-card__decisions">
                <div>
                  <p className="micro-label">Liczba decyzji</p>
                  <strong>{formatDecisionLabel(result.decisions)}</strong>
                </div>
                <DecisionMeter count={result.decisions} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
