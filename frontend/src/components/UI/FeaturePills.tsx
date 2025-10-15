/**
 * FeaturePills Component
 * Tag-style labels for features, categories, filters
 */

import React, { useState } from 'react';
import { FeaturePillsProps } from './types';
import './UI.css';

const FeaturePills: React.FC<FeaturePillsProps> = ({
  pills,
  size = 'md',
  maxDisplay,
  showMore = false,
  onPillClick,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const displayedPills = maxDisplay && !expanded ? pills.slice(0, maxDisplay) : pills;
  const hiddenCount = pills.length - (maxDisplay || pills.length);

  return (
    <div className={`feature-pills ${size} ${className}`}>
      {displayedPills.map((pill) => (
        <div
          key={pill.id}
          className={`feature-pill ${pill.variant || 'neutral'} ${onPillClick ? 'clickable' : ''}`}
          onClick={() => onPillClick?.(pill)}
          title={pill.tooltip}
        >
          {typeof pill.icon === 'string' ? (
            <img src={pill.icon} alt="" className="feature-pill-icon" />
          ) : pill.icon ? (
            <span className="feature-pill-icon">{pill.icon}</span>
          ) : null}
          
          <span className="feature-pill-label">{pill.label}</span>
          
          {pill.removable && (
            <button
              className="feature-pill-remove"
              onClick={(e) => {
                e.stopPropagation();
                pill.onRemove?.();
              }}
              aria-label="Kaldır"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      ))}
      
      {showMore && hiddenCount > 0 && (
        <button
          className="feature-pill feature-pill-more"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Daha Az' : `+${hiddenCount} Daha Fazla`}
        </button>
      )}
    </div>
  );
};

export default FeaturePills;
