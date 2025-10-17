import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  sourceUrl?: string;
  source: string;
  author?: string;
  imageUrl?: string;
  tags?: string;
  category: string;
  publishedAt: string;
  isActive: boolean;
  viewCount: number;
}

export interface NewsFilter {
  category?: string;
  source?: string;
  isActive?: boolean;
}

export const newsArticleService = {
  /**
   * Tüm haberleri getirir
   */
  async getAllNews(filter?: NewsFilter): Promise<NewsArticle[]> {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.source) params.append('source', filter.source);
    if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());

    const response = await api.get<NewsArticle[]>(`/api/NewsArticles?${params.toString()}`);
    return response.data;
  },

  /**
   * ID'ye göre tek bir haber getirir
   */
  async getNewsById(id: number): Promise<NewsArticle> {
    const response = await api.get<NewsArticle>(`/api/NewsArticles/${id}`);
    return response.data;
  },

  /**
   * En güncel haberleri getirir
   */
  async getLatestNews(limit: number = 10): Promise<NewsArticle[]> {
    const response = await api.get<NewsArticle[]>(`/api/NewsArticles/latest?limit=${limit}`);
    return response.data;
  },

  /**
   * En popüler haberleri getirir
   */
  async getPopularNews(limit: number = 10): Promise<NewsArticle[]> {
    const response = await api.get<NewsArticle[]>(`/api/NewsArticles/popular?limit=${limit}`);
    return response.data;
  },
};

export default newsArticleService;
