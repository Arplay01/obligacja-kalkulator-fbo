import { useState, useCallback, useMemo } from 'react';
import { getRelevantProducts, type CalculationResult } from '@/lib/calculations';

export type WizardStep = 'welcome' | 'amount' | 'horizon' | 'priority' | 'results';

export interface WizardState {
  amount: number;
  horizon: number; // months
  priority: 'certainty' | 'inflation_protection' | 'balanced';
  depositRate: number;
  savingsRate: number;
  expectedInflation: number;
  includeFamily: boolean;
}

const DEFAULT_STATE: WizardState = {
  amount: 10000,
  horizon: 12,
  priority: 'balanced',
  depositRate: 4.5,
  savingsRate: 3.5,
  expectedInflation: 3.0,
  includeFamily: false,
};

export function useWizard() {
  const [step, setStep] = useState<WizardStep>('welcome');
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);

  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((newStep: WizardStep) => {
    setStep(newStep);
  }, []);

  const nextStep = useCallback(() => {
    const steps: WizardStep[] = ['welcome', 'amount', 'horizon', 'priority', 'results'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    const steps: WizardStep[] = ['welcome', 'amount', 'horizon', 'priority', 'results'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  }, [step]);

  const results = useMemo<CalculationResult[]>(() => {
    if (step !== 'results') return [];
    return getRelevantProducts(
      state.amount,
      state.horizon,
      state.expectedInflation,
      state.depositRate,
      state.savingsRate,
      state.includeFamily,
      state.priority,
    );
  }, [step, state]);

  const stepNumber = useMemo(() => {
    const steps: WizardStep[] = ['welcome', 'amount', 'horizon', 'priority', 'results'];
    return steps.indexOf(step);
  }, [step]);

  const reset = useCallback(() => {
    setStep('welcome');
    setState(DEFAULT_STATE);
  }, []);

  return {
    step,
    stepNumber,
    state,
    results,
    updateState,
    goToStep,
    nextStep,
    prevStep,
    reset,
  };
}
