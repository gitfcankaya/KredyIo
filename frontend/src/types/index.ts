export enum ProductType {
  PersonalLoan = 1,
  CreditCard = 2,
  Mortgage = 3,
  AutoLoan = 4,
  BusinessLoan = 5,
}

export enum InterestType {
  Fixed = 1,
  Variable = 2,
}

export interface Product {
  id: string;
  type: ProductType;
  lenderName: string;
  productName: string;
  interestRate: number;
  interestType: InterestType;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  fees?: string[];
  features?: string[];
  eligibility?: string[];
  description?: string;
  imageUrl?: string;
}

export interface ProductFilter {
  type?: ProductType;
  lenderName?: string;
  minRate?: number;
  maxRate?: number;
  amount?: number;
  term?: number;
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface LoanPaymentRequest {
  amount: number;
  interestRate: number;
  termMonths: number;
}

export interface LoanPaymentResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface InterestRequest {
  principal: number;
  rate: number;
  time: number;
  compoundFrequency?: number;
}

export interface InterestResult {
  simpleInterest: number;
  compoundInterest: number;
  totalWithSimple: number;
  totalWithCompound: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
  };
}
