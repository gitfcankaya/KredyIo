# KredyIo Component Patterns

## Extracted from HesapKurdu.com HTML Analysis (43 Patterns)

**Date:** October 15, 2025  
**Source:** HTML_ANALYSIS.md (43 documented patterns from sample_shots directory)  
**Purpose:** Comprehensive component specification for KredyIo implementation

---

## Table of Contents

1. [Core Components](#core-components)
2. [Layout Components](#layout-components)
3. [Product Display Components](#product-display-components)
4. [Form & Input Components](#form--input-components)
5. [Navigation Components](#navigation-components)
6. [Content Components](#content-components)
7. [Utility Components](#utility-components)
8. [Implementation Priority](#implementation-priority)

---

## Core Components

### 1. ProductCard Component

**Usage Frequency:** 35+ patterns  
**Priority:** 🔴 CRITICAL

**Variants:**

- **Loan Product Card** (Patterns #1, #3, #5, #23, #40, #41, #42)
- **Credit Card Product Card** (Patterns #2, #4, #6-#11)
- **Deposit Product Card** (Pattern #37)
- **POS Product Card** (Pattern #43)

**Common Features:**

```typescript
interface ProductCardProps {
  // Core Data
  id: string;
  title: string;
  subtitle?: string;
  provider: {
    name: string;
    logo: string;
  };

  // Financial Details
  interestRate?: number;
  loanAmount?: number;
  installments?: number;
  annualFee?: number;

  // Visual Indicators
  isSponsor?: boolean;
  isPopular?: boolean;
  badges?: string[];

  // Actions
  onApply: () => void;
  onCompare: () => void;
  onDetails: () => void;

  // Additional
  features?: string[];
  benefits?: {
    icon: string;
    text: string;
  }[];
}
```

**Key Design Patterns:**

1. **Sponsor Badge** - "Sponsorlu" badge top-right (Pattern #12)
2. **Bank Logo** - Consistent 60x60px size with border-radius
3. **Primary Metric** - Large bold text (36-48px) for main rate/amount
4. **Feature Pills** - Horizontal scrolling chips for benefits
5. **CTA Hierarchy** - Primary "Başvur" + Secondary "Karşılaştır"
6. **Hover State** - Subtle shadow elevation on hover
7. **Mobile Optimization** - Full-width cards, vertical CTA stacking

**Tailwind Classes:**

```css
/* Card Container */
.product-card {
  @apply bg-white rounded-lg border border-gray-200 p-6;
  @apply hover:shadow-lg transition-shadow duration-300;
}

/* Bank Logo */
.bank-logo {
  @apply w-16 h-16 rounded-full border border-gray-100;
  @apply object-contain p-2;
}

/* Primary Metric */
.primary-metric {
  @apply text-4xl font-bold text-primary-600;
}

/* Sponsor Badge */
.sponsor-badge {
  @apply absolute top-4 right-4 bg-yellow-100 text-yellow-800;
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

/* Feature Pills */
.feature-pills {
  @apply flex gap-2 overflow-x-auto pb-2;
  scrollbar-width: none;
}

.feature-pill {
  @apply bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full;
  @apply text-sm whitespace-nowrap;
}

/* CTA Buttons */
.cta-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white;
  @apply px-6 py-3 rounded-lg font-medium transition-colors;
}

.cta-secondary {
  @apply bg-white border border-primary-600 text-primary-600;
  @apply px-6 py-3 rounded-lg font-medium hover:bg-primary-50;
}
```

---

### 2. FilterSidebar Component

**Usage Frequency:** 25+ patterns  
**Priority:** 🔴 CRITICAL

**Variants:**

- **Credit Card Filters** (Patterns #2, #4, #6-#11)
- **Loan Filters** (Patterns #1, #3, #5, #40-#42)
- **Deposit Filters** (Pattern #37)

**Features:**

```typescript
interface FilterSidebarProps {
  // Filter Categories
  categories: FilterCategory[];

  // State Management
  activeFilters: Record<string, any>;
  onFilterChange: (category: string, value: any) => void;
  onClearAll: () => void;

  // UI Options
  isCollapsible?: boolean;
  showResultCount?: boolean;
  resultCount?: number;
}

interface FilterCategory {
  id: string;
  label: string;
  type: "checkbox" | "range" | "select" | "chips";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}
```

**Key Patterns:**

1. **Collapsible Sections** - Accordion-style categories (Pattern #15)
2. **Active State Chips** - Visual feedback for selected filters (Pattern #15)
3. **Range Sliders** - For interest rates, amounts (Patterns #22, #37)
4. **Checkbox Groups** - Bank selection, features (Patterns #2, #4)
5. **Result Count** - Real-time product count update (Pattern #16)
6. **Clear All Button** - Reset all filters at once
7. **Mobile Drawer** - Bottom sheet on mobile, sidebar on desktop

**Tailwind Implementation:**

```css
/* Sidebar Container */
.filter-sidebar {
  @apply w-full lg:w-80 bg-white rounded-lg border border-gray-200;
  @apply sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto;
}

/* Filter Section */
.filter-section {
  @apply border-b border-gray-100 p-4;
}

.filter-section-header {
  @apply flex items-center justify-between cursor-pointer;
  @apply py-2 text-gray-900 font-medium;
}

/* Checkbox Group */
.filter-checkbox-group {
  @apply space-y-3 mt-3;
}

.filter-checkbox {
  @apply flex items-center space-x-3 cursor-pointer;
}

.filter-checkbox input[type="checkbox"] {
  @apply w-5 h-5 rounded border-gray-300 text-primary-600;
  @apply focus:ring-2 focus:ring-primary-500;
}

/* Active Filter Chips */
.active-filters {
  @apply flex flex-wrap gap-2 p-4 border-b border-gray-100;
}

.filter-chip {
  @apply bg-primary-100 text-primary-800 px-3 py-1.5 rounded-full;
  @apply text-sm flex items-center gap-2;
}

.filter-chip-remove {
  @apply w-4 h-4 hover:bg-primary-200 rounded-full;
  @apply flex items-center justify-center cursor-pointer;
}

/* Result Count */
.result-count {
  @apply text-center p-4 bg-gray-50 border-t border-gray-200;
}

.result-count-number {
  @apply text-2xl font-bold text-primary-600;
}
```

---

### 3. CalculatorWidget Component

**Usage Frequency:** 20+ patterns  
**Priority:** 🔴 CRITICAL

**Variants:**

- **Loan Calculator** (Patterns #22, #34, #39)
- **Credit Card Limit Calculator** (Pattern #39)
- **Deposit Interest Calculator** (Pattern #37, #39)
- **Early Payment Calculator** (Pattern #39)
- **Credit Score Calculator** (Patterns #35, #36)

**Core Interface:**

```typescript
interface CalculatorWidgetProps {
  type: "loan" | "creditCard" | "deposit" | "earlyPayment" | "creditScore";

  // Input Configuration
  inputs: CalculatorInput[];

  // Calculation Logic
  onCalculate: (inputs: Record<string, any>) => CalculatorResult;

  // Results Display
  resultFormat: "simple" | "detailed" | "comparison";

  // UI Options
  showAdvancedOptions?: boolean;
  showComparisonTable?: boolean;
  embeddedMode?: boolean;
}

interface CalculatorInput {
  id: string;
  label: string;
  type: "number" | "range" | "select" | "toggle";
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string; // 'TL', '%', 'ay'
  tooltip?: string;
  validation?: (value: any) => boolean | string;
}

interface CalculatorResult {
  primary: {
    value: number;
    label: string;
    format: string; // 'currency', 'percentage', 'number'
  };
  secondary?: Array<{
    label: string;
    value: number;
    format: string;
  }>;
  breakdown?: Array<{
    label: string;
    value: number;
  }>;
  comparisonTable?: any[];
}
```

**Key Features:**

1. **Dual Input Layout** - Side-by-side inputs on desktop (Pattern #22)
2. **Real-time Calculation** - Instant results on input change
3. **Range Sliders** - For amount, term, rate selection
4. **Breakdown Display** - Monthly payment, total interest, total cost
5. **Comparison Table** - Multiple bank options (Pattern #25)
6. **Tooltip Help** - Information icons for complex inputs
7. **Mobile-Optimized** - Vertical layout on mobile

**Tailwind Styling:**

```css
/* Calculator Container */
.calculator-widget {
  @apply bg-gradient-to-br from-primary-50 to-white;
  @apply rounded-xl border border-primary-200 p-8;
  @apply shadow-lg;
}

/* Input Row */
.calculator-input-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

/* Input Group */
.calculator-input-group {
  @apply space-y-2;
}

.calculator-label {
  @apply text-sm font-medium text-gray-700 flex items-center gap-2;
}

.calculator-input {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply text-lg font-semibold;
}

/* Range Slider */
.calculator-range {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none;
  @apply cursor-pointer;
}

.calculator-range::-webkit-slider-thumb {
  @apply w-6 h-6 bg-primary-600 rounded-full cursor-pointer;
  @apply hover:bg-primary-700 transition-colors;
}

/* Results Display */
.calculator-results {
  @apply mt-8 p-6 bg-white rounded-lg border-2 border-primary-300;
}

.calculator-primary-result {
  @apply text-center pb-6 border-b border-gray-200;
}

.calculator-primary-value {
  @apply text-5xl font-bold text-primary-600;
}

.calculator-primary-label {
  @apply text-sm text-gray-600 mt-2;
}

/* Breakdown */
.calculator-breakdown {
  @apply grid grid-cols-2 gap-4 mt-6;
}

.calculator-breakdown-item {
  @apply text-center;
}

.calculator-breakdown-value {
  @apply text-2xl font-bold text-gray-900;
}

.calculator-breakdown-label {
  @apply text-xs text-gray-600 mt-1;
}
```

---

### 4. FAQAccordion Component

**Usage Frequency:** 35+ patterns  
**Priority:** 🟡 HIGH

**Implementation:**

```typescript
interface FAQAccordionProps {
  faqs: FAQItem[];
  defaultOpenIndex?: number;
  allowMultiple?: boolean;
  schemaMarkup?: boolean; // Include Schema.org FAQPage markup
}

interface FAQItem {
  id: string;
  question: string;
  answer: string; // Supports HTML content
  category?: string;
}
```

**Key Patterns:**

1. **Schema.org Markup** - FAQPage structured data (Patterns #41, #42, #43)
2. **First Item Open** - Default expanded state for first question
3. **Single Expansion** - Only one item open at a time
4. **Smooth Animation** - Height transition with ease-in-out
5. **Icon Rotation** - Chevron rotates 180° on expand
6. **Mobile-Friendly** - Large touch targets, readable text

**Sample Questions from Patterns:**

- **Loan FAQs** (Pattern #42): "Faizsiz Kredi Nedir?", "Nasıl Alınır?"
- **Retirement FAQs** (Pattern #41): "Emekli Promosyonu Nedir?", "Hangi Bankalar Veriyor?"
- **POS FAQs** (Pattern #43): "POS Cihazı Nedir?", "Komisyon Oranları?"

---

### 5. TrustBadges Component

**Usage Frequency:** 15+ patterns  
**Priority:** 🟡 HIGH

**Badges from Patterns:**

1. **ETBİS** - Electronic Trade Information System (Pattern #43)
2. **KVKK** - Personal Data Protection Law (Pattern #43)
3. **SSL** - Secure Socket Layer (Pattern #43)
4. **ISO 27001** - Information Security Management (Pattern #43)
5. **License Numbers** - Financial institution licenses

**Implementation:**

```typescript
interface TrustBadgesProps {
  badges: TrustBadge[];
  layout?: "horizontal" | "grid";
  size?: "sm" | "md" | "lg";
}

interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  description: string;
  link?: string;
}
```

---

## Layout Components

### 6. Container Component

**Usage:** Global wrapper for content sections

```typescript
interface ContainerProps {
  variant?: "default" | "white" | "gradient" | "gray";
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}
```

**Variants from Patterns:**

- `Container_white__bARCX` - White background
- `Container_gradient__ONen6` - Gradient background (Pattern #43)
- Default container with neutral background

---

### 7. HeroSection Component

**Usage Frequency:** 20+ patterns  
**Priority:** 🟡 HIGH

**Variants:**

- **Video Hero** (Pattern #26) - Background video with lazy loading
- **Gradient Hero** (Patterns #39, #43) - Gradient background with CTA
- **Calculator Hero** (Pattern #34) - Integrated calculator widget
- **Search Hero** (Pattern #1) - Search bar with filters

---

## Product Display Components

### 8. ComparisonTable Component

**Usage Frequency:** 15+ patterns  
**Priority:** 🟡 HIGH

**Features:**

- Horizontal scrolling on mobile
- Fixed first column (bank names)
- Sortable columns
- Highlight best offers
- Export functionality

**Key Patterns:**

- **Loan Comparison** (Pattern #25)
- **Credit Score Risk Groups** (Pattern #36)
- **Deposit Interest Rates** (Pattern #37)

---

### 9. BankLogo Component

**Usage Frequency:** 40+ patterns  
**Priority:** 🔴 CRITICAL

**Specifications:**

- **Size:** 60x60px (most common), 40x40px (compact)
- **Border:** 1px solid gray-100
- **Border Radius:** 50% (circular)
- **Padding:** 8px internal padding
- **Object Fit:** contain
- **Background:** white

---

### 10. SponsorBadge Component

**Usage:** Pattern #12, #40, #41  
**Priority:** 🟢 MEDIUM

```typescript
interface SponsorBadgeProps {
  text?: string; // Default: "Sponsorlu"
  position?: "top-right" | "top-left";
  variant?: "yellow" | "blue" | "green";
}
```

---

## Form & Input Components

### 11. PhoneInput Component

**Usage:** Newsletter, application forms (Pattern #19, #43)

**Features:**

- Turkish phone format: (5XX) XXX XX XX
- Auto-formatting on input
- Validation: starts with 5, 10 digits
- SMS consent toggle

---

### 12. RangeSlider Component

**Usage:** Calculators, filters (Patterns #22, #34, #37, #39)

**Features:**

- Min/max labels
- Current value display
- Step increment
- Custom thumb styling
- Responsive touch targets

---

### 13. Checkbox Component

**Usage:** Filters, forms (Patterns #2, #4, #13)

**Variants:**

- **Filter Checkbox** - With count badge
- **Ownership Tracking** (Pattern #13) - "Sahip Olduğum Kartlar"
- **Consent Checkbox** - KVKK compliance

---

## Navigation Components

### 14. Breadcrumb Component

**Usage Frequency:** 40+ patterns  
**Priority:** 🟡 HIGH

**Implementation:**

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  schemaMarkup?: boolean; // Schema.org BreadcrumbList
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
```

**Patterns:**

- Ana Sayfa > Krediler > İhtiyaç Kredisi (Pattern #1)
- Ana Sayfa > Ticari > POS (Pattern #43)
- Ana Sayfa > Kredi Kartları > Aidatsız Kartlar (Pattern #2)

---

### 15. MainNavigation Component

**Usage:** Global header (All patterns)

**Structure:**

- Logo (left)
- Main menu items (center)
  - Krediler dropdown
  - Kredi Kartları dropdown
  - Ticari dropdown
  - Hesaplama Araçları link
- User actions (right)
  - Login/Register buttons
  - Mobile menu toggle

---

### 16. FooterNavigation Component

**Usage:** Global footer (All patterns)

**Sections:**

- Company info & logo
- Product categories (4 columns)
- Social media links (Pattern #21)
- Legal links (Privacy, Terms, KVKK)
- Newsletter subscription

---

## Content Components

### 17. BlogCard Component

**Usage:** Guide sections (Patterns #38, #41, #43)

**Features:**

- Desktop/mobile image variants
- Category badge
- Publication date
- Title + description
- "Devamını Oku" CTA

---

### 18. NewsletterForm Component

**Usage:** Pattern #19, #43  
**Priority:** 🟡 HIGH

**Features:**

- Phone input with validation
- SMS/email consent toggles
- Privacy policy link
- "Açık Rıza" (explicit consent) modal
- Salesforce hidden fields

---

### 19. VideoPlayer Component

**Usage:** Pattern #26

**Features:**

- Lazy loading
- Poster image
- Play button overlay
- Fullscreen support
- Mobile optimization

---

## Utility Components

### 20. LoadingSpinner

**Usage:** Data fetching states

---

### 21. ErrorBoundary

**Usage:** Error handling

---

### 22. Tooltip

**Usage:** Help icons in calculators, filters

---

### 23. Modal

**Usage:** Application forms, details views

---

### 24. Toast Notifications

**Usage:** Success/error messages

---

## Implementation Priority

### Phase 1: Critical Components (Week 1-2)

1. ✅ **ProductCard** - Foundation for all product displays
2. ✅ **FilterSidebar** - Core filtering functionality
3. ✅ **CalculatorWidget** - Key differentiator
4. ✅ **BankLogo** - Reused across all product cards
5. ✅ **MainNavigation** - Global header

### Phase 2: High Priority (Week 3-4)

6. ✅ **FAQAccordion** - SEO & user education
7. ✅ **HeroSection** - Landing page hero variants
8. ✅ **ComparisonTable** - Product comparison feature
9. ✅ **Breadcrumb** - Navigation & SEO
10. ✅ **FooterNavigation** - Global footer

### Phase 3: Medium Priority (Week 5-6)

11. ✅ **TrustBadges** - Credibility indicators
12. ✅ **BlogCard** - Content marketing
13. ✅ **NewsletterForm** - Lead generation
14. ✅ **SponsorBadge** - Monetization feature
15. ✅ **PhoneInput** - Form component

### Phase 4: Polish & Optimization (Week 7-8)

16. ✅ **RangeSlider** - Enhanced UX
17. ✅ **VideoPlayer** - Rich media
18. ✅ **Tooltip** - Help system
19. ✅ **Modal** - Dialogs & overlays
20. ✅ **Responsive optimizations** - Mobile-first refinement

---

## Next Steps

1. **Create Component Library** - Set up Storybook for component development
2. **Design Tokens** - Extract colors, spacing, typography from patterns
3. **API Integration** - Define data interfaces for backend
4. **Testing Strategy** - Unit + integration tests for core components
5. **Performance Optimization** - Lazy loading, code splitting

---

**Last Updated:** October 15, 2025  
**Total Patterns Analyzed:** 43  
**Total Components Identified:** 24  
**Implementation Status:** Planning Phase
