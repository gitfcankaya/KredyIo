import React, { useEffect, useState } from 'react';
import { goldPriceService, GoldPrice } from '../services/goldPriceService';

const GoldPriceList: React.FC = () => {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoldPrices = async () => {
      try {
        setLoading(true);
        const data = await goldPriceService.getLatestPrices();
        setGoldPrices(data);
      } catch (err) {
        setError('Altın fiyatları yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoldPrices();
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
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Altın Fiyatları</h2>
        <p className="text-yellow-100 text-sm mt-1">Güncel altın alış-satış fiyatları</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Altın Türü
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
            {goldPrices.map((price) => (
              <tr key={price.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{price.goldType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₺{price.buyingPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₺{price.sellingPrice.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    price.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {price.changePercent >= 0 ? '+' : ''}{price.changePercent.toFixed(2)}%
                    <span className="text-xs ml-1">
                      ({price.changePercent >= 0 ? '+' : ''}₺{price.changeAmount.toFixed(2)})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{price.source}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {goldPrices.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
          Son güncelleme: {new Date(goldPrices[0].priceDate).toLocaleString('tr-TR')}
        </div>
      )}
    </div>
  );
};

export default GoldPriceList;
