/**
 * TrustBadges Component
 * Display trust and security badges (ETBIS, KVKK, SSL, ISO)
 */

import React from 'react';
import { TrustBadgesProps } from './types';
import './UI.css';

const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges,
  variant = 'horizontal',
  size = 'md',
  showTooltip = true,
  showDescription = false,
  className = '',
}) => {
  return (
    <div className={`trust-badges ${variant} ${size} ${className}`}>
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="trust-badge"
          title={showTooltip ? badge.tooltip || badge.description : undefined}
        >
          {badge.link ? (
            <a href={badge.link} target="_blank" rel="noopener noreferrer" className="trust-badge-link">
              {badge.image ? (
                <img src={badge.image} alt={badge.name} className="trust-badge-image" />
              ) : badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="trust-badge-icon" />
              ) : (
                <span className="trust-badge-text">{badge.name}</span>
              )}
            </a>
          ) : (
            <>
              {badge.image ? (
                <img src={badge.image} alt={badge.name} className="trust-badge-image" />
              ) : badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="trust-badge-icon" />
              ) : (
                <span className="trust-badge-text">{badge.name}</span>
              )}
            </>
          )}
          {showDescription && badge.description && (
            <div className="trust-badge-description">{badge.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
