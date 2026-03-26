import type {
  BondDefinition,
  BondId,
  CalculatorState,
} from "@/features/calculator/domain/types";
import { BondBadge } from "@/features/calculator/components/bond-badge";
import { CheckIcon, SettingsIcon } from "@/features/calculator/components/icons";
import { FormattedNumberInput } from "@/features/calculator/components/formatted-number-input";
import { TermHelp } from "@/features/calculator/components/term-help";
import { BOND_ORDER } from "@/features/calculator/lib/constants";
import {
  amountToSliderValue,
  formatBondCount,
  getEffectiveInflation,
  parseAmountInput,
  parseLocaleNumber,
} from "@/features/calculator/lib/calculator";
import {
  formatGroupedInteger,
  formatInputNumber,
  formatPercent,
} from "@/features/calculator/lib/formatters";
import type { CSSProperties, KeyboardEvent, SyntheticEvent } from "react";

const AMOUNT_PRESETS = [3000, 5000, 10_000, 20_000, 50_000];
const INFLATION_PRESETS = [2, 3.5, 5];

type StepTarget =
  | "deposit-rate"
  | "savings-rate"
  | "nbp-rate"
  | "custom-inflation";

type CalculatorInputPanelProps = {
  bonds: Record<BondId, BondDefinition>;
  state: CalculatorState;
  sliderFill: number;
  inflationModeText: string;
  inflationHelperText: string;
  ikeHelperText: string;
  showNbpRow: boolean;
  advancedOptionsOpen: boolean;
  onAdvancedOptionsToggle: (open: boolean) => void;
  onBondSelect: (bondId: BondId) => void;
  onAmountChange: (amount: number) => void;
  onSliderChange: (sliderValue: number) => void;
  onInflationPresetSelect: (value: number) => void;
  onIkeToggle: () => void;
  onDepositRateChange: (value: number) => void;
  onSavingsRateChange: (value: number) => void;
  onNbpRateChange: (value: number) => void;
  onCustomInflationChange: (value: number) => void;
  onStep: (target: StepTarget, delta: number) => void;
};

function handleIndexedKeyboardNavigation(
  event: KeyboardEvent<HTMLButtonElement>,
  selector: string,
  currentIndex: number,
  onSelect: (nextIndex: number) => void,
) {
  const buttons = Array.from(
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
      selector,
    ) ?? [],
  );

  if (buttons.length === 0) {
    return;
  }

  let nextIndex = currentIndex;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % buttons.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = buttons.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  onSelect(nextIndex);
  buttons[nextIndex]?.focus();
}

type InlineStepInputProps = {
  label: string;
  helper: string;
  inputId: string;
  value: number;
  onValueChange: (value: number) => void;
  onStep: (delta: number) => void;
  ariaLabel: string;
  decreaseLabel: string;
  increaseLabel: string;
};

function InlineStepInput({
  label,
  helper,
  inputId,
  value,
  onValueChange,
  onStep,
  ariaLabel,
  decreaseLabel,
  increaseLabel,
}: InlineStepInputProps) {
  return (
    <div className="option-row">
      <div className="option-row__label">
        <strong>{label}</strong>
        <span className="helper-text">{helper}</span>
      </div>
      <label className="inline-input" htmlFor={inputId}>
        <button
          className="inline-input__step"
          type="button"
          data-step-target={inputId}
          data-step="-0.1"
          aria-label={decreaseLabel}
          onClick={() => onStep(-0.1)}
        >
          -
        </button>
        <FormattedNumberInput
          id={inputId}
          value={value}
          inputMode="decimal"
          aria-label={ariaLabel}
          format={formatInputNumber}
          parse={parseLocaleNumber}
          onValueChange={onValueChange}
        />
        <span>%</span>
        <button
          className="inline-input__step"
          type="button"
          data-step-target={inputId}
          data-step="0.1"
          aria-label={increaseLabel}
          onClick={() => onStep(0.1)}
        >
          +
        </button>
      </label>
    </div>
  );
}

