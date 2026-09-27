import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerMenuCatalog } from './components/CustomerMenuCatalog';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductManagement } from './components/ProductManagement';
import { CreateOrderPOS } from './components/CreateOrderPOS';
import { OrdersKDS } from './components/OrdersKDS';
import { CartModal } from './components/CartModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { FloatingTrayBar } from './components/FloatingTrayBar';

import { api, setToken } from './services/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {}
    }
    return token ? { email: 'admin@restaurant.com', role: 'admin' } : null;
  });

  const [activeView, setActiveView] = useState('customer'); // 'customer' | 'admin'
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'products' | 'create-order' | 'orders'
  const [fulfillmentMode, setFulfillmentMode] = useState('Dine-In');

  const isAdmin = Boolean(user && (user.role === 'admin' || user.email === 'admin@restaurant.com'));

  useEffect(() => {
    if (user && !isAdmin && activeView === 'admin') {
      setActiveView('customer');
    }
  }, [user, isAdmin, activeView]);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products dynamically from backend API for all users
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await api.getProducts();
      if (!data || data.length === 0) {
        // Auto seed menu items if MongoDB catalog is empty
        try {
          await api.seedDemoMenu();
          data = await api.getProducts();
        } catch (sErr) {
          console.warn('Auto-seed attempt:', sErr);
        }
      }
      setProducts(data || []);
    } catch (err) {
      console.warn('Failed to load products:', err);
      setError(err.message || 'Unable to connect to backend');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    if (userData?.role !== 'admin' && userData?.email !== 'admin@restaurant.com') {
      setActiveView('customer');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('auth_user');
    setUser(null);
    setCart({});
    setActiveView('customer');
  };

  const handleSeedDemo = async () => {
    try {
      await api.seedDemoMenu();
      loadProducts();
    } catch (err) {
      alert('Seed failed: ' + err.message);
    }
  };

  // Cart Management
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product._id];
      const currentQty = existing ? existing.quantity : 0;
      const effectivePrice = product.discountPrice ?? product.price;

      return {
        ...prev,
        [product._id]: {
          ...product,
          effectivePrice,
          quantity: currentQty + 1
        }
      };
    });
  };

  const handleRemoveFromCart = (product) => {
    setCart((prev) => {
      const existing = prev[product._id];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      }
      return {
        ...prev,
        [product._id]: {
          ...existing,
          quantity: existing.quantity - 1
        }
      };
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart((prev) => {
      if (newQuantity <= 0) {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity
        }
      };
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const cartItemsArray = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItemsArray.reduce((acc, item) => acc + item.quantity, 0), [cartItemsArray]);
  const cartTotal = useMemo(() => cartItemsArray.reduce((acc, item) => acc + (item.effectivePrice * item.quantity), 0), [cartItemsArray]);

  // Submit Order (`POST /api/orders`)
  const handleSubmitOrder = async (orderPayload) => {
    setIsSubmittingOrder(true);
    setOrderError('');
    try {
      const newOrder = await api.createOrder(orderPayload);
      setConfirmedOrder(newOrder);
      setCart({});
      setIsCartOpen(false);
    } catch (err) {
      setOrderError(err.message || 'Failed to submit order ticket');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleUpdateAdminPhoto = async (photoUrl) => {
    setUser(prev => prev ? { ...prev, photoUrl } : { email: 'admin@restaurant.com', photoUrl });
    try {
      await api.updateProfile({ photoUrl });
    } catch (err) {
      console.warn('Profile photo sync failed:', err);
    }
  };

  const handleAdminAuthenticated = (adminUserData) => {
    const adminUser = { ...adminUserData, role: 'admin', email: adminUserData?.email || 'admin@restaurant.com' };
    setUser(adminUser);
    localStorage.setItem('auth_user', JSON.stringify(adminUser));
    setActiveView('admin');
  };

  // Render Login screen if not authenticated
  if (!user) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f4] text-slate-900 font-body flex flex-col selection:bg-amber-500 selection:text-slate-950">

      {/* Top Header Bar & View Switcher */}
      <CustomerHeader
        activeView={activeView}
        setActiveView={setActiveView}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onUpdateAdminPhoto={handleUpdateAdminPhoto}
        onAdminAuthenticated={handleAdminAuthenticated}
        onLogout={handleLogout}
        fulfillmentMode={fulfillmentMode}
        setFulfillmentMode={setFulfillmentMode}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1180px] lg:w-full md:w-[94%] sm:w-[95%] w-[calc(100%-20px)] mx-auto py-6 px-0">

        {/* VIEW 1: CUSTOMER WEBSITE */}
        {activeView === 'customer' && (
          <CustomerMenuCatalog
            products={products}
            loading={loading}
            error={error}
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onSeedDemo={handleSeedDemo}
          />
        )}

        {/* VIEW 2: RESTAURANT ADMIN & KDS */}
        {activeView === 'admin' && (
          <>
            {adminTab === 'dashboard' && (
              <AdminDashboard
                user={user}
                onUpdateAdminPhoto={handleUpdateAdminPhoto}
                onNavigateTab={(tab) => setAdminTab(tab)}
                onBackToMenu={() => setActiveView('customer')}
              />
            )}

            {adminTab === 'products' && (
              <ProductManagement
                onBackToMenu={() => setActiveView('customer')}
              />
            )}

            {adminTab === 'create-order' && (
              <CreateOrderPOS
                onOrderCreated={(newOrder) => {
                  setConfirmedOrder(newOrder);
                  setAdminTab('orders');
                }}
                onBackToMenu={() => setActiveView('customer')}
              />
            )}

            {adminTab === 'orders' && (
              <OrdersKDS
                onBackToMenu={() => setActiveView('customer')}
              />
            )}
          </>
        )}

      </main>

      {/* Floating Tray Bar */}
      {activeView === 'customer' && (
        <FloatingTrayBar
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart Modal Sheet */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItemsArray}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={(id) => handleUpdateQuantity(id, 0)}
        onClearCart={handleClearCart}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmittingOrder}
        orderError={orderError}
      />

      {/* Order Confirmation Screen */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 font-medium">
        Bistro Clementine • Powered by Node.js, Express & MongoDB APIs
      </footer>

    </div>
  );
}

