import { jsPDF } from 'jspdf';
import type { MortgageResults } from '../types/mortgage';
import { formatCurrency } from './formatters';

export function generatePDF(results: MortgageResults): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.text('Mortgage Calculation Summary', pageWidth / 2, 20, { align: 'center' });
  
  // Monthly Payment Breakdown
  doc.setFontSize(16);
  doc.text('Monthly Payment Breakdown', 20, 40);
  
  doc.setFontSize(12);
  doc.text(`Principal & Interest: ${formatCurrency(results.monthlyPrincipalAndInterest)}`, 30, 55);
  doc.text(`Property Tax: ${formatCurrency(results.monthlyPropertyTax)}`, 30, 65);
  doc.text(`Home Insurance: ${formatCurrency(results.monthlyHomeInsurance)}`, 30, 75);
  doc.text(`Total Monthly Payment: ${formatCurrency(results.totalMonthlyPayment)}`, 30, 85);
  
  // Loan Summary
  doc.setFontSize(16);
  doc.text('Loan Summary', 20, 105);
  
  doc.setFontSize(12);
  doc.text(`Total Loan Amount: ${formatCurrency(results.loanAmount)}`, 30, 120);
  doc.text(`Total Interest Paid: ${formatCurrency(results.totalInterest)}`, 30, 130);
  
  // Amortization Schedule
  doc.setFontSize(16);
  doc.text('Amortization Schedule', 20, 150);
  
  doc.setFontSize(10);
  let y = 165;
  doc.text('Month', 20, y);
  doc.text('Principal', 60, y);
  doc.text('Interest', 100, y);
  doc.text('Balance', 140, y);
  
  y += 10;
  
  // Show first 12 months of amortization
  results.amortizationSchedule.slice(0, 12).forEach((payment) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(payment.month.toString(), 20, y);
    doc.text(formatCurrency(payment.principal), 60, y);
    doc.text(formatCurrency(payment.interest), 100, y);
    doc.text(formatCurrency(payment.balance), 140, y);
    
    y += 10;
  });
  
  doc.save('mortgage-calculation.pdf');
}