import type {
  BenchmarkResult,
  BondCalculationResult,
  BondCopyContext,
  BondDefinition,
  Insight,
} from "@/features/calculator/domain/types";
import { AnimatedNumberText } from "@/features/calculator/components/animated-number-text";
import { BondBadge } from "@/features/calculator/components/bond-badge";
import { InsightIcon } from "@/features/calculator/components/icons";
import { TermHelp } from "@/features/calculator/components/term-help";
import { EXTERNAL_LINKS } from "@/features/calculator/lib/constants";
import {
  formatHoldingPeriodLabel,
  formatMoney,
  formatMoneyRounded,
  formatPercent,
} from "@/features/calculator/lib/formatters";
import { getCompareDelta } from "@/features/calculator/lib/calculator";
import type { SyntheticEvent } from "react";

type CalculatorResultsPanelProps = {
  bond: BondDefinition;
  bondCopyContext: BondCopyContext;
  bondResult: BondCalculationResult;
  depositResult: BenchmarkResult;
  savingsResult: BenchmarkResult;
  depositRate: number;
  savingsRate: number;
  effectiveInflation: number;
  inactionLoss: number;
  insight: Insight;
  isUpdating: boolean;
  advancedOptionsOpen: boolean;
  calculationDetailsOpen: boolean;
  compareOpen: boolean;
  onComparisonSettingsReveal: () => void;
  onCalculationDetailsToggle: (open: boolean) => void;
  onCompareToggle: (open: boolean) => void;
};

