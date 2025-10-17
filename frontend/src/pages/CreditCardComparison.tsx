/**
 * Credit Card Comparison Page
 * Compare different credit cards with filtering, sorting, and side-by-side comparison
 */

import React, { useEffect, useState } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Container from '../components/Navigation/Container';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import { creditCardProductsService, banksService } from '../services/api';
import { CreditCard, Bank, CreditCardType } from '../types';
import './Pages.css';

const CreditCardComparison: React.FC = () => {
  // State
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<CreditCard[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<CreditCardType | null>(null);
  const [maxAnnualFee, setMaxAnnualFee] = useState<number>(5000);
  const [minRewardPoints, setMinRewardPoints] = useState<number>(0);
  
  // Comparison state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [comparisonCards, setComparisonCards] = useState<CreditCard[]>([]);
  
  // Sort state
  const [sortBy, setSortBy] = useState<'fee' | 'reward' | 'rate'>('fee');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [cardsData, banksData] = await Promise.all([
          creditCardProductsService.getProducts(),
          banksService.getBanks(true),
        ]);

        setCards(cardsData);
        setFilteredCards(cardsData);
        setBanks(banksData);
      } catch (err) {
        console.error('Error fetching credit cards:', err);
        setError('Kredi kartları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...cards];

    // Bank filter
    if (selectedBankId) {
      filtered = filtered.filter(c => c.bankId === selectedBankId);
    }

    // Card type filter
    if (selectedCardType !== null) {
      filtered = filtered.filter(c => c.type === selectedCardType);
    }

    // Annual fee filter
    filtered = filtered.filter(c => c.annualFee <= maxAnnualFee);

    // Reward points filter
    filtered = filtered.filter(c => c.rewardPoints >= minRewardPoints);

    // Active cards only
    filtered = filtered.filter(c => c.isActive);

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'fee':
          comparison = a.annualFee - b.annualFee;
          break;
        case 'reward':
          comparison = a.rewardPoints - b.rewardPoints;
          break;
        case 'rate':
          comparison = a.purchaseRate - b.purchaseRate;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredCards(filtered);
  }, [cards, selectedBankId, selectedCardType, maxAnnualFee, minRewardPoints, sortBy, sortDirection]);

  // Toggle comparison selection
  const toggleComparison = (cardId: number) => {
    if (selectedForComparison.includes(cardId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== cardId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison([...selectedForComparison, cardId]);
    }
  };

  // Enter comparison mode
  const enterComparisonMode = () => {
    const selected = cards.filter(c => selectedForComparison.includes(c.id));
    setComparisonCards(selected);
    setComparisonMode(true);
  };

  // Exit comparison mode
  const exitComparisonMode = () => {
    setComparisonMode(false);
    setSelectedForComparison([]);
    setComparisonCards([]);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get card type name
  const getCardTypeName = (type: CreditCardType): string => {
    const types: Record<CreditCardType, string> = {
      [CreditCardType.Bireysel]: 'Bireysel',
      [CreditCardType.Ticari]: 'Ticari',
      [CreditCardType.Premium]: 'Premium',
      [CreditCardType.Platinum]: 'Platinum',
      [CreditCardType.World]: 'World',
    };
    return types[type] || 'Diğer';
  };

  // Parse JSON features/benefits
  const parseFeatures = (data: string[] | any): string[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  if (loading) {
    return (
      <div className="credit-card-comparison-page">
        <MainNavigation items={mainNavItems} />
        <Container size="xl" className="py-16">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-secondary-600"></div>
          </div>
        </Container>
        <FooterNavigation sections={footerSections} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="credit-card-comparison-page">
        <MainNavigation items={mainNavItems} />
        <Container size="xl" className="py-16">
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-8 text-center">
            <h2 className="text-xl font-bold text-danger-700 mb-2">Bir Hata Oluştu</h2>
            <p className="text-danger-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
            >
              Tekrar Dene
            </button>
          </div>
        </Container>
        <FooterNavigation sections={footerSections} />
      </div>
    );
  }

  return (
    <div className="credit-card-comparison-page">
      <MainNavigation items={mainNavItems} />

      {/* Header */}
      <section className="bg-gradient-to-r from-secondary-600 to-secondary-800 text-white py-12">
        <Container size="xl">
          <h1 className="text-4xl font-bold mb-4">Kredi Kartı Karşılaştırma</h1>
          <p className="text-xl opacity-90">
            {filteredCards.length} kredi kartı arasından size en uygun olanı bulun
          </p>
        </Container>
      </section>

      {/* Comparison Mode */}
      {comparisonMode ? (
        <section className="bg-white py-8 border-b">
          <Container size="xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Karşılaştırma</h2>
              <button
                onClick={exitComparisonMode}
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300"
              >
                ← Listeye Dön
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonCards.map((card) => {
                const features = parseFeatures(card.features);
                const benefits = parseFeatures(card.benefits);
                const bank = banks.find(b => b.id === card.bankId);

                return (
                  <div key={card.id} className="bg-white border-2 border-secondary-200 rounded-lg overflow-hidden">
                    {/* Card Image */}
                    {card.imageUrl ? (
                      <div className="h-48 bg-gradient-to-r from-secondary-400 to-secondary-600 flex items-center justify-center">
                        <img
                          src={card.imageUrl}
                          alt={card.name}
                          className="max-h-40 w-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-secondary-400 to-secondary-600 flex items-center justify-center">
                        <div className="text-6xl">💳</div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Bank & Card Name */}
                      <div className="mb-4 pb-4 border-b">
                        <div className="flex items-center gap-2 mb-2">
                          {bank?.logoUrl && (
                            <img
                              src={bank.logoUrl}
                              alt={bank.name}
                              className="h-6 w-auto"
                            />
                          )}
                          <span className="text-sm text-neutral-600">{bank?.name}</span>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">{card.name}</h3>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          card.type === CreditCardType.World ? 'bg-purple-100 text-purple-700' :
                          card.type === CreditCardType.Platinum ? 'bg-gray-100 text-gray-700' :
                          card.type === CreditCardType.Premium ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {getCardTypeName(card.type)}
                        </span>
                      </div>

                      {/* Key Metrics */}
                      <div className="space-y-4 mb-4">
                        <div className="bg-secondary-50 rounded-lg p-3">
                          <div className="text-sm text-neutral-600 mb-1">Yıllık Aidat</div>
                          <div className="text-2xl font-bold text-secondary-600">
                            {card.annualFee === 0 ? 'ÜCRETSİZ' : formatCurrency(card.annualFee)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-neutral-50 rounded-lg p-3">
                            <div className="text-xs text-neutral-600 mb-1">Puan Kazanımı</div>
                            <div className="text-lg font-bold text-neutral-900">
                              {card.rewardPoints} puan
                            </div>
                            <div className="text-xs text-neutral-500">100₺ başına</div>
                          </div>
                          <div className="bg-neutral-50 rounded-lg p-3">
                            <div className="text-xs text-neutral-600 mb-1">Alışveriş Faizi</div>
                            <div className="text-lg font-bold text-neutral-900">
                              %{card.purchaseRate.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="bg-neutral-50 rounded-lg p-3">
                          <div className="text-xs text-neutral-600 mb-1">Nakit Avans Faizi</div>
                          <div className="text-lg font-bold text-neutral-900">
                            %{card.cashAdvanceRate.toFixed(2)}
                          </div>
                        </div>

                        {card.minimumIncome && (
                          <div className="text-sm">
                            <span className="text-neutral-600">Minimum Gelir: </span>
                            <span className="font-semibold">{formatCurrency(card.minimumIncome)}</span>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      {benefits.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-neutral-700 mb-2">
                            💎 Avantajlar
                          </div>
                          <ul className="text-sm space-y-1">
                            {benefits.slice(0, 3).map((benefit, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="text-success-600">✓</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Features */}
                      {features.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-neutral-700 mb-2">
                            ⭐ Özellikler
                          </div>
                          <ul className="text-sm space-y-1">
                            {features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="text-secondary-600">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Apply Button */}
                      <a
                        href={bank?.websiteUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 bg-secondary-600 text-white text-center rounded-lg hover:bg-secondary-700 font-semibold"
                      >
                        Başvur
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      ) : (
        <>
          {/* Filters Section */}
          <section className="bg-white py-8 border-b sticky top-0 z-10 shadow-sm">
            <Container size="xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Bank Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Banka
                  </label>
                  <select
                    value={selectedBankId || ''}
                    onChange={(e) => setSelectedBankId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Bankalar</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Card Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Kart Türü
                  </label>
                  <select
                    value={selectedCardType !== null ? selectedCardType : ''}
                    onChange={(e) => setSelectedCardType(e.target.value ? Number(e.target.value) as CreditCardType : null)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="">Tüm Türler</option>
                    <option value={CreditCardType.Bireysel}>Bireysel</option>
                    <option value={CreditCardType.Ticari}>Ticari</option>
                    <option value={CreditCardType.Premium}>Premium</option>
                    <option value={CreditCardType.Platinum}>Platinum</option>
                    <option value={CreditCardType.World}>World</option>
                  </select>
                </div>

                {/* Annual Fee Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Max Yıllık Aidat: {formatCurrency(maxAnnualFee)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={maxAnnualFee}
                    onChange={(e) => setMaxAnnualFee(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>Ücretsiz</span>
                    <span>5.000₺</span>
                  </div>
                </div>

                {/* Reward Points Filter */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Min Puan: {minRewardPoints}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={minRewardPoints}
                    onChange={(e) => setMinRewardPoints(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Sırala
                  </label>
                  <select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [by, dir] = e.target.value.split('-');
                      setSortBy(by as 'fee' | 'reward' | 'rate');
                      setSortDirection(dir as 'asc' | 'desc');
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                  >
                    <option value="fee-asc">Aidat (Düşük → Yüksek)</option>
                    <option value="fee-desc">Aidat (Yüksek → Düşük)</option>
                    <option value="reward-asc">Puan (Az → Çok)</option>
                    <option value="reward-desc">Puan (Çok → Az)</option>
                    <option value="rate-asc">Faiz (Düşük → Yüksek)</option>
                    <option value="rate-desc">Faiz (Yüksek → Düşük)</option>
                  </select>
                </div>
              </div>

              {/* Comparison Bar */}
              {selectedForComparison.length > 0 && (
                <div className="mt-6 p-4 bg-secondary-50 border border-secondary-200 rounded-lg flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold">{selectedForComparison.length}</span> kart seçildi
                    {selectedForComparison.length >= 2 && (
                      <span className="text-neutral-600 ml-2">
                        (Karşılaştırmak için en az 2 kart gerekli)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedForComparison([])}
                      className="px-4 py-2 bg-white text-neutral-700 rounded-lg hover:bg-neutral-50 text-sm"
                    >
                      Temizle
                    </button>
                    <button
                      onClick={enterComparisonMode}
                      disabled={selectedForComparison.length < 2}
                      className={`px-6 py-2 rounded-lg text-sm font-semibold ${
                        selectedForComparison.length >= 2
                          ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                          : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                      }`}
                    >
                      Karşılaştır ({selectedForComparison.length}/3)
                    </button>
                  </div>
                </div>
              )}
            </Container>
          </section>

          {/* Cards Grid */}
          <section className="py-8">
            <Container size="xl">
              {filteredCards.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Kart Bulunamadı
                  </h3>
                  <p className="text-neutral-600">
                    Arama kriterlerinizi değiştirerek tekrar deneyin
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCards.map((card) => {
                    const features = parseFeatures(card.features);
                    const benefits = parseFeatures(card.benefits);
                    const bank = banks.find(b => b.id === card.bankId);

                    return (
                      <div
                        key={card.id}
                        className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border-2 overflow-hidden ${
                          selectedForComparison.includes(card.id)
                            ? 'border-secondary-500'
                            : 'border-transparent'
                        }`}
                      >
                        {/* Card Image/Visual */}
                        {card.imageUrl ? (
                          <div className="h-40 bg-gradient-to-r from-secondary-300 to-secondary-500 flex items-center justify-center p-4">
                            <img
                              src={card.imageUrl}
                              alt={card.name}
                              className="max-h-32 w-auto object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-r from-secondary-300 to-secondary-500 flex items-center justify-center">
                            <div className="text-5xl">💳</div>
                          </div>
                        )}

                        {/* Selection Checkbox & Bank Info */}
                        <div className="p-4 border-b flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {bank?.logoUrl && (
                              <img
                                src={bank.logoUrl}
                                alt={bank.name}
                                className="h-6 w-auto"
                              />
                            )}
                            <span className="text-sm font-semibold text-neutral-700">{bank?.name}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedForComparison.includes(card.id)}
                            onChange={() => toggleComparison(card.id)}
                            disabled={!selectedForComparison.includes(card.id) && selectedForComparison.length >= 3}
                            className="w-5 h-5 text-secondary-600 rounded focus:ring-2 focus:ring-secondary-500"
                          />
                        </div>

                        {/* Card Details */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-neutral-900 mb-2">
                            {card.name}
                          </h3>
                          
                          <span className={`inline-block mb-3 px-2 py-1 rounded-full text-xs font-semibold ${
                            card.type === CreditCardType.World ? 'bg-purple-100 text-purple-700' :
                            card.type === CreditCardType.Platinum ? 'bg-gray-100 text-gray-700' :
                            card.type === CreditCardType.Premium ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {getCardTypeName(card.type)}
                          </span>

                          {/* Annual Fee - Prominent */}
                          <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                            <div className="text-xs text-neutral-600 mb-1">Yıllık Aidat</div>
                            <div className="text-2xl font-bold text-secondary-600">
                              {card.annualFee === 0 ? 'ÜCRETSİZ' : formatCurrency(card.annualFee)}
                            </div>
                          </div>

                          {/* Key Metrics */}
                          <div className="space-y-2 mb-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Puan Kazanımı:</span>
                              <span className="font-semibold">{card.rewardPoints}/100₺</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Alışveriş Faizi:</span>
                              <span className="font-semibold">%{card.purchaseRate.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-600">Nakit Avans:</span>
                              <span className="font-semibold">%{card.cashAdvanceRate.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Benefits Preview */}
                          {benefits.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-neutral-700 mb-1">
                                💎 Avantajlar
                              </div>
                              <ul className="text-xs space-y-1">
                                {benefits.slice(0, 2).map((benefit, index) => (
                                  <li key={index} className="flex items-center gap-1 text-neutral-700">
                                    <span className="text-success-600 text-xs">✓</span>
                                    <span className="line-clamp-1">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <a
                              href={bank?.websiteUrl || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 bg-secondary-600 text-white text-center rounded-lg hover:bg-secondary-700 font-semibold text-sm"
                            >
                              Başvur
                            </a>
                            <button
                              className="px-3 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm"
                              onClick={() => alert(`${card.name} detayları yakında...`)}
                            >
                              Detay
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Container>
          </section>
        </>
      )}

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default CreditCardComparison;
