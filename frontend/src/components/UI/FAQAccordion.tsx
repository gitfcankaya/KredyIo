/**
 * FAQAccordion Component
 * Frequently Asked Questions with Schema.org structured data
 */

import React, { useState, useMemo } from 'react';
import { FAQAccordionProps } from './types';
import './UI.css';

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  allowMultiple = false,
  searchable = false,
  showCategories = true,
  showHelpful = false,
  defaultOpen = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, { yes: number; no: number }>>(
    items.reduce((acc, item) => ({
      ...acc,
      [item.id]: { yes: item.helpfulVotes?.yes || 0, no: item.helpfulVotes?.no || 0 }
    }), {})
  );

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  const handleVote = (id: string, vote: 'yes' | 'no') => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [vote]: prev[id][vote] + 1
      }
    }));
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const answerText = typeof item.answer === 'string' ? item.answer : '';
      return item.question.toLowerCase().includes(query) ||
        answerText.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);
    });
  }, [items, searchQuery]);

  const groupedItems = useMemo(() => {
    if (!showCategories) return { '': filteredItems };
    
    return filteredItems.reduce((acc, item) => {
      const category = item.category || 'Diğer';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof filteredItems>);
  }, [filteredItems, showCategories]);

  // Schema.org FAQPage structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className={`faq-accordion ${className}`}>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {searchable && (
        <div className="faq-search">
          <input
            type="text"
            className="faq-search-input"
            placeholder="Soru ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="faq-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="faq-category">
          {showCategories && category && (
            <h3 className="faq-category-title">{category}</h3>
          )}
          
          <div className="faq-items">
            {categoryItems.map((item) => {
              const isOpen = openItems.includes(item.id);
              
              return (
                <div key={item.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <svg
                      className="faq-chevron"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="faq-answer">
                    <div className="faq-answer-content">
                      {typeof item.answer === 'string' ? (
                        <p>{item.answer}</p>
                      ) : (
                        item.answer
                      )}
                    </div>
                    
                    {showHelpful && (
                      <div className="faq-helpful">
                        <span className="faq-helpful-text">Bu yanıt yardımcı oldu mu?</span>
                        <div className="faq-helpful-buttons">
                          <button
                            className="faq-helpful-btn yes"
                            onClick={() => handleVote(item.id, 'yes')}
                          >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span>({helpfulVotes[item.id].yes})</span>
                          </button>
                          <button
                            className="faq-helpful-btn no"
                            onClick={() => handleVote(item.id, 'no')}
                          >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                            </svg>
                            <span>({helpfulVotes[item.id].no})</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="faq-empty">
          <p>Aradığınız soruya uygun sonuç bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default FAQAccordion;
