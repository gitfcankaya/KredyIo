import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoanProduct {
  id: number;
  bankId: number;
  bankName?: string;
  loanType: string;
  productName: string;
  description?: string;
  minInterestRate: number;
  maxInterestRate: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  isPromoted: boolean;
  isCampaignActive: boolean;
  campaignDescription?: string;
  isFirstHomeLoan: boolean;
  earlyPaymentAllowed: boolean;
  features: string[];
  requirements: string[];
  applicationUrl?: string;
  lastUpdated: string;
  bank?: {
    id: number;
    name: string;
    code: string;
    logoUrl?: string;
    websiteUrl?: string;
    rating?: number;
    customerCount?: number;
    description?: string;
    isActive: boolean;
  };
}

export interface LoanFilter {
  loanType?: string;
  bankId?: number;
  minAmount?: number;
  maxAmount?: number;
  maxInterestRate?: number;
  isPromoted?: boolean;
  isFirstHomeLoan?: boolean;
}

export const loanService = {
  /**
   * Tüm kredi ürünlerini getirir
   */
  async getAllLoans(filter?: LoanFilter): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts', {
      params: filter,
    });
    return response.data;
  },

  /**
   * ID'ye göre tek bir kredi ürünü getirir
   */
  async getLoanById(id: number): Promise<LoanProduct> {
    const response = await api.get<LoanProduct>(`/api/LoanProducts/${id}`);
    return response.data;
  },

  /**
   * Filtrelenmiş kredi ürünlerini getirir
   */
  async getFilteredLoans(filter: LoanFilter): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts/filtered', {
      params: filter,
    });
    return response.data;
  },

  /**
   * En iyi faiz oranlı kredileri getirir
   */
  async getBestRates(loanType?: string): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts/best-rates', {
      params: { loanType },
    });
    return response.data;
  },

  /**
   * Öne çıkan kredi ürünlerini getirir
   */
  async getPromotedLoans(): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts/promoted');
    return response.data;
  },

  /**
   * Kampanyalı kredi ürünlerini getirir
   */
  async getCampaignLoans(): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts/campaigns');
    return response.data;
  },

  /**
   * İlk ev kredilerini getirir
   */
  async getFirstHomeLoans(): Promise<LoanProduct[]> {
    const response = await api.get<LoanProduct[]>('/api/LoanProducts/first-home');
    return response.data;
  },

  /**
   * Kredi türlerini getirir
   */
  async getLoanTypes(): Promise<string[]> {
    const response = await api.get<string[]>('/api/LoanProducts/types');
    return response.data;
  },

  /**
   * Krediye başvuru yapar
   */
  async applyForLoan(loanId: number): Promise<void> {
    await api.post(`/api/LoanProducts/${loanId}/apply`);
  },
};

export default loanService;
