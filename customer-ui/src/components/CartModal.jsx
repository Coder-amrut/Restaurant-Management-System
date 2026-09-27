import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, UtensilsCrossed, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function CartModal({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSubmitOrder,
  isSubmitting = false,
  orderError = null
}) {
  const [orderType, setOrderType] = useState('Dine-in');
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.effectivePrice * item.quantity), 0);
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
  const totalPayable = Math.max(0, subtotal + taxAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0 || isSubmitting) return;

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

    if (orderType === 'Dine-in') {
      payload.tableNotes = tableNumber;
    }

    onSubmitOrder(payload);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      {/* Outer Shell Wrapper */}
      <div
        className="bg-[#f6f2ea] w-full max-w-[430px] rounded-[36px] p-3.5 sm:p-4 shadow-2xl transition-all border border-[#e8dfd3] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner Modal Card Container with cart-modal-container class for 4-side text margins */}
        <div className="cart-modal-container bg-white rounded-[26px] overflow-hidden shadow-sm flex flex-col max-h-[85vh] border border-[#ede7dd]">

          {/* Header Bar */}
          <div className="px-5 py-4 bg-[#111726] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white shadow-md shrink-0">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="my-0.5">
                <h2 className="text-base font-extrabold text-white leading-tight font-heading my-1 mx-0">
                  Your Order Tray
                </h2>
                <p className="text-xs text-slate-400 font-medium my-0.5 mx-0">
                  {cartItems.length} {cartItems.length === 1 ? 'dish selected' : 'dishes selected'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 bg-white">

            {/* Error Message */}
            {orderError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs my-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="my-0.5">
                  <span className="font-bold">Order Failed:</span> {orderError}
                </div>
              </div>
            )}

            {/* Empty State */}
            {cartItems.length === 0 ? (
              <div className="py-12 text-center space-y-2 my-2">
                <div className="w-14 h-14 rounded-full bg-orange-50 text-[#ea580c] flex items-center justify-center mx-auto mb-2">
                  <UtensilsCrossed className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 my-1 mx-0">Your Tray is Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto my-1">
                  Explore our menu catalog and add your favorite dishes!
                </p>
              </div>
            ) : (
              <>
                {/* 1. Fulfillment Mode Segmented Control */}
                <div className="space-y-1.5 my-2">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block font-heading my-1 mx-1">
                    Fulfillment Mode
                  </span>
                  <div className="bg-[#eee8df] p-1 rounded-full flex items-center gap-1">
                    {['Dine-in', 'Takeaway', 'Delivery'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${orderType === type
                          ? 'bg-[#ea580c] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 bg-transparent'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Table Dropdown (Only for Dine-in) */}
                {orderType === 'Dine-in' && (
                  <div className="space-y-1.5 my-2">
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block font-heading my-1 mx-1">
                      Selecting Table:
                    </label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-slate-200/90 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#ea580c] cursor-pointer my-1"
                    >
                      <option value="Table 1">Table 01 (Indoor)</option>
                      <option value="Table 2">Table 02 (Indoor)</option>
                      <option value="Table 3">Table 03 (Balcony)</option>
                      <option value="Table 4">Table 04 (V.I.P)</option>
                      <option value="Counter">Takeaway Counter</option>
                    </select>
                  </div>
                )}

                {/* 3. Items List Container */}
                <div className="bg-[#faf8f5] rounded-2xl border border-slate-200/80 p-3 space-y-2.5 my-2">
                  <div className="flex items-center justify-between px-1 pt-1 pb-1">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider font-heading my-1 mx-1">
                      Selected Items
                    </span>
                    {onClearCart && (
                      <button
                        onClick={onClearCart}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer my-1 mx-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-2xs my-1.5"
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-amber-100/90 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {item.name ? item.name.charAt(0).toUpperCase() : 'D'}
                        </div>

                        {/* Name & Rate */}
                        <div className="flex-1 min-w-0 mx-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate my-0.5 mx-0">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-mono my-0.5 mx-0">
                            ₹{item.effectivePrice}
                          </p>
                        </div>

                        {/* Quantity Stepper Pill */}
                        <div className="flex items-center bg-slate-50 rounded-full p-0.5 border border-slate-200 shrink-0 mx-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity === 1 && onRemoveItem) {
                                onRemoveItem(item._id);
                              } else {
                                onUpdateQuantity(item._id, item.quantity - 1);
                              }
                            }}
                            className="w-5.5 h-5.5 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>

                          <span className="w-5.5 text-center text-xs font-bold text-slate-900 font-mono">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                            className="w-5.5 h-5.5 rounded-full bg-[#ea580c] hover:bg-[#d94e02] text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right w-12 shrink-0 mx-1">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            ₹{item.effectivePrice * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Notes Input */}
                <div className="space-y-1.5 my-2">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block font-heading my-1 mx-1">
                    Chef Instructions / Notes
                  </label>
                  <div className="bg-[#faf8f5] border border-slate-200/90 rounded-2xl px-3 py-2.5 my-1">
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Chef notes (e.g. extra spicy, less oil)..."
                      className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Summary Breakdown */}
                <div className="bg-[#faf8f5] p-3.5 rounded-2xl border border-slate-200/80 space-y-2 my-2">
                  <div className="flex justify-between text-xs text-slate-500 my-1 mx-1">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-800">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 my-1 mx-1">
                    <span>GST (5%)</span>
                    <span className="font-mono text-slate-800">₹{taxAmount.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center my-1 mx-1">
                    <span className="text-xs font-bold text-slate-900">Total Payable</span>
                    <span className="text-base font-extrabold text-[#ea580c] font-mono">
                      ₹{totalPayable.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 6. Checkout CTA Button */}
                <div className="my-3">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="cta-btn w-full bg-[#ea580c] hover:bg-[#d94e02] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-full shadow-md shadow-[#ea580c]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed my-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending to Kitchen...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Send to Kitchen • ₹{totalPayable.toFixed(0)}</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}