import React, { useState, useEffect } from 'react';
import { loanService, LoanProduct } from '../services/loanService';

const LoanList: React.FC = () => {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>();

  useEffect(() => {
    const loadProductsAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await loanService.getAllLoans({ loanType: selectedType });
        setProducts(result);
      } catch (err) {
        setError('Krediler yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProductsAsync();
  }, [selectedType]);

  const handleTypeFilter = (type: string | undefined) => {
    setSelectedType(type);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Kredi Ürünlerini Karşılaştır</h1>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleTypeFilter(undefined)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !selectedType
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => handleTypeFilter('Konut')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'Konut'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Konut Kredisi
          </button>
          <button
            onClick={() => handleTypeFilter('İhtiyaç')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'İhtiyaç'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            İhtiyaç Kredisi
          </button>
          <button
            onClick={() => handleTypeFilter('Taşıt')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'Taşıt'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Taşıt Kredisi
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">{product.loanType}</span>
                  <h3 className="text-xl font-bold text-gray-800">{product.bank?.name || product.bankName || 'Banka Adı'}</h3>
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                {product.productName}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Faiz Oranı:</span>
                  <span className="font-bold text-primary-600">
                    %{product.minInterestRate} - %{product.maxInterestRate}
                  </span>
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

              {product.isPromoted && (
                <div className="mb-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                    Öne Çıkan
                  </span>
                </div>
              )}

              {product.isCampaignActive && product.campaignDescription && (
                <div className="mb-4 p-2 bg-purple-100 rounded text-sm text-purple-800">
                  📢 {product.campaignDescription}
                </div>
              )}

              {product.isFirstHomeLoan && (
                <div className="mb-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    İlk Konut
                  </span>
                </div>
              )}

              <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                Başvur
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Seçilen filtrelere uygun ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default LoanList;
