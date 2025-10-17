import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQFilter {
  category?: string;
  isActive?: boolean;
}

export const faqService = {
  /**
   * Tüm SSS'leri getirir
   */
  async getAllFAQs(filter?: FAQFilter): Promise<FAQ[]> {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());

    const response = await api.get<FAQ[]>(`/api/FrequentlyAskedQuestions?${params.toString()}`);
    return response.data;
  },

  /**
   * ID'ye göre tek bir SSS getirir
   */
  async getFAQById(id: number): Promise<FAQ> {
    const response = await api.get<FAQ>(`/api/FrequentlyAskedQuestions/${id}`);
    return response.data;
  },

  /**
   * Kategorileri getirir
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/api/FrequentlyAskedQuestions/categories');
    return response.data;
  },

  /**
   * Popüler SSS'leri getirir
   */
  async getPopularFAQs(limit: number = 10): Promise<FAQ[]> {
    const response = await api.get<FAQ[]>(`/api/FrequentlyAskedQuestions/popular?limit=${limit}`);
    return response.data;
  },
};

export default faqService;
