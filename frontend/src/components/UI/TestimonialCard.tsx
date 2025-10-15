/**
 * TestimonialCard Component
 * Customer testimonial cards with ratings and verification
 */

import React from 'react';
import { TestimonialCardProps } from './types';
import './UI.css';

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  variant = 'default',
  showRating = true,
  showDate = true,
  showAvatar = true,
  className = '',
}) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="testimonial-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`testimonial-star ${star <= rating ? 'filled' : 'empty'}`}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className={`testimonial-card ${variant} ${testimonial.featured ? 'featured' : ''} ${className}`}>
      <div className="testimonial-content">
        <div className="testimonial-quote-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        <p className="testimonial-text">{testimonial.content}</p>
        
        {showRating && testimonial.rating && renderStars(testimonial.rating)}
      </div>
      
      <div className="testimonial-footer">
        <div className="testimonial-author">
          {showAvatar && testimonial.author.avatar && (
            <img 
              src={testimonial.author.avatar} 
              alt={testimonial.author.name}
              className="testimonial-author-avatar"
            />
          )}
          <div className="testimonial-author-info">
            <div className="testimonial-author-name">
              {testimonial.author.name}
              {testimonial.verified && (
                <svg className="testimonial-verified" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {testimonial.author.title && (
              <div className="testimonial-author-title">{testimonial.author.title}</div>
            )}
            {testimonial.author.company && (
              <div className="testimonial-author-company">{testimonial.author.company}</div>
            )}
          </div>
        </div>
        
        {showDate && testimonial.date && (
          <div className="testimonial-date">{formatDate(testimonial.date)}</div>
        )}
      </div>
    </div>
  );
};

export default TestimonialCard;
