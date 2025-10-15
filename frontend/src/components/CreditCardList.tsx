import React, { useState, useEffect } from 'react';
import { creditCardService, CreditCardProduct } from '../services/creditCardService';

const CreditCardList: React.FC = () => {
  const [cards, setCards] = useState<CreditCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [showNoFeeOnly, setShowNoFeeOnly] = useState(false);

  useEffect(() => {
    const loadCardsAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result: CreditCardProduct[];
        if (showNoFeeOnly) {
          result = await creditCardService.getNoFeeCards();
        } else {
          result = await creditCardService.getAllCards({ cardType: selectedType });
        }
        
        setCards(result);
      } catch (err) {
        setError('Kredi kartları yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCardsAsync();
  }, [selectedType, showNoFeeOnly]);

  const handleTypeFilter = (type: string | undefined) => {
    setSelectedType(type);
    setShowNoFeeOnly(false);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Kredi Kartlarını Karşılaştır</h1>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleTypeFilter(undefined)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !selectedType && !showNoFeeOnly
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => {
              setShowNoFeeOnly(true);
              setSelectedType(undefined);
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showNoFeeOnly
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aidatsız Kartlar
          </button>
          <button
            onClick={() => handleTypeFilter('Mil')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'Mil'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mil Kazandıran
          </button>
          <button
            onClick={() => handleTypeFilter('Puan')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'Puan'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Puan Kazandıran
          </button>
          <button
            onClick={() => handleTypeFilter('Öğrenci')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === 'Öğrenci'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Öğrenci Kartı
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-gray-500">{card.cardType}</span>
                  <h3 className="text-xl font-bold text-gray-800">{card.bankName}</h3>
                </div>
              </div>

              <h4 className="text-lg font-semibold mb-3 text-gray-700">
                {card.cardName}
              </h4>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Yıllık Aidat:</span>
                  <span className={`font-bold ${card.isNoFee ? 'text-green-600' : 'text-primary-600'}`}>
                    {card.isNoFee ? 'Ücretsiz' : `₺${card.annualFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Faiz Oranı:</span>
                  <span className="font-medium">%{card.interestRate}</span>
                </div>
                {card.cashbackRate && card.cashbackRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cashback:</span>
                    <span className="font-medium text-green-600">%{card.cashbackRate}</span>
                  </div>
                )}
                {card.milesMultiplier && card.milesMultiplier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mil Kazancı:</span>
                    <span className="font-medium text-blue-600">{card.milesMultiplier}x</span>
                  </div>
                )}
                {card.pointsMultiplier && card.pointsMultiplier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puan Kazancı:</span>
                    <span className="font-medium text-purple-600">{card.pointsMultiplier}x</span>
                  </div>
                )}
              </div>

              {card.advantages && card.advantages.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Avantajlar:</div>
                  <div className="flex flex-wrap gap-2">
                    {card.advantages.slice(0, 3).map((advantage, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded"
                      >
                        {advantage}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {card.isPromoted && (
                <div className="mb-2">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                    Öne Çıkan
                  </span>
                </div>
              )}

              {card.isCampaignActive && card.campaignDescription && (
                <div className="mb-4 p-2 bg-purple-100 rounded text-sm text-purple-800">
                  📢 {card.campaignDescription}
                </div>
              )}

              <button className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                Başvur
              </button>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Seçilen filtrelere uygun kart bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default CreditCardList;
