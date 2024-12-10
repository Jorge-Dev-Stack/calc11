import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import MortgageCalculator from '../components/calculator/MortgageCalculator';
import MortgageResults from '../components/calculator/MortgageResults';
import { calculateMortgage } from '../utils/mortgageCalculations';
import type { MortgageData, MortgageResults as MortgageResultsType } from '../types/mortgage';

export default function Dashboard() {
  const [results, setResults] = useState<MortgageResultsType | null>(null);

  const handleCalculate = (data: MortgageData) => {
    const calculatedResults = calculateMortgage(data);
    setResults(calculatedResults);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MortgageCalculator onCalculate={handleCalculate} />
        {results && <MortgageResults results={results} />}
      </div>
    </DashboardLayout>
  );
}