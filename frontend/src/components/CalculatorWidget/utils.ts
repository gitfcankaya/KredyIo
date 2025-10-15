/**
 * Calculator Utility Functions
 * Financial calculation formulas and helpers
 * 
 * Turkish Banking Standards:
 * - KKDF (Kaynak Kullanımı Destekleme Fonu): 15%
 * - BSMV (Banka ve Sigorta Muameleleri Vergisi): 10%
 * - Deposit Tax (Stopaj): 15%
 */

import {
  LoanCalculationResult,
  CreditCardCalculationResult,
  DepositCalculationResult,
  EarlyPaymentCalculationResult,
  LoanCalculationOptions,
} from './types';

// ============================================
// Loan Calculations
// ============================================

/**
 * Calculate loan payment using standard amortization formula
 * PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number,
  includeKKDF: boolean = true,
  includeBSMV: boolean = true
): LoanCalculationResult {
  // Apply KKDF and BSMV to interest rate
  let effectiveRate = annualRate;
  
  if (includeKKDF) {
    effectiveRate += annualRate * 0.15; // KKDF 15%
  }
  
  if (includeBSMV) {
    effectiveRate += annualRate * 0.10; // BSMV 10%
  }
  
  // Monthly interest rate
  const monthlyRate = effectiveRate / 100 / 12;
  
  // Calculate monthly payment
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }
  
  // Generate amortization schedule
  const breakdown: LoanCalculationResult['breakdown'] = [];
  let remainingBalance = principal;
  let totalInterest = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    remainingBalance -= principalPayment;
    totalInterest += interestPayment;
    
    breakdown.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
    });
  }
  
  const totalPayment = monthlyPayment * termMonths;
  
  return {
    type: 'loan',
    monthlyPayment,
    totalPayment,
    totalInterest,
    interestRate: annualRate,
    principalAmount: principal,
    termMonths,
    breakdown,
    effectiveRate,
    monthlyInterestRate: monthlyRate * 100,
    totalCost: totalPayment,
  };
}

/**
 * Calculate loan with custom options
 */
export function calculateLoan(options: LoanCalculationOptions): LoanCalculationResult {
  const {
    amount,
    interestRate,
    termMonths,
    includeKKDF = true,
    includeBSMV = true,
  } = options;
  
  return calculateLoanPayment(amount, interestRate, termMonths, includeKKDF, includeBSMV);
}

// ============================================
// Credit Card Calculations
// ============================================

/**
 * Calculate recommended credit card limit based on income and debts
 * Turkish banking standards:
 * - Maximum limit: 4x monthly income
 * - Debt-to-income ratio should be < 40%
 */
export function calculateCreditCardLimit(
  monthlyIncome: number,
  existingDebts: number,
  creditScore?: number,
  employmentType: 'permanent' | 'contract' | 'self-employed' = 'permanent'
): CreditCardCalculationResult {
  // Base calculation: 2-4x monthly income
  let baseMultiplier = 3;
  
  // Adjust based on employment type
  switch (employmentType) {
    case 'permanent':
      baseMultiplier = 3.5;
      break;
    case 'contract':
      baseMultiplier = 2.5;
      break;
    case 'self-employed':
      baseMultiplier = 2;
      break;
  }
  
  // Calculate debt-to-income ratio
  const debtToIncomeRatio = existingDebts / monthlyIncome;
  
  // Reduce multiplier if DTI is high
  if (debtToIncomeRatio > 0.4) {
    baseMultiplier *= 0.7; // Reduce by 30%
  } else if (debtToIncomeRatio > 0.3) {
    baseMultiplier *= 0.85; // Reduce by 15%
  }
  
  // Credit score impact (-20% to +20%)
  let creditScoreImpact = 0;
  if (creditScore) {
    if (creditScore >= 1800) {
      creditScoreImpact = 0.2; // +20%
    } else if (creditScore >= 1600) {
      creditScoreImpact = 0.1; // +10%
    } else if (creditScore >= 1400) {
      creditScoreImpact = 0;
    } else if (creditScore >= 1200) {
      creditScoreImpact = -0.1; // -10%
    } else {
      creditScoreImpact = -0.2; // -20%
    }
  }
  
  baseMultiplier *= 1 + creditScoreImpact;
  
  // Calculate limits
  const recommendedLimit = Math.round(monthlyIncome * baseMultiplier / 1000) * 1000; // Round to nearest 1000
  const maximumLimit = Math.round(monthlyIncome * 4 / 1000) * 1000;
  const minimumLimit = Math.round(monthlyIncome * 1 / 1000) * 1000;
  
  return {
    type: 'creditCard',
    recommendedLimit,
    maximumLimit,
    minimumLimit,
    monthlyIncome,
    existingDebts,
    creditScore,
    factors: {
      incomeRatio: baseMultiplier,
      debtToIncomeRatio,
      creditScoreImpact,
    },
  };
}

