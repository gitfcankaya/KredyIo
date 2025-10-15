/**
 * ComparisonTable Component
 * Side-by-side product comparison with features, pricing, highlights
 * 
 * Based on patterns from Turkish banking comparison pages:
 * - Sticky headers and first column
 * - Feature categories
 * - Highlight best values
 * - Responsive horizontal scroll on mobile
 */

import React, { useState, useRef, useEffect } from 'react';
import { ComparisonTableProps, ComparisonProduct, ComparisonFeature, ComparisonFeatureValue } from './types';
import './UI.css';

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  features,
  maxProducts = 4,
  stickyHeader = true,
  stickyColumn = true,
  showPricing = true,
  showCTA = true,
  onRemoveProduct,
  onAddProduct,
  className = '',
}) => {
  const [scrolled, setScrolled] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        setScrolled(tableRef.current.scrollLeft > 0);
      }
    };

    const tableElement = tableRef.current;
    if (tableElement) {
      tableElement.addEventListener('scroll', handleScroll);
      return () => tableElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderFeatureValue = (value: ComparisonFeatureValue) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="comparison-check" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="comparison-cross" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }

    if (typeof value === 'object' && value !== null && 'value' in value) {
      return (
        <div className={`comparison-value ${value.highlight ? 'highlight' : ''}`}>
          {value.icon && <img src={value.icon} alt="" className="comparison-value-icon" />}
          <span>{String(value.value)}</span>
          {value.tooltip && (
            <span className="comparison-tooltip" title={value.tooltip}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </span>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    const category = feature.category || 'Genel';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(feature);
    return acc;
  }, {} as Record<string, ComparisonFeature[]>);

  const displayedProducts = products.slice(0, maxProducts);
  const canAddMore = products.length < maxProducts;

  return (
    <div className={`comparison-table-wrapper ${className}`}>
      <div
        ref={tableRef}
        className={`comparison-table-scroll ${scrolled ? 'scrolled' : ''}`}
      >
        <table className="comparison-table">
          {/* Header with Product Info */}
          <thead className={stickyHeader ? 'sticky' : ''}>
            <tr>
              <th className={`comparison-header-cell ${stickyColumn ? 'sticky-column' : ''}`}>
                <div className="comparison-header-label">Özellikler</div>
              </th>
              {displayedProducts.map((product) => (
                <th key={product.id} className={`comparison-product-header ${product.featured ? 'featured' : ''}`}>
                  <div className="comparison-product-info">
                    {onRemoveProduct && (
                      <button
                        className="comparison-remove"
                        onClick={() => onRemoveProduct(product.id)}
                        aria-label="Ürünü kaldır"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    {product.badge && (
                      <div className={`comparison-badge ${product.badge.variant}`}>
                        {product.badge.text}
                      </div>
                    )}
                    
                    {product.logo && (
                      <img src={product.logo} alt={product.provider} className="comparison-logo" />
                    )}
                    
                    <div className="comparison-product-name">{product.name}</div>
                    <div className="comparison-product-provider">{product.provider}</div>
                    
                    {showPricing && product.pricing && (
                      <div className="comparison-pricing">
                        <span className="comparison-price">
                          {product.pricing.amount.toLocaleString('tr-TR')}
                          {product.pricing.currency || '₺'}
                        </span>
                        {product.pricing.period && (
                          <span className="comparison-period">/{product.pricing.period}</span>
                        )}
                      </div>
                    )}
                    
                    {showCTA && product.cta && (
                      <a
                        href={product.cta.href}
                        onClick={product.cta.onClick}
                        className="comparison-cta"
                      >
                        {product.cta.label}
                      </a>
                    )}
                  </div>
                </th>
              ))}
              
              {canAddMore && onAddProduct && (
                <th className="comparison-add-column">
                  <button className="comparison-add-button" onClick={onAddProduct}>
                    <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span>Ürün Ekle</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          {/* Feature Rows */}
          <tbody>
            {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
              <React.Fragment key={category}>
                <tr className="comparison-category-row">
                  <td
                    className={`comparison-category ${stickyColumn ? 'sticky-column' : ''}`}
                    colSpan={displayedProducts.length + 1 + (canAddMore ? 1 : 0)}
                  >
                    {category}
                  </td>
                </tr>
                
                {categoryFeatures.map((feature) => (
                  <tr key={feature.id} className="comparison-feature-row">
                    <td className={`comparison-feature-label ${stickyColumn ? 'sticky-column' : ''}`}>
                      <div className="comparison-feature-content">
                        <span>{feature.label}</span>
                        {feature.tooltip && (
                          <span className="comparison-tooltip" title={feature.tooltip}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                      {feature.description && (
                        <div className="comparison-feature-description">{feature.description}</div>
                      )}
                    </td>
                    
                    {displayedProducts.map((product) => (
                      <td key={product.id} className="comparison-feature-value">
                        {renderFeatureValue(product.features[feature.id] || '-')}
                      </td>
                    ))}
                    
                    {canAddMore && <td className="comparison-add-column"></td>}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>

          {/* Footer with CTA (optional repeat) */}
          {showCTA && (
            <tfoot className="comparison-footer">
              <tr>
                <td className={stickyColumn ? 'sticky-column' : ''}></td>
                {displayedProducts.map((product) => (
                  <td key={product.id}>
                    {product.cta && (
                      <a
                        href={product.cta.href}
                        onClick={product.cta.onClick}
                        className="comparison-cta secondary"
                      >
                        {product.cta.label}
                      </a>
                    )}
                  </td>
                ))}
                {canAddMore && <td className="comparison-add-column"></td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      
      {/* Mobile scroll hint */}
      <div className="comparison-scroll-hint lg:hidden">
        Tüm özellikleri görmek için yan kaydırın →
      </div>
    </div>
  );
};

export default ComparisonTable;
