"use client";

import {
  startTransition,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ChallengeCta } from "@/features/calculator/components/challenge-cta";
import { ViewModeSwitch } from "@/features/calculator/components/view-mode-switch";
import { CURRENT_BOND_OFFER_MONTH_GENITIVE } from "@/features/calculator/lib/current-bond-offer";
import { ComparisonChart } from "@/features/comparison/components/comparison-chart";
import {
  ComparisonEntryControls,
  ComparisonProductControls,
  ComparisonAdvancedControls,
} from "@/features/comparison/components/comparison-controls";
import { ComparisonEffortGrid } from "@/features/comparison/components/comparison-effort-grid";
import { ComparisonRecommendationCard } from "@/features/comparison/components/comparison-insight-callout";
import type {
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
  ComparisonSmartSuggestion,
  ComparisonValueMode,
} from "@/features/comparison/domain/types";
import { DEFAULT_COMPARISON_STATE } from "@/features/comparison/lib/constants";
import { simulateComparisonScenario } from "@/features/comparison/lib/comparison";
import { formatPercent } from "@/features/calculator/lib/formatters";

type ComparisonAppState = {
  scenarioState: ComparisonScenarioState;
  pinnedSuggestionId: ComparisonSelectableInstrumentId | null;
};

function patch(
  setState: React.Dispatch<React.SetStateAction<ComparisonAppState>>,
  values: Partial<ComparisonScenarioState>,
) {
  startTransition(() => {
    setState((current) => {
      const scenarioState = { ...current.scenarioState, ...values };
      const nextScenario = simulateComparisonScenario(scenarioState);

      return {
        scenarioState,
        pinnedSuggestionId:
          nextScenario.smartSuggestion?.instrumentId ??
          current.pinnedSuggestionId,
      };
    });
  });
}

