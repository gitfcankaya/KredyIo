/**
 * Predefined Calculator Configurations
 * Ready-to-use calculator setups for common scenarios
 */

import { CalculatorConfig } from './types';
import {
  calculateLoan,
  calculateCreditCardLimit,
  calculateDepositInterest,
  calculateEarlyPayment,
} from './utils';

// ============================================
// Loan Calculator Configuration
// ============================================

export const loanCalculatorConfig: CalculatorConfig = {
  type: 'loan',
  title: 'İhtiyaç Kredisi Hesaplama',
  description: 'Aylık ödeme tutarınızı ve toplam maliyeti hesaplayın',
  icon: '/icons/loan.svg',
  
  inputs: [
    {
      id: 'amount',
      label: 'Kredi Tutarı',
      type: 'slider',
      min: 5000,
      max: 500000,
      step: 1000,
      defaultValue: 50000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
      tooltip: 'Almak istediğiniz kredi tutarı',
    },
    {
      id: 'term',
      label: 'Vade',
      type: 'slider',
      min: 3,
      max: 60,
      step: 1,
      defaultValue: 12,
      unit: 'Ay',
      tooltip: 'Krediyi kaç ayda ödemek istediğiniz',
    },
    {
      id: 'interestRate',
      label: 'Yıllık Faiz Oranı',
      type: 'input',
      min: 0.1,
      max: 50,
      step: 0.1,
      defaultValue: 2.5,
      suffix: '%',
      tooltip: 'Bankanın uyguladığı yıllık faiz oranı (KKDF ve BSMV dahil edilecektir)',
    },
  ],
  
  calculate: (inputs) => {
    return calculateLoan({
      amount: Number(inputs.amount),
      interestRate: Number(inputs.interestRate),
      termMonths: Number(inputs.term),
      includeKKDF: true,
      includeBSMV: true,
    });
  },
  
  showBreakdown: true,
  showChart: true,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'loan',
};

// ============================================
// Mortgage Calculator Configuration
// ============================================

