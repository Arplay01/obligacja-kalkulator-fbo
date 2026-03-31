"use client";

import { startTransition, useState } from "react";
import { ViewModeSwitch } from "@/features/calculator/components/view-mode-switch";
import { ComparisonChart } from "@/features/comparison/components/comparison-chart";
import { ComparisonControls } from "@/features/comparison/components/comparison-controls";
import { ComparisonEffortGrid } from "@/features/comparison/components/comparison-effort-grid";
import { ComparisonInsightCallout } from "@/features/comparison/components/comparison-insight-callout";
import type {
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import { DEFAULT_COMPARISON_STATE } from "@/features/comparison/lib/constants";
import { simulateComparisonScenario } from "@/features/comparison/lib/comparison";
import { formatPercent } from "@/features/calculator/lib/formatters";

function updateComparisonState(
  setState: React.Dispatch<React.SetStateAction<ComparisonScenarioState>>,
  patch: Partial<ComparisonScenarioState>,
) {
  startTransition(() => {
    setState((currentState) => ({
      ...currentState,
      ...patch,
    }));
  });
}

export function ComparisonApp() {
  const [state, setState] = useState<ComparisonScenarioState>(
    DEFAULT_COMPARISON_STATE,
  );
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const scenario = simulateComparisonScenario(state);

  function handleInstrumentToggle(instrumentId: ComparisonSelectableInstrumentId) {
    const isActive = state.activeInstrumentIds.includes(instrumentId);

    if (isActive && state.activeInstrumentIds.length === 1) {
      return;
    }

    const nextIds = isActive
      ? state.activeInstrumentIds.filter((currentId) => currentId !== instrumentId)
      : [...state.activeInstrumentIds, instrumentId];

    updateComparisonState(setState, { activeInstrumentIds: nextIds });
  }

  function handleDisplayModeChange(mode: ComparisonValueMode) {
    updateComparisonState(setState, { displayMode: mode });
  }

  return (
    <main className="page comparison-page" data-comparison-page>
      <header className="intro comparison-intro" aria-label="Wprowadzenie">
        <div className="intro__main">
          <h1 className="intro__title">
            Porównaj opcje i
            <span className="gradient-text"> zobacz różnice</span>
          </h1>
          <p className="intro__note">
            Obligacje EDO, COI, TOS i lokata na 10, 20 albo 30 lat.
          </p>
        </div>
      </header>

      <section className="comparison-layout" aria-label="Porównanie opcji">
        <aside className="comparison-sidebar card">
          <ViewModeSwitch mode="comparison" variant="panel" />

          <div
            className="comparison-sidebar__blur-shell"
            data-comparison-sidebar-blur
          >
            <ComparisonControls
              state={state}
              mobileOpen={mobileControlsOpen}
              effectiveInflation={scenario.effectiveInflation}
              onMobileToggle={() => setMobileControlsOpen((current) => !current)}
              onAmountChange={(amount) => updateComparisonState(setState, { amount })}
              onHorizonChange={(horizonYears) =>
                updateComparisonState(setState, { horizonYears })
              }
              onInflationPresetSelect={(inflationPreset) =>
                updateComparisonState(setState, {
                  inflationMode: "preset",
                  inflationPreset,
                  customInflation: inflationPreset,
                })
              }
              onCustomInflationChange={(customInflation) =>
                updateComparisonState(setState, {
                  inflationMode: "custom",
                  customInflation,
                })
              }
              onDepositRateChange={(depositRate) =>
                updateComparisonState(setState, {
                  depositRate,
                })
              }
              onInstrumentToggle={handleInstrumentToggle}
            />
          </div>
        </aside>

        <section className="comparison-main">
          <div className="comparison-main__blur-shell" data-comparison-main-blur>
            <ComparisonChart
              scenario={scenario}
              displayMode={state.displayMode}
              onDisplayModeChange={handleDisplayModeChange}
            />

            <ComparisonEffortGrid
              rows={scenario.effortRows}
              displayMode={state.displayMode}
            />

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

            <ComparisonInsightCallout
              insight={scenario.insight}
              displayMode={state.displayMode}
            />
          </div>

          <div
            className="comparison-main__overlay"
            data-comparison-overlay
            role="status"
            aria-live="polite"
          >
            <div className="comparison-main__overlay-card">
              <span className="comparison-main__overlay-loader" aria-hidden="true">
                <span className="comparison-main__overlay-loader-dot" />
                <span className="comparison-main__overlay-loader-dot" />
                <span className="comparison-main__overlay-loader-dot" />
              </span>
              <p
                className="comparison-main__overlay-title"
                data-comparison-overlay-title
              >
                Praca w trakcie
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
