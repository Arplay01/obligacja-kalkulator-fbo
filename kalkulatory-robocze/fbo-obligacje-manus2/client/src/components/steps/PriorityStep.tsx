/**
 * PriorityStep - "Co jest dla Ciebie ważniejsze?"
 * Design: Two clear choices + advanced settings.
 * This step also lets users tweak deposit rate and inflation assumptions.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, TrendingUp, Settings2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { StepHeader } from './AmountStep';
import { useState } from 'react';
import type { WizardState } from '@/hooks/useWizard';

interface PriorityStepProps {
  state: WizardState;
  onUpdate: (updates: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PriorityStep({ state, onUpdate, onNext, onBack }: PriorityStepProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <StepHeader stepNumber={3} totalSteps={3} onBack={onBack} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F36] mb-2">
            Co jest ważniejsze?
          </h2>
          <p className="text-base sm:text-lg text-[#1A1F36]/50 mb-8">
            Nie ma jednej dobrej odpowiedzi - zależy od Twojej sytuacji. To pomoże nam lepiej dobrać porównanie.
          </p>

          {/* Priority cards */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <PriorityCard
              icon={<Lock className="w-5 h-5" />}
              title="Pewność zysku"
              description="Chcę wiedzieć z góry, ile dokładnie zarobię. Wolę mniej, ale pewnie."
              selected={state.priority === 'certainty'}
              onClick={() => onUpdate({ priority: 'certainty' })}
            />
            <PriorityCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Ochrona przed inflacją"
              description="Chcę, żeby moje pieniądze nie traciły na wartości. Nawet jeśli zysk jest niepewny."
              selected={state.priority === 'inflation_protection'}
              onClick={() => onUpdate({ priority: 'inflation_protection' })}
            />
          </div>

          {/* Family 800+ toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#1A1F36]/[0.04] mb-5">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-[#1A1F36]/30" />
              <div>
                <p className="text-sm font-medium text-[#1A1F36]">Korzystam z programu Rodzina 800+</p>
                <p className="text-[11px] text-[#1A1F36]/35">Odblokuje obligacje rodzinne z wyższym oprocentowaniem</p>
              </div>
            </div>
            <Switch
              checked={state.includeFamily}
              onCheckedChange={(checked) => onUpdate({ includeFamily: checked })}
            />
          </div>

          {/* Advanced settings toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs text-[#1A1F36]/30 hover:text-[#1A1F36]/50 transition-colors mb-4"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Dostosuj założenia
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-5 p-5 rounded-xl bg-white border border-[#1A1F36]/[0.04] mb-6">
                  {/* Deposit rate */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[#1A1F36]">
                        Oprocentowanie lokaty
                      </label>
                      <span className="text-sm font-bold text-[#1A1F36] tabular-nums">
                        {state.depositRate.toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[state.depositRate]}
                      onValueChange={([v]) => onUpdate({ depositRate: Math.round(v * 10) / 10 })}
                      min={1}
                      max={8}
                      step={0.1}
                    />
                    <p className="text-[11px] text-[#1A1F36]/30 mt-1.5">
                      Średnia roczna lokata w marcu 2026: ok. 4–5%. Sprawdź swoją ofertę.
                    </p>
                  </div>

                  {/* Savings rate */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[#1A1F36]">
                        Oprocentowanie konta oszczędnościowego
                      </label>
                      <span className="text-sm font-bold text-[#1A1F36] tabular-nums">
                        {state.savingsRate.toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[state.savingsRate]}
                      onValueChange={([v]) => onUpdate({ savingsRate: Math.round(v * 10) / 10 })}
                      min={0.5}
                      max={7}
                      step={0.1}
                    />
                    <p className="text-[11px] text-[#1A1F36]/30 mt-1.5">
                      Typowe konto oszczędnościowe: 3–4%
                    </p>
                  </div>

                  {/* Expected inflation */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[#1A1F36]">
                        Oczekiwana średnia inflacja
                      </label>
                      <span className="text-sm font-bold text-[#1A1F36] tabular-nums">
                        {state.expectedInflation.toFixed(1)}%
                      </span>
                    </div>
                    <Slider
                      value={[state.expectedInflation]}
                      onValueChange={([v]) => onUpdate({ expectedInflation: Math.round(v * 10) / 10 })}
                      min={0}
                      max={10}
                      step={0.1}
                    />
                    <p className="text-[11px] text-[#1A1F36]/30 mt-1.5">
                      Inflacja w lutym 2026: 2,1%. Średnia 2025: 3,6%. Nikt nie wie jaka będzie w przyszłości.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end">
            <Button
              onClick={onNext}
              size="lg"
              className="bg-[#E8A838] hover:bg-[#D4952E] text-[#1A1F36] px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-[#E8A838]/15 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Pokaż porównanie
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function PriorityCard({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`text-left p-5 rounded-xl border transition-all duration-200 ${
        selected
          ? 'border-[#1A1F36] bg-[#1A1F36]/[0.02] shadow-sm'
          : 'border-[#1A1F36]/[0.04] bg-white hover:border-[#1A1F36]/10 hover:shadow-sm'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          selected ? 'bg-[#1A1F36] text-white' : 'bg-[#1A1F36]/5 text-[#1A1F36]/50'
        }`}
      >
        {icon}
      </div>
      <p className="font-bold text-[#1A1F36] text-base mb-0.5">{title}</p>
      <p className="text-xs text-[#1A1F36]/45 leading-relaxed">{description}</p>
    </motion.button>
  );
}
