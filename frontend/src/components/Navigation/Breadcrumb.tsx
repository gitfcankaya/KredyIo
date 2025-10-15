/**
 * Breadcrumb Component
 * Navigation breadcrumbs with Schema.org structured data
 */

import React from 'react';
import { BreadcrumbProps } from './types';
import './Navigation.css';

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  showHome = true,
  homeLabel = 'Ana Sayfa',
  homeHref = '/',
  homeIcon,
  className = '',
  enableStructuredData = true,
}) => {
  const allItems = showHome
    ? [{ id: 'home', label: homeLabel, href: homeHref, icon: homeIcon }, ...items]
    : items;

  const structuredData = enableStructuredData
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.label,
          item: item.href ? `${window.location.origin}${item.href}` : undefined,
        })),
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      <nav className={`breadcrumb ${className}`} aria-label="Breadcrumb">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <div key={item.id} className="breadcrumb-item">
              {!isLast && item.href ? (
                <>
                  <a href={item.href}>
                    {item.icon && (
                      <img src={item.icon} alt="" className="breadcrumb-icon" />
                    )}
                    {item.id === 'home' && !item.icon ? (
                      <svg
                        className="breadcrumb-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </a>
                  <span className="breadcrumb-separator">
                    {typeof separator === 'string' ? separator : separator}
                  </span>
                </>
              ) : (
                <span className="current">
                  {item.icon && (
                    <img src={item.icon} alt="" className="breadcrumb-icon" />
                  )}
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
};

export default Breadcrumb;
