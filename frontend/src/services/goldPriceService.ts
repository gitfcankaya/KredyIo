import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GoldPrice {
  id: number;
  goldType: string;
  buyingPrice: number;
  sellingPrice: number;
  previousPrice: number;
  changePercent: number;
  changeAmount: number;
  source: string;
  priceDate: string;
}

export const goldPriceService = {
  /**
   * Tüm altın fiyatlarını getirir
   */
  async getAllPrices(): Promise<GoldPrice[]> {
    const response = await api.get<GoldPrice[]>('/api/GoldPrices');
    return response.data;
  },

  /**
   * ID'ye göre tek bir altın fiyatı getirir
   */
  async getPriceById(id: number): Promise<GoldPrice> {
    const response = await api.get<GoldPrice>(`/api/GoldPrices/${id}`);
    return response.data;
  },

  /**
   * En güncel altın fiyatlarını getirir
   */
  async getLatestPrices(): Promise<GoldPrice[]> {
    const response = await api.get<GoldPrice[]>('/api/GoldPrices/latest');
    return response.data;
  },
};

export default goldPriceService;