// ============================================
// Deposit Calculations
// ============================================

/**
 * Calculate deposit interest with tax
 * Turkish deposit tax (stopaj): 15%
 */
export function calculateDepositInterest(
  principal: number,
  annualRate: number,
  termMonths: number,
  taxRate: number = 15
): DepositCalculationResult {
  // Monthly interest rate
  const monthlyRate = annualRate / 100 / 12;
  
  // Generate breakdown
  const breakdown: DepositCalculationResult['breakdown'] = [];
  let total = principal;
  let totalInterest = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const interest = total * monthlyRate;
    total += interest;
    totalInterest += interest;
    
    breakdown.push({
      month,
      interest,
      total,
    });
  }
  
  const maturityAmount = total;
  const taxAmount = (totalInterest * taxRate) / 100;
  const netInterest = totalInterest - taxAmount;
  
  // Calculate effective yield (net return)
  const effectiveYield = (netInterest / principal) * (12 / termMonths) * 100;
  
  return {
    type: 'deposit',
    principal,
    interestRate: annualRate,
    termMonths,
    maturityAmount,
    totalInterest,
    netInterest,
    taxAmount,
    breakdown,
    effectiveYield,
  };
}

// ============================================
// Early Payment Calculations
// ============================================

/**
 * Calculate savings from early payment
 */
export function calculateEarlyPayment(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  paidMonths: number,
  earlyPaymentAmount: number
): EarlyPaymentCalculationResult {
  // Calculate original loan details
  const original = calculateLoanPayment(loanAmount, annualRate, termMonths);
  
  // Calculate current balance
  const currentBalance = original.breakdown[paidMonths - 1]?.remainingBalance || loanAmount;
  
  // Calculate remaining balance after early payment
  const remainingBalance = currentBalance - earlyPaymentAmount;
  
  // Calculate new loan with remaining balance
  const remainingMonths = termMonths - paidMonths;
  const newLoan = calculateLoanPayment(remainingBalance, annualRate, remainingMonths);
  
  // Calculate savings
  const originalRemainingPayment = original.monthlyPayment * remainingMonths;
  const newTotalPayment = newLoan.totalPayment + earlyPaymentAmount;
  const savedInterest = originalRemainingPayment - newTotalPayment;
  
  return {
    type: 'earlyPayment',
    currentBalance,
    earlyPaymentAmount,
    remainingBalance,
    savedInterest,
    savedMonths: 0, // Keep same term
    newMonthlyPayment: newLoan.monthlyPayment,
    newTotalPayment,
    comparison: {
      before: {
        totalPayment: originalRemainingPayment,
        remainingPayments: remainingMonths,
        totalInterest: original.totalInterest - original.breakdown
          .slice(0, paidMonths)
          .reduce((sum, item) => sum + item.interest, 0),
      },
      after: {
        totalPayment: newTotalPayment,
        remainingPayments: remainingMonths,
        totalInterest: newLoan.totalInterest,
      },
    },
  };
}

