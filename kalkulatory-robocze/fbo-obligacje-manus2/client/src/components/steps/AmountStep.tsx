/**
 * AmountStep — "Ile masz do ulokowania?"
 * Design: Single question, big slider, immediate feedback.
 * Plain language, no financial jargon.
 */
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatPLN } from '@/lib/calculations';
import { useState } from 'react';

interface AmountStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const AMOUNT_STEPS = [
  1000, 2000, 3000, 5000, 7000, 10000, 15000, 20000, 30000, 50000,
  75000, 100000, 150000, 200000, 300000, 500000,
];

function amountToSlider(amount: number): number {
  const idx = AMOUNT_STEPS.findIndex(s => s >= amount);
  if (idx === -1) return AMOUNT_STEPS.length - 1;
  if (idx === 0) return 0;
  const lower = AMOUNT_STEPS[idx - 1];
  const upper = AMOUNT_STEPS[idx];
  const fraction = (amount - lower) / (upper - lower);
  return idx - 1 + fraction;
}

function sliderToAmount(value: number): number {
  const idx = Math.floor(value);
  if (idx >= AMOUNT_STEPS.length - 1) return AMOUNT_STEPS[AMOUNT_STEPS.length - 1];
  const fraction = value - idx;
  const lower = AMOUNT_STEPS[idx];
  const upper = AMOUNT_STEPS[idx + 1];
  const raw = lower + fraction * (upper - lower);
  if (raw < 5000) return Math.round(raw / 100) * 100;
  if (raw < 50000) return Math.round(raw / 1000) * 1000;
  return Math.round(raw / 5000) * 5000;
}

export default function AmountStep({ amount, onAmountChange, onNext, onBack }: AmountStepProps) {
  const [sliderValue, setSliderValue] = useState(amountToSlider(amount));

  const handleSliderChange = (values: number[]) => {
    const val = values[0];
    setSliderValue(val);
    onAmountChange(sliderToAmount(val));
  };

  const numBonds = Math.floor(amount / 100);

  return (
    <div className="min-h-screen flex flex-col">
      <StepHeader stepNumber={1} totalSteps={3} onBack={onBack} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F36] mb-2">
            Ile chcesz ulokować?
          </h2>
          <p className="text-base sm:text-lg text-[#1A1F36]/50 mb-10">
            Kwota, którą chcesz porównać. Nie musisz być precyzyjny — to orientacyjne porównanie.
          </p>

          {/* Amount display */}
          <div className="text-center mb-8">
            <motion.div
              key={amount}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.12 }}
              className="text-5xl sm:text-6xl font-extrabold text-[#1A1F36] tabular-nums"
            >
              {formatPLN(amount)}
            </motion.div>
            <p className="text-sm text-[#1A1F36]/35 mt-2">
              To {numBonds} obligacji po 100 zł każda
            </p>
          </div>

          {/* Slider */}
          <div className="px-2 mb-10">
            <Slider
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              min={0}
              max={AMOUNT_STEPS.length - 1}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between mt-3 text-xs text-[#1A1F36]/30">
              <span>1 000 zł</span>
              <span>500 000 zł</span>
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {[5000, 10000, 20000, 50000, 100000].map(a => (
              <button
                key={a}
                onClick={() => {
                  onAmountChange(a);
                  setSliderValue(amountToSlider(a));
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  amount === a
                    ? 'bg-[#1A1F36] text-white shadow-sm'
                    : 'bg-[#1A1F36]/[0.03] text-[#1A1F36]/60 hover:bg-[#1A1F36]/[0.07]'
                }`}
              >
                {formatPLN(a)}
              </button>
            ))}
          </div>

          {/* Info note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E8A838]/5 border border-[#E8A838]/10 mb-8">
            <Info className="w-4 h-4 text-[#E8A838] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1A1F36]/50 leading-relaxed">
              Obligacje kupuje się w sztukach po <strong className="text-[#1A1F36]/70">100 zł</strong>. Jeśli wpiszesz np. 10 350 zł, 
              porównanie będzie dla <strong className="text-[#1A1F36]/70">10 300 zł</strong> (103 obligacje). Reszta zostanie na koncie.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onNext}
              size="lg"
              className="bg-[#1A1F36] hover:bg-[#1A1F36]/90 text-white px-8 py-6 text-lg rounded-xl shadow-md shadow-[#1A1F36]/10 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Dalej
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export function StepHeader({ stepNumber, totalSteps, onBack }: { stepNumber: number; totalSteps: number; onBack: () => void }) {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#1A1F36]/40 hover:text-[#1A1F36] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć
        </button>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i < stepNumber
                  ? 'w-8 bg-[#E8A838]'
                  : i === stepNumber
                  ? 'w-8 bg-[#1A1F36]'
                  : 'w-4 bg-[#1A1F36]/8'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[#1A1F36]/30 tabular-nums">
          {stepNumber} z {totalSteps}
        </span>
      </div>
    </header>
  );
}
