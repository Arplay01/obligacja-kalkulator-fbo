/**
 * Home — Orchestrates the wizard flow
 * Design: "Ścieżka Decyzji" — guided journey from user's situation to comparison.
 * 
 * Flow: Welcome → Amount → Horizon → Priority → Results
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useWizard } from '@/hooks/useWizard';
import WelcomeStep from '@/components/steps/WelcomeStep';
import AmountStep from '@/components/steps/AmountStep';
import HorizonStep from '@/components/steps/HorizonStep';
import PriorityStep from '@/components/steps/PriorityStep';
import ResultsStep from '@/components/steps/ResultsStep';

export default function Home() {
  const wizard = useWizard();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={wizard.step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {wizard.step === 'welcome' && (
          <WelcomeStep onStart={wizard.nextStep} />
        )}

        {wizard.step === 'amount' && (
          <AmountStep
            amount={wizard.state.amount}
            onAmountChange={(amount) => wizard.updateState({ amount })}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.step === 'horizon' && (
          <HorizonStep
            horizon={wizard.state.horizon}
            onHorizonChange={(horizon) => wizard.updateState({ horizon })}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.step === 'priority' && (
          <PriorityStep
            state={wizard.state}
            onUpdate={wizard.updateState}
            onNext={wizard.nextStep}
            onBack={wizard.prevStep}
          />
        )}

        {wizard.step === 'results' && (
          <ResultsStep
            results={wizard.results}
            state={wizard.state}
            onBack={wizard.prevStep}
            onReset={wizard.reset}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
