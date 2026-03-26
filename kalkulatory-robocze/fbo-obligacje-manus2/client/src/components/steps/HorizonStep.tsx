/**
 * HorizonStep - "Na jak długo możesz odłożyć te pieniądze?"
 * Design: Visual timeline with selectable periods.
 * Each period explains what it means in plain language.
 */
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepHeader } from './AmountStep';

interface HorizonStepProps {
  horizon: number;
  onHorizonChange: (months: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const HORIZONS = [
  {
    months: 3,
    label: '3 miesiące',
    sublabel: 'Potrzebuję pieniędzy wkrótce',
    description: 'Krótki okres - mało opcji, ale pieniądze szybko wracają.',
    icon: '⚡',
  },
  {
    months: 12,
    label: '1 rok',
    sublabel: 'Mogę poczekać rok',
    description: 'Dobry kompromis - więcej opcji niż na 3 miesiące.',
    icon: '📅',
  },
  {
    months: 24,
    label: '2 lata',
    sublabel: 'Nie potrzebuję tych pieniędzy przez 2 lata',
    description: 'Otwierają się obligacje zmiennoprocentowe.',
    icon: '🗓️',
  },
  {
    months: 36,
    label: '3 lata',
    sublabel: 'Mogę zamrozić na 3 lata',
    description: 'Dostępne obligacje stałoprocentowe z kapitalizacją.',
    icon: '📊',
  },
  {
    months: 48,
    label: '4 lata',
    sublabel: 'Długoterminowe oszczędzanie',
    description: 'Obligacje indeksowane inflacją - ochrona przed wzrostem cen.',
    icon: '🛡️',
  },
  {
    months: 120,
    label: '10 lat',
    sublabel: 'Oszczędzam na przyszłość',
    description: 'Najwyższe potencjalne zyski z kapitalizacją i ochroną przed inflacją.',
    icon: '🏔️',
  },
];

export default function HorizonStep({ horizon, onHorizonChange, onNext, onBack }: HorizonStepProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <StepHeader stepNumber={2} totalSteps={3} onBack={onBack} />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1F36] mb-2">
            Na jak długo?
          </h2>
          <p className="text-base sm:text-lg text-[#1A1F36]/50 mb-8">
            Jak długo możesz nie ruszać tych pieniędzy? Wybierz okres, który najbardziej pasuje do Twojej sytuacji.
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {HORIZONS.map((h, index) => (
              <motion.button
                key={h.months}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                onClick={() => onHorizonChange(h.months)}
                className={`relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                  horizon === h.months
                    ? 'border-[#1A1F36] bg-[#1A1F36]/[0.02] shadow-sm'
                    : 'border-[#1A1F36]/[0.04] bg-white hover:border-[#1A1F36]/10 hover:shadow-sm'
                }`}
              >
                {horizon === h.months && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-[#1A1F36] flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-xl">{h.icon}</span>
                  <div>
                    <p className="font-bold text-[#1A1F36] text-base sm:text-lg leading-tight">{h.label}</p>
                    <p className="text-xs sm:text-sm text-[#1A1F36]/45 mt-0.5">{h.sublabel}</p>
                    <p className="text-[11px] text-[#1A1F36]/30 mt-1.5 leading-relaxed">{h.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#D4E8E0]/20 border border-[#D4E8E0]/30 mb-8">
            <Clock className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <p className="text-xs text-[#1A1F36]/50 leading-relaxed">
              Obligacje można wykupić wcześniej (za niewielką opłatą), ale najlepiej trzymać do końca. 
              Pokażemy Ci koszty wcześniejszego wykupu w wynikach.
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
