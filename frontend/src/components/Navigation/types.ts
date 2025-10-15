/**
 * Navigation Type Definitions
 * Types for main navigation, footer, and breadcrumb components
 */

// ============================================
// Navigation Item Types
// ============================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isPopular?: boolean;
  featured?: boolean;
}

export interface NavDropdown {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
  items: NavItem[];
  columns?: number; // For mega menu layout
  featuredItems?: NavItem[];
  ctaButton?: {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
  };
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

// ============================================
// Main Navigation Props
// ============================================

export interface MainNavigationProps {
  logo?: {
    src: string;
    alt: string;
    href?: string;
  };
  
  // Navigation items
  items: (NavItem | NavDropdown)[];
  
  // Actions
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  
  showLogin?: boolean;
  loginLabel?: string;
  onLogin?: () => void;
  
  showSignup?: boolean;
  signupLabel?: string;
  onSignup?: () => void;
  
  // User menu (when logged in)
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    menuItems: NavItem[];
  };
  
  // Behavior
  sticky?: boolean;
  transparentOnTop?: boolean;
  hideOnScroll?: boolean;
  
  // Mobile
  mobileBreakpoint?: number; // Default: 1024px
  
  // Styling
  className?: string;
  variant?: 'light' | 'dark' | 'gradient';
}

// ============================================
// Footer Navigation Props
// ============================================

export interface FooterSection {
  id: string;
  title: string;
  items: NavItem[];
}

export interface FooterProps {
  logo?: {
    src: string;
    alt: string;
  };
  
  tagline?: string;
  description?: string;
  
  sections: FooterSection[];
  
  // Social media
  socialLinks?: Array<{
    id: string;
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
    icon?: string;
  }>;
  
  // Contact info
  contact?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  
  // Newsletter
  newsletter?: {
    title: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    onSubmit?: (email: string) => void;
  };
  
  // Trust badges
  trustBadges?: Array<{
    id: string;
    name: string;
    icon: string;
    tooltip?: string;
  }>;
  
  // Legal
  copyright?: string;
  legalLinks?: NavItem[];
  
  // Styling
  className?: string;
  variant?: 'light' | 'dark';
}

// ============================================
// Breadcrumb Props
// ============================================

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string | React.ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
  homeIcon?: string;
  className?: string;
  
  // Schema.org structured data
  enableStructuredData?: boolean;
}

// ============================================
// Container Props
// ============================================

export type ContainerVariant = 'default' | 'white' | 'gray' | 'gradient' | 'transparent';
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
  children: React.ReactNode;
  variant?: ContainerVariant;
  size?: ContainerSize;
  noPadding?: boolean;
  noMargin?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

// ============================================
// Hero Section Props
// ============================================

export type HeroVariant = 'default' | 'gradient' | 'video' | 'image' | 'calculator';
export type HeroAlignment = 'left' | 'center' | 'right';

export interface HeroProps {
  variant?: HeroVariant;
  alignment?: HeroAlignment;
  
  // Content
  title: string;
  subtitle?: string;
  description?: string;
  
  // Media
  backgroundImage?: string;
  backgroundVideo?: {
    src: string;
    poster?: string;
  };
  
  // Actions
  primaryCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  
  secondaryCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  
  // Calculator integration
  calculator?: React.ReactNode;
  
  // Styling
  minHeight?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
}

// ============================================
// Mobile Menu State
// ============================================

export interface MobileMenuState {
  isOpen: boolean;
  activeDropdown: string | null;
  searchOpen: boolean;
}

// ============================================
// Navigation Context
// ============================================

export interface NavigationContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

// ============================================
// Scroll Behavior
// ============================================

export interface ScrollBehavior {
  scrollY: number;
  scrollDirection: 'up' | 'down';
  isAtTop: boolean;
  isScrolled: boolean;
}

// ============================================
// Type Guards
// ============================================

export function isNavDropdown(item: NavItem | NavDropdown): item is NavDropdown {
  return 'items' in item && Array.isArray(item.items);
}

export function isNavItem(item: NavItem | NavDropdown): item is NavItem {
  return 'href' in item && typeof item.href === 'string';
}
