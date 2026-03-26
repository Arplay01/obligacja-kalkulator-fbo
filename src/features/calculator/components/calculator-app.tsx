"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { BONDS } from "@/features/calculator/domain/bonds";
import { type CalculatorState } from "@/features/calculator/domain/types";
import { CalculatorDeepDive } from "@/features/calculator/components/calculator-deep-dive";
import { CalculatorInputPanel } from "@/features/calculator/components/calculator-input-panel";
import { CalculatorIntro } from "@/features/calculator/components/calculator-intro";
import { CalculatorNextSteps } from "@/features/calculator/components/calculator-next-steps";
import { CalculatorResultsPanel } from "@/features/calculator/components/calculator-results-panel";
import { CalculatorTrustFooter } from "@/features/calculator/components/calculator-trust-footer";
import {
  amountToSliderValue,
  buildInsight,
  calculateBenchmark,
  calculateBond,
  getEffectiveInflation,
  inflationFactor,
  sliderValueToAmount,
  steppedValue,
} from "@/features/calculator/lib/calculator";
import { DEFAULT_CALCULATOR_STATE } from "@/features/calculator/lib/constants";
import { formatMoneyRounded, formatPercent } from "@/features/calculator/lib/formatters";
import { requestPortfolioReturn } from "@/features/calculator/lib/portfolio-return";

type CalculatorUiState = {
  advancedOptionsOpen: boolean;
  calculationDetailsOpen: boolean;
  compareOpen: boolean;
  howOpen: boolean;
  chartOpen: boolean;
  educationOpen: boolean;
};

const DEFAULT_UI_STATE: CalculatorUiState = {
  advancedOptionsOpen: false,
  calculationDetailsOpen: false,
  compareOpen: true,
  howOpen: false,
  chartOpen: false,
  educationOpen: false,
};

type StepTarget =
  | "deposit-rate"
  | "savings-rate"
  | "nbp-rate"
  | "custom-inflation";

