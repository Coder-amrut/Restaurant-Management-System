import React, { useState, useEffect } from 'react';

import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
  ChefHat,
  RefreshCw,
  ArrowLeft,
  Camera,
  Upload,
  User as UserIcon
} from 'lucide-react';

import { api } from '../services/api';

export function AdminDashboard({ user, onUpdateAdminPhoto, onNavigateTab, onBackToMenu }) {

  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getDashboard();

      if (data && data.metrics) {
        setMetrics(data.metrics);
      } else {
        const [prods, ords] = await Promise.all([
          api.getProducts(),
          api.getOrders()
        ]);

        const productsList = prods || [];
        const ordersList = ords || [];

        setMetrics({
          totalProducts: productsList.length,
          totalOrders: ordersList.length,
          pendingOrders: ordersList.filter(
            o => o.status === 'Pending' || o.status === 'Preparing'
          ).length,
          completedOrders: ordersList.filter(
            o => o.status === 'Completed'
          ).length
        });
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load live metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (onUpdateAdminPhoto) onUpdateAdminPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-fade-in font-body space-y-8">

      {/* =====================================================
          TOP ACTION ROW
          ===================================================== */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToMenu}
          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all font-heading"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Back to Menu</span>
        </button>

        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
          Operational Analytics
        </span>
      </div>


      {/* =====================================================
          HEADER BANNER WITH ADMIN PHOTO UPLOAD
          ===================================================== */}
      <div
        className="
          flex flex-col md:flex-row
          items-start md:items-center
          justify-between
          gap-6
          bg-slate-950
          text-white
          p-6 sm:p-8
          rounded-3xl
          shadow-xl
          relative
          overflow-hidden
          border border-slate-800
        "
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          {/* Admin Photo / Avatar with device file input */}
          <label className="relative group cursor-pointer shrink-0" title="Click to upload/change photo from your device">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border-2 border-amber-500/80 shadow-md flex items-center justify-center relative">
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Admin Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl font-heading">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Live Operational Control • {user?.name || 'Admin User'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              Restaurant Control Hub
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium max-w-lg">
              Real-time analytics across menu inventory, active kitchen tickets,
              and completed guest orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="cursor-pointer px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-full flex items-center gap-2 transition-colors shadow-md font-heading">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Admin Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>

          <button
            onClick={fetchDashboardData}
            className="
              px-4 py-2.5
              bg-slate-900
              hover:bg-slate-800
              text-slate-200
              font-bold
              text-xs
              rounded-full
              flex
              items-center
              gap-2
              border
              border-slate-700
              transition-colors
              shadow-sm
              cursor-pointer
            "
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>


      {/* =====================================================
          EXTRA SPACE AFTER HEADER
          ===================================================== */}
      <div className="h-2" />


      {/* =====================================================
          4 METRIC CARDS
          ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL PRODUCTS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
              Total Products
            </span>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-inner">
              <Package className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {loading ? '...' : metrics.totalProducts}
            </span>

            <span className="text-xs font-semibold text-slate-400 ml-2">
              Active dishes
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="mt-4 text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-heading"
          >
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>


        {/* TOTAL ORDERS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
              Total Orders
            </span>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900 font-heading">
              {loading ? '...' : metrics.totalOrders}
            </span>

            <span className="text-xs font-semibold text-slate-400 ml-2">
              Total tickets
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-heading"
          >
            <span>View All Tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>


        {/* PENDING ORDERS */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200/90 bg-amber-50/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-heading">
              Pending Orders
            </span>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-inner">
              <Clock className="w-6 h-6 stroke-[2] animate-pulse" />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-amber-950 font-heading">
              {loading ? '...' : metrics.pendingOrders}
            </span>

            <span className="text-xs font-semibold text-amber-700 ml-2">
              Needs action
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="mt-4 text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-heading"
          >
            <span>Open KDS Display</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>


        {/* COMPLETED ORDERS */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-200/90 bg-emerald-50/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-heading">
              Completed Orders
            </span>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-inner">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-950 font-heading">
              {loading ? '...' : metrics.completedOrders}
            </span>

            <span className="text-xs font-semibold text-emerald-700 ml-2">
              Fulfilled
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-heading"
          >
            <span>Order History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>


      {/* =====================================================
          EXTRA SPACE BETWEEN METRIC CARDS AND SHORTCUTS
          ===================================================== */}
      <div className="h-4" />


      {/* =====================================================
          QUICK MANAGEMENT SHORTCUTS
          ===================================================== */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">

        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-heading">
          Quick Management Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* CREATE POS ORDER */}
          <button
            onClick={() => onNavigateTab('create-order')}
            className="
              p-4
              rounded-2xl
              bg-amber-50
              hover:bg-amber-100
              border
              border-amber-200
              text-amber-950
              text-left
              transition-colors
              flex
              items-center
              justify-between
              group
              cursor-pointer
            "
          >
            <div>
              <span className="font-bold text-sm block font-heading">
                Create POS Order
              </span>

              <span className="text-xs text-amber-700">
                Take order & send to kitchen
              </span>
            </div>

            <ChefHat className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" />
          </button>


          {/* ADD NEW DISH */}
          <button
            onClick={() => onNavigateTab('products')}
            className="
              p-4
              rounded-2xl
              bg-slate-50
              hover:bg-slate-100
              border
              border-slate-200
              text-slate-900
              text-left
              transition-colors
              flex
              items-center
              justify-between
              group
              cursor-pointer
            "
          >
            <div>
              <span className="font-bold text-sm block font-heading">
                Add New Dish
              </span>

              <span className="text-xs text-slate-500">
                Update pricing & availability
              </span>
            </div>

            <PlusCircle className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
          </button>


          {/* KITCHEN DISPLAY */}
          <button
            onClick={() => onNavigateTab('orders')}
            className="
              p-4
              rounded-2xl
              bg-slate-50
              hover:bg-slate-100
              border
              border-slate-200
              text-slate-900
              text-left
              transition-colors
              flex
              items-center
              justify-between
              group
              cursor-pointer
            "
          >
            <div>
              <span className="font-bold text-sm block font-heading">
                Kitchen Display System
              </span>

              <span className="text-xs text-slate-500">
                Update ticket statuses
              </span>
            </div>

            <Clock className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
          </button>

        </div>
      </div>

    </div>
  );
}