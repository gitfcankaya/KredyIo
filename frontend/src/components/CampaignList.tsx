import React, { useEffect, useState } from 'react';
import { campaignService, Campaign } from '../services/campaignService';

const CampaignList: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedType, selectedProductType, selectedBank, showActiveOnly]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: Campaign[];
      
      if (showActiveOnly) {
        data = await campaignService.getActiveCampaigns();
      } else {
        data = await campaignService.getAllCampaigns();
      }

      // Apply filters
      if (selectedType) {
        data = data.filter(c => c.campaignType === selectedType);
      }
      // productType filter temporarily disabled
      // if (selectedProductType) {
      //   data = data.filter(c => c.productType === selectedProductType);
      // }
      if (selectedBank) {
        data = data.filter(c => c.bank.id.toString() === selectedBank);
      }

      // Sort by start date (newest first)
      data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

      setCampaigns(data);
    } catch (err) {
      setError('Kampanyalar yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type === selectedType ? '' : type);
  };

  const handleProductTypeFilter = (productType: string) => {
    setSelectedProductType(productType === selectedProductType ? '' : productType);
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const isNew = (startDate: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(startDate) >= sevenDaysAgo;
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kampanyalar</h1>
        <p className="text-gray-600">Bankaların güncel kampanyalarını inceleyin ve fırsatları kaçırmayın</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Campaign Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kampanya Türü</label>
            <div className="flex flex-col gap-2">
              {['Hoşgeldin', 'İlk İşlem', 'Bonus', 'Faiz İndirimi'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Product Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ürün Türü</label>
            <div className="flex flex-col gap-2">
              {['Kredi Kartı', 'Kredi', 'Mevduat', 'Hesap'].map((productType) => (
                <button
                  key={productType}
                  onClick={() => handleProductTypeFilter(productType)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedProductType === productType
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {productType}
                </button>
              ))}
            </div>
          </div>

          {/* Active Status Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Durum</label>
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                showActiveOnly
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showActiveOnly ? '✅ Sadece Aktif' : '📋 Tümü'}
            </button>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedType('');
                setSelectedProductType('');
                setSelectedBank('');
              }}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
            >
              🔄 Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Campaign Cards */}
      {!loading && !error && (
        <div>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Seçilen kriterlere uygun kampanya bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const expired = isExpired(campaign.endDate);
                const isNewCampaign = isNew(campaign.startDate);
                const daysRemaining = getDaysRemaining(campaign.endDate);
                const showCountdown = daysRemaining > 0 && daysRemaining <= 30;

                return (
                  <div
                    key={campaign.id}
                    className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-2 ${
                      expired 
                        ? 'border-gray-300 opacity-60' 
                        : campaign.isActive 
                        ? 'border-purple-200' 
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Header with Badges */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-wrap gap-2">
                        {isNewCampaign && !expired && (
                          <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full font-bold">
                            🆕 YENİ
                          </span>
                        )}
                        {campaign.isActive && !expired && (
                          <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full font-bold">
                            ✅ AKTİF
                          </span>
                        )}
                        {expired && (
                          <span className="text-xs px-2 py-1 bg-gray-400 text-white rounded-full font-bold">
                            ⏰ SÜRESİ BİTTİ
                          </span>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {campaign.campaignType}
                      </span>
                    </div>

                    {/* Campaign Image (placeholder if not available) */}
                    {campaign.imageUrl ? (
                      <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-white text-4xl">🎉</span>
                      </div>
                    )}

                    {/* Bank Name */}
                    <p className="text-sm text-gray-500 mb-1">{campaign.bank?.name || 'Banka'}</p>

                    {/* Campaign Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>

                    {/* Campaign Type */}
                    <span className="inline-block text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full mb-3">
                      {campaign.campaignType}
                    </span>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {truncateText(campaign.description || 'Açıklama bulunmuyor', 120)}
                    </p>

                    {/* Bonus & Discount */}
                    <div className="flex gap-3 mb-4">
                      {campaign.bonusAmount && campaign.bonusAmount > 0 && (
                        <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs text-green-600 mb-1">Bonus</p>
                          <p className="text-2xl font-bold text-green-700">
                            +{campaign.bonusAmount.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      )}
                      {campaign.discountRate && campaign.discountRate > 0 && (
                        <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs text-red-600 mb-1">İndirim</p>
                          <p className="text-2xl font-bold text-red-700">
                            %{campaign.discountRate.toFixed(1)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Target Audience */}
                    {campaign.targetAudience && (
                      <div className="mb-4">
                        <span className="inline-block text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          🎯 {campaign.targetAudience}
                        </span>
                      </div>
                    )}

                    {/* Date Range */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Kampanya Süresi</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </p>
                    </div>

                    {/* Countdown */}
                    {showCountdown && !expired && (
                      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-bold text-orange-700">
                          ⏳ {daysRemaining} gün kaldı!
                        </p>
                      </div>
                    )}

                    {/* CTA Button - temporarily disabled */}
                    {!expired && (
                      <div className="block w-full text-center px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold">
                        Kampanya Detayları
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
