import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import MortgageCalculator from '../components/calculator/MortgageCalculator';
import MortgageResults from '../components/calculator/MortgageResults';
import { calculateMortgage } from '../utils/mortgageCalculations';
export default function Dashboard() {
    const [results, setResults] = useState(null);
    const handleCalculate = (data) => {
        const calculatedResults = calculateMortgage(data);
        setResults(calculatedResults);
    };
    return (_jsx(DashboardLayout, { children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsx(MortgageCalculator, { onCalculate: handleCalculate }), results && _jsx(MortgageResults, { results: results })] }) }));
}
