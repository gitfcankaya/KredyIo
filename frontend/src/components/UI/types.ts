/**
 * UI Components Type Definitions
 * Types for ComparisonTable, TrustBadges, InfoCard, etc.
 */

import React from 'react';

// ============================================
// Comparison Table Types
// ============================================

export interface ComparisonFeature {
  id: string;
  label: string;
  category?: string;
  description?: string;
  tooltip?: string;
}

export interface ComparisonProduct {
  id: string;
  name: string;
  provider: string;
  logo?: string;
  image?: string;
  featured?: boolean;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'primary' | 'danger';
  };
  features: Record<string, ComparisonFeatureValue>;
  pricing?: {
    amount: number;
    period?: string;
    currency?: string;
  };
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export type ComparisonFeatureValue =
  | string
  | number
  | boolean
  | {
      value: string | number | boolean;
      highlight?: boolean;
      tooltip?: string;
      icon?: string;
    };

export interface ComparisonTableProps {
  products: ComparisonProduct[];
  features: ComparisonFeature[];
  maxProducts?: number;
  stickyHeader?: boolean;
  stickyColumn?: boolean;
  showPricing?: boolean;
  showCTA?: boolean;
  onRemoveProduct?: (productId: string) => void;
  onAddProduct?: () => void;
  className?: string;
}

// ============================================
// Trust Badges Types
// ============================================

export type TrustBadgeType = 'etbis' | 'kvkk' | 'ssl' | 'iso' | 'verified' | 'secure' | 'custom';

export interface TrustBadge {
  id: string;
  type: TrustBadgeType;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  tooltip?: string;
  link?: string;
}

export interface TrustBadgesProps {
  badges: TrustBadge[];
  variant?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  showDescription?: boolean;
  className?: string;
}

// ============================================
// Info Card Types
// ============================================

export type InfoCardVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
export type InfoCardStyle = 'filled' | 'outlined' | 'subtle';

export interface InfoCardProps {
  variant?: InfoCardVariant;
  style?: InfoCardStyle;
  title?: string;
  description?: string;
  icon?: string | React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// ============================================
// Feature Pills Types
// ============================================

export type FeaturePillVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
export type FeaturePillSize = 'xs' | 'sm' | 'md' | 'lg';

export interface FeaturePill {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  variant?: FeaturePillVariant;
  tooltip?: string;
  removable?: boolean;
  onRemove?: () => void;
}

export interface FeaturePillsProps {
  pills: FeaturePill[];
  size?: FeaturePillSize;
  maxDisplay?: number;
  showMore?: boolean;
  onPillClick?: (pill: FeaturePill) => void;
  className?: string;
}

// ============================================
// Blog Post Card Types
// ============================================

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  author: {
    name: string;
    avatar?: string;
    title?: string;
  };
  category?: {
    name: string;
    slug: string;
    color?: string;
  };
  tags?: string[];
  date: Date | string;
  readTime?: number; // in minutes
  featured?: boolean;
  href: string;
}

export interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
  className?: string;
}

// ============================================
// Testimonial Card Types
// ============================================

export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    title?: string;
    company?: string;
    avatar?: string;
  };
  rating?: number;
  date?: Date | string;
  verified?: boolean;
  featured?: boolean;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
  variant?: 'default' | 'compact' | 'featured';
  showRating?: boolean;
  showDate?: boolean;
  showVerified?: boolean;
  showAvatar?: boolean;
  className?: string;
}

// ============================================
// FAQ Accordion Types
// ============================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
  category?: string;
  helpfulVotes?: {
    yes: number;
    no: number;
  };
}

export interface FAQAccordionProps {
  items: FAQItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[]; // Array of FAQ IDs
  searchable?: boolean;
  showCategories?: boolean;
  showHelpful?: boolean;
  onHelpful?: (faqId: string, helpful: boolean) => void;
  enableStructuredData?: boolean;
  className?: string;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisible?: number;
  className?: string;
}

// ============================================
// Rating Types
// ============================================

export interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
}

// ============================================
// Progress Bar Types
// ============================================

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

// ============================================
// Alert Types
// ============================================

export interface AlertProps {
  variant: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string;
  icon?: string | React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  className?: string;
}

// ============================================
// Stat Card Types
// ============================================

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string | React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}
