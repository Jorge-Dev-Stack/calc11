import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { MortgageData } from '../../types/mortgage';

const mortgageSchema = z.object({
  homePrice: z.number().min(1, 'Home price must be greater than 0'),
  downPayment: z.number().min(0, 'Down payment must be non-negative'),
  loanTerm: z.number().int().min(1, 'Loan term must be at least 1 year'),
  interestRate: z.number().min(0, 'Interest rate must be non-negative'),
  propertyTax: z.number().min(0, 'Property tax must be non-negative'),
  homeInsurance: z.number().min(0, 'Home insurance must be non-negative'),
});

interface MortgageCalculatorProps {
  onCalculate: (data: MortgageData) => void;
}

export default function MortgageCalculator({ onCalculate }: MortgageCalculatorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MortgageData>({
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mortgage Calculator</h2>
      <form onSubmit={handleSubmit(onCalculate)} className="space-y-4">
        <Input
          label="Home Price ($)"
          type="number"
          {...register('homePrice', { valueAsNumber: true })}
          error={errors.homePrice?.message}
        />

        <Input
          label="Down Payment ($)"
          type="number"
          {...register('downPayment', { valueAsNumber: true })}
          error={errors.downPayment?.message}
        />

        <Input
          label="Loan Term (years)"
          type="number"
          {...register('loanTerm', { valueAsNumber: true })}
          error={errors.loanTerm?.message}
        />

        <Input
          label="Interest Rate (%)"
          type="number"
          step="0.1"
          {...register('interestRate', { valueAsNumber: true })}
          error={errors.interestRate?.message}
        />

        <Input
          label="Annual Property Tax ($)"
          type="number"
          {...register('propertyTax', { valueAsNumber: true })}
          error={errors.propertyTax?.message}
        />

        <Input
          label="Annual Home Insurance ($)"
          type="number"
          {...register('homeInsurance', { valueAsNumber: true })}
          error={errors.homeInsurance?.message}
        />

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Calculate
        </Button>
      </form>
    </div>
  );
}