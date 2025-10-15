/**
 * ProductCard Component Types
 * Based on patterns extracted from HesapKurdu.com analysis
 * Supports: Loan, Credit Card, Deposit, POS products
 */

export type ProductType = 'loan' | 'creditCard' | 'deposit' | 'pos';

export interface Provider {
  id: string;
  name: string;
  logo: string;
  slug: string;
}

export interface Badge {
  id: string;
  text: string;
  variant: 'sponsor' | 'popular' | 'new' | 'best' | 'promotion';
  color?: string;
}

export interface Benefit {
  icon: string;
  text: string;
  tooltip?: string;
}

export interface ProductFinancials {
  // Loan specifics
  interestRate?: number;
  loanAmount?: number;
  monthlyPayment?: number;
  totalCost?: number;
  installments?: number;
  
  // Credit Card specifics
  annualFee?: number;
  cashbackRate?: number;
  milesEarned?: number;
  pointsEarned?: number;
  withdrawalLimit?: number;
  
  // Deposit specifics
  depositRate?: number;
  depositTerm?: number;
  minimumAmount?: number;
  
  // POS specifics
  commissionRate?: number;
  setupFee?: number;
  monthlyFee?: number;
}

export interface ProductCardProps {
  // Core Data
  id: string;
  type: ProductType;
  title: string;
  subtitle?: string;
  description?: string;
  provider: Provider;
  
  // Financial Details
  financials: ProductFinancials;
  
  // Visual Indicators
  badges?: Badge[];
  isSponsor?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  
  // Features & Benefits
  features?: string[];
  benefits?: Benefit[];
  
  // Actions
  onApply: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onDetails?: (productId: string) => void;
  
  // State
  isComparing?: boolean;
  isLoading?: boolean;
  
  // Additional
  externalUrl?: string;
  disclaimer?: string;
  validUntil?: Date;
  
  // Layout Options
  variant?: 'default' | 'compact' | 'detailed';
  showCompareButton?: boolean;
  showFeatures?: boolean;
  className?: string;
}

export interface ProductCardState {
  isExpanded: boolean;
  isHovered: boolean;
  isComparing: boolean;
}

// Complete Product type for use in pages
export interface Product {
  id: string;
  type: ProductType;
  name: string;
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  provider: Provider;
  financials: ProductFinancials;
  interestRate?: number; // For direct access in sorting/filtering
  depositRate?: number; // For direct access in deposits
  badges?: Badge[];
  isSponsor?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  features?: string[];
  benefits?: Benefit[];
  image?: string;
  imageUrl?: string;
  rating?: {
    score: number;
    value?: number; // Alias for score
    count: number;
  };
  cta?: {
    label: string;
    href: string;
  };
  externalUrl?: string;
  disclaimer?: string;
  validUntil?: Date;
}
