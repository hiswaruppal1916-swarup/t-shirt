import React from 'react';
import { Home, Compass, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileNavDockProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNavDock: React.FC<MobileNavDockProps> = ({ currentView, onNavigate }) => {
  const { itemCount } = useCart();

  // Hide mobile bottom dock on checkout to avoid obstructing payment and place order buttons
  if (currentView === 'checkout') {
    return null;
  }

  return (
    <nav className="mobile-nav-dock md:hidden" aria-label="Mobile Navigation">
      <button
        onClick={() => onNavigate('home')}
        className={`nav-dock-item ${currentView === 'home' ? 'active' : ''}`}
        aria-label="Home"
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`nav-dock-item ${currentView === 'shop' ? 'active' : ''}`}
        aria-label="Shop"
      >
        <Compass size={20} />
        <span>Shop</span>
      </button>

      <button
        onClick={() => onNavigate('cart')}
        className={`nav-dock-item ${currentView === 'cart' ? 'active' : ''}`}
        aria-label="Cart"
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} />
          {itemCount > 0 && <span className="badge-count" style={{ top: '-6px', right: '-10px' }}>{itemCount}</span>}
        </div>
        <span>Cart</span>
      </button>

      <button
        onClick={() => onNavigate('account')}
        className={`nav-dock-item ${currentView === 'account' ? 'active' : ''}`}
        aria-label="Account"
      >
        <User size={20} />
        <span>Account</span>
      </button>
    </nav>
  );
};
