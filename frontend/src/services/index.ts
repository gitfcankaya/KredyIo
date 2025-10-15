// Export all services from a single entry point
export * from './loanService';
export * from './creditCardService';
export * from './depositService';
export * from './campaignService';

// Keep the legacy api.ts exports for backward compatibility
export { default as api } from './api';
export { productService, calculatorService } from './api';
