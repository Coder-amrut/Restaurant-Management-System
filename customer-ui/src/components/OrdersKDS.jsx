import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, CheckCircle2, RefreshCw, Loader2, ArrowRight, AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export function OrdersKDS({ onBackToMenu }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getOrders();
      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load order tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusTransition = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Pending') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Completed';
    else return;

    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      fetchOrders();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Preparing':
        return 'bg-sky-100 border-sky-300 text-sky-800';
      case 'Completed':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'Pending':
      default:
        return 'bg-amber-100 border-amber-300 text-amber-800';
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
          Kitchen Display Ticket Pipeline
        </span>
      </div>

      {/* KDS Header & Auto-Sync Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold font-heading text-slate-900 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-600" /> Kitchen Display & Order Pipeline
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time status transitions: <span className="font-bold text-amber-700">Pending</span> → <span className="font-bold text-sky-700">Preparing</span> → <span className="font-bold text-emerald-700">Completed</span>
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          <span>Sync Kitchen Board</span>
        </button>
      </div>

      {/* Orders List / Cards Grid */}
      {loading && orders.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold mt-2">Fetching active kitchen tickets...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-rose-600 bg-rose-50 border border-rose-200 rounded-3xl">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <p className="text-sm font-bold mt-1">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200 space-y-2">
          <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold">No orders in queue</p>
          <p className="text-xs text-slate-400">Place an order from the Customer View or POS tab to see live tickets here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((ord) => {
            const isUpdating = updatingId === ord._id;

            return (
              <div
                key={ord._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                
                {/* Header: Number & Status */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                      Ticket Number
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {ord.orderNumber}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getBadgeStyle(ord.status)}`}>
                    {ord.status}
                  </span>
                </div>

                {/* Items Breakdown */}
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                    Ordered Dishes
                  </span>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                    {ord.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-mono text-slate-600">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {ord.notes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      <span className="font-bold">Note:</span> {ord.notes}
                    </div>
                  )}
                </div>

                {/* Total & Status Transition CTA Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-lg font-black text-amber-600 font-mono">
                      ₹{ord.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  {ord.status === 'Pending' && (
                    <button
                      onClick={() => handleStatusTransition(ord._id, 'Pending')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all font-heading active:scale-95 cursor-pointer"
                    >
                      {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>Move to Preparing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {ord.status === 'Preparing' && (
                    <button
                      onClick={() => handleStatusTransition(ord._id, 'Preparing')}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-full shadow-sm flex items-center gap-1.5 transition-all font-heading active:scale-95 cursor-pointer"
                    >
                      {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChefHat className="w-3.5 h-3.5" />}
                      <span>Mark Completed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {ord.status === 'Completed' && (
                    <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
