import React from 'react';
import { ShoppingBag, Utensils, Sparkles } from 'lucide-react';

export function Header({ cartCount, cartTotal, onOpenCart, activeOrderType }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Restaurant Branding Title & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Utensils className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                MUMBAI SPICE <span className="text-orange-600">BISTRO</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">
                <Sparkles className="w-3 h-3 text-orange-500" /> Kitchen Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Authentic Flavors & Gourmet Delights
            </p>
          </div>
        </div>

        {/* Right Actions: Order Type & Quick Tray / Cart Button */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeOrderType} Mode</span>
          </div>

          <button
            onClick={onOpenCart}
            aria-label="View Shopping Tray"
            className="relative flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-orange-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-heading">Tray</span>
            {cartCount > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-lg font-bold font-mono">
                ₹{cartTotal.toFixed(0)}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
