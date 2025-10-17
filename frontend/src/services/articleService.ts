import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5149';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Article {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  tags?: string;
  imageUrl?: string;
  viewCount: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleFilter {
  category?: string;
  isPublished?: boolean;
}

export const articleService = {
  /**
   * Tüm içerik/rehber yazılarını getirir
   */
  async getAllArticles(filter?: ArticleFilter): Promise<Article[]> {
    const params = new URLSearchParams();
    if (filter?.category) params.append('category', filter.category);
    if (filter?.isPublished !== undefined) params.append('isPublished', filter.isPublished.toString());

    const response = await api.get<Article[]>(`/api/Articles?${params.toString()}`);
    return response.data;
  },

  /**
   * ID'ye göre tek bir yazı getirir
   */
  async getArticleById(id: number): Promise<Article> {
    const response = await api.get<Article>(`/api/Articles/${id}`);
    return response.data;
  },

  /**
   * Slug ile yazı getirir
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await api.get<Article>(`/api/Articles/slug/${slug}`);
    return response.data;
  },

  /**
   * Kategorileri getirir
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/api/Articles/categories');
    return response.data;
  },

  /**
   * En popüler yazıları getirir
   */
  async getPopularArticles(limit: number = 10): Promise<Article[]> {
    const response = await api.get<Article[]>(`/api/Articles/popular?limit=${limit}`);
    return response.data;
  },
};

export default articleService;