function clampPercent(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function getPersistentSmartSuggestion(
  scenario: ReturnType<typeof simulateComparisonScenario>,
  activeInstrumentIds: ComparisonSelectableInstrumentId[],
  pinnedInstrumentId: ComparisonSelectableInstrumentId | null,
): (NonNullable<ComparisonSmartSuggestion> & { isActive: boolean }) | null {
  const instrumentId =
    scenario.smartSuggestion?.instrumentId ?? pinnedInstrumentId;

  if (!instrumentId) {
    return null;
  }

  const targetResult = scenario.allResults.find(
    (result) => result.id === instrumentId,
  );

  if (!targetResult) {
    return null;
  }

  const isActive = activeInstrumentIds.includes(instrumentId);
  const alternativeResults = isActive
    ? scenario.activeResults.filter((result) => result.id !== instrumentId)
    : scenario.activeResults;
  const bestAlternative = [...alternativeResults].sort(
    (left, right) => right.finalNet - left.finalNet,
  )[0];

  if (!bestAlternative) {
    return null;
  }

  const delta = targetResult.finalNet - bestAlternative.finalNet;

  if (delta <= 0) {
    return null;
  }

  return {
    instrumentId,
    label: targetResult.label,
    delta,
    finalNet: targetResult.finalNet,
    isActive,
  };
}

export function ComparisonApp() {
  const [appState, setAppState] = useState<ComparisonAppState>(() => {
    const scenarioState = DEFAULT_COMPARISON_STATE;
    const initialScenario = simulateComparisonScenario(scenarioState);

    return {
      scenarioState,
      pinnedSuggestionId: initialScenario.smartSuggestion?.instrumentId ?? null,
    };
  });
  const [mobileAdvancedOpen, setMobileAdvancedOpen] = useState(false);
  const [desktopAdvancedOpen, setDesktopAdvancedOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const state = appState.scenarioState;
  const scenario = simulateComparisonScenario(state);
  /* Bugfix: keep the suggestion visible after enabling the recommended option, so the CTA can switch to "Wyłącz" instead of disappearing. */
  const persistentSmartSuggestion = getPersistentSmartSuggestion(
    scenario,
    state.activeInstrumentIds,
    appState.pinnedSuggestionId,
  );

  useLayoutEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) return;

    function syncHeaderHeight(target: HTMLElement) {
      const nextHeight = Math.round(target.getBoundingClientRect().height);
      setHeaderHeight((current) =>
        current === nextHeight ? current : nextHeight,
      );
    }

    syncHeaderHeight(headerElement);

    const observer = new ResizeObserver(() => {
      syncHeaderHeight(headerElement);
    });

    observer.observe(headerElement);

    return () => observer.disconnect();
  }, []);
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

    patch(setAppState, { activeInstrumentIds: nextIds });
  }

  function handleDisplayModeChange(mode: ComparisonValueMode) {
    patch(setAppState, { displayMode: mode });
  }

  function handleToggleSuggested() {
    if (!persistentSmartSuggestion) return;

    handleInstrumentToggle(persistentSmartSuggestion.instrumentId);
  }

  const shellStyle = {
    "--comparison-header-height": `${headerHeight}px`,
  } as CSSProperties & { "--comparison-header-height": string };

  return (
    <main
      className="page comparison-page"
      data-comparison-page
      style={shellStyle}
    >
      <header
        ref={headerRef}
        className="intro comparison-intro comparison-shell__header"
        aria-label="Wprowadzenie"
        data-comparison-header
      >
        <div className="intro__main">
          <h1 className="intro__title">
            Sprawdź, co się stanie z
            <span className="gradient-text"> Twoimi oszczędnościami</span>
          </h1>
        </div>
        <ViewModeSwitch mode="comparison" />
      </header>

      <section className="comparison-layout" aria-label="Porównanie opcji">
        <aside
          className="comparison-layout__sidebar"
          aria-label="Panel sterowania porównania"
        >
          <div
            className="comparison-sidebar card"
            data-comparison-sidebar-scroll
          >
            <ComparisonEntryControls
              amount={state.amount}
              horizonYears={state.horizonYears}
              onAmountChange={(amount) => patch(setAppState, { amount })}
              onHorizonChange={(horizonYears) =>
                patch(setAppState, { horizonYears })
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
                    patch(setAppState, {
                      inflationMode: "preset",
                      inflationPreset,
                      customInflation: inflationPreset,
                    })
                  }
                  onCustomInflationChange={(customInflation) =>
                    patch(setAppState, {
                      inflationMode: "custom",
                      customInflation: clampPercent(customInflation),
                    })
                  }
                  onDepositRateChange={(depositRate) =>
                    patch(setAppState, {
                      depositRate: clampPercent(depositRate),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="comparison-main" data-comparison-main-scroll>
          <div className="comparison-main__content">
            {/* Bugfix: the chart should anchor the right column, so it renders before recommendation and helper cards. */}
            <ComparisonChart
              scenario={scenario}
              displayMode={state.displayMode}
              onDisplayModeChange={handleDisplayModeChange}
              smartSuggestion={persistentSmartSuggestion}
              onSmartSuggestionToggle={handleToggleSuggested}
            />

            {/* Bugfix: keep the recommendation below the chart card, because it reads better as a follow-up explanation than as part of the chart box. */}
            <ComparisonRecommendationCard
              recommendation={scenario.recommendation}
            />

            {/* Effort grid */}
            <ComparisonEffortGrid
              rows={scenario.effortRows}
              displayMode={state.displayMode}
            />

            <ChallengeCta
              className="comparison-action-cta"
              label="Pierwszy krok"
              title="Jak kupić pierwsze obligacje?"
              description="7-dniowe wyzwanie mailowe od Marcina, Kasi i Maćka. Dostajesz jedną prostą instrukcję dziennie - na końcu kupujesz swoją pierwszą obligację."
              headingLevel="h3"
              ariaLabel="Pierwszy krok do zakupu obligacji"
            />

            {/* Assumptions */}
            <div className="comparison-assumptions card">
              <p className="micro-label">Założenia symulacji</p>
              <div className="comparison-assumptions__grid">
                <span className="comparison-assumption-pill">
                  Stała inflacja: {formatPercent(scenario.effectiveInflation)}
                </span>
                <span className="comparison-assumption-pill">
                  Przyszłe serie liczone na parametrach z {CURRENT_BOND_OFFER_MONTH_GENITIVE}
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
          </div>
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
              patch(setAppState, {
                inflationMode: "preset",
                inflationPreset,
                customInflation: inflationPreset,
              })
            }
            onCustomInflationChange={(customInflation) =>
              patch(setAppState, {
                inflationMode: "custom",
                customInflation: clampPercent(customInflation),
              })
            }
            onDepositRateChange={(depositRate) =>
              patch(setAppState, { depositRate: clampPercent(depositRate) })
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
