import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DepositRate {
  id: number;
  bankId: number;
  bank?: {
    id: number;
    name: string;
    logoUrl?: string;
  };
  currency: string;
  termMonths: number;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  campaignRate?: number;
  campaignEndDate?: string;
  hasSpreadsheet?: boolean;
  campaignDetails?: string;
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositFilter {
  bankId?: number;
  currency?: string;
  termMonths?: number;
  minInterestRate?: number;
  isOnlineSpecial?: boolean;
  isNewCustomerSpecial?: boolean;
}

export interface DepositMatrixItem {
  bankId: number;
  bankName: string;
  rates: { [term: number]: number };
}

export const depositService = {
  /**
   * Tüm mevduat faiz oranlarını getirir
   */
  async getAllRates(filter?: DepositFilter): Promise<DepositRate[]> {
    const response = await api.get<DepositRate[]>('/api/DepositRates', {
      params: filter,
    });
    return response.data;
  },

  /**
   * ID'ye göre tek bir mevduat oranı getirir
   */
  async getRateById(id: number): Promise<DepositRate> {
    const response = await api.get<DepositRate>(`/api/DepositRates/${id}`);
    return response.data;
  },

  /**
   * Filtrelenmiş mevduat oranlarını getirir
   */
  async getFilteredRates(filter: DepositFilter): Promise<DepositRate[]> {
    const response = await api.get<DepositRate[]>('/api/DepositRates/filtered', {
      params: filter,
    });
    return response.data;
  },

  /**
   * En yüksek faiz oranlarını getirir
   */
  async getBestRates(currency?: string, termMonths?: number): Promise<DepositRate[]> {
    const response = await api.get<DepositRate[]>('/api/DepositRates/best-rates', {
      params: { currency, termMonths },
    });
    return response.data;
  },

  /**
   * Online özel fırsatları getirir
   */
  async getOnlineSpecials(): Promise<DepositRate[]> {
    const response = await api.get<DepositRate[]>('/api/DepositRates/online-specials');
    return response.data;
  },

  /**
   * Yeni müşteri fırsatlarını getirir
   */
  async getNewCustomerSpecials(): Promise<DepositRate[]> {
    const response = await api.get<DepositRate[]>('/api/DepositRates/new-customer');
    return response.data;
  },

  /**
   * Mevduat matris görünümünü getirir (bankalar x vadeler)
   */
  async getMatrixView(currency: string = 'TRY'): Promise<DepositMatrixItem[]> {
    const response = await api.get<DepositMatrixItem[]>('/api/DepositRates/matrix', {
      params: { currency },
    });
    return response.data;
  },

  /**
   * Mevcut para birimlerini getirir
   */
  async getCurrencies(): Promise<string[]> {
    const response = await api.get<string[]>('/api/DepositRates/currencies');
    return response.data;
  },
};

export default depositService;
