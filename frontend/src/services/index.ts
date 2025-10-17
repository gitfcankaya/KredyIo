// Export all services from a single entry point
export * from './loanService';
export * from './creditCardService';
export * from './depositService';
export * from './campaignService';
export * from './goldPriceService';
export * from './currencyRateService';
export * from './economicIndicatorService';
export * from './newsArticleService';
export * from './articleService';
export * from './faqService';

// Keep the legacy api.ts exports for backward compatibility
export { default as api } from './api';
export { productService, calculatorService } from './api';
