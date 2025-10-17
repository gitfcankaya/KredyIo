/**
 * Admin Layout Component
 * Sidebar navigation with main content area for admin panel
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  subItems?: NavItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/admin',
    },
    {
      id: 'banks',
      label: 'Bankalar',
      icon: '🏦',
      path: '/admin/banks',
    },
    {
      id: 'products',
      label: 'Ürünler',
      icon: '💰',
      path: '/admin/products',
      subItems: [
        { id: 'loans', label: 'Krediler', icon: '💵', path: '/admin/products/loans' },
        { id: 'credit-cards', label: 'Kredi Kartları', icon: '💳', path: '/admin/products/credit-cards' },
        { id: 'deposits', label: 'Mevduatlar', icon: '💎', path: '/admin/products/deposits' },
      ],
    },
    {
      id: 'campaigns',
      label: 'Kampanyalar',
      icon: '🎁',
      path: '/admin/campaigns',
    },
    {
      id: 'content',
      label: 'İçerik',
      icon: '📝',
      path: '/admin/content',
      subItems: [
        { id: 'articles', label: 'Makaleler', icon: '📄', path: '/admin/content/articles' },
        { id: 'news', label: 'Haberler', icon: '📰', path: '/admin/content/news' },
        { id: 'faqs', label: 'SSS', icon: '❓', path: '/admin/content/faqs' },
      ],
    },
    {
      id: 'market-data',
      label: 'Piyasa Verileri',
      icon: '📈',
      path: '/admin/market-data',
      subItems: [
        { id: 'currency', label: 'Döviz Kurları', icon: '💱', path: '/admin/market-data/currency' },
        { id: 'gold', label: 'Altın Fiyatları', icon: '🥇', path: '/admin/market-data/gold' },
        { id: 'economic', label: 'Ekonomik Göstergeler', icon: '📊', path: '/admin/market-data/economic' },
      ],
    },
    {
      id: 'users',
      label: 'Kullanıcılar',
      icon: '👥',
      path: '/admin/users',
    },
    {
      id: 'settings',
      label: 'Ayarlar',
      icon: '⚙️',
      path: '/admin/settings',
    },
  ];

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">⚡</span>
            {sidebarOpen && <span className="brand-name">KredyIo Admin</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="toggle-btn"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <div key={item.id} className="nav-item-wrapper">
              {item.subItems ? (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      <span className="expand-icon">
                        {expandedItems.includes(item.id) ? '▼' : '▶'}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {sidebarOpen && <span className="nav-label">{item.label}</span>}
                </Link>
              )}

              {/* Sub Items */}
              {item.subItems && sidebarOpen && expandedItems.includes(item.id) && (
                <div className="sub-items">
                  {item.subItems.map(subItem => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`nav-item sub-item ${isActive(subItem.path) ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{subItem.icon}</span>
                      <span className="nav-label">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Info */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            {sidebarOpen && (
              <div className="user-details">
                <div className="user-name">{user?.fullName || 'Admin User'}</div>
                <button onClick={handleLogout} className="logout-btn">Çıkış</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mobile-menu-btn"
            >
              ☰
            </button>
            <h1 className="page-title">Admin Panel</h1>
          </div>
          <div className="header-right">
            <button className="header-btn">
              🔔 <span className="badge">3</span>
            </button>
            <button className="header-btn">⚙️</button>
          </div>
        </header>

        {/* Content Area */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
