import React, { useEffect, useState } from 'react';
import { economicIndicatorService, EconomicIndicator } from '../services/economicIndicatorService';

const EconomicIndicatorsDashboard: React.FC = () => {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        setLoading(true);
        const data = await economicIndicatorService.getLatestIndicators();
        setIndicators(data);
      } catch (err) {
        setError('Ekonomik göstergeler yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicators();
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
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Ekonomik Göstergeler</h2>
        <p className="text-blue-100 text-sm mt-1">Güncel ekonomik veriler ve göstergeler</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {indicators.map((indicator) => (
          <div key={indicator.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{indicator.indicatorName}</h3>
                <p className="text-sm text-gray-500">{indicator.indicatorCode}</p>
              </div>
              {indicator.changePercent !== undefined && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  indicator.changePercent >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {indicator.changePercent >= 0 ? '↑' : '↓'} {Math.abs(indicator.changePercent).toFixed(2)}%
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {indicator.value.toFixed(2)} {indicator.unit}
                </div>
                <div className="text-xs text-gray-500 mt-1">{indicator.period}</div>
              </div>
              
              {indicator.previousValue !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Önceki Değer:</span>
                  <span className="font-medium text-gray-700">
                    {indicator.previousValue.toFixed(2)} {indicator.unit}
                  </span>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Kaynak: {indicator.source}</span>
                  <span className="text-gray-400">
                    {new Date(indicator.dataDate).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {indicators.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Henüz ekonomik gösterge verisi bulunmamaktadır.
        </div>
      )}
    </div>
  );
};

export default EconomicIndicatorsDashboard;
