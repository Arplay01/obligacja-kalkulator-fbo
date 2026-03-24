/**
 * Results Table – Comparison of all selected bonds
 * Design: Clean data table with sparkline-like indicators
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, ArrowUp, ArrowDown, ChevronDown, Trophy, Landmark } from "lucide-react";
import {
  type CalculatorResults,
  type BondResult,
  formatPLN,
  formatPercent,
  formatPercentSimple,
} from "@/lib/bondCalculator";

interface Props {
  results: CalculatorResults;
  useIKE: boolean;
}

function RealReturnBadge({ rate }: { rate: number }) {
  const isPositive = rate > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 tabular-nums text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {formatPercent(rate)}
    </span>
  );
}

function BondRow({ result, isBest, depositReturn }: { result: BondResult; isBest: boolean; depositReturn: number; }) {
  const [open, setOpen] = useState(false);
  const bond = result.bondInfo;
  const beatsDeposit = result.totalInterestAfterTax > depositReturn;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <tr className={`
          cursor-pointer transition-colors hover:bg-muted/30
          ${isBest ? 'bg-primary/[0.02]' : ''}
        `}>
          {/* Bond name */}
          <td className="py-3 px-3 sm:px-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: bond.color }}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{bond.name}</span>
                  {isBest && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {bond.durationLabel} · {bond.categoryLabel}
                </span>
              </div>
            </div>
          </td>

          {/* First year rate */}
          <td className="py-3 px-2 sm:px-4 text-right">
            <span className="tabular-nums text-sm font-medium">
              {formatPercentSimple(bond.firstYearRate)}
            </span>
          </td>

          {/* Net profit */}
          <td className="py-3 px-2 sm:px-4 text-right">
            <span className="tabular-nums text-sm font-semibold text-foreground">
              {formatPLN(result.totalInterestAfterTax)}
            </span>
          </td>

          {/* Total at maturity */}
          <td className="py-3 px-2 sm:px-4 text-right hidden md:table-cell">
            <span className="tabular-nums text-sm">
              {formatPLN(result.totalAtMaturity)}
            </span>
          </td>

          {/* Effective rate */}
          <td className="py-3 px-2 sm:px-4 text-right hidden lg:table-cell">
            <span className="tabular-nums text-sm font-medium">
              {formatPercentSimple(result.effectiveAnnualRate)}
            </span>
          </td>

          {/* Real return */}
          <td className="py-3 px-2 sm:px-4 text-right">
            <RealReturnBadge rate={result.realReturnRate} />
          </td>

          {/* vs Deposit */}
          <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
            {beatsDeposit ? (
              <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                Lepiej
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                Gorzej
              </Badge>
            )}
          </td>

          {/* Expand */}
          <td className="py-3 px-2 sm:px-3 text-right">
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform inline-block ${open ? 'rotate-180' : ''}`} />
          </td>
        </tr>
      </CollapsibleTrigger>

      <CollapsibleContent asChild>
        <tr>
          <td colSpan={8} className="px-3 sm:px-4 pb-4">
            <div className="bg-muted/30 rounded-lg p-4 mt-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Zainwestowano</p>
                  <p className="tabular-nums font-medium">{formatPLN(result.totalInvested)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Odsetki brutto</p>
                  <p className="tabular-nums font-medium">{formatPLN(result.totalInterest)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Odsetki netto</p>
                  <p className="tabular-nums font-medium text-emerald-600">{formatPLN(result.totalInterestAfterTax)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Opłata za wcz. wykup</p>
                  <p className="tabular-nums font-medium">{formatPLN(result.earlyExitCost)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kapitalizacja</p>
                  <p className="font-medium">{bond.capitalizationLabel}</p>
                </div>
              </div>

              {/* Yearly breakdown */}
              {result.yearlyBreakdown.length > 1 && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/40">
                        <th className="text-left py-1.5 pr-3 text-muted-foreground font-medium">Rok</th>
                        <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Oprocentowanie</th>
                        <th className="text-right py-1.5 px-2 text-muted-foreground font-medium">Odsetki</th>
                        <th className="text-right py-1.5 pl-2 text-muted-foreground font-medium">Wartość</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.yearlyBreakdown.map((row) => (
                        <tr key={row.year} className="border-b border-border/20">
                          <td className="py-1.5 pr-3 font-medium">{row.year}</td>
                          <td className="py-1.5 px-2 text-right tabular-nums">{formatPercentSimple(row.effectiveRate)}</td>
                          <td className="py-1.5 px-2 text-right tabular-nums">{formatPLN(row.interestEarned)}</td>
                          <td className="py-1.5 pl-2 text-right tabular-nums font-medium">{formatPLN(row.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </td>
        </tr>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ResultsTable({ results, useIKE }: Props) {
  return (
    <Card className="border border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
              <Table className="w-4 h-4 text-primary" />
            </div>
            Porównanie obligacji
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {useIKE ? "IKE – bez podatku" : "Podatek Belki 19%"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20">
                <th className="text-left py-2.5 px-3 sm:px-4 text-xs font-medium text-muted-foreground">Obligacja</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Oprocentowanie</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Zysk netto</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground hidden md:table-cell">Na koniec</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground hidden lg:table-cell">Efektywna stopa</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground">Realna stopa</th>
                <th className="text-right py-2.5 px-2 sm:px-4 text-xs font-medium text-muted-foreground hidden sm:table-cell">vs Lokata</th>
                <th className="py-2.5 px-2 sm:px-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {results.bonds.map((result) => {
                const depForBond = results.depositPerBond.get(result.bondType);
                return (
                  <BondRow
                    key={result.bondType}
                    result={result}
                    isBest={result.bondType === results.bestBond}
                    depositReturn={depForBond?.totalInterestAfterTax ?? results.depositResult.totalInterestAfterTax}
                  />
                );
              })}
              {/* Deposit row */}
              <tr className="border-t-2 border-border/40 bg-amber-50/30">
                <td className="py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-semibold text-sm text-amber-800">Lokata</span>
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {results.depositResult.years > 1 ? `${results.depositResult.years} lat` : '1 rok'} · Porównanie
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <span className="tabular-nums text-sm font-medium text-amber-700">
                    {formatPercentSimple(results.depositResult.effectiveAnnualRate)}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <span className="tabular-nums text-sm font-semibold text-amber-800">
                    {formatPLN(results.depositResult.totalInterestAfterTax)}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden md:table-cell">
                  <span className="tabular-nums text-sm text-amber-700">
                    {formatPLN(results.depositResult.totalAtMaturity)}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden lg:table-cell">
                  <span className="tabular-nums text-sm font-medium text-amber-700">
                    {formatPercentSimple(results.depositResult.effectiveAnnualRate)}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4 text-right">
                  <RealReturnBadge rate={results.depositResult.realReturnRate} />
                </td>
                <td className="py-3 px-2 sm:px-4 text-right hidden sm:table-cell">
                  <Badge variant="secondary" className="text-[10px]">Ref.</Badge>
                </td>
                <td className="py-3 px-2 sm:px-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
