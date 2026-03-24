/**
 * Best Bond Card – Highlights the best-performing bond
 * Design: "Forteca Finansowa" – prominent highlight with left accent border
 */

import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { type CalculatorResults, formatPLN, formatPercent, formatPercentSimple } from "@/lib/bondCalculator";

interface Props {
  results: CalculatorResults;
}

export default function BestBondCard({ results }: Props) {
  const best = results.bonds.find(b => b.bondType === results.bestBond);
  if (!best || best.totalInvested === 0) return null;

  const isPositiveReal = best.realReturnRate > 0;
  const bondColor = best.bondInfo.color;

  return (
    <div
      className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden"
      style={{ borderLeftWidth: '4px', borderLeftColor: bondColor }}
    >
      <div className="px-5 py-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ backgroundColor: `${bondColor}18` }}
          >
            <Trophy className="w-4 h-4" style={{ color: bondColor }} />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Najlepsza opcja przy Twoich założeniach
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          {/* Bond name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color: bondColor }}
              >
                {best.bondInfo.name}
              </span>
              <span className="text-base font-semibold text-foreground truncate">
                {best.bondInfo.fullName}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {best.bondInfo.durationLabel} · {best.bondInfo.categoryLabel}
            </p>
          </div>

          {/* Metrics row */}
          <div className="flex gap-6 sm:gap-8 shrink-0">
            {/* Net profit */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Zysk netto</p>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {formatPLN(best.totalInterestAfterTax)}
              </p>
            </div>

            {/* Effective rate */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Efektywna stopa</p>
              <p className="text-xl font-bold tabular-nums text-foreground">
                {formatPercentSimple(best.effectiveAnnualRate)}
              </p>
            </div>

            {/* Real return */}
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Realna stopa zwrotu</p>
              <div className="flex items-center gap-1">
                {isPositiveReal ? (
                  <ArrowUp className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-rose-500 shrink-0" />
                )}
                <p className={`text-xl font-bold tabular-nums ${isPositiveReal ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatPercent(best.realReturnRate)}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground">rocznie vs inflacja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
