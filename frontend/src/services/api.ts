import axios from 'axios';
import {
  Product,
  ProductFilter,
  PagedResult,
  LoanPaymentRequest,
  LoanPaymentResult,
  InterestRequest,
  InterestResult,
  ApiResponse,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5148';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Banks Service
export const banksService = {
  async getBanks(isActive?: boolean) {
    const response = await api.get('/api/banks', {
      params: { isActive }
    });
    return response.data;
  },

  async getBank(id: number) {
    const response = await api.get(`/api/banks/${id}`);
    return response.data;
  },

  async getBankByCode(code: string) {
    const response = await api.get(`/api/banks/code/${code}`);
    return response.data;
  },

  async getBankProducts(id: number) {
    const response = await api.get(`/api/banks/${id}/products`);
    return response.data;
  },

  async createBank(data: any) {
    const response = await api.post('/api/banks', data);
    return response.data;
  },

  async updateBank(id: number, data: any) {
    const response = await api.put(`/api/banks/${id}`, data);
    return response.data;
  },

  async deleteBank(id: number) {
    const response = await api.delete(`/api/banks/${id}`);
    return response.data;
  }
};

// Campaigns Service
export const campaignsService = {
  async getCampaigns(params?: { campaignType?: string; bankId?: number; isFeatured?: boolean }) {
    const response = await api.get('/api/campaigns', { params });
    return response.data;
  },

  async getCampaign(id: number) {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },

  async getActiveCampaigns() {
    const response = await api.get('/api/campaigns/active');
    return response.data;
  },

  async getFeaturedCampaigns() {
    const response = await api.get('/api/campaigns/featured');
    return response.data;
  },

  async createCampaign(data: any) {
    const response = await api.post('/api/campaigns', data);
    return response.data;
  },

  async updateCampaign(id: number, data: any) {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
  },

  async deleteCampaign(id: number) {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
  }
};

// Currency Rates Service
export const currencyRatesService = {
  async getLatestRates() {
    const response = await api.get('/api/currencyrates/latest');
    return response.data;
  },

  async getRates() {
    const response = await api.get('/api/currencyrates');
    return response.data;
  },

  async getRateByCode(code: string) {
    const response = await api.get(`/api/currencyrates/code/${code}`);
    return response.data;
  }
};

// Gold Prices Service
export const goldPricesService = {
  async getLatestPrices() {
    const response = await api.get('/api/goldprices/latest');
    return response.data;
  },

  async getPrices() {
    const response = await api.get('/api/goldprices');
    return response.data;
  },

  async getPrice(id: number) {
    const response = await api.get(`/api/goldprices/${id}`);
    return response.data;
  }
};

// Economic Indicators Service
export const economicIndicatorsService = {
  async getLatestIndicators() {
    const response = await api.get('/api/economicindicators/latest');
    return response.data;
  },

  async getIndicators() {
    const response = await api.get('/api/economicindicators');
    return response.data;
  },

  async getIndicatorByCode(code: string) {
    const response = await api.get(`/api/economicindicators/code/${code}`);
    return response.data;
  }
};

// News Articles Service
export const newsArticlesService = {
  async getLatestNews(count?: number) {
    const response = await api.get('/api/newsarticles/latest', {
      params: { count }
    });
    return response.data;
  },

  async getNews(params?: { category?: string; isActive?: boolean }) {
    const response = await api.get('/api/newsarticles', { params });
    return response.data;
  },

  async getNewsArticle(id: number) {
    const response = await api.get(`/api/newsarticles/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/api/newsarticles/categories');
    return response.data;
  },

  async createNews(data: any) {
    const response = await api.post('/api/newsarticles', data);
    return response.data;
  },

  async updateNews(id: number, data: any) {
    const response = await api.put(`/api/newsarticles/${id}`, data);
    return response.data;
  },

  async deleteNews(id: number) {
    const response = await api.delete(`/api/newsarticles/${id}`);
    return response.data;
  }
};

// Deposit Products Service
export const depositProductsService = {
  async getProducts(params?: { bankId?: number; currency?: string }) {
    const response = await api.get('/api/depositproducts', { params });
    return response.data;
  },

  async getProduct(id: number) {
    const response = await api.get(`/api/depositproducts/${id}`);
    return response.data;
  },

  async getByBank(bankId: number) {
    const response = await api.get(`/api/depositproducts/bank/${bankId}`);
    return response.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/api/depositproducts', data);
    return response.data;
  },

  async updateProduct(id: number, data: any) {
    const response = await api.put(`/api/depositproducts/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/api/depositproducts/${id}`);
    return response.data;
  }
};

// Investment Products Service
export const investmentProductsService = {
  async getProducts() {
    const response = await api.get('/api/investmentproducts');
    return response.data;
  },

  async getProduct(id: number) {
    const response = await api.get(`/api/investmentproducts/${id}`);
    return response.data;
  }
};

// Articles Service
export const articlesService = {
  async getPopularArticles(count?: number) {
    const response = await api.get('/api/articles/popular', {
      params: { count }
    });
    return response.data;
  },

  async getArticles() {
    const response = await api.get('/api/articles');
    return response.data;
  },

  async getArticleBySlug(slug: string) {
    const response = await api.get(`/api/articles/slug/${slug}`);
    return response.data;
  },

  async getArticle(id: number) {
    const response = await api.get(`/api/articles/${id}`);
    return response.data;
  },

  async createArticle(data: any) {
    const response = await api.post('/api/articles', data);
    return response.data;
  },

  async updateArticle(id: number, data: any) {
    const response = await api.put(`/api/articles/${id}`, data);
    return response.data;
  },

  async deleteArticle(id: number) {
    const response = await api.delete(`/api/articles/${id}`);
    return response.data;
  }
};

// FAQs Service
export const faqsService = {
  async getFAQs(category?: string) {
    const response = await api.get('/api/frequentlyaskedquestions', {
      params: { category }
    });
    return response.data;
  },

  async getFAQ(id: number) {
    const response = await api.get(`/api/frequentlyaskedquestions/${id}`);
    return response.data;
  }
};

// Loan Products Service
export const loanProductsService = {
  async getProducts(params?: { bankId?: number; loanType?: string; minAmount?: number; maxAmount?: number }) {
    const response = await api.get('/api/loanproducts', { params });
    return response.data;
  },

  async getProduct(id: number) {
    const response = await api.get(`/api/loanproducts/${id}`);
    return response.data;
  },

  async getByBank(bankId: number) {
    const response = await api.get(`/api/loanproducts/bank/${bankId}`);
    return response.data;
  },

  async getFeatured() {
    const response = await api.get('/api/loanproducts/featured');
    return response.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/api/loanproducts', data);
    return response.data;
  },

  async updateProduct(id: number, data: any) {
    const response = await api.put(`/api/loanproducts/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/api/loanproducts/${id}`);
    return response.data;
  }
};

// Credit Card Products Service
export const creditCardProductsService = {
  async getProducts(params?: { bankId?: number; cardType?: string }) {
    const response = await api.get('/api/creditcardproducts', { params });
    return response.data;
  },

  async getProduct(id: number) {
    const response = await api.get(`/api/creditcardproducts/${id}`);
    return response.data;
  },

  async getByBank(bankId: number) {
    const response = await api.get(`/api/creditcardproducts/bank/${bankId}`);
    return response.data;
  },

  async createProduct(data: any) {
    const response = await api.post('/api/creditcardproducts', data);
    return response.data;
  },

  async updateProduct(id: number, data: any) {
    const response = await api.put(`/api/creditcardproducts/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number) {
    const response = await api.delete(`/api/creditcardproducts/${id}`);
    return response.data;
  }
};

export const productService = {
  async getProducts(filter?: ProductFilter): Promise<PagedResult<Product>> {
    const response = await api.get<ApiResponse<PagedResult<Product>>>('/api/v1/products', {
      params: filter,
    });
    return response.data.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/api/v1/products/${id}`);
    return response.data.data;
  },

  async compareProducts(ids: string[]): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/api/v1/products/compare', {
      params: { ids: ids.join(',') },
    });
    return response.data.data;
  },
};

export const calculatorService = {
  async calculateLoanPayment(request: LoanPaymentRequest): Promise<LoanPaymentResult> {
    const response = await api.post<ApiResponse<LoanPaymentResult>>(
      '/api/calculators/loan',
      request
    );
    return response.data.data;
  },

  async calculateInterest(request: InterestRequest): Promise<InterestResult> {
    const response = await api.post<ApiResponse<InterestResult>>(
      '/api/calculators/interest',
      request
    );
    return response.data.data;
  },
};

export default api;

