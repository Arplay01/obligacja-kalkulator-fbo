"use client";

import { startTransition, useState } from "react";
import { ViewModeSwitch } from "@/features/calculator/components/view-mode-switch";
import { ComparisonChart } from "@/features/comparison-legacy/components/comparison-chart";
import {
  ComparisonEntryControls,
  ComparisonProductControls,
  ComparisonAdvancedControls,
} from "@/features/comparison-legacy/components/comparison-controls";
import { ComparisonEffortGrid } from "@/features/comparison-legacy/components/comparison-effort-grid";
import { ComparisonRecommendationCard } from "@/features/comparison-legacy/components/comparison-insight-callout";
import { ComparisonNextSteps } from "@/features/comparison-legacy/components/comparison-next-steps";
import type {
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
  ComparisonValueMode,
} from "@/features/comparison-legacy/domain/types";
import { DEFAULT_COMPARISON_STATE } from "@/features/comparison-legacy/lib/constants";
import {
  formatYearsPolish,
  simulateComparisonScenario,
} from "@/features/comparison-legacy/lib/comparison";
import { formatPercent } from "@/features/calculator/lib/formatters";
import { formatMoneyRounded } from "@/features/calculator/lib/formatters";

function patch(
  setState: React.Dispatch<React.SetStateAction<ComparisonScenarioState>>,
  values: Partial<ComparisonScenarioState>,
) {
  startTransition(() => {
    setState((current) => ({ ...current, ...values }));
  });
}

