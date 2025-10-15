/**
 * ProductCard Component
 * Reusable product card for loans, credit cards, deposits, and POS products
 * 
 * Based on 35+ patterns from HesapKurdu.com analysis:
 * - Pattern #1: Loan Product Cards
 * - Pattern #2-11: Credit Card Product Cards
 * - Pattern #12: Sponsor Badge System
 * - Pattern #37: Deposit Product Cards
 * - Pattern #40-43: Business Products (B2B Loans, Retirement, POS)
 */

import React, { useState } from 'react';
import { ProductCardProps, ProductCardState } from './types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  type,
  title,
  subtitle,
  description,
  provider,
  financials,
  badges = [],
  isSponsor = false,
  isPopular = false,
  isNew = false,
  features = [],
  benefits = [],
  onApply,
  onCompare,
  onDetails,
  isComparing = false,
  isLoading = false,
  externalUrl,
  disclaimer,
  validUntil,
  variant = 'default',
  showCompareButton = true,
  showFeatures = true,
  className = '',
}) => {
  const [state, setState] = useState<ProductCardState>({
    isExpanded: false,
    isHovered: false,
    isComparing: isComparing,
  });

  const handleApply = () => {
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
    onApply(id);
  };

  const handleCompare = () => {
    setState(prev => ({ ...prev, isComparing: !prev.isComparing }));
    if (onCompare) {
      onCompare(id);
    }
  };

  const handleDetails = () => {
    if (variant !== 'compact') {
      setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
    }
    if (onDetails) {
      onDetails(id);
    }
  };

  // Render primary metric based on product type
  const renderPrimaryMetric = () => {
    switch (type) {
      case 'loan':
        return (
          <div className="primary-metric-container">
            <div className="primary-metric">
              {formatPercentage(financials.interestRate || 0)}
            </div>
            <div className="primary-metric-label">Aylık Faiz Oranı</div>
            {financials.monthlyPayment && (
              <div className="secondary-metric">
                {formatCurrency(financials.monthlyPayment)} / ay
              </div>
            )}
          </div>
        );
      
      case 'creditCard':
        return (
          <div className="primary-metric-container">
            {financials.annualFee === 0 ? (
              <>
                <div className="primary-metric text-green-600">₺0</div>
                <div className="primary-metric-label">Yıllık Aidat</div>
              </>
            ) : (
              <>
                <div className="primary-metric">
                  {formatCurrency(financials.annualFee || 0)}
                </div>
                <div className="primary-metric-label">Yıllık Aidat</div>
              </>
            )}
            {financials.cashbackRate && (
              <div className="secondary-metric">
                %{financials.cashbackRate} Cashback
              </div>
            )}
          </div>
        );
      
      case 'deposit':
        return (
          <div className="primary-metric-container">
            <div className="primary-metric">
              {formatPercentage(financials.depositRate || 0)}
            </div>
            <div className="primary-metric-label">Yıllık Faiz Oranı</div>
            {financials.depositTerm && (
              <div className="secondary-metric">
                {financials.depositTerm} Ay Vade
              </div>
            )}
          </div>
        );
      
      case 'pos':
        return (
          <div className="primary-metric-container">
            <div className="primary-metric">
              {formatPercentage(financials.commissionRate || 0)}
            </div>
            <div className="primary-metric-label">Komisyon Oranı</div>
            {financials.setupFee === 0 && (
              <div className="secondary-metric text-green-600">
                Kurulum Ücretsiz
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Render badges (sponsor, popular, new, etc.)
  const renderBadges = () => {
    const allBadges = [...badges];
    
    if (isSponsor) {
      allBadges.push({
        id: 'sponsor',
        text: 'Sponsorlu',
        variant: 'sponsor',
      });
    }
    
    if (isPopular) {
      allBadges.push({
        id: 'popular',
        text: 'Popüler',
        variant: 'popular',
      });
    }
    
    if (isNew) {
      allBadges.push({
        id: 'new',
        text: 'Yeni',
        variant: 'new',
      });
    }

    if (allBadges.length === 0) return null;

    return (
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        {allBadges.map(badge => (
          <span
            key={badge.id}
            className={`badge badge-${badge.variant}`}
            style={badge.color ? { backgroundColor: badge.color } : undefined}
          >
            {badge.text}
          </span>
        ))}
      </div>
    );
  };

  // Render feature pills (horizontal scrolling)
  const renderFeatures = () => {
    if (!showFeatures || features.length === 0) return null;

    return (
      <div className="feature-pills">
        {features.map((feature, index) => (
          <span key={index} className="feature-pill">
            {feature}
          </span>
        ))}
      </div>
    );
  };

  // Render benefits with icons
  const renderBenefits = () => {
    if (benefits.length === 0) return null;

    return (
      <div className="benefits-container">
        {benefits.slice(0, variant === 'compact' ? 3 : benefits.length).map((benefit, index) => (
          <div key={index} className="benefit-item" title={benefit.tooltip}>
            <img src={benefit.icon} alt="" className="benefit-icon" />
            <span className="benefit-text">{benefit.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`product-card ${variant} ${state.isComparing ? 'comparing' : ''} ${className}`}
      onMouseEnter={() => setState(prev => ({ ...prev, isHovered: true }))}
      onMouseLeave={() => setState(prev => ({ ...prev, isHovered: false }))}
    >
      {/* Badges */}
      {renderBadges()}

      {/* Provider Logo & Name */}
      <div className="product-card-header">
        <img
          src={provider.logo}
          alt={provider.name}
          className="bank-logo"
          loading="lazy"
        />
        <div className="provider-info">
          <h3 className="product-title">{title}</h3>
          {subtitle && <p className="product-subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* Primary Metric */}
      {renderPrimaryMetric()}

      {/* Feature Pills */}
      {renderFeatures()}

      {/* Benefits */}
      {renderBenefits()}

      {/* Description (expanded view) */}
      {state.isExpanded && description && (
        <div className="product-description">
          <p>{description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="product-card-actions">
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="cta-primary"
        >
          {isLoading ? 'Yükleniyor...' : 'Başvur'}
        </button>
        
        {showCompareButton && onCompare && (
          <button
            onClick={handleCompare}
            className={`cta-secondary ${state.isComparing ? 'active' : ''}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6h12M4 10h12M4 14h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {state.isComparing ? 'Karşılaştırmadan Çıkar' : 'Karşılaştır'}
          </button>
        )}
        
        {variant !== 'compact' && (
          <button onClick={handleDetails} className="cta-details">
            {state.isExpanded ? 'Daha Az' : 'Detaylar'}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={`chevron ${state.isExpanded ? 'rotated' : ''}`}
            >
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <div className="product-disclaimer">
          <small>{disclaimer}</small>
        </div>
      )}

      {/* Valid Until */}
      {validUntil && (
        <div className="product-validity">
          <small>
            Geçerlilik: {validUntil.toLocaleDateString('tr-TR')}
          </small>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
