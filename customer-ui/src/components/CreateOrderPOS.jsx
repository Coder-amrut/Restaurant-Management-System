import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingBag, CheckCircle2, Loader2, Utensils, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export function CreateOrderPOS({ onOrderCreated, onBackToMenu }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({});
  const [orderType, setOrderType] = useState('Dine-in');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.getProducts(search);
        setProducts(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch product list');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search]);

  const handleUpdateQty = (prod, delta) => {
    setCart((prev) => {
      const existing = prev[prod._id];
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        const updated = { ...prev };
        delete updated[prod._id];
        return updated;
      }

      const effectivePrice = prod.discountPrice ?? prod.price;
      return {
        ...prev,
        [prod._id]: {
          ...prod,
          effectivePrice,
          quantity: newQty
        }
      };
    });
  };

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.effectivePrice * item.quantity), 0), [cartItems]);
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = Math.max(0, subtotal + taxAmount);

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const payload = {
      items: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        notes: item.notes || ''
      })),
      orderType,
      notes: notes.trim(),
      discountAmount: 0
    };

    try {
      const createdOrder = await api.createOrder(payload);
      setCart({});
      setNotes('');
      if (onOrderCreated) onOrderCreated(createdOrder);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-body">
      
      {/* Top Action Row with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all font-heading"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Back to Menu</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
          POS Order Placement Interface
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Product Selection Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search & Header */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes to add to ticket..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-full">
              {products.length} Dishes
            </span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold mt-2">Loading menu items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((prod) => {
                const qty = cart[prod._id]?.quantity || 0;
                const price = prod.discountPrice ?? prod.price;

                return (
                  <div
                    key={prod._id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-3 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider block font-heading">
                        {prod.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate font-heading">{prod.name}</h4>
                      <span className="text-xs font-extrabold text-slate-900 font-mono">₹{price}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => handleUpdateQty(prod, 1)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-full text-xs font-black shadow-sm flex items-center gap-1 active:scale-95 font-heading"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> ADD
                      </button>
                    ) : (
                      <div className="flex items-center bg-amber-50 border border-amber-400 rounded-full p-0.5">
                        <button
                          onClick={() => handleUpdateQty(prod, -1)}
                          className="w-7 h-7 bg-white rounded-full text-amber-800 font-bold flex items-center justify-center shadow-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-black font-mono">{qty}</span>
                        <button
                          onClick={() => handleUpdateQty(prod, 1)}
                          className="w-7 h-7 bg-amber-500 text-slate-950 rounded-full font-bold flex items-center justify-center shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* POS Order Cart & Summary Column */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 h-fit">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold font-heading text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" /> New Order Ticket
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {cartItems.length} items
              </span>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mode Selector */}
            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
                Order Mode
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Dine-in', 'Takeaway', 'Delivery'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`py-1.5 text-xs font-bold rounded-full border transition-colors ${
                      orderType === type
                        ? 'bg-slate-950 text-white border-transparent'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Items Summary */}
            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
                Ticket Items
              </label>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Select items from the left catalog to add to ticket.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block font-heading">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">₹{item.effectivePrice} × {item.quantity}</span>
                      </div>
                      <span className="font-extrabold font-mono text-slate-900">
                        ₹{item.effectivePrice * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Calculated Total Amount & Submit CTA */}
          {cartItems.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5 text-xs font-heading">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST (5%)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-amber-600 font-mono">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-full shadow-lg flex items-center justify-center gap-2 font-heading cursor-pointer active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                    <span>Placing Order Ticket...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-slate-950" />
                    <span>Place Order • ₹{totalAmount.toFixed(0)}</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
