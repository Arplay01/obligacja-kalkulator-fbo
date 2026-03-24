/**
 * Parameters Panel – User inputs for the calculator
 * Design: Clean card with labeled inputs, tooltips for beginners
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Info, ChevronDown, Wallet, TrendingUp, Landmark, PiggyBank } from "lucide-react";
import type { CalculatorInputs } from "@/lib/bondCalculator";

interface Props {
  inputs: CalculatorInputs;
  onInputChange: (partial: Partial<CalculatorInputs>) => void;
  onInflationChange: (index: number, value: number) => void;
}

function HelpTip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="w-3.5 h-3.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs leading-relaxed">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export default function ParametersPanel({ inputs, onInputChange, onInflationChange }: Props) {
  const [inflationOpen, setInflationOpen] = useState(false);

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          Twoje założenia
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Wpisz kwotę inwestycji i przewidywane warunki rynkowe.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Row 1: Investment Amount + IKE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Investment Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="amount" className="text-sm font-medium">
                Kwota inwestycji (PLN)
              </Label>
              <HelpTip text="Ile pieniędzy chcesz zainwestować w obligacje? Minimalna kwota to 100 zł (1 obligacja)." />
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                min={100}
                step={100}
                value={inputs.investmentAmount}
                onChange={(e) => onInputChange({ investmentAmount: Math.max(100, Number(e.target.value) || 100) })}
                className="pl-3 pr-12 tabular-nums text-base h-11"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                zł
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              = {Math.floor(inputs.investmentAmount / 100)} obligacji po 100 zł
            </p>
          </div>

          {/* IKE Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">Konto IKE/IKZE</Label>
              <HelpTip text="Indywidualne Konto Emerytalne (IKE) lub IKZE pozwala uniknąć podatku Belki (19% od zysków kapitałowych)." />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/40">
              <Switch
                checked={inputs.useIKE}
                onCheckedChange={(checked) => onInputChange({ useIKE: checked })}
              />
              <div>
                <p className="text-sm font-medium">
                  {inputs.useIKE ? "Tak, korzystam z IKE/IKZE" : "Nie, zwykły rachunek"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {inputs.useIKE
                    ? "Brak podatku Belki (19%)"
                    : "Podatek Belki: 19% od zysków"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: NBP Rate + Deposit Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NBP Reference Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="nbp" className="text-sm font-medium">
                Stopa referencyjna NBP
              </Label>
              <HelpTip text="Stopa procentowa ustalana przez NBP. Wpływa na oprocentowanie obligacji ROR i DOR. Aktualna wartość: 5,75%." />
            </div>
            <div className="space-y-3">
              <Slider
                value={[inputs.nbpRate]}
                onValueChange={([v]) => onInputChange({ nbpRate: v })}
                min={0}
                max={15}
                step={0.25}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground">0%</span>
                </div>
                <span className="tabular-nums text-sm font-semibold text-primary">
                  {inputs.nbpRate.toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground">15%</span>
              </div>
            </div>
          </div>

          {/* Deposit Rate */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="deposit" className="text-sm font-medium">
                Oprocentowanie lokaty (do porównania)
              </Label>
              <HelpTip text="Średnie oprocentowanie lokaty bankowej, z którą chcesz porównać obligacje." />
            </div>
            <div className="space-y-3">
              <Slider
                value={[inputs.depositRate]}
                onValueChange={([v]) => onInputChange({ depositRate: v })}
                min={0}
                max={15}
                step={0.25}
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <PiggyBank className="w-3.5 h-3.5 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground">0%</span>
                </div>
                <span className="tabular-nums text-sm font-semibold text-amber-600">
                  {inputs.depositRate.toFixed(2)}%
                </span>
                <span className="text-xs text-muted-foreground">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Inflation */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">
              Przewidywana inflacja (rok 1)
            </Label>
            <HelpTip text="Prognozowany poziom inflacji. Wpływa na oprocentowanie obligacji indeksowanych inflacją (COI, EDO, ROS, ROD) od 2. roku." />
          </div>
          <div className="space-y-3">
            <Slider
              value={[inputs.inflationRates[0]]}
              onValueChange={([v]) => onInflationChange(0, v)}
              min={-2}
              max={20}
              step={0.1}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground">-2%</span>
              </div>
              <span className="tabular-nums text-sm font-semibold text-rose-600">
                {inputs.inflationRates[0].toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">20%</span>
            </div>
          </div>

          {/* Advanced: per-year inflation */}
          <Collapsible open={inflationOpen} onOpenChange={setInflationOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1 px-0">
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${inflationOpen ? 'rotate-180' : ''}`} />
                {inflationOpen ? "Ukryj" : "Ustaw inflację dla każdego roku osobno"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {inputs.inflationRates.map((rate, i) => (
                  <div key={i} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Rok {i + 1}
                    </Label>
                    <Input
                      type="number"
                      min={-5}
                      max={50}
                      step={0.1}
                      value={rate}
                      onChange={(e) => onInflationChange(i, Number(e.target.value) || 0)}
                      className="tabular-nums text-sm h-9"
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs text-muted-foreground"
                onClick={() => {
                  const firstRate = inputs.inflationRates[0];
                  const newRates = inputs.inflationRates.map(() => firstRate);
                  onInputChange({ inflationRates: newRates });
                }}
              >
                Ustaw wszystkie na {inputs.inflationRates[0].toFixed(1)}%
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}
