export interface MortgageData {
  homePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  propertyTax: number;
  homeInsurance: number;
}

export interface MortgageResults {
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  totalMonthlyPayment: number;
  loanAmount: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}