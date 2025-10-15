/**
 * FooterNavigation Component
 * Multi-column footer with sitemap, newsletter, social links
 * 
 * Based on patterns from HesapKurdu.com analysis:
 * - 4-column layout (Products, Tools, Company, Legal)
 * - Newsletter signup form
 * - Trust badges (ETBIS, KVKK, SSL)
 * - Social media links
 * - Responsive single-column on mobile
 */

import React, { useState } from 'react';
import { FooterProps } from './types';
import './Navigation.css';

const FooterNavigation: React.FC<FooterProps> = ({
  logo,
  tagline,
  description,
  sections,
  socialLinks,
  contact,
  newsletter,
  trustBadges,
  copyright,
  legalLinks,
  className = '',
  variant = 'dark',
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) return;
    
    setNewsletterStatus('loading');
    
    try {
      await newsletter?.onSubmit?.(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
      twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
      instagram: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z',
      linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
      youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    };
    return icons[platform] || '';
  };

  return (
    <footer className={`footer-navigation ${variant} ${className}`}>
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Company Info */}
          <div className="footer-company">
            {logo && (
              <div className="footer-logo">
                <img src={logo.src} alt={logo.alt} />
              </div>
            )}
            
            {tagline && <div className="footer-tagline">{tagline}</div>}
            {description && <p className="footer-description">{description}</p>}
            
            {contact && (
              <div className="footer-contact">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`} className="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {contact.email}
                  </a>
                )}
                {contact.address && (
                  <div className="footer-contact-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {contact.address}
                  </div>
                )}
              </div>
            )}
            
            {socialLinks && socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    aria-label={link.platform}
                    title={link.platform}
                  >
                    {link.icon ? (
                      <img src={link.icon} alt={link.platform} />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d={getSocialIcon(link.platform)} />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Sections */}
          {sections.map(section => (
            <div key={section.id} className="footer-section">
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-section-list">
                {section.items.map(item => (
                  <li key={item.id}>
                    <a href={item.href} className="footer-section-link">
                      {item.label}
                      {item.isNew && <span className="footer-link-tag new">Yeni</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div className="footer-newsletter">
              <h3 className="footer-section-title">{newsletter.title}</h3>
              {newsletter.description && (
                <p className="footer-newsletter-description">{newsletter.description}</p>
              )}
              
              <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder={newsletter.placeholder || 'E-posta adresiniz'}
                  className="footer-newsletter-input"
                  required
                  disabled={newsletterStatus === 'loading'}
                />
                <button
                  type="submit"
                  className="footer-newsletter-button"
                  disabled={newsletterStatus === 'loading'}
                >
                  {newsletterStatus === 'loading'
                    ? 'Gönderiliyor...'
                    : newsletter.buttonText || 'Abone Ol'}
                </button>
              </form>
              
              {newsletterStatus === 'success' && (
                <div className="footer-newsletter-message success">
                  Başarıyla abone oldunuz!
                </div>
              )}
              {newsletterStatus === 'error' && (
                <div className="footer-newsletter-message error">
                  Bir hata oluştu. Lütfen tekrar deneyin.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      {trustBadges && trustBadges.length > 0 && (
        <div className="footer-badges">
          <div className="footer-container">
            <div className="footer-badges-list">
              {trustBadges.map(badge => (
                <div key={badge.id} className="footer-badge" title={badge.tooltip}>
                  <img src={badge.icon} alt={badge.name} />
                  <span className="footer-badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="footer-bottom-content">
            {copyright && <div className="footer-copyright">{copyright}</div>}
            
            {legalLinks && legalLinks.length > 0 && (
              <div className="footer-legal">
                {legalLinks.map((link, index) => (
                  <React.Fragment key={link.id}>
                    <a href={link.href} className="footer-legal-link">
                      {link.label}
                    </a>
                    {index < legalLinks.length - 1 && (
                      <span className="footer-legal-separator">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNavigation;
