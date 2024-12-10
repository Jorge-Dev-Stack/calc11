import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { generatePDF } from '../../utils/pdfGenerator';
export default function MortgageResults({ results }) {
    const { currentUser } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const handleSave = async () => {
        if (!currentUser)
            return;
        try {
            setIsSaving(true);
            const calculationRef = doc(db, 'users', currentUser.uid, 'calculations', new Date().toISOString());
            await setDoc(calculationRef, {
                ...results,
                createdAt: new Date().toISOString(),
            });
            toast.success('Calculation saved successfully!');
        }
        catch (error) {
            toast.error('Failed to save calculation.');
        }
        finally {
            setIsSaving(false);
        }
    };
    const handleDownloadPDF = async () => {
        try {
            setIsGeneratingPDF(true);
            await generatePDF(results);
            toast.success('PDF generated successfully!');
        }
        catch (error) {
            toast.error('Failed to generate PDF.');
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Mortgage Summary" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Monthly Payment Breakdown" }), _jsxs("dl", { className: "mt-3 grid grid-cols-1 gap-4", children: [_jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Principal & Interest" }), _jsx("dd", { className: "mt-1 text-2xl font-semibold text-gray-900", children: formatCurrency(results.monthlyPrincipalAndInterest) })] }), _jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Property Tax" }), _jsx("dd", { className: "mt-1 text-2xl font-semibold text-gray-900", children: formatCurrency(results.monthlyPropertyTax) })] }), _jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Home Insurance" }), _jsx("dd", { className: "mt-1 text-2xl font-semibold text-gray-900", children: formatCurrency(results.monthlyHomeInsurance) })] }), _jsxs("div", { className: "rounded-lg bg-blue-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-blue-700", children: "Total Monthly Payment" }), _jsx("dd", { className: "mt-1 text-3xl font-semibold text-blue-700", children: formatCurrency(results.totalMonthlyPayment) })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-900", children: "Loan Summary" }), _jsxs("dl", { className: "mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Loan Amount" }), _jsx("dd", { className: "mt-1 text-xl font-semibold text-gray-900", children: formatCurrency(results.loanAmount) })] }), _jsxs("div", { className: "rounded-lg bg-gray-50 p-4", children: [_jsx("dt", { className: "text-sm font-medium text-gray-500", children: "Total Interest Paid" }), _jsx("dd", { className: "mt-1 text-xl font-semibold text-gray-900", children: formatCurrency(results.totalInterest) })] })] })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Button, { onClick: handleSave, isLoading: isSaving, className: "flex-1", children: "Save Calculation" }), _jsx(Button, { onClick: handleDownloadPDF, isLoading: isGeneratingPDF, variant: "outline", className: "flex-1", children: "Download PDF" })] })] })] }));
}
