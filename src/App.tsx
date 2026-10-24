import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNavDock } from './components/MobileNavDock';
import { PhoneOnboardingModal } from './components/PhoneOnboardingModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { supabase } from './lib/supabase';
import { Product, ProductVariant, Order } from './types';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch catalog from Supabase on load
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const [prodRes, varRes] = await Promise.all([
        supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false }),
        supabase.from('product_variants').select('*').eq('active', true)
      ]);

      if (prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data as Product[]);
      }
      if (varRes.data) {
        setVariants(varRes.data as ProductVariant[]);
      }
    } catch (err) {
      console.error('Error loading Supabase catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (view: string, param?: string) => {
    if (param && view === 'shop') {
      setCategoryFilter(param);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* Global Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'shop') setCurrentView('shop');
        }}
      />

      {/* Main Viewport Routing */}
      <main className={currentView !== 'checkout' ? 'has-mobile-dock' : ''} style={{ flex: 1, minWidth: 0 }}>
        {currentView === 'home' && (
          <HomePage
            products={products}
            variants={variants}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            variants={variants}
            initialCategory={categoryFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            variants={variants}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && <CartPage onNavigate={handleNavigate} />}

        {currentView === 'checkout' && (
          <CheckoutPage
            onNavigate={handleNavigate}
            onOrderSuccess={(ord) => setConfirmedOrder(ord)}
          />
        )}

        {currentView === 'order-confirmation' && (
          <OrderConfirmationPage order={confirmedOrder} onNavigate={handleNavigate} />
        )}

        {currentView === 'account' && <AccountPage onNavigate={handleNavigate} />}

        {currentView === 'admin' && <AdminDashboard onNavigate={handleNavigate} />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile-First Fixed Navigation Dock */}
      <MobileNavDock currentView={currentView} onNavigate={handleNavigate} />

      {/* Mandatory First-Time Phone Onboarding Modal */}
      <PhoneOnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
