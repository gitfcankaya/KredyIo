/**
 * Product Listing Page
 * Full page template for browsing and filtering financial products
 */

import React, { useState, useMemo } from 'react';
import MainNavigation from '../components/Navigation/MainNavigation';
import FooterNavigation from '../components/Navigation/FooterNavigation';
import Breadcrumb from '../components/Navigation/Breadcrumb';
import Container from '../components/Navigation/Container';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import ProductCard from '../components/ProductCard/ProductCard';
import { InfoCard, FeaturePills } from '../components/UI';
import type { Product } from '../components/ProductCard/types';
import type { FilterState } from '../components/FilterSidebar/types';
import { mainNavItems, footerSections } from '../components/Navigation/configs';
import './Pages.css';

interface ProductListingPageProps {
  category: 'loan' | 'credit-card' | 'deposit' | 'account';
  products: Product[];
  pageTitle: string;
  pageDescription?: string;
}

const ProductListingPage: React.FC<ProductListingPageProps> = ({
  category,
  products,
  pageTitle,
  pageDescription,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 1000000],
    selectedBanks: [],
    searchQuery: '',
    sortBy: 'relevance',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.provider.name.toLowerCase().includes(query)
      );
    }

    // Categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }

    // Banks
    if (filters.selectedBanks.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedBanks.includes(p.provider.name)
      );
    }

    // Price range (interest rate or fee)
    if (filters.priceRange) {
      filtered = filtered.filter((p) => {
        const rate = p.interestRate || 0;
        return rate >= filters.priceRange[0] && rate <= filters.priceRange[1];
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.interestRate || 0) - (b.interestRate || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.interestRate || 0) - (a.interestRate || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating?.score || 0) - (a.rating?.score || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbItems = [
    { id: '1', label: 'Anasayfa', href: '/' },
    { id: '2', label: pageTitle, href: '#' },
  ];

  const popularFilters = [
    { id: '1', label: 'Düşük Faiz', variant: 'primary' as const },
    { id: '2', label: 'Hızlı Onay', variant: 'success' as const },
    { id: '3', label: 'Masrafsız', variant: 'secondary' as const },
    { id: '4', label: 'Yüksek Limit', variant: 'warning' as const },
  ];

  return (
    <div className="product-listing-page">
      <MainNavigation items={mainNavItems} />

      <Breadcrumb items={breadcrumbItems} />

      <Container size="xl" className="py-8">
        {/* Page Header */}
        <div className="page-header mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-neutral-900 mb-3">
                {pageTitle}
              </h1>
              {pageDescription && (
                <p className="text-lg text-neutral-700">{pageDescription}</p>
              )}
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 p-1">
              <button
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid görünümü"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:text-neutral-900'}`}
                onClick={() => setViewMode('list')}
                aria-label="Liste görünümü"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Popular Filters */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-neutral-700">Popüler:</span>
              <FeaturePills pills={popularFilters} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                categories={[]}
                activeFilters={filters}
                onFilterChange={(categoryId: string, value: any) => {
                  setFilters(prev => ({ ...prev, [categoryId]: value }));
                }}
                onClearAll={() => setFilters({
                  categories: [],
                  priceRange: [0, 1000000],
                  selectedBanks: [],
                  searchQuery: '',
                })}
                resultCount={filteredProducts.length}
                totalCount={products.length}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <div className="text-neutral-700">
                <span className="font-semibold text-neutral-900">
                  {filteredProducts.length}
                </span>{' '}
                ürün bulundu
              </div>

              {/* Sort Dropdown */}
              <select
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="relevance">Önerilen</option>
                <option value="price-low">Faiz Oranı (Düşük-Yüksek)</option>
                <option value="price-high">Faiz Oranı (Yüksek-Düşük)</option>
                <option value="rating">En Yüksek Puan</option>
                <option value="popular">En Popüler</option>
              </select>
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'products-grid' : 'products-list'}>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      type={product.type}
                      title={product.name || product.title || ''}
                      description={product.description}
                      provider={product.provider}
                      financials={product.financials}
                      badges={product.badges}
                      features={product.features}
                      onApply={(id) => console.log('Apply:', id)}
                      onDetails={(id) => console.log('Details:', id)}
                      variant={viewMode === 'grid' ? 'default' : 'detailed'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <nav className="pagination">
                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>

                    <div className="pagination-info">
                      Sayfa {currentPage} / {totalPages}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <InfoCard
                variant="neutral"
                style="subtle"
                title="Sonuç Bulunamadı"
                description="Aradığınız kriterlere uygun ürün bulunamadı. Lütfen filtreleri değiştirerek tekrar deneyin."
              />
            )}
          </main>
        </div>

        {/* Mobile Filter Button */}
        <button className="mobile-filter-button lg:hidden">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filtrele
        </button>
      </Container>

      <FooterNavigation sections={footerSections} />
    </div>
  );
};

export default ProductListingPage;
