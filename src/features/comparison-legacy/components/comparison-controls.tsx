import type { CSSProperties } from "react";
import { AmountInput } from "@/features/calculator/components/amount-input";
import {
  CheckIcon,
  FixedRateIcon,
  InflationIcon,
  VariableRateIcon,
} from "@/features/calculator/components/icons";
import { FormattedNumberInput } from "@/features/calculator/components/formatted-number-input";
import { TermHelp } from "@/features/calculator/components/term-help";
import type {
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
} from "@/features/comparison-legacy/domain/types";
import { COMPARISON_INSTRUMENTS } from "@/features/comparison-legacy/domain/instruments";
import {
  COMPARISON_AMOUNT_PRESETS,
  COMPARISON_HORIZON_PRESETS,
  COMPARISON_INFLATION_PRESETS,
} from "@/features/comparison-legacy/lib/constants";
import {
  amountToSliderValue,
  parseLocaleNumber,
  sliderValueToAmount,
  SLIDER_MAX,
} from "@/features/comparison-legacy/lib/legacy-calculator";
import {
  formatGroupedInteger,
  formatInputNumber,
  formatPercent,
} from "@/features/calculator/lib/formatters";

const AMOUNT_SLIDER_MARKERS = [
  { label: "100 zł", value: 100, align: "start" },
  { label: "100 tys.", value: 100_000, align: "center" },
  { label: "500 tys. zł", value: 500_000, align: "end" },
] as const;

const HORIZON_SLIDER_MARKERS = [
  { label: "1 rok", value: 1, align: "start" },
  { label: "10 lat", value: 10, align: "center" },
  { label: "30 lat", value: 30, align: "end" },
] as const;

function InstrumentIcon({
  instrumentId,
}: {
  instrumentId: ComparisonSelectableInstrumentId;
}) {
  if (instrumentId === "EDO" || instrumentId === "COI") {
    return <InflationIcon />;
  }

  if (instrumentId === "TOS") {
    return <FixedRateIcon />;
  }

  return <VariableRateIcon />;
}

/* --- Entry controls: amount + horizon --- */

type ComparisonEntryControlsProps = {
  amount: number;
  horizonYears: number;
  onAmountChange: (amount: number) => void;
  onHorizonChange: (years: number) => void;
};

