import React from 'react';
import GoldPriceList from '../components/GoldPriceList';
import CurrencyRateList from '../components/CurrencyRateList';
import EconomicIndicatorsDashboard from '../components/EconomicIndicatorsDashboard';

const MarketDataPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Piyasa Verileri</h1>
        <p className="text-gray-600">Güncel altın, döviz ve ekonomik göstergeler</p>
      </div>

      <div className="space-y-8">
        {/* Gold Prices Section */}
        <section>
          <GoldPriceList />
        </section>

        {/* Currency Rates Section */}
        <section>
          <CurrencyRateList />
        </section>

        {/* Economic Indicators Section */}
        <section>
          <EconomicIndicatorsDashboard />
        </section>
      </div>
    </div>
  );
};

export default MarketDataPage;
