import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange
}) => {
  const { itemCount } = useCart();
  const { user, customerProfile } = useAuth();
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-40 transition-all">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '0.75rem' }}>
        {/* Logo / Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0 }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
          >
            <span style={{ fontSize: '1.125rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', whiteSpace: 'nowrap' }}>
              ATELIER TEES
            </span>
            <span style={{ fontSize: '0.5625rem', fontWeight: 600, letterSpacing: '0.1em', color: '#6B7280', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Print on Demand
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{
                fontSize: '0.875rem',
                fontWeight: currentView === 'home' ? 700 : 500,
                color: currentView === 'home' ? '#111827' : '#4B5563',
                padding: '0.5rem 0'
              }}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              style={{
                fontSize: '0.875rem',
                fontWeight: currentView === 'shop' ? 700 : 500,
                color: currentView === 'shop' ? '#111827' : '#4B5563',
                padding: '0.5rem 0'
              }}
            >
              Shop All Drops
            </button>
            <button
              onClick={() => onNavigate('shop', 'Graphic Tees')}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#4B5563',
                padding: '0.5rem 0'
              }}
            >
              Graphic Tees
            </button>
            <button
              onClick={() => onNavigate('shop', 'Oversized')}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#4B5563',
                padding: '0.5rem 0'
              }}
            >
              Oversized
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Search Trigger / Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setShowSearchModal(true)}
              className="btn-icon"
              title="Search t-shirts"
              style={{ width: '42px', height: '42px' }}
            >
              <Search size={18} />
            </button>
          </div>

          {/* Admin Switcher */}
          <button
            onClick={() => onNavigate('admin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: currentView === 'admin' ? '#111827' : '#F3F4F6',
              color: currentView === 'admin' ? '#FFFFFF' : '#374151',
              border: '1px solid #E5E7EB'
            }}
            title="Open Admin Dashboard"
          >
            <ShieldCheck size={14} />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Account Profile Button */}
          <button
            onClick={() => onNavigate('account')}
            className="btn-icon"
            title={user ? `Signed in as ${customerProfile?.name || user.email}` : 'Sign In'}
            style={{ width: '42px', height: '42px' }}
          >
            <User size={18} />
          </button>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={() => onNavigate('cart')}
            className="btn-icon"
            title="Shopping Cart"
            style={{ width: '42px', height: '42px', position: 'relative' }}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && <span className="badge-count">{itemCount}</span>}
          </button>
        </div>
      </div>

      {/* Quick Search Overlay Modal */}
      {showSearchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '600px',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              marginTop: '4rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Search Atelier Catalog</h3>
              <button onClick={() => setShowSearchModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search graphic tees, oversized, minimalist, 240 GSM..."
                style={{ paddingLeft: '2.75rem' }}
                autoFocus
              />
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', alignSelf: 'center' }}>Popular:</span>
              {['Tokyo Monolith', 'Oversized', 'Bauhaus', 'Screen-Print', 'Bio-Washed'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSearchChange(tag);
                    onNavigate('shop');
                    setShowSearchModal(false);
                  }}
                  className="filter-chip"
                  style={{ fontSize: '0.75rem', minHeight: '30px', padding: '0.25rem 0.75rem' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
