import React, { useState } from 'react';
import { Search, Clock, ChefHat, CheckCircle2, X, RefreshCw, AlertCircle, ArrowLeft, Receipt } from 'lucide-react';
import { api } from '../services/api';

export function TrackOrderModal({ isOpen, onClose }) {
  const [ticketInput, setTicketInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!ticketInput.trim() || loading) return;

    setLoading(true);
    setError('');
    setTrackedOrder(null);

    try {
      // Find order by ID or order number
      const orders = await api.getOrders().catch(() => []);
      const match = orders.find(o => 
        o.orderNumber?.toLowerCase() === ticketInput.trim().toLowerCase() ||
        o._id?.toLowerCase() === ticketInput.trim().toLowerCase()
      );

      if (match) {
        setTrackedOrder(match);
      } else {
        // Try direct endpoint
        const direct = await api.getOrderById(ticketInput.trim()).catch(() => null);
        if (direct) {
          setTrackedOrder(direct);
        } else {
          setError(`No order ticket found for "${ticketInput.trim()}". Please check your reference number.`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const getStepState = (status) => {
    switch (status) {
      case 'Completed':
        return { step: 3, label: 'Order Ready / Served' };
      case 'Preparing':
        return { step: 2, label: 'Kitchen Preparing Dish' };
      case 'Pending':
      default:
        return { step: 1, label: 'Ticket Received by Kitchen' };
    }
  };

  const currentStepInfo = trackedOrder ? getStepState(trackedOrder.status) : { step: 1, label: '' };

  return (
    <div className="modal-backdrop">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-slate-200 m-4 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-1"
              title="Back to Menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-heading">Live Order Tracker</h2>
              <p className="text-[11px] text-slate-400">Track kitchen preparation ticket in real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Ticket Input Search */}
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-heading">
              Enter Order Ticket ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  placeholder="e.g. ORD-1790403..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !ticketInput.trim()}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-sm flex items-center gap-1.5 transition-all font-heading"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Track'}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Tracked Order Result Card */}
          {trackedOrder && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Order Info Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 font-heading">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Ticket Number</span>
                  <span className="font-mono font-black text-slate-900">{trackedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Current Status</span>
                  <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {trackedOrder.status}
                  </span>
                </div>
              </div>

              {/* 3-Step Live Progress Tracker */}
              <div className="space-y-4 py-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                  Preparation Progress
                </h4>

                <div className="relative flex items-center justify-between px-2">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-10"></div>
                  <div
                    className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-10"
                    style={{
                      width: currentStepInfo.step === 1 ? '0%' : currentStepInfo.step === 2 ? '50%' : '100%'
                    }}
                  ></div>

                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                      currentStepInfo.step >= 1 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-400'
                    }`}>
                      1
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 font-heading">Ticket Sent</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                      currentStepInfo.step >= 2 ? 'bg-sky-500 text-white font-black' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 font-heading">Preparing</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-1.5 bg-white px-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                      currentStepInfo.step >= 3 ? 'bg-emerald-500 text-white font-black' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 font-heading">Ready</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" /> Order Summary
                </h4>
                <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  {trackedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between">
                      <span className="font-bold text-slate-800">{item.quantity}x {item.productName}</span>
                      <span className="font-mono text-slate-900 font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="p-3 flex justify-between font-black font-heading text-slate-900 text-sm">
                    <span>Total Paid</span>
                    <span className="text-amber-600 font-mono">₹{trackedOrder.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Back Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 font-heading cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
        </div>

      </div>
    </div>
  );
}