function clampPercent(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

export function ComparisonApp() {
  const [state, setState] = useState<ComparisonScenarioState>(
    DEFAULT_COMPARISON_STATE,
  );
  const [mobileAdvancedOpen, setMobileAdvancedOpen] = useState(false);
  const [desktopAdvancedOpen, setDesktopAdvancedOpen] = useState(false);
  const scenario = simulateComparisonScenario(state);

  function handleInstrumentToggle(
    instrumentId: ComparisonSelectableInstrumentId,
  ) {
    const isActive = state.activeInstrumentIds.includes(instrumentId);

    if (isActive && state.activeInstrumentIds.length === 1) {
      return;
    }

    const nextIds = isActive
      ? state.activeInstrumentIds.filter((id) => id !== instrumentId)
      : [...state.activeInstrumentIds, instrumentId];

    patch(setState, { activeInstrumentIds: nextIds });
  }

  function handleDisplayModeChange(mode: ComparisonValueMode) {
    patch(setState, { displayMode: mode });
  }

  function handleEnableSuggested() {
    if (!scenario.smartSuggestion) return;

    patch(setState, {
      activeInstrumentIds: [
        ...state.activeInstrumentIds,
        scenario.smartSuggestion.instrumentId,
      ],
    });
  }

  return (
    <main
      className="page comparison-page"
      data-comparison-page
      data-comparison-legacy-page
    >
      <header className="intro comparison-intro" aria-label="Wprowadzenie">
        <div className="intro__main">
          <div className="comparison-legacy-stamp" data-comparison-legacy-stamp>
            Archiwalny snapshot - stan sprzed UI polishingu
          </div>
          <h1 className="intro__title">
            Sprawdź, co się stanie z
            <span className="gradient-text"> Twoimi oszczędnościami</span>
          </h1>
          <p className="intro__note">
            Wpisz kwotę i horyzont - pokażemy Ci, która opcja daje najlepszy
            wynik.
          </p>
        </div>
        <ViewModeSwitch mode="comparisonLegacy" />
      </header>

      <section className="comparison-layout" aria-label="Porównanie opcji">
        {/* SIDEBAR - single card, no nested borders */}
        <aside className="comparison-sidebar card">
          <ComparisonEntryControls
            amount={state.amount}
            horizonYears={state.horizonYears}
            onAmountChange={(amount) => patch(setState, { amount })}
            onHorizonChange={(horizonYears) =>
              patch(setState, { horizonYears })
            }
          />

          <ComparisonProductControls
            state={state}
            onInstrumentToggle={handleInstrumentToggle}
          />

          {/* Desktop accordion for advanced controls */}
          <div className="comparison-accordion">
            <button
              className="comparison-accordion__trigger"
              type="button"
              aria-expanded={desktopAdvancedOpen}
              onClick={() => setDesktopAdvancedOpen((o) => !o)}
            >
              <span className="comparison-accordion__trigger-label">
                Więcej opcji
              </span>
              <span className="comparison-accordion__trigger-state">
                {desktopAdvancedOpen ? "Zwiń" : "Rozwiń"}
              </span>
            </button>
            <div
              className={`comparison-accordion__panel${desktopAdvancedOpen ? " is-open" : ""}`}
            >
              <ComparisonAdvancedControls
                idPrefix="comparison-desktop"
                state={state}
                effectiveInflation={scenario.effectiveInflation}
                onInflationPresetSelect={(inflationPreset) =>
                  patch(setState, {
                    inflationMode: "preset",
                    inflationPreset,
                    customInflation: inflationPreset,
                  })
                }
                onCustomInflationChange={(customInflation) =>
                  patch(setState, {
                    inflationMode: "custom",
                    customInflation: clampPercent(customInflation),
                  })
                }
                onDepositRateChange={(depositRate) =>
                  patch(setState, { depositRate: clampPercent(depositRate) })
                }
              />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="comparison-main">
          {/* Smart suggestion banner */}
          {scenario.smartSuggestion && (
            <div className="comparison-smart-suggestion">
              <p className="comparison-smart-suggestion__text">
                Na {state.horizonYears}{" "}
                {formatYearsPolish(state.horizonYears)}{" "}
                <strong>{scenario.smartSuggestion.label}</strong> daje{" "}
                {formatMoneyRounded(scenario.smartSuggestion.delta)} więcej.
              </p>
              <button
                className="comparison-smart-suggestion__button"
                type="button"
                onClick={handleEnableSuggested}
              >
                Włącz i porównaj
              </button>
            </div>
          )}

          {/* Recommendation hero */}
          <ComparisonRecommendationCard
            recommendation={scenario.recommendation}
          />

          {/* Chart */}
          <ComparisonChart
            scenario={scenario}
            displayMode={state.displayMode}
            onDisplayModeChange={handleDisplayModeChange}
          />

          {/* Effort grid */}
          <ComparisonEffortGrid
            rows={scenario.effortRows}
            displayMode={state.displayMode}
          />

          {/* COI idle cash warning */}
          {state.activeInstrumentIds.includes("COI") && (
            <div className="comparison-coi-warning">
              <strong>Uwaga o COI:</strong> Obligacje COI wypłacają odsetki co
              rok na Twoje konto bankowe. Te pieniądze nie pracują dalej - leżą.
              Rozważ ich reinwestowanie, np. w krótkoterminowe obligacje.
            </div>
          )}

          {/* Assumptions */}
          <div className="comparison-assumptions card">
            <p className="micro-label">Założenia symulacji</p>
            <div className="comparison-assumptions__grid">
              <span className="comparison-assumption-pill">
                Stała inflacja: {formatPercent(scenario.effectiveInflation)}
              </span>
              <span className="comparison-assumption-pill">
                Przyszłe serie liczone na parametrach z marca 2026
              </span>
              <span className="comparison-assumption-pill">
                Nie liczymy dyskonta zamiany 99,90 zł
              </span>
              <span className="comparison-assumption-pill">
                To symulacja edukacyjna, nie rekomendacja
              </span>
            </div>
            <p className="helper-text comparison-assumptions__note">
              Cel NBP to 2,5% +/- 1 pkt proc. Presety mają dać kontekst, a nie
              przewidywać przyszłą inflację.
            </p>
          </div>

          {/* Next steps */}
          <ComparisonNextSteps />
        </section>
      </section>

      {/* Mobile fixed CTA */}
      <div className="comparison-mobile-cta">
        <button
          className="comparison-mobile-cta__button"
          type="button"
          onClick={() => setMobileAdvancedOpen((o) => !o)}
          aria-expanded={mobileAdvancedOpen}
        >
          Więcej opcji - {mobileAdvancedOpen ? "zwiń" : "rozwiń"}
        </button>
      </div>

      {/* Mobile slide-up panel */}
      <div
        className={`comparison-advanced--mobile${mobileAdvancedOpen ? " comparison-advanced--open" : ""}`}
      >
        <div className="comparison-advanced__content">
          <ComparisonProductControls
            state={state}
            onInstrumentToggle={handleInstrumentToggle}
          />

          <ComparisonAdvancedControls
            idPrefix="comparison-mobile"
            state={state}
            effectiveInflation={scenario.effectiveInflation}
            onInflationPresetSelect={(inflationPreset) =>
              patch(setState, {
                inflationMode: "preset",
                inflationPreset,
                customInflation: inflationPreset,
              })
            }
            onCustomInflationChange={(customInflation) =>
              patch(setState, {
                inflationMode: "custom",
                customInflation: clampPercent(customInflation),
              })
            }
            onDepositRateChange={(depositRate) =>
              patch(setState, { depositRate: clampPercent(depositRate) })
            }
          />

          <div className="comparison-advanced__apply">
            <button
              className="comparison-advanced__apply-button"
              type="button"
              onClick={() => setMobileAdvancedOpen(false)}
            >
              Zastosuj
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export { ComparisonApp as ComparisonLegacyApp };
