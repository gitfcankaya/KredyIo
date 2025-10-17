import React, { useEffect, useState } from 'react';
import { currencyRateService, CurrencyRate } from '../services/currencyRateService';

const CurrencyRateList: React.FC = () => {
  const [currencyRates, setCurrencyRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        setLoading(true);
        const data = await currencyRateService.getLatestRates();
        setCurrencyRates(data);
      } catch (err) {
        setError('Döviz kurları yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencyRates();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Döviz Kurları</h2>
        <p className="text-green-100 text-sm mt-1">Güncel döviz alış-satış kurları</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Döviz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alış
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satış
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Değişim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currencyRates.map((rate) => (
              <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rate.currencyCode}</div>
                      <div className="text-xs text-gray-500">{rate.currencyName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₺{rate.buyingRate.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₺{rate.sellingRate.toFixed(4)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    rate.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {rate.changePercent >= 0 ? '+' : ''}{rate.changePercent.toFixed(2)}%
                    <span className="text-xs ml-1">
                      ({rate.changePercent >= 0 ? '+' : ''}₺{rate.changeAmount.toFixed(4)})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{rate.source}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {currencyRates.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
          Son güncelleme: {new Date(currencyRates[0].rateDate).toLocaleString('tr-TR')}
        </div>
      )}
    </div>
  );
};

export default CurrencyRateList;
