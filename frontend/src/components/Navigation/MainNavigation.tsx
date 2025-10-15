/**
 * MainNavigation Component
 * Responsive navigation with mega menu, search, and mobile support
 * 
 * Based on patterns from HesapKurdu.com analysis:
 * - Mega menu with 3-column layout
 * - Sticky header on scroll
 * - Mobile hamburger menu
 * - Search integration
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MainNavigationProps, NavItem, NavDropdown, isNavDropdown } from './types';
import './Navigation.css';

const MainNavigation: React.FC<MainNavigationProps> = ({
  logo,
  items,
  showSearch = true,
  searchPlaceholder = 'Kredi, kart veya hesaplama ara...',
  onSearch,
  showLogin = true,
  loginLabel = 'Giriş Yap',
  onLogin,
  showSignup = true,
  signupLabel = 'Üye Ol',
  onSignup,
  user,
  sticky = true,
  transparentOnTop = false,
  hideOnScroll = false,
  mobileBreakpoint = 1024,
  className = '',
  variant = 'light',
}) => {
  // State
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 10);
      
      if (hideOnScroll) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScroll]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
      
      if (window.innerWidth >= mobileBreakpoint) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Handle dropdown toggle
  const handleDropdownToggle = useCallback((id: string) => {
    setOpenDropdown(prev => (prev === id ? null : id));
  }, []);

  // Handle search
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    },
    [searchQuery, onSearch]
  );

  // Render nav item
  const renderNavItem = (item: NavItem, isMobileMenu: boolean = false) => {
    return (
      <a
        key={item.id}
        href={item.href}
        className={`nav-link ${isMobileMenu ? 'mobile' : ''}`}
        onClick={() => isMobileMenu && setMobileMenuOpen(false)}
      >
        {item.icon && <img src={item.icon} alt="" className="nav-link-icon" />}
        <span className="nav-link-label">{item.label}</span>
        {item.badge && <span className="nav-link-badge">{item.badge}</span>}
        {item.isNew && <span className="nav-link-tag new">Yeni</span>}
        {item.isPopular && <span className="nav-link-tag popular">Popüler</span>}
      </a>
    );
  };

  // Render dropdown
  const renderDropdown = (dropdown: NavDropdown, isMobileMenu: boolean = false) => {
    const isOpen = isMobileMenu ? openDropdown === dropdown.id : openDropdown === dropdown.id;

    if (isMobileMenu) {
      return (
        <div key={dropdown.id} className="nav-dropdown-mobile">
          <button
            className={`nav-dropdown-toggle ${isOpen ? 'open' : ''}`}
            onClick={() => handleDropdownToggle(dropdown.id)}
          >
            {dropdown.icon && <img src={dropdown.icon} alt="" className="nav-link-icon" />}
            <span>{dropdown.label}</span>
            {dropdown.badge && <span className="nav-link-badge">{dropdown.badge}</span>}
            <svg
              className="nav-dropdown-chevron"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 7.5l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
          
          {isOpen && (
            <div className="nav-dropdown-content-mobile">
              {dropdown.items.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  className="nav-dropdown-item-mobile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <img src={item.icon} alt="" className="nav-link-icon" />}
                  <div>
                    <div className="nav-dropdown-item-label">{item.label}</div>
                    {item.description && (
                      <div className="nav-dropdown-item-description">{item.description}</div>
                    )}
                  </div>
                  {item.isNew && <span className="nav-link-tag new">Yeni</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={dropdown.id}
        className="nav-dropdown"
        onMouseEnter={() => !isMobile && setOpenDropdown(dropdown.id)}
        onMouseLeave={() => !isMobile && setOpenDropdown(null)}
      >
        <button
          className={`nav-dropdown-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => handleDropdownToggle(dropdown.id)}
        >
          {dropdown.icon && <img src={dropdown.icon} alt="" className="nav-link-icon" />}
          <span>{dropdown.label}</span>
          {dropdown.badge && <span className="nav-link-badge">{dropdown.badge}</span>}
          <svg
            className="nav-dropdown-chevron"
            width="20"
            height="20"
            viewBox="0 0 20 20"
          >
            <path
              d="M5 7.5l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>

        {isOpen && (
          <div className={`nav-dropdown-content columns-${dropdown.columns || 3}`}>
            <div className="nav-dropdown-grid">
              {dropdown.items.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  className={`nav-dropdown-item ${item.featured ? 'featured' : ''}`}
                >
                  {item.icon && <img src={item.icon} alt="" className="nav-dropdown-item-icon" />}
                  <div className="nav-dropdown-item-content">
                    <div className="nav-dropdown-item-label">
                      {item.label}
                      {item.isNew && <span className="nav-link-tag new">Yeni</span>}
                      {item.isPopular && <span className="nav-link-tag popular">Popüler</span>}
                    </div>
                    {item.description && (
                      <div className="nav-dropdown-item-description">{item.description}</div>
                    )}
                  </div>
                </a>
              ))}
            </div>
            
            {dropdown.ctaButton && (
              <div className="nav-dropdown-footer">
                <a
                  href={dropdown.ctaButton.href}
                  className={`nav-dropdown-cta ${dropdown.ctaButton.variant || 'primary'}`}
                >
                  {dropdown.ctaButton.label}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav
      ref={navRef}
      className={`
        main-navigation
        ${variant}
        ${sticky ? 'sticky' : ''}
        ${isScrolled ? 'scrolled' : ''}
        ${transparentOnTop && !isScrolled ? 'transparent' : ''}
        ${hideOnScroll && scrollDirection === 'down' ? 'hidden' : ''}
        ${className}
      `}
    >
      <div className="nav-container">
        {/* Logo */}
        {logo && (
          <a href={logo.href || '/'} className="nav-logo">
            <img src={logo.src} alt={logo.alt} />
          </a>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="nav-menu">
            {items.map(item =>
              isNavDropdown(item)
                ? renderDropdown(item)
                : renderNavItem(item)
            )}
          </div>
        )}

        {/* Actions */}
        <div className="nav-actions">
          {/* Search */}
          {showSearch && (
            <div className={`nav-search ${searchOpen ? 'open' : ''}`}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="nav-search-form">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="nav-search-input"
                  />
                  <button type="submit" className="nav-search-submit">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        d="M9 2a7 7 0 105.657 11.314l4.014 4.015a1 1 0 001.415-1.415l-4.015-4.014A7 7 0 009 2z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </form>
              ) : (
                <button
                  className="nav-search-button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Ara"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      d="M9 2a7 7 0 105.657 11.314l4.014 4.015a1 1 0 001.415-1.415l-4.015-4.014A7 7 0 009 2z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* User or Auth buttons */}
          {user ? (
            <div className="nav-user-menu">
              <button className="nav-user-button">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="nav-user-avatar" />
                ) : (
                  <div className="nav-user-avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="nav-user-name">{user.name}</span>
              </button>
            </div>
          ) : (
            <>
              {showLogin && !isMobile && (
                <button className="nav-button secondary" onClick={onLogin}>
                  {loginLabel}
                </button>
              )}
              {showSignup && !isMobile && (
                <button className="nav-button primary" onClick={onSignup}>
                  {signupLabel}
                </button>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              className={`nav-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <div className="nav-mobile-menu-content">
            {items.map(item =>
              isNavDropdown(item)
                ? renderDropdown(item, true)
                : renderNavItem(item, true)
            )}
            
            {!user && (
              <div className="nav-mobile-auth">
                {showLogin && (
                  <button
                    className="nav-button secondary full-width"
                    onClick={() => {
                      onLogin?.();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {loginLabel}
                  </button>
                )}
                {showSignup && (
                  <button
                    className="nav-button primary full-width"
                    onClick={() => {
                      onSignup?.();
                      setMobileMenuOpen(false);
                    }}
                  >
                    {signupLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavigation;