// ============================================
// Validation Helpers
// ============================================

/**
 * Validate loan inputs
 */
export function validateLoanInputs(
  amount: number,
  rate: number,
  term: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (amount <= 0) {
    errors.push('Kredi tutarı 0\'dan büyük olmalıdır');
  }
  
  if (amount > 10000000) {
    errors.push('Kredi tutarı 10.000.000 TL\'yi aşamaz');
  }
  
  if (rate < 0 || rate > 100) {
    errors.push('Faiz oranı 0-100 arasında olmalıdır');
  }
  
  if (term < 1 || term > 360) {
    errors.push('Vade 1-360 ay arasında olmalıdır');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate credit card inputs
 */
export function validateCreditCardInputs(
  income: number,
  debts: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (income <= 0) {
    errors.push('Aylık gelir 0\'dan büyük olmalıdır');
  }
  
  if (income < 8500) {
    errors.push('Aylık gelir minimum 8.500 TL olmalıdır');
  }
  
  if (debts < 0) {
    errors.push('Borç tutarı negatif olamaz');
  }
  
  if (debts > income * 2) {
    errors.push('Borç tutarı gelirin 2 katından fazla olamaz');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate deposit inputs
 */
export function validateDepositInputs(
  amount: number,
  rate: number,
  term: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (amount <= 0) {
    errors.push('Mevduat tutarı 0\'dan büyük olmalıdır');
  }
  
  if (amount < 1000) {
    errors.push('Minimum mevduat tutarı 1.000 TL\'dir');
  }
  
  if (rate < 0 || rate > 100) {
    errors.push('Faiz oranı 0-100 arasında olmalıdır');
  }
  
  if (term < 1 || term > 360) {
    errors.push('Vade 1-360 ay arasında olmalıdır');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// Formatting Helpers
// ============================================

/**
 * Format calculation result for display
 */
export function formatCalculationSummary(
  result: LoanCalculationResult | DepositCalculationResult
): Array<{ label: string; value: string; emphasis?: boolean }> {
  if (result.type === 'loan') {
    return [
      {
        label: 'Aylık Ödeme',
        value: `₺${result.monthlyPayment.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        emphasis: true,
      },
      {
        label: 'Toplam Ödeme',
        value: `₺${result.totalPayment.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        label: 'Toplam Faiz',
        value: `₺${result.totalInterest.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        label: 'Efektif Faiz Oranı',
        value: `%${result.effectiveRate.toFixed(2)}`,
      },
    ];
  } else if (result.type === 'deposit') {
    return [
      {
        label: 'Vade Sonu Tutarı',
        value: `₺${result.maturityAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        emphasis: true,
      },
      {
        label: 'Net Kazanç',
        value: `₺${result.netInterest.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        label: 'Stopaj',
        value: `₺${result.taxAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      },
      {
        label: 'Efektif Getiri',
        value: `%${result.effectiveYield.toFixed(2)}`,
      },
    ];
  }
  
  return [];
}

// ============================================
// URL Parameter Sync Helpers
// ============================================

/**
 * Encode calculator values to URL parameters
 */
export function encodeCalculatorParams(
  type: string,
  values: Record<string, number | string>
): string {
  const params = new URLSearchParams();
  params.set('type', type);
  
  Object.entries(values).forEach(([key, value]) => {
    params.set(key, String(value));
  });
  
  return params.toString();
}

/**
 * Decode URL parameters to calculator values
 */
export function decodeCalculatorParams(
  search: string
): { type: string; values: Record<string, string> } {
  const params = new URLSearchParams(search);
  const type = params.get('type') || '';
  const values: Record<string, string> = {};
  
  params.forEach((value, key) => {
    if (key !== 'type') {
      values[key] = value;
    }
  });
  
  return { type, values };
}
