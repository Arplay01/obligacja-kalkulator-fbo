import type {
  BondCalculationResult,
  BondCopyContext,
  BondDefinition,
} from "@/features/calculator/domain/types";
import { GrowthChart } from "@/features/calculator/components/growth-chart";
import { formatMoney, formatPercent } from "@/features/calculator/lib/formatters";
import type { SyntheticEvent } from "react";

type CalculatorDeepDiveProps = {
  bond: BondDefinition;
  bondCopyContext: BondCopyContext;
  bondResult: BondCalculationResult;
  effectiveInflation: number;
  basicsOpen: boolean;
  howOpen: boolean;
  chartOpen: boolean;
  educationOpen: boolean;
  onBasicsToggle: (open: boolean) => void;
  onHowToggle: (open: boolean) => void;
  onChartToggle: (open: boolean) => void;
  onEducationToggle: (open: boolean) => void;
};

export function CalculatorDeepDive({
  bond,
  bondCopyContext,
  bondResult,
  effectiveInflation,
  basicsOpen,
  howOpen,
  chartOpen,
  educationOpen,
  onBasicsToggle,
  onHowToggle,
  onChartToggle,
  onEducationToggle,
}: CalculatorDeepDiveProps) {
  return (
    <section className="deep-dive" aria-label="Szczegóły i edukacja">
      <h2 className="section-title">Jeśli chcesz wejść głębiej</h2>

      <details
        className="disclosure deep-dive-disclosure"
        open={basicsOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onBasicsToggle(event.currentTarget.open);
        }}
      >
        <summary className="disclosure__trigger">
          Nie wiesz, czym są obligacje? Przeczytaj w 30 sekund
        </summary>
        <div className="disclosure__body">
          <p className="deep-dive__lead">
            Kupując obligacje, pożyczasz pieniądze państwu na określony czas. W
            zamian dostajesz odsetki. To rozwiązanie często wybierane na początek,
            bo zasady są proste, ryzyko jest niższe niż przy wielu innych
            inwestycjach, a tutaj od razu widać szacowany wynik po podatku i
            inflacji.
          </p>
          <p>
            Nie trzeba umieć analizować giełdy ani wybierać spółek. Na start ważne
            jest głównie to, na jak długo chcesz odłożyć pieniądze i jakiego typu
            oprocentowanie bardziej Ci odpowiada.
          </p>
          <ul className="deep-dive__quick-points">
            <li>Jedna obligacja kosztuje 100 zł, więc można zacząć od małej kwoty.</li>
            <li>Od razu wiadomo, na jaki czas odkładasz pieniądze i jak liczony jest wynik.</li>
            <li>Możliwy jest wcześniejszy wykup, ale zwykle z opłatą za każdą obligację.</li>
          </ul>
        </div>
      </details>

      <details
        className="disclosure deep-dive-disclosure"
        open={howOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onHowToggle(event.currentTarget.open);
        }}
      >
        <summary className="disclosure__trigger" data-how-summary>
          Jak działa teraz wybrana obligacja - {bond.name} {bond.summaryLabel}?
        </summary>
        <div className="disclosure__body">
          <p data-how-description>{bond.howItWorks(bondCopyContext)}</p>

          <div className="pros-cons">
            <div className="pros-cons__col pros-cons__col--pro">
              <p className="pros-cons__title">Dlaczego ktoś ją wybiera</p>
              <ul data-pros-list>
                {bond.pros.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="pros-cons__col pros-cons__col--con">
              <p className="pros-cons__title">Na co uważać</p>
              <ul data-cons-list>
                {bond.cons.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </details>

      <details
        className="disclosure deep-dive-disclosure"
        open={chartOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onChartToggle(event.currentTarget.open);
        }}
      >
        <summary className="disclosure__trigger">Wykres i tabela rok po roku</summary>
        <div className="disclosure__body">
          <GrowthChart
            invested={bondResult.invested}
            breakdown={bondResult.breakdown}
            effectiveInflation={effectiveInflation}
            termLabel={bond.termLabel}
          />

          <div className="table-wrap">
            <table className="year-table">
              <thead>
                <tr>
                  <th>Okres</th>
                  <th>Oprocentowanie</th>
                  <th>Odsetki brutto</th>
                  <th>Kwota na koniec</th>
                  <th>Wartość realna</th>
                </tr>
              </thead>
              <tbody data-year-table-body>
                {bondResult.breakdown.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td>{row.rateLabel}</td>
                    <td>{formatMoney(row.interest)}</td>
                    <td>{formatMoney(row.netBalance)}</td>
                    <td className="value--positive">{formatMoney(row.realValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="helper-text" data-table-helper>
            Kwota na koniec pokazuje wynik po podatku. Wartość realna pokazuje, ile
            ten wynik jest wart po uwzględnieniu inflacji {formatPercent(effectiveInflation)}.
          </p>
        </div>
      </details>

      <details
        className="disclosure deep-dive-disclosure"
        open={educationOpen}
        onToggle={(event: SyntheticEvent<HTMLDetailsElement>) => {
          onEducationToggle(event.currentTarget.open);
        }}
      >
        <summary className="disclosure__trigger">
          Kiedy obligacje, a kiedy lokata?
        </summary>
        <div className="disclosure__body">
          <div className="edu-grid">
            <div className="edu-card">
              <p className="edu-card__title">Podatek Belki (19%)</p>
              <p>
                Od zysków z obligacji, lokat i kont oszczędnościowych pobierany jest
                19% podatku. Wyjątek stanowi przełącznik IKE dla obligacji.
              </p>
            </div>

            <div className="edu-card">
              <p className="edu-card__title">BFG vs Skarb Państwa</p>
              <p>
                Lokaty chroni BFG do 100 000 EUR. Obligacje detaliczne gwarantuje
                Skarb Państwa. To różne mechanizmy bezpieczeństwa, ale oba należą do
                najspokojniejszych opcji.
              </p>
            </div>

            <div className="edu-card">
              <p className="edu-card__title">Inflacja nadal ma znaczenie</p>
              <p>
                Nawet jeśli nie zmienia oprocentowania danej serii, wpływa na realną
                wartość wyniku. Dlatego obok nominalnego zysku pokazano też „co
                zostaje po inflacji”.
              </p>
            </div>

            <div className="edu-card">
              <p className="edu-card__title">Przedterminowy wykup</p>
              <p>
                Detaliczne obligacje możesz wykupić wcześniej, ale zwykle z opłatą
                za każdą sztukę. Lokata zerwana przed terminem najczęściej traci
                odsetki.
              </p>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}
