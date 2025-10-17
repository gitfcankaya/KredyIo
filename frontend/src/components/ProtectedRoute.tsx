/**
 * Protected Route Component
 * Wrapper for admin-only routes requiring authentication
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#718096', fontSize: '14px' }}>Yükleniyor...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  // Redirect to home if authenticated but not admin
  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px'
      }}>
        <div style={{
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '16px 24px',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#c53030' }}>⚠️ Yetkisiz Erişim</h2>
          <p style={{ margin: '0 0 16px 0', color: '#742a2a' }}>
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  // Render children if authenticated and admin
  return <>{children}</>;
};

export default ProtectedRoute;
