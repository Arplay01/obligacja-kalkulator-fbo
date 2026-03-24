/**
 * ResultsStep — The comparison dashboard
 * Design: Insight banner + side-by-side comparison cards + growth chart + detailed breakdown.
 * Honest: if deposit wins, it's shown clearly. No persuasion.
 */
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, TrendingUp, Shield, Clock, AlertTriangle, Info, ChevronDown, ChevronUp, Award, Lightbulb, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPLN, formatPLNExact, formatPercent, generateInsight, type CalculationResult } from '@/lib/calculations';
import type { WizardState } from '@/hooks/useWizard';
import { useState, useMemo } from 'react';
import GrowthChart from '@/components/GrowthChart';

interface ResultsStepProps {
  results: CalculationResult[];
  state: WizardState;
  onBack: () => void;
  onReset: () => void;
}

export default function ResultsStep({ results, state, onBack, onReset }: ResultsStepProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(true);

  const insight = useMemo(() => {
    return generateInsight(results, state.amount, state.horizon, state.expectedInflation, state.priority);
  }, [results, state]);

  if (results.length === 0) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      {/* Sticky header */}
      <header className="py-3 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-[#1A1F36]/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#1A1F36]/50 hover:text-[#1A1F36] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Zmień założenia</span>
          </button>
          <div className="text-center">
            <p className="text-xs text-[#1A1F36]/40 tabular-nums">
              {formatPLN(state.amount)} · {results[0]?.termLabel} · inflacja {state.expectedInflation}%
            </p>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-[#1A1F36]/50 hover:text-[#1A1F36] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Od nowa</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto">
          {/* Summary headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1F36] mb-1">
              Twoje porównanie
            </h2>
            <p className="text-[#1A1F36]/50 text-sm sm:text-base">
              {results.length} opcji dla {formatPLN(state.amount)} na {results[0]?.termLabel}. 
              Posortowane od najwyższego zysku netto.
            </p>
          </motion.div>

          {/* Insight banner */}
          {insight.headline && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className={`p-4 sm:p-5 rounded-2xl mb-6 border ${
                insight.tone === 'positive'
                  ? 'bg-[#D4E8E0]/30 border-[#2D6A4F]/10'
                  : insight.tone === 'warning'
                  ? 'bg-[#E8A838]/5 border-[#E8A838]/15'
                  : 'bg-[#1A1F36]/[0.02] border-[#1A1F36]/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  insight.tone === 'positive'
                    ? 'bg-[#2D6A4F]/10'
                    : insight.tone === 'warning'
                    ? 'bg-[#E8A838]/10'
                    : 'bg-[#1A1F36]/5'
                }`}>
                  <Lightbulb className={`w-4.5 h-4.5 ${
                    insight.tone === 'positive'
                      ? 'text-[#2D6A4F]'
                      : insight.tone === 'warning'
                      ? 'text-[#E8A838]'
                      : 'text-[#1A1F36]/60'
                  }`} />
                </div>
                <div>
                  <p className="font-bold text-[#1A1F36] text-sm sm:text-base">{insight.headline}</p>
                  <p className="text-sm text-[#1A1F36]/55 mt-1 leading-relaxed">{insight.detail}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8A838]/5 border border-[#E8A838]/10 mb-6"
          >
            <AlertTriangle className="w-4 h-4 text-[#E8A838] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1A1F36]/50 leading-relaxed">
              <strong className="text-[#1A1F36]/70">To jest symulacja, nie gwarancja.</strong> Wyniki dla obligacji zmiennoprocentowych i indeksowanych inflacją 
              zależą od przyszłej inflacji i stóp procentowych — nikt ich nie zna. Oprocentowanie lokat i kont oszczędnościowych 
              może się zmienić w dowolnym momencie.
            </p>
          </motion.div>

          {/* Growth chart */}
          {state.horizon >= 12 && results.some(r => r.yearlyBreakdown.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <button
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2 text-sm font-medium text-[#1A1F36]/50 hover:text-[#1A1F36] mb-3 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Wykres wzrostu w czasie
                {showChart ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showChart && (
                <div className="bg-white rounded-2xl border border-[#1A1F36]/5 p-3 sm:p-5">
                  <GrowthChart results={results} invested={state.amount} />
                </div>
              )}
            </motion.div>
          )}

          {/* Result cards */}
          <div className="space-y-3">
            {results.map((result, index) => (
              <motion.div
                key={result.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.04 }}
              >
                <ResultCard
                  result={result}
                  rank={index + 1}
                  isExpanded={expandedCard === result.productId}
                  onToggle={() => setExpandedCard(
                    expandedCard === result.productId ? null : result.productId
                  )}
                  invested={state.amount}
                  expectedInflation={state.expectedInflation}
                />
              </motion.div>
            ))}
          </div>

          {/* Educational footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 p-5 sm:p-6 rounded-2xl bg-white border border-[#1A1F36]/5"
          >
            <h3 className="font-bold text-[#1A1F36] mb-4 flex items-center gap-2 text-sm sm:text-base">
              <Info className="w-5 h-5 text-[#E8A838]" />
              Co warto wiedzieć
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 text-sm text-[#1A1F36]/55">
              <div>
                <p className="font-semibold text-[#1A1F36] mb-1">Podatek Belki (19%)</p>
                <p className="leading-relaxed">Od każdego zysku z oszczędności — czy to z lokaty, konta, czy obligacji — państwo pobiera 19% podatku. 
                Wszystkie kwoty powyżej to zysk NETTO, po podatku.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1A1F36] mb-1">Gwarancja BFG vs Skarb Państwa</p>
                <p className="leading-relaxed">Lokaty i konta są gwarantowane przez BFG do 100 tys. EUR na bank. 
                Obligacje skarbowe gwarantuje bezpośrednio Skarb Państwa — bez limitu kwoty.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1A1F36] mb-1">Inflacja zjada oszczędności</p>
                <p className="leading-relaxed">Jeśli inflacja wynosi 3%, a Twoja lokata daje 4%, to realnie zarabiasz tylko ok. 1%. 
                Obligacje indeksowane inflacją automatycznie dostosowują oprocentowanie.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1A1F36] mb-1">Wcześniejszy wykup obligacji</p>
                <p className="leading-relaxed">Możesz wykupić obligacje przed terminem, ale zapłacisz niewielką opłatę (0,50–3,00 zł za sztukę). 
                Przy lokacie zerwanie zwykle oznacza utratę WSZYSTKICH odsetek.</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 pb-12 text-center space-y-3">
            <a
              href="https://www.obligacjeskarbowe.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#1A1F36]/30 hover:text-[#1A1F36]/50 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Kup obligacje na obligacjeskarbowe.pl
            </a>
            <p className="text-xs text-[#1A1F36]/25">
              Dane obligacji: obligacjeskarbowe.pl, marzec 2026. Narzędzie edukacyjne — nie stanowi porady inwestycyjnej.
              <br />
              Stworzone dla Finanse Bardzo Osobiste.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function ResultCard({
  result,
  rank,
  isExpanded,
  onToggle,
  invested,
  expectedInflation,
}: {
  result: CalculationResult;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
  invested: number;
  expectedInflation: number;
}) {
  const isWinner = rank === 1;
  const isBond = result.productType === 'bond';
  const realProfitPositive = result.realReturn > invested;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isWinner
          ? 'border-[#E8A838]/30 bg-white shadow-md shadow-[#E8A838]/5'
          : 'border-[#1A1F36]/[0.04] bg-white hover:border-[#1A1F36]/10'
      }`}
    >
      {/* Main row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 sm:p-5"
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Rank */}
          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs sm:text-sm font-bold ${
            isWinner ? 'bg-[#E8A838] text-white' : 'bg-[#1A1F36]/5 text-[#1A1F36]/35'
          }`}>
            {isWinner ? <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : rank}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#1A1F36] text-base sm:text-lg leading-tight">
                {isBond ? `${result.productId} ` : ''}{result.productName}
              </h3>
              <span
                className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
                  result.typeLabel.includes('inflacj')
                    ? 'bg-[#E8A838]/10 text-[#B07D1A]'
                    : result.typeLabel.includes('Zmienne')
                    ? 'bg-[#1A1F36]/5 text-[#1A1F36]/60'
                    : result.typeLabel.includes('Stałe')
                    ? 'bg-[#1A1F36]/5 text-[#1A1F36]/60'
                    : result.typeLabel === 'Lokata'
                    ? 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                    : 'bg-[#2D6A4F]/10 text-[#2D6A4F]'
                }`}
              >
                {result.typeLabel}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1A1F36]/45 mt-0.5 line-clamp-2">{result.description}</p>
          </div>

          {/* Key numbers - desktop */}
          <div className="text-right shrink-0 hidden sm:block">
            <p className={`text-xl sm:text-2xl font-extrabold tabular-nums ${
              isWinner ? 'text-[#1A1F36]' : 'text-[#1A1F36]'
            }`}>
              +{formatPLN(result.netProfit)}
            </p>
            <p className="text-xs text-[#1A1F36]/40 mt-0.5">
              zysk netto · {formatPercent(result.effectiveAnnualRate)} rocznie
            </p>
            <p className={`text-[11px] font-medium mt-1 ${realProfitPositive ? 'text-[#2D6A4F]' : 'text-red-400'}`}>
              {realProfitPositive ? 'Pokonuje inflację' : 'Nie pokrywa inflacji'}
            </p>
          </div>

          {/* Key numbers - mobile */}
          <div className="text-right shrink-0 sm:hidden">
            <p className="text-lg font-extrabold text-[#1A1F36] tabular-nums">
              +{formatPLN(result.netProfit)}
            </p>
            <p className="text-[10px] text-[#1A1F36]/40 tabular-nums">
              {formatPercent(result.effectiveAnnualRate)}/rok
            </p>
            <p className={`text-[10px] font-medium mt-0.5 ${realProfitPositive ? 'text-[#2D6A4F]' : 'text-red-400'}`}>
              {realProfitPositive ? 'Pokonuje inflację' : 'Nie pokrywa inflacji'}
            </p>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex items-center justify-center mt-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#1A1F36]/20" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#1A1F36]/20" />
          )}
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="border-t border-[#1A1F36]/5"
        >
          <div className="p-4 sm:p-5 space-y-5">
            {/* Numbers grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <NumberBox label="Wpłacasz" value={formatPLN(result.invested)} />
              <NumberBox label="Odsetki brutto" value={formatPLNExact(result.grossReturn - result.invested)} />
              <NumberBox label="Podatek Belki" value={`−${formatPLNExact(result.tax)}`} negative />
              <NumberBox label="Zysk netto" value={`+${formatPLNExact(result.netProfit)}`} highlight />
            </div>

            {/* Real value */}
            <div className="p-3.5 rounded-xl bg-[#FAFAF8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1F36]">Realna wartość po inflacji</p>
                  <p className="text-xs text-[#1A1F36]/35">
                    Przy założeniu inflacji {expectedInflation}% rocznie
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold tabular-nums ${
                    result.realReturn >= invested ? 'text-[#2D6A4F]' : 'text-red-500'
                  }`}>
                    {formatPLN(result.realReturn)}
                  </p>
                  <p className={`text-xs ${
                    result.realReturn >= invested ? 'text-[#2D6A4F]' : 'text-red-500'
                  }`}>
                    {result.realReturn >= invested
                      ? `+${formatPLN(result.realReturn - invested)} realnie`
                      : `${formatPLN(result.realReturn - invested)} realnie`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#D4E8E0]/15">
                <p className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-widest mb-1.5">Zalety</p>
                <p className="text-sm text-[#1A1F36]/65 leading-relaxed">{result.prosText}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-red-50/40">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1.5">Wady</p>
                <p className="text-sm text-[#1A1F36]/65 leading-relaxed">{result.consText}</p>
              </div>
            </div>

            {/* Yearly breakdown table */}
            {result.yearlyBreakdown.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-[#1A1F36] mb-3">Rok po roku</p>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-sm min-w-[400px]">
                    <thead>
                      <tr className="border-b border-[#1A1F36]/10">
                        <th className="text-left py-2 pr-3 pl-4 sm:pl-0 text-[#1A1F36]/35 font-medium text-xs">Rok</th>
                        <th className="text-right py-2 px-3 text-[#1A1F36]/35 font-medium text-xs">Saldo</th>
                        <th className="text-right py-2 px-3 text-[#1A1F36]/35 font-medium text-xs">Odsetki</th>
                        <th className="text-right py-2 pl-3 pr-4 sm:pr-0 text-[#1A1F36]/35 font-medium text-xs">Wartość realna</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-b border-[#1A1F36]/[0.03]">
                          <td className="py-2 pr-3 pl-4 sm:pl-0 text-[#1A1F36]/50 text-xs">{row.year}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-[#1A1F36] text-xs font-medium">
                            {formatPLNExact(row.balance)}
                          </td>
                          <td className="py-2 px-3 text-right tabular-nums text-[#1A1F36]/50 text-xs">
                            +{formatPLNExact(row.interest)}
                          </td>
                          <td className={`py-2 pl-3 pr-4 sm:pr-0 text-right tabular-nums text-xs font-medium ${
                            row.realValue >= invested ? 'text-[#2D6A4F]' : 'text-red-400'
                          }`}>
                            {formatPLNExact(row.realValue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Early redemption info for bonds */}
            {isBond && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#1A1F36]/[0.02]">
                <Clock className="w-4 h-4 text-[#1A1F36]/25 shrink-0 mt-0.5" />
                <p className="text-xs text-[#1A1F36]/40 leading-relaxed">
                  Wcześniejszy wykup: opłata {result.earlyRedemptionFee > 0 ? `${result.earlyRedemptionFee.toFixed(2)} zł` : 'brak opłaty'} za obligację. 
                  Obligacje kupujesz na obligacjeskarbowe.pl lub w PKO BP / Pekao SA.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function NumberBox({
  label,
  value,
  highlight = false,
  negative = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div className={`p-3 rounded-xl ${highlight ? 'bg-[#E8A838]/5' : 'bg-[#FAFAF8]'}`}>
      <p className="text-[10px] text-[#1A1F36]/35 mb-0.5">{label}</p>
      <p className={`text-base sm:text-lg font-bold tabular-nums ${
        highlight ? 'text-[#E8A838]' : negative ? 'text-red-400' : 'text-[#1A1F36]'
      }`}>
        {value}
      </p>
    </div>
  );
}