export function CalculatorApp() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_CALCULATOR_STATE);
  const [uiState, setUiState] = useState<CalculatorUiState>(DEFAULT_UI_STATE);
  const [isUpdating, setIsUpdating] = useState(false);
  const hasRenderedRef = useRef(false);
  const updateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    hasRenderedRef.current = true;

    return () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const bond = BONDS[state.bondId];
  const effectiveInflation = getEffectiveInflation(state);
  const bondCopyContext = {
    effectiveInflation,
    nbpRate: state.nbpRate,
  };
  const bondResult = calculateBond(
    bond,
    state.amount,
    effectiveInflation,
    state.nbpRate,
    state.ike,
  );
  const depositResult = calculateBenchmark(
    state.amount,
    state.depositRate,
    bond.termMonths,
    effectiveInflation,
  );
  const savingsResult = calculateBenchmark(
    state.amount,
    state.savingsRate,
    bond.termMonths,
    effectiveInflation,
  );
  const inactionRealValue =
    bondResult.invested / inflationFactor(effectiveInflation, bondResult.termYears);
  const inactionLoss = bondResult.invested - inactionRealValue;
  const sliderFill =
    (amountToSliderValue(state.amount) / 1000) * 100;
  const insight = buildInsight(
    bond,
    bondResult,
    depositResult,
    effectiveInflation,
    state.nbpRate,
    state.depositRate,
  );

  function updateState(patch: Partial<CalculatorState>) {
    if (hasRenderedRef.current) {
      setIsUpdating(true);

      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = window.setTimeout(() => {
        setIsUpdating(false);
      }, 260);
    }

    setState((currentState) => ({
      ...currentState,
      ...patch,
    }));
  }

  function updateUiState(patch: Partial<CalculatorUiState>) {
    setUiState((currentState) => ({
      ...currentState,
      ...patch,
    }));
  }

  function handleStep(target: StepTarget, delta: number) {
    if (target === "deposit-rate") {
      updateState({ depositRate: steppedValue(state.depositRate, delta) });
      return;
    }

    if (target === "savings-rate") {
      updateState({ savingsRate: steppedValue(state.savingsRate, delta) });
      return;
    }

    if (target === "nbp-rate") {
      updateState({ nbpRate: steppedValue(state.nbpRate, delta) });
      return;
    }

    updateState({
      customInflation: steppedValue(state.customInflation, delta),
      inflationMode: "custom",
    });
  }

  function handlePortfolioReturn(event: MouseEvent<HTMLButtonElement>) {
    requestPortfolioReturn(
      event.currentTarget,
      event.currentTarget.dataset.portfolioFallbackUrl ?? "",
    );
  }

  const inflationModeText =
    bond.badgeKind === "inflation"
      ? `Pierwszy rok: stałe ${formatPercent(
          bond.firstRate,
        )}. Potem: oprocentowanie podąża za inflacją.`
      : state.inflationMode === "custom"
        ? `Aktywna własna inflacja: ${formatPercent(effectiveInflation)}`
        : "Zmienia tylko wynik realny";

  const inflationHelperText =
    bond.badgeKind === "inflation"
      ? `Dla ${bond.name} ta wartość zmienia oprocentowanie od 2. roku.`
      : `Dla ${bond.name} inflacja nie zmienia kuponu, ale zmienia realną wartość wyniku.`;

  const ikeHelperText = `Bez podatku od zysków. Tutaj oszczędzasz ok. ${formatMoneyRounded(
    bondResult.totalInterest * 0.19,
  )}.`;

  return (
    <main className="page">
      <CalculatorIntro />

      <section className="workspace" aria-label="Kalkulator obligacji">
        <CalculatorInputPanel
          bonds={BONDS}
          state={state}
          sliderFill={sliderFill}
          inflationModeText={inflationModeText}
          inflationHelperText={inflationHelperText}
          ikeHelperText={ikeHelperText}
          showNbpRow={bond.badgeKind === "variable"}
          advancedOptionsOpen={uiState.advancedOptionsOpen}
          onAdvancedOptionsToggle={(open) =>
            updateUiState({ advancedOptionsOpen: open })
          }
          onBondSelect={(bondId) => updateState({ bondId })}
          onAmountChange={(amount) => updateState({ amount })}
          onSliderChange={(value) =>
            updateState({ amount: sliderValueToAmount(value) })
          }
          onInflationPresetSelect={(value) =>
            updateState({
              inflationMode: "preset",
              inflationPreset: value,
              customInflation: value,
            })
          }
          onIkeToggle={() => updateState({ ike: !state.ike })}
          onDepositRateChange={(value) => updateState({ depositRate: value })}
          onSavingsRateChange={(value) => updateState({ savingsRate: value })}
          onNbpRateChange={(value) => updateState({ nbpRate: value })}
          onCustomInflationChange={(value) =>
            updateState({
              customInflation: value,
              inflationMode: "custom",
            })
          }
          onStep={handleStep}
        />

        <CalculatorResultsPanel
          bond={bond}
          bondCopyContext={bondCopyContext}
          bondResult={bondResult}
          depositResult={depositResult}
          savingsResult={savingsResult}
          depositRate={state.depositRate}
          savingsRate={state.savingsRate}
          effectiveInflation={effectiveInflation}
          inactionRealValue={inactionRealValue}
          inactionLoss={inactionLoss}
          insight={insight}
          isUpdating={isUpdating}
          calculationDetailsOpen={uiState.calculationDetailsOpen}
          compareOpen={uiState.compareOpen}
          onCalculationDetailsToggle={(open) =>
            updateUiState({ calculationDetailsOpen: open })
          }
          onCompareToggle={(open) => updateUiState({ compareOpen: open })}
        />
      </section>

      <CalculatorDeepDive
        bond={bond}
        bondCopyContext={bondCopyContext}
        bondResult={bondResult}
        effectiveInflation={effectiveInflation}
        howOpen={uiState.howOpen}
        chartOpen={uiState.chartOpen}
        educationOpen={uiState.educationOpen}
        onHowToggle={(open) => updateUiState({ howOpen: open })}
        onChartToggle={(open) => updateUiState({ chartOpen: open })}
        onEducationToggle={(open) => updateUiState({ educationOpen: open })}
      />

      <CalculatorNextSteps onPortfolioReturn={handlePortfolioReturn} />
      <CalculatorTrustFooter />
    </main>
  );
}
