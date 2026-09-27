import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ChefHat, Sparkles, RefreshCw, ArrowLeft, Utensils, Receipt } from 'lucide-react';
import { api } from '../services/api';

export function OrderConfirmationModal({ order, onClose }) {
  const [liveOrder, setLiveOrder] = useState(order);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll backend for real-time status updates every 5 seconds
  useEffect(() => {
    if (!order?._id) return;

    const interval = setInterval(async () => {
      try {
        const updated = await api.getOrderStatus(order._id);
        if (updated) {
          setLiveOrder(updated);
        }
      } catch (err) {
        console.warn('Failed polling order status:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order?._id]);

  const handleManualRefresh = async () => {
    if (!order?._id || isRefreshing) return;
    setIsRefreshing(true);
    try {
      const updated = await api.getOrderStatus(order._id);
      if (updated) setLiveOrder(updated);
    } catch (err) {
      console.warn('Manual refresh failed:', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  if (!liveOrder) return null;

  const currentStatus = liveOrder.status || 'Pending';

  // Dynamic Status Badge styles based on order status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Preparing':
        return {
          bg: 'bg-sky-100 border-sky-300 text-sky-800',
          dot: 'bg-sky-500 animate-ping',
          icon: <ChefHat className="w-4 h-4 text-sky-600 animate-bounce" />,
          label: 'Kitchen Preparing'
        };
      case 'Completed':
        return {
          bg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
          dot: 'bg-emerald-500',
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          label: 'Order Ready / Served'
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-100 border-amber-300 text-amber-800',
          dot: 'bg-amber-500 animate-pulse',
          icon: <Clock className="w-4 h-4 text-amber-600" />,
          label: 'Pending Ticket'
        };
    }
  };

  const statusConfig = getStatusBadge(currentStatus);

  return (
    <div className="modal-backdrop">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-slate-200 m-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Animated Checkmark Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner ring-4 ring-white/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            Order Placed Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 font-medium">
            Ticket sent straight to the chef's display unit.
          </p>
        </div>

        {/* Scrollable Details */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Order Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3">
            
            {/* Reference & Time */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Ticket ID</span>
                <span className="text-base font-extrabold text-slate-900 font-mono">
                  {liveOrder.orderNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Placed At</span>
                <span className="text-xs font-semibold text-slate-700">
                  {new Date(liveOrder.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Live Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border flex items-center gap-1.5 shadow-xs ${statusConfig.bg}`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </span>
              </div>

              <button
                onClick={handleManualRefresh}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
                title="Refresh Status"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-600' : ''}`} />
              </button>
            </div>

          </div>

          {/* Informational Kitchen Note */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <ChefHat className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              <span className="font-bold block text-amber-900">Kitchen Notification:</span>
              The kitchen team has received your ticket. Your meal is being crafted with fresh ingredients!
            </div>
          </div>

          {/* Ordered Line Items Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-400" /> Summary of Ticket
            </h4>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs sm:text-sm">
              {liveOrder.items?.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-orange-100 text-orange-800 font-mono font-bold text-xs flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <span className="font-bold text-slate-800">{item.productName}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}

              <div className="p-3.5 bg-slate-50 flex items-center justify-between font-heading font-extrabold text-slate-900 text-sm">
                <span>Total Amount</span>
                <span className="text-orange-600 text-base font-mono">₹{liveOrder.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] font-heading cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu (New Order)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
