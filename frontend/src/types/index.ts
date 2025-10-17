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

// Bank types
export interface Bank {
  id: number;
  name: string;
  code: string;
  logoUrl?: string;
  websiteUrl?: string;
  rating?: number;
  customerCount?: number;
  description?: string;
  isActive: boolean;
}

// Loan Product types
export interface LoanProduct {
  id: number;
  name: string;
  productName: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  minInterestRate: number;
  maxInterestRate: number;
  minTerm: number;
  maxTerm: number;
  minAge: number;
  maxAge: number;
  requiresCollateral: boolean;
  requiresGuarantor: boolean;
  purpose?: string;
  description?: string;
  features?: string[];
  isPromoted: boolean;
  isFeatured: boolean;
  isFirstHomeLoan: boolean;
  isSecondHomeLoan: boolean;
  isActive: boolean;
  bank: Bank;
}

export interface LoanProductFilter {
  bankId?: number;
  loanType?: string;
  minAmount?: number;
  maxAmount?: number;
  minInterestRate?: number;
  maxInterestRate?: number;
  term?: number;
  requiresCollateral?: boolean;
  isActive?: boolean;
}

// Credit Card types
export enum CreditCardType {
  Bireysel = 1,
  Ticari = 2,
  Premium = 3,
  Platinum = 4,
  World = 5,
}

export interface CreditCard {
  id: number;
  name: string;
  bankId: number;
  type: CreditCardType;
  annualFee: number;
  cashAdvanceRate: number;
  purchaseRate: number;
  rewardPoints: number;
  imageUrl?: string;
  description?: string;
  benefits?: string[] | any;
  features?: string[] | any;
  minimumIncome?: number;
  isActive: boolean;
  bank?: Bank;
}

export interface CreditCardFilter {
  bankId?: number;
  type?: CreditCardType;
  maxAnnualFee?: number;
  minRewardPoints?: number;
  isActive?: boolean;
}

// Deposit Product types
export enum DepositType {
  VadeliMevduat = 1,
  VadesizMevduat = 2,
  DovizMevduati = 3,
  AltinHesabi = 4,
  YatirimHesabi = 5,
}

export interface DepositProduct {
  id: number;
  name: string;
  bankId: number;
  type: DepositType;
  interestRate: number;
  minimumAmount: number;
  maximumAmount?: number;
  minimumTerm: number;
  maximumTerm?: number;
  currency: string;
  description?: string;
  features?: string[] | any;
  isActive: boolean;
  bank?: Bank;
}

export interface DepositProductFilter {
  bankId?: number;
  type?: DepositType;
  currency?: string;
  minAmount?: number;
  term?: number;
  isActive?: boolean;
}
