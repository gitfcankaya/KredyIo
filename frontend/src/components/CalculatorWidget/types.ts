/**
 * CalculatorWidget Type Definitions
 * Comprehensive calculator system for financial products
 * 
 * Based on 20+ patterns from HesapKurdu.com analysis:
 * - Pattern #22: Dual Input Layout (Loan Calculator)
 * - Pattern #39: Calculator Hub (24 calculator types)
 * - Various product-specific calculators across patterns
 */

// ============================================
// Calculator Types
// ============================================

export type CalculatorType =
  | 'loan'              // İhtiyaç Kredisi
  | 'mortgage'          // Konut Kredisi
  | 'vehicle'           // Taşıt Kredisi
  | 'creditCard'        // Kredi Kartı Limiti
  | 'deposit'           // Mevduat Faizi
  | 'earlyPayment'      // Erken Ödeme
  | 'creditScore'       // Kredi Notu
  | 'refinance'         // Kredi Refinansmanı
  | 'consolidation'     // Kredi Birleştirme
  | 'business'          // Ticari Kredi
  | 'overdraft';        // Kredili Mevduat

export type CalculatorLayout = 'inline' | 'card' | 'fullpage' | 'modal';

export type CalculatorTheme = 'light' | 'dark' | 'gradient';

// ============================================
// Input Configuration
// ============================================

export interface CalculatorInputConfig {
  id: string;
  label: string;
  type: 'slider' | 'input' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  unit?: string;
  prefix?: string;
  suffix?: string;
  options?: Array<{ value: string | number; label: string }>;
  tooltip?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  formatValue?: (value: number) => string;
  parseValue?: (formatted: string) => number;
}

// ============================================
// Calculation Results
// ============================================

export interface LoanCalculationResult {
  type: 'loan';
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  interestRate: number;
  principalAmount: number;
  termMonths: number;
  
  // Breakdown
  breakdown: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
  
  // Summary metrics
  effectiveRate: number; // KKDF + BSMV dahil
  monthlyInterestRate: number;
  totalCost: number;
}

export interface CreditCardCalculationResult {
  type: 'creditCard';
  recommendedLimit: number;
  maximumLimit: number;
  minimumLimit: number;
  monthlyIncome: number;
  existingDebts: number;
  creditScore?: number;
  
  // Factors
  factors: {
    incomeRatio: number; // Gelir/Limit oranı
    debtToIncomeRatio: number; // Borç/Gelir oranı
    creditScoreImpact: number; // Kredi notu etkisi (-20% to +20%)
  };
}

export interface DepositCalculationResult {
  type: 'deposit';
  principal: number;
  interestRate: number;
  termMonths: number;
  maturityAmount: number;
  totalInterest: number;
  netInterest: number; // Vergi sonrası
  taxAmount: number;
  
  // Breakdown by period
  breakdown: Array<{
    month: number;
    interest: number;
    total: number;
  }>;
  
  effectiveYield: number; // Vergi sonrası efektif getiri
}

export interface EarlyPaymentCalculationResult {
  type: 'earlyPayment';
  currentBalance: number;
  earlyPaymentAmount: number;
  remainingBalance: number;
  savedInterest: number;
  savedMonths: number;
  newMonthlyPayment?: number;
  newTotalPayment: number;
  
  // Comparison
  comparison: {
    before: {
      totalPayment: number;
      remainingPayments: number;
      totalInterest: number;
    };
    after: {
      totalPayment: number;
      remainingPayments: number;
      totalInterest: number;
    };
  };
}

export type CalculationResult =
  | LoanCalculationResult
  | CreditCardCalculationResult
  | DepositCalculationResult
  | EarlyPaymentCalculationResult;

// ============================================
// Calculator Configuration
// ============================================

export interface CalculatorConfig {
  type: CalculatorType;
  title: string;
  description?: string;
  icon?: string;
  inputs: CalculatorInputConfig[];
  
  // Calculation function
  calculate: (inputs: Record<string, number | string>) => CalculationResult;
  
