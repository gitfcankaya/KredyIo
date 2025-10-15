/**
 * FilterSidebar Component Types
 * Based on 25+ patterns from HesapKurdu.com analysis
 * Supports: Credit Cards, Loans, Deposits, POS products
 */

export type FilterType = 'checkbox' | 'range' | 'select' | 'chips' | 'radio';
export type FilterLayout = 'sidebar' | 'drawer' | 'modal';

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number; // Number of results for this option
  icon?: string;
  disabled?: boolean;
  subOptions?: FilterOption[]; // For nested filters
}

export interface FilterCategory {
  id: string;
  label: string;
  type: FilterType;
  
  // For checkbox, radio, chips, select
  options?: FilterOption[];
  
  // For range type
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // 'TL', '%', 'ay'
  
  // UI behavior
  isCollapsible?: boolean;
  defaultExpanded?: boolean;
  showSearch?: boolean; // For long option lists
  multiSelect?: boolean; // For checkbox type
  
  // Help text
  tooltip?: string;
  description?: string;
}

export interface ActiveFilter {
  categoryId: string;
  categoryLabel: string;
  value: string | number | [number, number];
  label: string;
}

export interface FilterSidebarProps {
  // Filter Configuration
  categories: FilterCategory[];
  
  // State Management
  activeFilters: Record<string, any>;
  onFilterChange: (categoryId: string, value: any) => void;
  onClearAll: () => void;
  onClearCategory?: (categoryId: string) => void;
  
  // Results
  resultCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  
  // UI Options
  layout?: FilterLayout;
  isOpen?: boolean; // For drawer/modal layouts
  onClose?: () => void;
  showResultCount?: boolean;
  showClearAll?: boolean;
  
  // Advanced Features
  enableUrlSync?: boolean; // Sync filters with URL params
  showActiveFilters?: boolean; // Display active filters as chips
  collapsedByDefault?: boolean;
  
  // Callbacks
  onApplyFilters?: () => void; // For drawer/modal submit
  
  // Customization
  className?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export interface FilterSidebarState {
  expandedCategories: Set<string>;
  searchTerms: Record<string, string>; // For searchable option lists
  localFilters: Record<string, any>; // For drawer/modal (before apply)
}

// Export FilterState for use in pages
export interface FilterState {
  [categoryId: string]: any;
}

export interface RangeValue {
  min: number;
  max: number;
}

// Predefined filter categories for common use cases
export interface LoanFilterCategories {
  banks: FilterCategory;
  loanAmount: FilterCategory;
  loanTerm: FilterCategory;
  interestRate: FilterCategory;
  loanPurpose: FilterCategory;
}

export interface CreditCardFilterCategories {
  banks: FilterCategory;
  annualFee: FilterCategory;
  cardType: FilterCategory;
  benefits: FilterCategory;
  cashbackRate: FilterCategory;
}

export interface DepositFilterCategories {
  banks: FilterCategory;
  depositAmount: FilterCategory;
  depositTerm: FilterCategory;
  interestRate: FilterCategory;
  depositType: FilterCategory;
}

export interface POSFilterCategories {
  banks: FilterCategory;
  posType: FilterCategory;
  commissionRate: FilterCategory;
  setupFee: FilterCategory;
  features: FilterCategory;
}
