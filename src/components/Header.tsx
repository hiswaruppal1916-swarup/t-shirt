import React, { useState } from 'react';
import { ShoppingBag, Search, User, ShieldCheck, X, Sparkles } from 'lucide-react';
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
    <header
      className="sticky top-0 z-40 luxury-glass"
      style={{
        borderBottom: '1px solid rgba(232, 232, 226, 0.8)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: '1rem' }}>
        {/* Brand / Atelier Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', minWidth: 0 }}>
          <button
            onClick={() => onNavigate('home')}
            style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', flexShrink: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: '#0B0C10',
                  whiteSpace: 'nowrap'
                }}
              >
                ATELIER
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#C5A059'
                }}
              >
                Tees
              </span>
            </div>
            <span
              style={{
                fontSize: '0.5625rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#6B7280',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              Print-on-Demand Studio
            </span>
          </button>

          {/* Desktop Navigation Links with Gold Underline */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '1.5rem' }}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'shop', label: 'All Drops' },
              { id: 'graphic', label: 'Graphic Tees', filter: 'Graphic Tees' },
              { id: 'oversized', label: 'Oversized', filter: 'Oversized' }
            ].map((link) => {
              const isActive =
                link.id === 'home'
                  ? currentView === 'home'
                  : currentView === 'shop';

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.filter) onNavigate('shop', link.filter);
                    else onNavigate(link.id);
                  }}
                  style={{
                    position: 'relative',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: isActive ? '#0B0C10' : '#4B5563',
                    padding: '0.5rem 0',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#C5A059',
                        borderRadius: '9999px'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Search Trigger */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="btn-icon"
            title="Search collection"
            style={{ width: '42px', height: '42px', backgroundColor: '#FBFBFA', borderColor: '#E8E8E2' }}
          >
            <Search size={18} color="#0B0C10" />
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => onNavigate('admin')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.8125rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: currentView === 'admin' ? '#0B0C10' : '#F4F4F0',
              color: currentView === 'admin' ? '#FFFFFF' : '#374151',
              border: '1px solid #E8E8E2',
              transition: 'all 0.15s ease'
            }}
            title="Open Admin Dashboard"
          >
            <ShieldCheck size={14} color={currentView === 'admin' ? '#C5A059' : '#6B7280'} />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Account Profile Button */}
          <button
            onClick={() => onNavigate('account')}
            className="btn-icon"
            title={user ? `Signed in as ${customerProfile?.name || user.email}` : 'Sign In'}
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: currentView === 'account' ? '#0B0C10' : '#FBFBFA',
              borderColor: '#E8E8E2',
              color: currentView === 'account' ? '#FFFFFF' : '#0B0C10'
            }}
          >
            <User size={18} />
          </button>

          {/* Cart Icon with Live Badge */}
          <button
            onClick={() => onNavigate('cart')}
            className="btn-icon"
            title="Shopping Bag"
            style={{
              width: '42px',
              height: '42px',
              position: 'relative',
              backgroundColor: currentView === 'cart' ? '#0B0C10' : '#FBFBFA',
              borderColor: '#E8E8E2',
              color: currentView === 'cart' ? '#FFFFFF' : '#0B0C10'
            }}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span
                className="badge-count"
                style={{
                  backgroundColor: '#C5A059',
                  color: '#0B0C10',
                  fontWeight: 800,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Search Overlay Modal */}
      {showSearchModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 12, 16, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeInSoft 0.25s ease'
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '620px',
              borderRadius: '1.5rem',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(11, 12, 16, 0.35)',
              marginTop: '4rem',
              border: '1px solid #E8E8E2'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span className="editorial-eyebrow">
                  <Sparkles size={13} />
                  Atelier Catalog Search
                </span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0B0C10', marginTop: '0.25rem' }}>
                  Search Prints & Silhouettes
                </h3>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F4F4F0',
                  color: '#0B0C10'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '1.25rem', color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by title, category, 240 GSM, Tokyo..."
                style={{
                  paddingLeft: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: '#FBFBFA',
                  borderColor: '#E8E8E2'
                }}
                autoFocus
              />
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>Suggested:</span>
              {['Tokyo Monolith', 'Oversized', 'Graphic Tees', 'Minimalist', '240 GSM'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSearchChange(tag);
                    onNavigate('shop');
                    setShowSearchModal(false);
                  }}
                  className="filter-chip"
                  style={{
                    fontSize: '0.75rem',
                    minHeight: '32px',
                    padding: '0.25rem 0.8125rem',
                    borderRadius: '9999px',
                    borderColor: '#E8E8E2'
                  }}
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
