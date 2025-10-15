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
      '/api/v1/calculators/loan-payment',
      request
    );
    return response.data.data;
  },

  async calculateInterest(request: InterestRequest): Promise<InterestResult> {
    const response = await api.post<ApiResponse<InterestResult>>(
      '/api/v1/calculators/interest',
      request
    );
    return response.data.data;
  },
};

export default api;
