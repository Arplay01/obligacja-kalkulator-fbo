import type { CSSProperties } from "react";
import { AmountInput } from "@/features/calculator/components/amount-input";
import { BondBadge } from "@/features/calculator/components/bond-badge";
import { CheckIcon } from "@/features/calculator/components/icons";
import { FormattedNumberInput } from "@/features/calculator/components/formatted-number-input";
import { TermHelp } from "@/features/calculator/components/term-help";
import { BONDS } from "@/features/calculator/domain/bonds";
import type { BondBadgeKind } from "@/features/calculator/domain/types";
import type {
  ComparisonScenarioState,
  ComparisonSelectableInstrumentId,
} from "@/features/comparison/domain/types";
import { COMPARISON_INSTRUMENTS } from "@/features/comparison/domain/instruments";
import {
  COMPARISON_AMOUNT_PRESETS,
  COMPARISON_INFLATION_PRESETS,
} from "@/features/comparison/lib/constants";
import {
  amountToSliderValue,
  parseLocaleNumber,
  sliderValueToAmount,
} from "@/features/calculator/lib/calculator";
import { SLIDER_MAX } from "@/features/calculator/lib/constants";
import {
  formatGroupedInteger,
  formatInputNumber,
  formatPercent,
} from "@/features/calculator/lib/formatters";
import { formatYearsPolish } from "@/features/comparison/lib/comparison";

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

const COMPARISON_INSTRUMENT_BADGES = {
  EDO: {
    kind: BONDS.EDO.badgeKind,
    label: BONDS.EDO.chipBadgeLabel,
  },
  COI: {
    kind: BONDS.COI.badgeKind,
    label: BONDS.COI.chipBadgeLabel,
  },
  TOS: {
    kind: BONDS.TOS.badgeKind,
    label: BONDS.TOS.chipBadgeLabel,
  },
  DEPOSIT: {
    kind: BONDS.TOS.badgeKind,
    label: BONDS.TOS.chipBadgeLabel,
  },
} as const satisfies Record<
  ComparisonSelectableInstrumentId,
  { kind: BondBadgeKind; label: string }
>;

function getComparisonInstrumentRateLabel(
  instrumentId: ComparisonSelectableInstrumentId,
  depositRate: number,
) {
  const instrument = COMPARISON_INSTRUMENTS[instrumentId];

  if (instrumentId === "DEPOSIT") {
    return `${formatPercent(depositRate)} brutto`;
  }

  if (instrument.kind === "fixed_capitalized") {
    return `${formatPercent(instrument.firstRate)} stałe`;
  }

  return `${formatPercent(instrument.firstRate)} start`;
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
          <p
            className="comparison-entry-summary"
            data-comparison-horizon-summary
          >
            <span className="comparison-entry-summary__value">
              {horizonYears}
            </span>
            {" "}
            <span className="comparison-entry-summary__unit">
              {formatYearsPolish(horizonYears)}
            </span>
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
          const badge = COMPARISON_INSTRUMENT_BADGES[instrumentId];

          return (
            <button
              key={instrumentId}
              className={`comparison-toggle bond-chip${isActive ? " comparison-toggle--active bond-chip--active" : ""}`}
              type="button"
              aria-pressed={isActive}
              data-instrument-toggle={instrumentId}
              onClick={() => onInstrumentToggle(instrumentId)}
            >
              {isActive ? (
                <span
                  className="comparison-toggle__check bond-chip__check"
                  aria-hidden="true"
                >
                  <CheckIcon />
                </span>
              ) : null}

              <div className="comparison-toggle__header bond-chip__header">
                <div className="comparison-toggle__copy">
                  <strong className="comparison-toggle__label bond-chip__label">
                    {instrument.label}
                  </strong>
                </div>
              </div>

              <span className="comparison-toggle__meta bond-chip__meta">
                <span className="comparison-toggle__rate bond-chip__rate">
                  {getComparisonInstrumentRateLabel(
                    instrumentId,
                    state.depositRate,
                  )}
                </span>
                <span className="bond-chip__badge-slot bond-chip__badge-slot--inline">
                  <BondBadge
                    kind={badge.kind}
                    label={badge.label}
                    variant="chip"
                  />
                </span>
              </span>
              <span className="bond-chip__badge-slot bond-chip__badge-slot--stacked">
                <BondBadge kind={badge.kind} label={badge.label} variant="chip" />
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
