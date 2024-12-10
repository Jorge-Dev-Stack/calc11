import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import type { MortgageResults as MortgageResultsType } from '../../types/mortgage';
import { generatePDF } from '../../utils/pdfGenerator';

interface MortgageResultsProps {
  results: MortgageResultsType;
}

export default function MortgageResults({ results }: MortgageResultsProps) {
  const { currentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleSave = async () => {
    if (!currentUser) return;

    try {
      setIsSaving(true);
      const calculationRef = doc(db, 'users', currentUser.uid, 'calculations', new Date().toISOString());
      await setDoc(calculationRef, {
        ...results,
        createdAt: new Date().toISOString(),
      });
      toast.success('Calculation saved successfully!');
    } catch (error) {
      toast.error('Failed to save calculation.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generatePDF(results);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mortgage Summary</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Monthly Payment Breakdown</h3>
          <dl className="mt-3 grid grid-cols-1 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm font-medium text-gray-500">Principal & Interest</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(results.monthlyPrincipalAndInterest)}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm font-medium text-gray-500">Property Tax</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(results.monthlyPropertyTax)}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm font-medium text-gray-500">Home Insurance</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(results.monthlyHomeInsurance)}
              </dd>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <dt className="text-sm font-medium text-blue-700">Total Monthly Payment</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-700">
                {formatCurrency(results.totalMonthlyPayment)}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Loan Summary</h3>
          <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm font-medium text-gray-500">Total Loan Amount</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">
                {formatCurrency(results.loanAmount)}
              </dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm font-medium text-gray-500">Total Interest Paid</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900">
                {formatCurrency(results.totalInterest)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            className="flex-1"
          >
            Save Calculation
          </Button>
          <Button
            onClick={handleDownloadPDF}
            isLoading={isGeneratingPDF}
            variant="outline"
            className="flex-1"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}