export function CalculatorResultsPanel({
  bond,
  bondCopyContext,
  bondResult,
  depositResult,
  savingsResult,
  depositRate,
  savingsRate,
  effectiveInflation,
  inactionLoss,
  insight,
  isUpdating,
  advancedOptionsOpen,
  calculationDetailsOpen,
  compareOpen,
  onComparisonSettingsReveal,
  onCalculationDetailsToggle,
  onCompareToggle,
}: CalculatorResultsPanelProps) {
  const depositDelta = getCompareDelta(
    bond.name,
    "lokata",
    bondResult.netProfit - depositResult.netProfit,
  );
  const savingsDelta = getCompareDelta(
    bond.name,
    "konto",
    bondResult.netProfit - savingsResult.netProfit,
  );
  const heroTooltip = `Szacunkowy wynik po podatku Belki (19%), przy założonej inflacji ${formatPercent(
    effectiveInflation,
  )}. Rzeczywisty zysk zależy od przyszłej inflacji.`;
  const holdingPeriodLabel = formatHoldingPeriodLabel(bond.termMonths);
  const netProfitLabel = `Szacowany zysk netto ${holdingPeriodLabel}`;

  const [bondTitleCode, bondTitleLabel] = bond.title.split(" - ", 2);

  return (
    <section
      className={`workspace__results card result-shell${isUpdating ? " is-updating" : ""}`}
      aria-label="Wyniki symulacji"
      aria-live="polite"
    >
      <div className="results__header">
        <div className="results__headline">
          <h2 className="results__bond-name" data-bond-name>
            <span>{bondTitleCode ?? bond.title}</span>{" "}
            <span className="results__bond-name-label">
              {bondTitleLabel ?? ""}
            </span>
          </h2>
          <p className="results__description" data-bond-description>
            {bond.description(bondCopyContext)}
          </p>
        </div>

        <span data-bond-badge>
          <BondBadge kind={bond.badgeKind} label={bond.badgeLabel} variant="result" />
        </span>
      </div>

      <div className="hero-metric">
        <div className="micro-label label-with-help">
          <span>{netProfitLabel}</span>
          <TermHelp
            label="Wyjaśnienie: szacowany zysk netto"
            tooltip={heroTooltip}
            tooltipDataAttribute="data-hero-tooltip"
          />
        </div>
        <AnimatedNumberText
          tag="p"
          className={`hero-metric__value ${bondResult.netProfit >= 0 ? "hero-metric__value--positive" : "hero-metric__value--negative"}`}
          value={bondResult.netProfit}
          animateOnMount
          data-value="netProfit"
          format={(value) => formatMoneyRounded(value, { signed: true })}
        />
        <p className="hero-metric__total">
          <span className="hero-metric__meta-group">
            Na koniec:
            <AnimatedNumberText
              tag="strong"
              value={bondResult.netReturn}
              animateOnMount
              data-value="netReturn"
              format={(value) => formatMoneyRounded(value)}
            />
          </span>
          <span className="hero-metric__meta-group hero-metric__yearly">
            Średnio:
            <AnimatedNumberText
              tag="strong"
              value={bondResult.netProfit / bondResult.termYears}
              animateOnMount
              data-value="avgProfitPerYear"
              format={(value) => `${formatMoneyRounded(value)} / rok`}
            />
          </span>
        </p>
        <p className="interpretation hero-metric__bridge" data-result-bridge>
          <span className="hero-metric__bridge-lead">W praktyce:</span>{" "}
          Twoje {formatMoneyRounded(bondResult.invested)} {holdingPeriodLabel} może dać{" "}
          <strong className="hero-metric__bridge-amount hero-metric__bridge-amount--return">
            {formatMoneyRounded(bondResult.netReturn)}
          </strong>{" "}
          netto. Jeśli nic nie zrobisz, realnie stracisz{" "}
          <strong className="hero-metric__bridge-amount hero-metric__bridge-amount--loss">
            {formatMoneyRounded(inactionLoss)}
          </strong>
          , nawet jeśli w portfelu nadal widzisz{" "}
          <strong className="hero-metric__bridge-amount">
            {formatMoneyRounded(bondResult.invested)}
          </strong>
          .
        </p>
      </div>

      <div className="insight-banner" hidden>
        <InsightIcon className="insight-banner__icon" />
        <div className="insight-banner__copy">
          <p className="insight-banner__title" data-insight-title>
            {insight.title}
          </p>
          <p data-insight-text>{insight.text}</p>
        </div>
      </div>

      <details
        className="disclosure results-disclosure"
        open={calculationDetailsOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onCalculationDetailsToggle(event.currentTarget.open);
        }}
      >
        <summary className="disclosure__trigger">Pokaż szczegóły kalkulacji</summary>
        <div className="disclosure__body">
          <p className="results-disclosure__note">
            Tu widać, z czego bierze się wynik netto i jak wygląda kalkulacja po
            podatku.
          </p>
          <div className="metrics-grid">
            <div className="metric-box">
              <p className="micro-label">Wpłacasz</p>
              <AnimatedNumberText
                tag="p"
                className="metric-box__value"
                value={bondResult.invested}
                data-value="invested"
                format={(value) => formatMoney(value)}
              />
            </div>
            <div className="metric-box">
              <div className="micro-label label-with-help">
                <span>Odsetki brutto</span>
                <TermHelp
                  label="Wyjaśnienie: odsetki brutto"
                  tooltip="Zysk przed podatkiem. To jeszcze nie jest kwota, która zostaje Ci na rękę."
                />
              </div>
              <AnimatedNumberText
                tag="p"
                className="metric-box__value"
                value={bondResult.totalInterest}
                data-value="grossInterest"
                format={(value) => formatMoney(value)}
              />
            </div>
            <div className="metric-box">
              <div className="micro-label label-with-help">
                <span>Podatek Belki</span>
                <TermHelp
                  label="Wyjaśnienie: podatek Belki"
                  tooltip="19% podatku od wypracowanego zysku. Dlatego wynik netto jest niższy niż brutto."
                />
              </div>
              <AnimatedNumberText
                tag="p"
                className="metric-box__value metric-box__value--danger"
                value={bondResult.tax}
                data-value="tax"
                format={(value) => formatMoney(-Math.abs(value))}
              />
            </div>
            <div className="metric-box">
              <div className="micro-label label-with-help">
                <span>Efektywnie rocznie</span>
                <TermHelp
                  label="Wyjaśnienie: efektywnie rocznie"
                  tooltip="Uśredniony roczny wynik po podatku. Pomaga porównać serie o różnej długości."
                />
              </div>
              <AnimatedNumberText
                tag="p"
                className="metric-box__value"
                value={bondResult.effectiveAnnualRate}
                data-value="effectiveAnnualRate"
                format={(value) => `${formatPercent(value)} netto`}
              />
            </div>
          </div>
        </div>
      </details>

      <details
        className="compare-section"
        open={compareOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onCompareToggle(event.currentTarget.open);
        }}
      >
        <summary className="compare-section__trigger">
          Porównaj z lokatą i kontem
        </summary>
        <div className="compare-section__body">
          <div className="compare-grid">
            <div className="compare-card">
              <p className="micro-label" data-deposit-title>
                Lokata ({formatPercent(depositRate)})
              </p>
              <AnimatedNumberText
                tag="p"
                className="compare-card__profit"
                value={depositResult.netProfit}
                data-value="depositProfit"
                format={(value) => formatMoneyRounded(value, { signed: true })}
              />
              <AnimatedNumberText
                tag="p"
                className="compare-card__total"
                value={depositResult.netReturn}
                data-value="depositTotal"
                format={(value) => `Na koniec: ${formatMoneyRounded(value)}`}
              />
              <p
                className={`compare-card__vs ${depositDelta.positive ? "compare-card__vs--positive" : "compare-card__vs--negative"}`}
                data-deposit-vs
              >
                {depositDelta.before}
                <strong>{depositDelta.highlight}</strong>
                {depositDelta.after}
              </p>
              <a
                className="compare-card__link"
                href={EXTERNAL_LINKS.depositRanking}
                target="_blank"
                rel="noreferrer noopener"
              >
                Ranking marzec 2026
              </a>
            </div>

            <div className="compare-card">
              <p className="micro-label" data-savings-title>
                Konto oszczędnościowe ({formatPercent(savingsRate)})
              </p>
              <AnimatedNumberText
                tag="p"
                className="compare-card__profit"
                value={savingsResult.netProfit}
                data-value="savingsProfit"
                format={(value) => formatMoneyRounded(value, { signed: true })}
              />
              <AnimatedNumberText
                tag="p"
                className="compare-card__total"
                value={savingsResult.netReturn}
                data-value="savingsTotal"
                format={(value) => `Na koniec: ${formatMoneyRounded(value)}`}
              />
              <p
                className={`compare-card__vs ${savingsDelta.positive ? "compare-card__vs--positive" : "compare-card__vs--negative"}`}
                data-savings-vs
              >
                {savingsDelta.before}
                <strong>{savingsDelta.highlight}</strong>
                {savingsDelta.after}
              </p>
              <a
                className="compare-card__link"
                href={EXTERNAL_LINKS.savingsRanking}
                target="_blank"
                rel="noreferrer noopener"
              >
                Ranking marzec 2026
              </a>
            </div>
          </div>

          <p className="helper-text compare-section__helper" data-compare-helper>
            <span>
              W porównaniu przyjęto ten sam czas oszczędzania, a domyślnie lokatę{" "}
              {formatPercent(depositRate)} i konto {formatPercent(savingsRate)}.
            </span>
            <button
              className="compare-section__helper-action"
              type="button"
              aria-controls="advanced-options"
              aria-expanded={advancedOptionsOpen}
              data-compare-settings-action
              onClick={onComparisonSettingsReveal}
            >
              Zmień stawki w ustawieniach
            </button>
          </p>
        </div>
      </details>

      <section className="action-cta" aria-label="Następny krok">
        <h3 className="action-cta__title">Jak kupić?</h3>
        <p className="action-cta__text">
          7-dniowe wyzwanie mailowe od Marcina, Kasi i Maćka. Codziennie konkretna
          instrukcja - na końcu masz swoją pierwszą obligację.
        </p>
        <a
          className="action-cta__button"
          href={EXTERNAL_LINKS.challenge}
          target="_blank"
          rel="noopener noreferrer"
        >
          Dołącz do wyzwania
        </a>
      </section>
    </section>
  );
}
