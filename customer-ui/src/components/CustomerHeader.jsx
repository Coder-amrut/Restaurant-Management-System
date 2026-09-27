import React, { useState } from 'react';
import { Utensils, LayoutDashboard, ShoppingBag, LogOut, Clock, ArrowLeft, Camera, User } from 'lucide-react';
import { TrackOrderModal } from './TrackOrderModal';
import { AdminAuthModal } from './AdminAuthModal';

export function CustomerHeader({
  activeView,
  setActiveView,
  adminTab,
  setAdminTab,
  cartCount,
  cartTotal,
  onOpenCart,
  user,
  onUpdateAdminPhoto,
  onAdminAuthenticated,
  onLogout,
  fulfillmentMode,
  setFulfillmentMode
}) {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const isAdmin = Boolean(user && (user.role === 'admin' || user.email === 'admin@restaurant.com'));

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (onUpdateAdminPhoto) onUpdateAdminPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAdminSwitchClick = () => {
    if (activeView === 'admin') return;
    setIsAdminAuthModalOpen(true);
  };

  const handleAdminAuthenticated = (adminUserData) => {
    setIsAdminAuthModalOpen(false);
    if (onAdminAuthenticated) {
      onAdminAuthenticated(adminUserData);
    } else {
      setActiveView('admin');
    }
  };

  return (
    <header className="sticky top-0 z-40 font-body">

      {/* 2. TOP BLACK SYSTEM HEADER (Height ~58-60px, solid black background, max-w-[1180px]) */}
      <div className="bg-[#090909] text-white border-b border-neutral-800/80 h-[58px] flex items-center">
        <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* Left: Orange logo icon + BISTRO CLEMENTINE + Live Unified Ecosystem */}
          <div className="flex items-center gap-2.5">
            {activeView === 'admin' && (
              <button
                onClick={() => setActiveView('customer')}
                className="px-2.5 py-1 rounded-full bg-neutral-800 hover:bg-neutral-700 text-[#f59e0b] font-bold text-xs flex items-center gap-1 border border-neutral-700 transition-colors font-heading cursor-pointer shrink-0"
                title="Back to Customer Website"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to Menu</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#f59e0b] flex items-center justify-center text-black font-black text-xs shadow-xs shrink-0">
                <Utensils className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-black font-heading tracking-wide text-white whitespace-nowrap">
                BISTRO CLEMENTINE <span className="text-neutral-400 font-normal hidden sm:inline">• Live Unified Ecosystem</span>
              </span>
            </div>
          </div>

          {/* Center: Segmented Navigation Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[220px] xs:max-w-none sm:max-w-none" style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleAdminSwitchClick}
              className={`settings-style-btn ${activeView === 'admin' ? 'active' : ''}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Restaurant Admin & KDS</span>
              <span className="bg-[#991b1b] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center ml-0.5">
                2
              </span>
            </button>
          </div>

          {/* Right: Green dot status + Real-Time Sync Active + Logout */}
          <div className="flex items-center gap-3" style={{ display: 'flex', gap: '12px' }}>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-Time Sync Active</span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 3. RESTAURANT HEADER (White Navbar, centered max-w-[1180px]) */}
      {activeView === 'customer' && (
        <div className="bg-white text-slate-900 border-b border-slate-200/90 shadow-xs">
          <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            {/* Left: Circular Orange Icon + Clementine Artisan Kitchen */}
            <div className="flex items-center gap-3" style={{ display: 'flex', gap: '12px' }}>
              <div className="w-9 h-9 rounded-full bg-[#f59e0b] text-black flex items-center justify-center font-black shadow-xs shrink-0">
                <Utensils className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold font-heading text-slate-900 leading-tight">
                  Clementine Artisan Kitchen
                </h2>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Kitchen Open
                  </span>
                  <span className="text-slate-400">• Avg 25 mins prep</span>
                </div>
              </div>
            </div>

            {/* Center: Segmented Control Delivery | Takeaway | Dine-In */}
            {/* <div className="hidden md:flex items-center gap-1.5" style={{ display: 'flex', gap: '6px' }}>
              {['Delivery', 'Takeaway', 'Dine-In'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFulfillmentMode(mode)}
                  className={`settings-style-btn ${fulfillmentMode === mode ? 'active' : ''}`}
                >
                  <span>{mode}</span>
                </button>
              ))}
            </div> */}

            {/* Right: Track Order + User profile Sophia + Orange Cart Button */}
            <div className="flex items-center gap-2.5" style={{ display: 'flex', gap: '8px' }}>

              {/* Track Order Pill */}
              <button
                onClick={() => setIsTrackModalOpen(true)}
                className="settings-style-btn"
              >
                <Clock className="w-3.5 h-3.5 text-slate-700" />
                <span>Track Order</span>
              </button>

              {/* User Profile Pill with Device Photo Upload */}
              <label className="hidden sm:inline-flex settings-style-btn active cursor-pointer relative group" title="Click to upload/change admin profile photo from device">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="Admin" className="w-5 h-5 rounded-full object-cover border border-black/20 shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-[#f59e0b] text-black font-black text-[11px] flex items-center justify-center shadow-xs shrink-0 font-heading">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                )}
                <span className="font-bold">{user?.name || user?.email?.split('@')[0] || 'Admin'}</span>
                <Camera className="w-3.5 h-3.5 text-amber-900 group-hover:scale-110 transition-transform ml-0.5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {/* Orange Cart Button */}
              <button
                onClick={onOpenCart}
                className="settings-style-btn active"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Cart ({cartCount})</span>
                {cartTotal > 0 && (
                  <span className="bg-black text-[#f59e0b] px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold ml-1">
                    ₹{cartTotal.toFixed(0)}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* Sub-Header Navigation for Admin & KDS View */}
      {activeView === 'admin' && (
        <div className="bg-slate-900 text-white border-b border-slate-800 py-3 sm:py-3.5 shadow-sm">
          <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            
            <button
              onClick={() => setActiveView('customer')}
              className="settings-style-btn shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
              <span>Back to Menu</span>
            </button>

            <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar py-1 px-1" style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'dashboard', label: 'Dashboard Overview' },
                { id: 'products', label: 'Product Catalog' },
                { id: 'create-order', label: 'Create POS Order' },
                { id: 'orders', label: 'Orders & KDS' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`settings-style-btn ${adminTab === tab.id ? 'active' : ''}`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticated={handleAdminAuthenticated}
      />

    </header>
  );
}