export function CalculatorInputPanel({
  bonds,
  state,
  sliderFill,
  inflationModeText,
  inflationHelperText,
  ikeHelperText,
  showNbpRow,
  advancedOptionsOpen,
  onAdvancedOptionsToggle,
  onBondSelect,
  onAmountChange,
  onSliderChange,
  onInflationPresetSelect,
  onIkeToggle,
  onDepositRateChange,
  onSavingsRateChange,
  onNbpRateChange,
  onCustomInflationChange,
  onStep,
}: CalculatorInputPanelProps) {
  const bondCountText = formatBondCount(state.amount / 100);
  const sliderValue = amountToSliderValue(state.amount);
  const sliderStyle = {
    "--slider-fill": `${sliderFill.toFixed(2)}%`,
  } as CSSProperties & { "--slider-fill": string };

  return (
    <aside className="workspace__inputs card" aria-label="Parametry symulacji">
      <section
        className="panel-block panel-block--selector"
        aria-label="Wybierz rodzaj obligacji"
      >
        <h2 className="section-title section-title--compact">Wybierz obligację</h2>

        <div className="bond-grid" role="tablist" aria-label="Rodzaje obligacji">
          {BOND_ORDER.map((bondId, index) => {
            const bond = bonds[bondId];
            const isActive = state.bondId === bondId;

            return (
              <button
                key={bondId}
                className={`bond-chip${isActive ? " bond-chip--active" : ""}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-bond={bondId}
                onClick={() => onBondSelect(bondId)}
                onKeyDown={(event) => {
                  handleIndexedKeyboardNavigation(
                    event,
                    "[data-bond]",
                    index,
                    (nextIndex) => {
                      onBondSelect(BOND_ORDER[nextIndex]);
                    },
                  );
                }}
              >
                {isActive ? (
                  <span className="bond-chip__check" aria-hidden="true">
                    <CheckIcon />
                  </span>
                ) : null}
                <span className="bond-chip__ticker">{bond.name}</span>
                <span className="bond-chip__label">{bond.pickerLabel}</span>
                <span className="bond-chip__rate">{formatPercent(bond.firstRate)}</span>
                <BondBadge
                  kind={bond.badgeKind}
                  label={bond.chipBadgeLabel}
                  variant="chip"
                />
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel-block" aria-label="Kwota inwestycji">
        <div className="input-heading">
          <h2 className="input-title">Ile chcesz ulokować?</h2>
          <p className="input-inline-note" data-bond-count>
            {bondCountText}
          </p>
        </div>

        <div className="amount-stack">
          <div className="amount-display" aria-live="polite">
            <label className="amount-display__field" htmlFor="amount-input">
              <span className="sr-only">Kwota inwestycji</span>
              <FormattedNumberInput
                id="amount-input"
                className="amount-display__input"
                inputMode="numeric"
                value={state.amount}
                data-amount-display
                aria-label="Kwota inwestycji"
                format={(value) => new Intl.NumberFormat("pl-PL").format(value)}
                parse={parseAmountInput}
                onValueChange={onAmountChange}
              />
            </label>
            <span className="amount-display__suffix">zł</span>
          </div>

          <div
            className="amount-slider-wrap"
            data-amount-slider-wrap
            style={sliderStyle}
          >
            <label className="sr-only" htmlFor="amount-slider">
              Kwota inwestycji
            </label>
            <input
              id="amount-slider"
              className="amount-slider"
              type="range"
              min="0"
              max="1000"
              step="1"
              value={sliderValue}
              onInput={(event) =>
                onSliderChange(Number.parseInt(event.currentTarget.value, 10))
              }
            />
            <div className="amount-slider__limits" aria-hidden="true">
              <span>100 zł</span>
              <span>precyzyjnie do 100 tys.</span>
              <span>500 tys. zł</span>
            </div>
          </div>

          <div className="chip-row chip-row--amount" aria-label="Szybki wybór kwoty">
            {AMOUNT_PRESETS.map((preset) => {
              const isActive = state.amount === preset;

              return (
                <button
                  key={preset}
                  className={`chip${isActive ? " chip--active" : ""}`}
                  type="button"
                  aria-pressed={isActive}
                  data-amount={preset}
                  onClick={() => onAmountChange(preset)}
                >
                  {formatGroupedInteger(preset)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="panel-block state-panel"
        aria-label="Założenie inflacji"
        data-panel="inflation"
      >
        <div className="state-panel__inner">
          <div className="input-heading">
            <h2 className="input-title">Jaki poziom inflacji założyć?</h2>
            <p className="input-inline-note" data-inflation-mode>
              {inflationModeText}
            </p>
          </div>

          <div
            className="chip-row chip-row--compact chip-row--trio"
            role="radiogroup"
            aria-label="Scenariusze inflacji"
          >
            {INFLATION_PRESETS.map((preset, index) => {
              const isActive =
                Math.abs(getEffectiveInflation(state) - preset) < 0.001;

              return (
                <button
                  key={preset}
                  className={`chip${isActive ? " chip--active" : ""}`}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  data-inflation={preset}
                  onClick={() => onInflationPresetSelect(preset)}
                  onKeyDown={(event) => {
                    handleIndexedKeyboardNavigation(
                      event,
                      "[data-inflation]",
                      index,
                      (nextIndex) => {
                        onInflationPresetSelect(INFLATION_PRESETS[nextIndex]);
                      },
                    );
                  }}
                >
                  {index === 0
                    ? "Niska 2,0%"
                    : index === 1
                      ? "Umiark. 3,5%"
                      : "Wysoka 5,0%"}
                </button>
              );
            })}
          </div>

          <p className="helper-text" data-inflation-helper>
            {inflationHelperText}
          </p>
        </div>
      </section>

      <details
        className="advanced-options"
        open={advancedOptionsOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onAdvancedOptionsToggle(event.currentTarget.open);
        }}
      >
        <summary className="advanced-options__trigger">
          <SettingsIcon className="advanced-options__icon" />
          Więcej opcji
        </summary>

        <div className="advanced-options__body">
          <div className="option-row">
            <div className="option-row__label">
              <div className="label-with-help">
                <strong>Konto IKE</strong>
                <TermHelp
                  label="Wyjaśnienie: konto IKE"
                  tooltip="IKE to konto, które pozwala oszczędzać bez 19% podatku od zysków. W tym kalkulatorze pokazuję ten efekt dla obligacji."
                />
              </div>
              <span className="helper-text" data-ike-helper>
                {ikeHelperText}
              </span>
            </div>
            <button
              className="toggle"
              id="ike-toggle"
              type="button"
              role="switch"
              aria-checked={state.ike}
              aria-label="Konto IKE"
              onClick={onIkeToggle}
            >
              <span className="toggle__track">
                <span className="toggle__thumb" />
              </span>
            </button>
          </div>

          <InlineStepInput
            label="Oprocentowanie lokaty"
            helper="Ręcznie ustawiane porównanie"
            inputId="deposit-rate"
            value={state.depositRate}
            onValueChange={onDepositRateChange}
            onStep={(delta) => onStep("deposit-rate", delta)}
            ariaLabel="Oprocentowanie lokaty"
            decreaseLabel="Zmniejsz oprocentowanie lokaty"
            increaseLabel="Zwiększ oprocentowanie lokaty"
          />

          <InlineStepInput
            label="Oprocentowanie konta oszczędnościowego"
            helper="Ręcznie ustawiane porównanie"
            inputId="savings-rate"
            value={state.savingsRate}
            onValueChange={onSavingsRateChange}
            onStep={(delta) => onStep("savings-rate", delta)}
            ariaLabel="Oprocentowanie konta oszczędnościowego"
            decreaseLabel="Zmniejsz oprocentowanie konta oszczędnościowego"
            increaseLabel="Zwiększ oprocentowanie konta oszczędnościowego"
          />

          <div className={`option-row${showNbpRow ? "" : " is-hidden"}`} data-row="nbp">
            <div className="option-row__label">
              <strong>Stopa referencyjna NBP</strong>
              <span className="helper-text">
                Aktualna: 3,75%. Dotyczy ROR i DOR.
              </span>
            </div>
            <label className="inline-input" htmlFor="nbp-rate">
              <button
                className="inline-input__step"
                type="button"
                data-step-target="nbp-rate"
                data-step="-0.1"
                aria-label="Zmniejsz stopę referencyjną NBP"
                onClick={() => onStep("nbp-rate", -0.1)}
              >
                -
              </button>
              <FormattedNumberInput
                id="nbp-rate"
                value={state.nbpRate}
                inputMode="decimal"
                aria-label="Stopa referencyjna NBP"
                format={formatInputNumber}
                parse={parseLocaleNumber}
                onValueChange={onNbpRateChange}
              />
              <span>%</span>
              <button
                className="inline-input__step"
                type="button"
                data-step-target="nbp-rate"
                data-step="0.1"
                aria-label="Zwiększ stopę referencyjną NBP"
                onClick={() => onStep("nbp-rate", 0.1)}
              >
                +
              </button>
            </label>
          </div>

          <InlineStepInput
            label="Własna inflacja"
            helper="Jeśli zmienisz tę wartość, nadpisze preset"
            inputId="custom-inflation"
            value={state.customInflation}
            onValueChange={onCustomInflationChange}
            onStep={(delta) => onStep("custom-inflation", delta)}
            ariaLabel="Własna inflacja"
            decreaseLabel="Zmniejsz własną inflację"
            increaseLabel="Zwiększ własną inflację"
          />
        </div>
      </details>
    </aside>
  );
}