export const mortgageCalculatorConfig: CalculatorConfig = {
  type: 'mortgage',
  title: 'Konut Kredisi Hesaplama',
  description: 'Ev alımı için kredi hesaplayın',
  icon: '/icons/home.svg',
  
  inputs: [
    {
      id: 'amount',
      label: 'Kredi Tutarı',
      type: 'slider',
      min: 100000,
      max: 5000000,
      step: 10000,
      defaultValue: 500000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
    {
      id: 'term',
      label: 'Vade',
      type: 'slider',
      min: 12,
      max: 240,
      step: 12,
      defaultValue: 120,
      unit: 'Ay',
      formatValue: (value) => `${value} Ay (${Math.floor(value / 12)} Yıl)`,
    },
    {
      id: 'interestRate',
      label: 'Yıllık Faiz Oranı',
      type: 'input',
      min: 0.1,
      max: 30,
      step: 0.1,
      defaultValue: 1.8,
      suffix: '%',
    },
  ],
  
  calculate: (inputs) => {
    return calculateLoan({
      amount: Number(inputs.amount),
      interestRate: Number(inputs.interestRate),
      termMonths: Number(inputs.term),
      includeKKDF: true,
      includeBSMV: true,
    });
  },
  
  showBreakdown: true,
  showChart: true,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'mortgage',
};

// ============================================
// Vehicle Loan Calculator Configuration
// ============================================

export const vehicleLoanCalculatorConfig: CalculatorConfig = {
  type: 'vehicle',
  title: 'Taşıt Kredisi Hesaplama',
  description: 'Araç alımı için kredi hesaplayın',
  icon: '/icons/car.svg',
  
  inputs: [
    {
      id: 'amount',
      label: 'Kredi Tutarı',
      type: 'slider',
      min: 50000,
      max: 2000000,
      step: 10000,
      defaultValue: 300000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
    {
      id: 'term',
      label: 'Vade',
      type: 'slider',
      min: 6,
      max: 60,
      step: 6,
      defaultValue: 36,
      unit: 'Ay',
    },
    {
      id: 'interestRate',
      label: 'Yıllık Faiz Oranı',
      type: 'input',
      min: 0.1,
      max: 40,
      step: 0.1,
      defaultValue: 2.2,
      suffix: '%',
    },
  ],
  
  calculate: (inputs) => {
    return calculateLoan({
      amount: Number(inputs.amount),
      interestRate: Number(inputs.interestRate),
      termMonths: Number(inputs.term),
      includeKKDF: true,
      includeBSMV: true,
    });
  },
  
  showBreakdown: true,
  showChart: true,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'vehicle',
};

// ============================================
// Credit Card Limit Calculator Configuration
// ============================================

export const creditCardCalculatorConfig: CalculatorConfig = {
  type: 'creditCard',
  title: 'Kredi Kartı Limit Hesaplama',
  description: 'Size uygun kredi kartı limitini öğrenin',
  icon: '/icons/credit-card.svg',
  
  inputs: [
    {
      id: 'monthlyIncome',
      label: 'Aylık Net Gelir',
      type: 'slider',
      min: 8500,
      max: 100000,
      step: 500,
      defaultValue: 15000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
    {
      id: 'existingDebts',
      label: 'Mevcut Aylık Borç Ödemeleri',
      type: 'slider',
      min: 0,
      max: 50000,
      step: 500,
      defaultValue: 0,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
      tooltip: 'Kredi kartı, kredi vb. aylık ödemeleriniz',
    },
    {
      id: 'creditScore',
      label: 'Kredi Notu (Opsiyonel)',
      type: 'input',
      min: 1,
      max: 1900,
      step: 1,
      defaultValue: 1500,
      tooltip: 'Varsa Findeks kredi notunuz',
    },
    {
      id: 'employmentType',
      label: 'Çalışma Durumu',
      type: 'select',
      defaultValue: 'permanent',
      options: [
        { value: 'permanent', label: 'Sürekli İşçi / Memur' },
        { value: 'contract', label: 'Sözleşmeli' },
        { value: 'self-employed', label: 'Serbest Meslek' },
      ],
    },
  ],
  
  calculate: (inputs) => {
    return calculateCreditCardLimit(
      Number(inputs.monthlyIncome),
      Number(inputs.existingDebts),
      Number(inputs.creditScore) || undefined,
      inputs.employmentType as 'permanent' | 'contract' | 'self-employed'
    );
  },
  
  showBreakdown: false,
  showChart: false,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'creditcard',
};

// ============================================
// Deposit Calculator Configuration
// ============================================

export const depositCalculatorConfig: CalculatorConfig = {
  type: 'deposit',
  title: 'Mevduat Faiz Hesaplama',
  description: 'Mevduat getirinizi hesaplayın',
  icon: '/icons/savings.svg',
  
  inputs: [
    {
      id: 'principal',
      label: 'Mevduat Tutarı',
      type: 'slider',
      min: 1000,
      max: 1000000,
      step: 1000,
      defaultValue: 50000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
    {
      id: 'term',
      label: 'Vade',
      type: 'slider',
      min: 1,
      max: 36,
      step: 1,
      defaultValue: 12,
      unit: 'Ay',
    },
    {
      id: 'interestRate',
      label: 'Yıllık Faiz Oranı',
      type: 'input',
      min: 0.1,
      max: 50,
      step: 0.1,
      defaultValue: 25,
      suffix: '%',
      tooltip: 'Bankanın sunduğu yıllık faiz oranı',
    },
  ],
  
  calculate: (inputs) => {
    return calculateDepositInterest(
      Number(inputs.principal),
      Number(inputs.interestRate),
      Number(inputs.term),
      15 // Turkish deposit tax rate
    );
  },
  
  showBreakdown: true,
  showChart: true,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'deposit',
};

// ============================================
// Early Payment Calculator Configuration
// ============================================

export const earlyPaymentCalculatorConfig: CalculatorConfig = {
  type: 'earlyPayment',
  title: 'Erken Ödeme Hesaplama',
  description: 'Erken ödeme yaparak ne kadar tasarruf edersiniz?',
  icon: '/icons/piggy-bank.svg',
  
  inputs: [
    {
      id: 'loanAmount',
      label: 'Toplam Kredi Tutarı',
      type: 'slider',
      min: 5000,
      max: 500000,
      step: 1000,
      defaultValue: 50000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
    {
      id: 'termMonths',
      label: 'Toplam Vade',
      type: 'slider',
      min: 3,
      max: 60,
      step: 1,
      defaultValue: 12,
      unit: 'Ay',
    },
    {
      id: 'paidMonths',
      label: 'Ödenen Ay Sayısı',
      type: 'slider',
      min: 1,
      max: 59,
      step: 1,
      defaultValue: 6,
      unit: 'Ay',
    },
    {
      id: 'interestRate',
      label: 'Yıllık Faiz Oranı',
      type: 'input',
      min: 0.1,
      max: 50,
      step: 0.1,
      defaultValue: 2.5,
      suffix: '%',
    },
    {
      id: 'earlyPaymentAmount',
      label: 'Erken Ödeme Tutarı',
      type: 'slider',
      min: 1000,
      max: 100000,
      step: 1000,
      defaultValue: 10000,
      unit: 'TL',
      prefix: '₺',
      formatValue: (value) => value.toLocaleString('tr-TR'),
    },
  ],
  
  calculate: (inputs) => {
    return calculateEarlyPayment(
      Number(inputs.loanAmount),
      Number(inputs.interestRate),
      Number(inputs.termMonths),
      Number(inputs.paidMonths),
      Number(inputs.earlyPaymentAmount)
    );
  },
  
  showBreakdown: false,
  showChart: false,
  showComparison: true,
  showShare: true,
  enableUrlSync: true,
  urlParam: 'earlypayment',
};

// ============================================
// Export all configurations
// ============================================

export const calculatorConfigs = {
  loan: loanCalculatorConfig,
  mortgage: mortgageCalculatorConfig,
  vehicle: vehicleLoanCalculatorConfig,
  creditCard: creditCardCalculatorConfig,
  deposit: depositCalculatorConfig,
  earlyPayment: earlyPaymentCalculatorConfig,
};

export default calculatorConfigs;
