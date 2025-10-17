import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CurrencyRate {
  id: number;
  currencyCode: string;
  currencyName: string;
  buyingRate: number;
  sellingRate: number;
  effectiveBuyingRate?: number;
  effectiveSellingRate?: number;
  previousRate: number;
  changePercent: number;
  changeAmount: number;
  source: string;
  rateDate: string;
}

export const currencyRateService = {
  /**
   * Tüm döviz kurlarını getirir
   */
  async getAllRates(): Promise<CurrencyRate[]> {
    const response = await api.get<CurrencyRate[]>('/api/CurrencyRates');
    return response.data;
  },

  /**
   * ID'ye göre tek bir döviz kuru getirir
   */
  async getRateById(id: number): Promise<CurrencyRate> {
    const response = await api.get<CurrencyRate>(`/api/CurrencyRates/${id}`);
    return response.data;
  },

  /**
   * En güncel döviz kurlarını getirir
   */
  async getLatestRates(): Promise<CurrencyRate[]> {
    const response = await api.get<CurrencyRate[]>('/api/CurrencyRates/latest');
    return response.data;
  },
};

export default currencyRateService;
