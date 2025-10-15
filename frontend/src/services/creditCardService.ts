import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreditCardProduct {
  id: number;
  bankId: number;
  bankName?: string;
  cardName: string;
  cardType: string;
  description?: string;
  annualFee: number;
  interestRate: number;
  cashbackRate?: number;
  pointsMultiplier?: number;
  milesMultiplier?: number;
  isNoFee: boolean;
  isPromoted: boolean;
  isCampaignActive: boolean;
  campaignDescription?: string;
  advantages: string[];
  requirements: string[];
  benefits: string[];
  applicationUrl?: string;
  cardImageUrl?: string;
  lastUpdated: string;
}

export interface CreditCardFilter {
  cardType?: string;
  bankId?: number;
  isNoFee?: boolean;
  maxAnnualFee?: number;
  isPromoted?: boolean;
  hasCashback?: boolean;
  hasPoints?: boolean;
  hasMiles?: boolean;
}

export const creditCardService = {
  /**
   * Tüm kredi kartlarını getirir
   */
  async getAllCards(filter?: CreditCardFilter): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts', {
      params: filter,
    });
    return response.data;
  },

  /**
   * ID'ye göre tek bir kredi kartı getirir
   */
  async getCardById(id: number): Promise<CreditCardProduct> {
    const response = await api.get<CreditCardProduct>(`/api/CreditCardProducts/${id}`);
    return response.data;
  },

  /**
   * Filtrelenmiş kredi kartlarını getirir
   */
  async getFilteredCards(filter: CreditCardFilter): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts/filtered', {
      params: filter,
    });
    return response.data;
  },

  /**
   * Aidatsız kredi kartlarını getirir
   */
  async getNoFeeCards(): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts/no-fee');
    return response.data;
  },

  /**
   * Öne çıkan kredi kartlarını getirir
   */
  async getPromotedCards(): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts/promoted');
    return response.data;
  },

  /**
   * Kampanyalı kredi kartlarını getirir
   */
  async getCampaignCards(): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts/campaigns');
    return response.data;
  },

  /**
   * Mil kazandıran kartları getirir
   */
  async getMileCards(): Promise<CreditCardProduct[]> {
    const response = await api.get<CreditCardProduct[]>('/api/CreditCardProducts/mile-earning');
    return response.data;
  },

  /**
   * Kart türlerini getirir
   */
  async getCardTypes(): Promise<string[]> {
    const response = await api.get<string[]>('/api/CreditCardProducts/types');
    return response.data;
  },

  /**
   * Kredi kartına başvuru yapar
   */
  async applyForCard(cardId: number): Promise<void> {
    await api.post(`/api/CreditCardProducts/${cardId}/apply`);
  },
};

export default creditCardService;
