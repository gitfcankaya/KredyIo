import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface EconomicIndicator {
  id: number;
  indicatorCode: string;
  indicatorName: string;
  value: number;
  unit: string;
  period: string;
  previousValue?: number;
  changePercent?: number;
  source: string;
  dataDate: string;
}

export const economicIndicatorService = {
  /**
   * Tüm ekonomik göstergeleri getirir
   */
  async getAllIndicators(): Promise<EconomicIndicator[]> {
    const response = await api.get<EconomicIndicator[]>('/api/EconomicIndicators');
    return response.data;
  },

  /**
   * ID'ye göre tek bir ekonomik gösterge getirir
   */
  async getIndicatorById(id: number): Promise<EconomicIndicator> {
    const response = await api.get<EconomicIndicator>(`/api/EconomicIndicators/${id}`);
    return response.data;
  },

  /**
   * Kod ile ekonomik gösterge getirir
   */
  async getIndicatorByCode(code: string): Promise<EconomicIndicator> {
    const response = await api.get<EconomicIndicator>(`/api/EconomicIndicators/code/${code}`);
    return response.data;
  },

  /**
   * En güncel ekonomik göstergeleri getirir
   */
  async getLatestIndicators(): Promise<EconomicIndicator[]> {
    const response = await api.get<EconomicIndicator[]>('/api/EconomicIndicators/latest');
    return response.data;
  },
};

export default economicIndicatorService;
