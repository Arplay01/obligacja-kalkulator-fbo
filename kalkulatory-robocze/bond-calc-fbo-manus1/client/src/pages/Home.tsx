/**
 * Home Page – Kalkulator Obligacji Skarbowych
 * Design: "Forteca Finansowa" – Dashboard Clarity
 * 
 * Layout: Hero → Parameters → Bond Selection → Results Table → Charts
 * Mobile: Stacked sections with accordion-style expansion
 */

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import ParametersPanel from "@/components/ParametersPanel";
import BondSelector from "@/components/BondSelector";
import ResultsTable from "@/components/ResultsTable";
import ResultsChart from "@/components/ResultsChart";
import BestBondCard from "@/components/BestBondCard";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";
import {
  calculateAll,
  type CalculatorInputs,
  type CalculatorResults,
  type BondType,
} from "@/lib/bondCalculator";

const DEFAULT_INPUTS: CalculatorInputs = {
  investmentAmount: 10000,
  inflationRates: [3.5, 3.0, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
  nbpRate: 5.75,
  depositRate: 5.0,
  useIKE: false,
  selectedBonds: ['OTS', 'ROR', 'DOR', 'TOS', 'COI', 'EDO'],
};

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const results: CalculatorResults = useMemo(() => calculateAll(inputs), [inputs]);

  const handleInputChange = useCallback((partial: Partial<CalculatorInputs>) => {
    setInputs(prev => ({ ...prev, ...partial }));
  }, []);

  const handleInflationChange = useCallback((index: number, value: number) => {
    setInputs(prev => {
      const newRates = [...prev.inflationRates];
      newRates[index] = value;
      return { ...prev, inflationRates: newRates };
    });
  }, []);

  const handleBondToggle = useCallback((bondType: BondType) => {
    setInputs(prev => {
      const selected = prev.selectedBonds.includes(bondType)
        ? prev.selectedBonds.filter(b => b !== bondType)
        : [...prev.selectedBonds, bondType];
      return { ...prev, selectedBonds: selected };
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <HeroSection />

      <main className="container py-6 lg:py-10 space-y-8 lg:space-y-12">
        {/* Parameters Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ParametersPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            onInflationChange={handleInflationChange}
          />
        </motion.section>

        {/* Bond Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BondSelector
            selectedBonds={inputs.selectedBonds}
            onToggle={handleBondToggle}
          />
        </motion.section>

        {/* Best Bond Highlight */}
        {results.bestBond && results.bonds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <BestBondCard results={results} />
          </motion.section>
        )}

        {/* Results Comparison Table */}
        {results.bonds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ResultsTable results={results} useIKE={inputs.useIKE} />
          </motion.section>
        )}

        {/* Charts */}
        {results.bonds.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ResultsChart results={results} />
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  );
}
