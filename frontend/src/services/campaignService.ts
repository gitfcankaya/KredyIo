import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  campaignType: string;
  startDate: string;
  endDate: string;
  discountRate?: number;
  bonusAmount?: number;
  conditions?: string;
  terms?: string;
  targetAudience?: string;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  bank: {
    id: number;
    name: string;
    logoUrl?: string;
  };
}

export interface CampaignFilter {
  bankId?: number;
  campaignType?: string;
  productType?: string;
  isActive?: boolean;
  targetAudience?: string;
}

export const campaignService = {
  /**
   * Tüm kampanyaları getirir
   */
  async getAllCampaigns(filter?: CampaignFilter): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>('/api/Campaigns', {
      params: filter,
    });
    return response.data;
  },

  /**
   * ID'ye göre tek bir kampanya getirir
   */
  async getCampaignById(id: number): Promise<Campaign> {
    const response = await api.get<Campaign>(`/api/Campaigns/${id}`);
    return response.data;
  },

  /**
   * Aktif kampanyaları getirir
   */
  async getActiveCampaigns(): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>('/api/Campaigns/active');
    return response.data;
  },

  /**
   * Banka kampanyalarını getirir
   */
  async getCampaignsByBank(bankId: number): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>(`/api/Campaigns/bank/${bankId}`);
    return response.data;
  },

  /**
   * Kampanya türlerine göre kampanyaları getirir
   */
  async getCampaignsByType(campaignType: string): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>(`/api/Campaigns/type/${campaignType}`);
    return response.data;
  },

  /**
   * Ürün türüne göre kampanyaları getirir
   */
  async getCampaignsByProduct(productType: string): Promise<Campaign[]> {
    const response = await api.get<Campaign[]>(`/api/Campaigns/product/${productType}`);
    return response.data;
  },

  /**
   * Kampanya türlerini getirir
   */
  async getCampaignTypes(): Promise<string[]> {
    const response = await api.get<string[]>('/api/Campaigns/types');
    return response.data;
  },
};

export default campaignService;