export function ComparisonEntryControls({
  amount,
  horizonYears,
  onAmountChange,
  onHorizonChange,
}: ComparisonEntryControlsProps) {
  const amountSliderValue = amountToSliderValue(amount);
  const amountSliderStyle = {
    "--slider-fill": `${((amountSliderValue / SLIDER_MAX) * 100).toFixed(2)}%`,
  } as CSSProperties & { "--slider-fill": string };
  const horizonSliderStyle = {
    "--slider-fill": `${(((horizonYears - 1) / 29) * 100).toFixed(2)}%`,
  } as CSSProperties & { "--slider-fill": string };

  return (
    <>
      <section className="panel-block" aria-label="Kwota inwestycji">
        <div className="input-heading">
          <h3 className="input-title">Ile chcesz zainwestować?</h3>
          <p className="input-inline-note" data-comparison-amount-summary>
            {formatGroupedInteger(amount)} zł
          </p>
        </div>

        <div className="amount-stack">
          <div className="amount-display">
            <label className="amount-display__field" htmlFor="comparison-amount">
              <span className="sr-only">Kwota inwestycji</span>
              <AmountInput
                id="comparison-amount"
                className="amount-display__input"
                inputMode="numeric"
                aria-label="Kwota inwestycji"
                value={amount}
                onValueChange={onAmountChange}
              />
            </label>
            <span className="amount-display__suffix">zł</span>
          </div>

          <div className="amount-slider-wrap" style={amountSliderStyle}>
            <label className="sr-only" htmlFor="comparison-amount-slider">
              Kwota inwestycji
            </label>
            <input
              id="comparison-amount-slider"
              className="amount-slider"
              type="range"
              min="0"
              max={SLIDER_MAX}
              step="1"
              value={amountSliderValue}
              onInput={(event) =>
                onAmountChange(
                  sliderValueToAmount(
                    Number.parseInt(event.currentTarget.value, 10),
                  ),
                )
              }
            />
            <div className="amount-slider__limits" aria-hidden="true">
              {AMOUNT_SLIDER_MARKERS.map((marker) => {
                const position =
                  (amountToSliderValue(marker.value) / SLIDER_MAX) * 100;

                return (
                  <span
                    key={marker.value}
                    className={`amount-slider__limit amount-slider__limit--${marker.align}`}
                    style={
                      {
                        "--amount-slider-limit": `${position.toFixed(2)}%`,
                      } as CSSProperties & { "--amount-slider-limit": string }
                    }
                  >
                    {marker.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            className="chip-row chip-row--amount"
            aria-label="Szybki wybór kwoty"
          >
            {COMPARISON_AMOUNT_PRESETS.map((preset) => {
              const isActive = amount === preset;

              return (
                <button
                  key={preset}
                  className={`chip${isActive ? " chip--active" : ""}`}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onAmountChange(preset)}
                >
                  {formatGroupedInteger(preset)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel-block" aria-label="Horyzont czasowy">
        <div className="input-heading">
          <h3 className="input-title">Na ile lat?</h3>
          <p className="input-inline-note" data-comparison-horizon-summary>
            {horizonYears} lat
          </p>
        </div>

        <div className="comparison-range-wrap" style={horizonSliderStyle}>
          <label className="sr-only" htmlFor="comparison-horizon-slider">
            Horyzont czasowy
          </label>
          <input
            id="comparison-horizon-slider"
            className="amount-slider"
            type="range"
            min="1"
            max="30"
            step="1"
            value={horizonYears}
            onInput={(event) =>
              onHorizonChange(
                Number.parseInt(event.currentTarget.value, 10),
              )
            }
          />
          <div className="amount-slider__limits" aria-hidden="true">
            {HORIZON_SLIDER_MARKERS.map((marker) => {
              const position = ((marker.value - 1) / 29) * 100;

              return (
                <span
                  key={marker.value}
                  className={`amount-slider__limit amount-slider__limit--${marker.align}`}
                  style={
                    {
                      "--amount-slider-limit": `${position.toFixed(2)}%`,
                    } as CSSProperties & { "--amount-slider-limit": string }
                  }
                >
                  {marker.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="chip-row chip-row--compact comparison-chip-row">
          {COMPARISON_HORIZON_PRESETS.map((preset) => {
            const isActive = horizonYears === preset;

            return (
              <button
                key={preset}
                className={`chip${isActive ? " chip--active" : ""}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => onHorizonChange(preset)}
              >
                {preset} lat
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* --- Product controls: instrument toggles --- */

type ComparisonProductControlsProps = {
  state: ComparisonScenarioState;
  onInstrumentToggle: (instrumentId: ComparisonSelectableInstrumentId) => void;
};

export function ComparisonProductControls({
  state,
  onInstrumentToggle,
}: ComparisonProductControlsProps) {
  return (
    <section
      className="panel-block comparison-instruments-section"
      aria-label="Instrumenty"
    >
      <div className="input-heading">
        <h3 className="input-title">Porównaj:</h3>
      </div>

      <div className="comparison-toggle-grid">
        {(
          Object.keys(
            COMPARISON_INSTRUMENTS,
          ) as ComparisonSelectableInstrumentId[]
        ).map((instrumentId) => {
          const instrument = COMPARISON_INSTRUMENTS[instrumentId];
          const isActive = state.activeInstrumentIds.includes(instrumentId);

          return (
            <button
              key={instrumentId}
              className={`comparison-toggle${isActive ? " comparison-toggle--active" : ""}`}
              type="button"
              aria-pressed={isActive}
              data-instrument-toggle={instrumentId}
              onClick={() => onInstrumentToggle(instrumentId)}
            >
              <div className="comparison-toggle__header">
                <span className="comparison-toggle__icon" aria-hidden="true">
                  <InstrumentIcon instrumentId={instrumentId} />
                </span>
                <div className="comparison-toggle__copy">
                  <strong>{instrument.label}</strong>
                  <span>{instrument.summary}</span>
                </div>
              </div>

              <span className="comparison-toggle__meta">
                <span className="comparison-toggle__rate">
                  {instrumentId === "DEPOSIT"
                    ? `${formatPercent(state.depositRate)} brutto`
                    : instrument.kind === "fixed_capitalized"
                      ? `${formatPercent(instrument.firstRate)} stałe`
                      : `${formatPercent(instrument.firstRate)} start`}
                </span>
                {isActive ? (
                  <span
                    className="comparison-toggle__check"
                    aria-hidden="true"
                  >
                    <CheckIcon />
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* --- Advanced controls: inflation + deposit rate --- */

type ComparisonAdvancedControlsProps = {
  idPrefix: string;
  state: ComparisonScenarioState;
  effectiveInflation: number;
  onInflationPresetSelect: (value: number) => void;
  onCustomInflationChange: (value: number) => void;
  onDepositRateChange: (value: number) => void;
};

export function ComparisonAdvancedControls({
  idPrefix,
  state,
  effectiveInflation,
  onInflationPresetSelect,
  onCustomInflationChange,
  onDepositRateChange,
}: ComparisonAdvancedControlsProps) {
  return (
    <div className="comparison-advanced-section">
      <section className="panel-block" aria-label="Scenariusz inflacji">
        <div className="input-heading">
          <div className="label-with-help">
            <h3 className="input-title">Inflacja</h3>
            <TermHelp
              label="Wyjaśnienie: scenariusz inflacji"
              tooltip="To scenariusz edukacyjny, a nie prognoza. Ta sama inflacja obowiązuje przez cały horyzont."
            />
          </div>
          <p className="input-inline-note" data-comparison-inflation-summary>
            {formatPercent(effectiveInflation)}
          </p>
        </div>

        <p className="helper-note comparison-helper-note">
          Cel NBP to 2,5% +/- 1 pkt proc. Presety pomagają sprawdzić spokojny,
          umiarkowany i trudniejszy scenariusz.
        </p>

        <div
          className="chip-row chip-row--compact comparison-chip-row"
          aria-label="Presety inflacji"
        >
          {COMPARISON_INFLATION_PRESETS.map((preset) => {
            const isActive =
              state.inflationMode === "preset" &&
              Math.abs(state.inflationPreset - preset) < 0.001;

            return (
              <button
                key={preset}
                className={`chip${isActive ? " chip--active" : ""}`}
                type="button"
                aria-pressed={isActive}
                onClick={() => onInflationPresetSelect(preset)}
              >
                {formatPercent(preset)}
              </button>
            );
          })}
        </div>

        <div className="option-row">
          <div className="option-row__label">
            <strong>Własna inflacja</strong>
            <span className="helper-text">Nadpisuje preset i działa live</span>
          </div>
          <label
            className="inline-input"
            htmlFor={`${idPrefix}-custom-inflation`}
          >
            <FormattedNumberInput
              id={`${idPrefix}-custom-inflation`}
              value={state.customInflation}
              inputMode="decimal"
              aria-label="Własna inflacja"
              format={formatInputNumber}
              parse={parseLocaleNumber}
              onValueChange={onCustomInflationChange}
            />
            <span>%</span>
          </label>
        </div>
      </section>

      {state.activeInstrumentIds.includes("DEPOSIT") && (
        <section className="panel-block" aria-label="Lokata">
          <div className="option-row">
            <div className="option-row__label">
              <strong>Stawka lokaty</strong>
              <span className="helper-text">
                Symulacja zakłada coroczne odnowienie na tej samej stopie
              </span>
            </div>
            <label
              className="inline-input"
              htmlFor={`${idPrefix}-deposit-rate`}
            >
              <FormattedNumberInput
                id={`${idPrefix}-deposit-rate`}
                value={state.depositRate}
                inputMode="decimal"
                aria-label="Oprocentowanie lokaty"
                format={formatInputNumber}
                parse={parseLocaleNumber}
                onValueChange={onDepositRateChange}
              />
              <span>%</span>
            </label>
          </div>
        </section>
      )}
    </div>
  );
}
