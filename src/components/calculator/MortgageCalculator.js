import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
const mortgageSchema = z.object({
    homePrice: z.number().min(1, 'Home price must be greater than 0'),
    downPayment: z.number().min(0, 'Down payment must be non-negative'),
    loanTerm: z.number().int().min(1, 'Loan term must be at least 1 year'),
    interestRate: z.number().min(0, 'Interest rate must be non-negative'),
    propertyTax: z.number().min(0, 'Property tax must be non-negative'),
    homeInsurance: z.number().min(0, 'Home insurance must be non-negative'),
});
export default function MortgageCalculator({ onCalculate }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(mortgageSchema),
        defaultValues: {
            homePrice: 300000,
            downPayment: 60000,
            loanTerm: 30,
            interestRate: 3.5,
            propertyTax: 2400,
            homeInsurance: 1200,
        },
    });
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Mortgage Calculator" }), _jsxs("form", { onSubmit: handleSubmit(onCalculate), className: "space-y-4", children: [_jsx(Input, { label: "Home Price ($)", type: "number", ...register('homePrice', { valueAsNumber: true }), error: errors.homePrice?.message }), _jsx(Input, { label: "Down Payment ($)", type: "number", ...register('downPayment', { valueAsNumber: true }), error: errors.downPayment?.message }), _jsx(Input, { label: "Loan Term (years)", type: "number", ...register('loanTerm', { valueAsNumber: true }), error: errors.loanTerm?.message }), _jsx(Input, { label: "Interest Rate (%)", type: "number", step: "0.1", ...register('interestRate', { valueAsNumber: true }), error: errors.interestRate?.message }), _jsx(Input, { label: "Annual Property Tax ($)", type: "number", ...register('propertyTax', { valueAsNumber: true }), error: errors.propertyTax?.message }), _jsx(Input, { label: "Annual Home Insurance ($)", type: "number", ...register('homeInsurance', { valueAsNumber: true }), error: errors.homeInsurance?.message }), _jsx(Button, { type: "submit", isLoading: isSubmitting, className: "w-full", children: "Calculate" })] })] }));
}
