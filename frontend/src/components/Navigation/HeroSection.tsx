/**
 * Hero Section Component
 * Hero sections with multiple variants (gradient, video, image, calculator)
 */

import React from 'react';
import { HeroProps } from './types';
import './Navigation.css';

const HeroSection: React.FC<HeroProps> = ({
  variant = 'default',
  alignment = 'left',
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  primaryCTA,
  secondaryCTA,
  calculator,
  minHeight = '500px',
  overlay = true,
  overlayOpacity = 0.6,
  className = '',
}) => {
  return (
    <section
      className={`hero-section ${variant} ${className}`}
      style={{ minHeight }}
    >
      {/* Background */}
      {(backgroundImage || backgroundVideo) && (
        <div className="hero-background">
          {backgroundVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={backgroundVideo.poster}
            >
              <source src={backgroundVideo.src} type="video/mp4" />
            </video>
          ) : (
            backgroundImage && <img src={backgroundImage} alt="" />
          )}
        </div>
      )}

      {/* Overlay */}
      {overlay && (backgroundImage || backgroundVideo) && (
        <div
          className="hero-overlay"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className={`hero-content ${alignment}`}>
        {subtitle && <div className="hero-subtitle">{subtitle}</div>}
        
        <h1 className="hero-title">{title}</h1>
        
        {description && <p className="hero-description">{description}</p>}

        {/* CTAs */}
        {(primaryCTA || secondaryCTA) && (
          <div className="hero-actions">
            {primaryCTA && (
              <a
                href={primaryCTA.href}
                onClick={primaryCTA.onClick}
                className="hero-cta primary"
              >
                {primaryCTA.label}
              </a>
            )}
            {secondaryCTA && (
              <a
                href={secondaryCTA.href}
                onClick={secondaryCTA.onClick}
                className="hero-cta secondary"
              >
                {secondaryCTA.label}
              </a>
            )}
          </div>
        )}

        {/* Calculator Integration */}
        {calculator && (
          <div className="hero-calculator">
            {calculator}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
