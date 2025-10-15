import React, { useEffect, useState } from 'react';
import { depositService, DepositRate } from '../services/depositService';

type ViewMode = 'list' | 'matrix';

const DepositRateList: React.FC = () => {
  const [rates, setRates] = useState<DepositRate[]>([]);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('TRY');
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>('');

  useEffect(() => {
    fetchRates();
  }, [selectedCurrency, selectedTerm, selectedBank, viewMode]);

  const fetchRates = async () => {
    try {
      setLoading(true);
      setError(null);

      if (viewMode === 'matrix') {
        const data = await depositService.getMatrixView(selectedCurrency);
        setMatrixData(data);
      } else {
        const filters: any = { currency: selectedCurrency };
        if (selectedTerm) filters.termMonths = selectedTerm;
        if (selectedBank) filters.bankId = selectedBank;

        const data = await depositService.getFilteredRates(filters);
        setRates(data);
      }
    } catch (err) {
      setError('Mevduat oranları yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
  };

  const handleTermFilter = (term: number | null) => {
    setSelectedTerm(term);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'list' ? 'matrix' : 'list');
  };

  const formatCurrency = (amount: number | undefined, currency: string) => {
    if (amount === undefined || amount === null) return '0';
    const symbols: any = { TRY: '₺', USD: '$', EUR: '€' };
    return `${symbols[currency] || ''}${amount.toLocaleString('tr-TR')}`;
  };

  const renderMatrixView = () => {
    if (!matrixData || !matrixData.terms || matrixData.terms.length === 0) {
      return <div className="text-center py-8 text-gray-500">Matrix verisi bulunamadı</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Banka</th>
              {matrixData.terms.map((term: number) => (
                <th key={term} className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                  {term} Ay
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData.banks && matrixData.banks.map((bank: any, idx: number) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b">{bank.bankName}</td>
                {matrixData.terms.map((term: number) => {
                  const rate = bank.rates[term];
                  const isBestRate = rate && rate.isBestRate;
                  return (
                    <td
                      key={term}
                      className={`px-4 py-3 text-center text-sm border-b ${
                        isBestRate ? 'bg-green-100 font-bold text-green-800' : 'text-gray-700'
                      }`}
                    >
                      {rate ? `%${rate.rate.toFixed(2)}` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderListView = () => {
    if (rates.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Seçilen kriterlere uygun mevduat oranı bulunamadı</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">{rate.bank?.name || 'Banka'}</h3>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                {rate.currency}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Vade</span>
                <span className="text-lg font-bold text-gray-900">{rate.termMonths} Ay</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Faiz Oranı</span>
                <span className="text-2xl font-bold text-green-600">%{rate.interestRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tutar Aralığı</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(rate.minAmount || 0, rate.currency)} - {formatCurrency(rate.maxAmount || 0, rate.currency)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {rate.campaignRate && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  🎉 Kampanya: %{rate.campaignRate.toFixed(2)}
                </span>
              )}
              {rate.campaignDetails && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  ⭐ {rate.campaignDetails}
                </span>
              )}
            </div>

            {rate.campaignEndDate && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-xs text-purple-800">
                  <span className="font-semibold">📢 Kampanya Bitiş:</span> {new Date(rate.campaignEndDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Son Güncelleme: {new Date(rate.updatedAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mevduat Faiz Oranları</h1>
        <p className="text-gray-600">Bankaların güncel mevduat faiz oranlarını karşılaştırın</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Currency Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Para Birimi</label>
            <div className="flex gap-2">
              {['TRY', 'USD', 'EUR'].map((currency) => (
                <button
                  key={currency}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCurrency === currency
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {/* Term Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vade</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleTermFilter(null)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTerm === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tümü
              </button>
              {[1, 3, 6, 12].map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermFilter(term)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTerm === term
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {term} Ay
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Görünüm</label>
            <button
              onClick={handleViewModeToggle}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {viewMode === 'list' ? '📊 Matrix Görünüm' : '📋 Liste Görünüm'}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <div>
          {viewMode === 'matrix' ? renderMatrixView() : renderListView()}
        </div>
      )}
    </div>
  );
};

export default DepositRateList;
