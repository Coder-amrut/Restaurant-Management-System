import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function FloatingTrayBar({ cartCount, cartTotal, onOpenCart }) {
  if (cartCount === 0) return null;

  const formattedTotal = typeof cartTotal === 'number'
    ? (cartTotal < 500 ? `$${cartTotal.toFixed(2)}` : `₹${cartTotal.toFixed(0)}`)
    : cartTotal;

  return (
    <aside className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 animate-slide-up font-body">
      <div className="bg-[#090909] text-white rounded-full p-2.5 pl-4 shadow-2xl border border-neutral-800 flex items-center justify-between backdrop-blur-md">
        
        {/* Left Info: Item Count & Total Amount */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#f59e0b] text-black font-extrabold shadow-xs">
            <ShoppingBag className="w-5 h-5 text-black stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 bg-black text-[#f59e0b] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#f59e0b]">
              {cartCount}
            </span>
          </div>
          <div>
            <div className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider font-heading">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Cart
            </div>
            <div className="text-sm font-extrabold font-heading text-white">
              {formattedTotal} <span className="text-[10px] font-normal text-neutral-400">(incl. taxes)</span>
            </div>
          </div>
        </div>

        {/* Right CTA Action: View Cart */}
        <button
          onClick={onOpenCart}
          className="flex items-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all active:scale-95 font-heading cursor-pointer"
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>

      </div>
    </aside>
  );
}
