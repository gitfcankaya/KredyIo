import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { Product, ProductType, ProductFilter } from '../types';

const ProductTypeLabels: Record<ProductType, string> = {
  [ProductType.PersonalLoan]: 'İhtiyaç Kredisi',
  [ProductType.CreditCard]: 'Kredi Kartı',
  [ProductType.Mortgage]: 'Konut Kredisi',
  [ProductType.AutoLoan]: 'Taşıt Kredisi',
  [ProductType.BusinessLoan]: 'İşletme Kredisi',
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductFilter>({
    pageNumber: 1,
    pageSize: 12,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    const loadProductsAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productService.getProducts(filter);
        setProducts(result.items);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProductsAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else if (prev.length < 5) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const handleTypeFilter = (type: ProductType | undefined) => {
    setFilter({ ...filter, type, pageNumber: 1 });
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      window.location.href = `/compare?ids=${selectedProducts.join(',')}`;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Kredi Ürünlerini Karşılaştır
      </h1>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filtreler</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleTypeFilter(undefined)}
            className={`px-4 py-2 rounded-lg ${
              !filter.type
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tümü
          </button>
          {Object.entries(ProductTypeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTypeFilter(Number(key) as ProductType)}
              className={`px-4 py-2 rounded-lg ${
                filter.type === Number(key)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Products Bar */}
      {selectedProducts.length > 0 && (
        <div className="mb-6 bg-primary-50 p-4 rounded-lg flex justify-between items-center">
          <span className="text-primary-800 font-medium">
            {selectedProducts.length} ürün seçildi
          </span>
          <button
            onClick={handleCompare}
            disabled={selectedProducts.length < 2}
            className={`px-6 py-2 rounded-lg font-medium ${
              selectedProducts.length >= 2
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Karşılaştır
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow ${
              selectedProducts.includes(product.id) ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">
                    {ProductTypeLabels[product.type]}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">{product.lenderName}</h3>
                </div>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="w-5 h-5 text-primary-600"
                  disabled={
                    !selectedProducts.includes(product.id) && selectedProducts.length >= 5
                  }
                />
              </div>

              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                {product.productName}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Faiz Oranı:</span>
                  <span className="font-bold text-primary-600">%{product.interestRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Miktar:</span>
                  <span className="font-medium">
                    ₺{product.minAmount.toLocaleString()} - ₺
                    {product.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vade:</span>
                  <span className="font-medium">
                    {product.minTerm}-{product.maxTerm} ay
                  </span>
                </div>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Özellikler:</div>
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                Detayları Gör
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setFilter({ ...filter, pageNumber: page })}
              className={`px-4 py-2 rounded-lg ${
                filter.pageNumber === page
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