  // Display options
  showBreakdown?: boolean;
  showChart?: boolean;
  showComparison?: boolean;
  showShare?: boolean;
  showPrint?: boolean;
  
  // URL sync
  enableUrlSync?: boolean;
  urlParam?: string;
}

// ============================================
// Calculator Widget Props
// ============================================

export interface CalculatorWidgetProps {
  config: CalculatorConfig;
  
  // Layout options
  layout?: CalculatorLayout;
  theme?: CalculatorTheme;
  
  // Initial values (from URL or props)
  initialValues?: Record<string, number | string>;
  
  // Callbacks
  onCalculate?: (result: CalculationResult) => void;
  onChange?: (values: Record<string, number | string>) => void;
  onShare?: (url: string) => void;
  onCompare?: (result: CalculationResult) => void;
  
  // Display options
  showHeader?: boolean;
  showFooter?: boolean;
  showReset?: boolean;
  autoCalculate?: boolean; // Calculate on input change
  debounceMs?: number; // Debounce time for auto-calculate
  
  // Styling
  className?: string;
  containerClassName?: string;
  
  // CTAs
  primaryCTA?: {
    label: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================
// Calculator State
// ============================================

export interface CalculatorState {
  values: Record<string, number | string>;
  result: CalculationResult | null;
  isCalculating: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
  showBreakdown: boolean;
  showChart: boolean;
}

// ============================================
// Predefined Calculator Configurations
// ============================================

export interface LoanCalculatorInputs {
  amount: number;      // Kredi Tutarı
  term: number;        // Vade (ay)
  interestRate: number; // Faiz Oranı (yıllık %)
}

export interface CreditCardCalculatorInputs {
  monthlyIncome: number;
  existingDebts: number;
  creditScore?: number;
  employmentType: 'permanent' | 'contract' | 'self-employed';
}

export interface DepositCalculatorInputs {
  principal: number;    // Ana Para
  term: number;         // Vade (ay)
  interestRate: number; // Faiz Oranı (yıllık %)
  taxRate?: number;     // Stopaj Oranı (default: 15%)
}

export interface EarlyPaymentCalculatorInputs {
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  paidMonths: number;
  earlyPaymentAmount: number;
}

// ============================================
// Breakdown Display
// ============================================

export interface BreakdownDisplayProps {
  result: CalculationResult;
  variant?: 'compact' | 'detailed';
  showChart?: boolean;
  className?: string;
}

// ============================================
// Calculation Utilities
// ============================================

export interface LoanCalculationOptions {
  amount: number;
  interestRate: number; // Annual percentage
  termMonths: number;
  includeKKDF?: boolean; // Kaynak Kullanımı Destekleme Fonu
  includeBSMV?: boolean; // Banka ve Sigorta Muameleleri Vergisi
  kkdfRate?: number; // Default: 15%
  bsmvRate?: number; // Default: 10%
}

export interface InterestCalculationMethod {
  type: 'compound' | 'simple';
  frequency: 'monthly' | 'quarterly' | 'annual';
}

// ============================================
// Chart Configuration
// ============================================

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    fill?: boolean;
  }>;
}

export interface CalculatorChartProps {
  result: CalculationResult;
  chartType: 'pie' | 'line' | 'bar' | 'doughnut';
  showLegend?: boolean;
  height?: number;
  className?: string;
}

// ============================================
// Comparison Table
// ============================================

export interface ComparisonItem {
  label: string;
  before: string | number;
  after: string | number;
  change?: string | number;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface ComparisonTableProps {
  items: ComparisonItem[];
  title?: string;
  className?: string;
}

// ============================================
// URL Sync Configuration
// ============================================

export interface UrlSyncConfig {
  enabled: boolean;
  paramPrefix?: string; // e.g., 'calc_'
  syncOnChange?: boolean;
  pushState?: boolean; // Use pushState vs replaceState
}

// ============================================
// Export Helper Types
// ============================================

export interface CalculatorExportData {
  type: CalculatorType;
  timestamp: string;
  inputs: Record<string, number | string>;
  result: CalculationResult;
  breakdown?: any[];
}

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';
