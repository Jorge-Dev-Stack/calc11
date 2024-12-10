import type { MortgageData, MortgageResults } from '../types/mortgage';

export function calculateMortgage(data: MortgageData): MortgageResults {
  const loanAmount = data.homePrice - data.downPayment;
  const monthlyInterestRate = data.interestRate / 100 / 12;
  const numberOfPayments = data.loanTerm * 12;

  // Calculate monthly principal and interest payment
  const monthlyPrincipalAndInterest =
    (loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Calculate monthly property tax and insurance
  const monthlyPropertyTax = data.propertyTax / 12;
  const monthlyHomeInsurance = data.homeInsurance / 12;

  // Calculate total monthly payment
  const totalMonthlyPayment =
    monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance;

  // Calculate amortization schedule
  const amortizationSchedule = [];
  let remainingBalance = loanAmount;
  let totalInterest = 0;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPrincipalAndInterest - interestPayment;
    totalInterest += interestPayment;
    remainingBalance -= principalPayment;

    amortizationSchedule.push({
      month,
      principal: principalPayment,
      interest: interestPayment,
      balance: remainingBalance,
    });
  }

  return {
    monthlyPrincipalAndInterest,
    monthlyPropertyTax,
    monthlyHomeInsurance,
    totalMonthlyPayment,
    loanAmount,
    totalInterest,
    amortizationSchedule,
  };
}