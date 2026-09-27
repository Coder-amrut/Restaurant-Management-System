import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, X, Loader2, AlertCircle, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react';
import { api, setToken } from '../services/api';

export function AdminAuthModal({
  isOpen,
  onClose,
  onAuthenticated
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail('admin@restaurant.com');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await api.login(email.trim(), password);
      if (res.token) {
        setToken(res.token);
        onAuthenticated({ ...res.user, role: 'admin' });
      } else {
        throw new Error('No authentication token returned from server');
      }
    } catch (err) {
      setError(err.message || 'Invalid Admin Email or Password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[400px] bg-slate-950 text-white rounded-[28px] border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 animate-slide-up"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black font-heading text-white tracking-tight">
            Restaurant Admin Verification
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Enter Admin ID & Password to access the Admin Control Hub, POS & Kitchen KDS.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-2.5 text-xs animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Admin Email / ID */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block font-heading">
              Admin Email / ID *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="admin@restaurant.com"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 font-medium"
              />
            </div>
          </div>

          {/* Admin Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block font-heading">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Chip */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer font-heading"
            >
              <KeyRound className="w-3 h-3" />
              <span>Auto-fill Demo Password (admin123)</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-heading active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Authenticating Admin Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Verify & Enter Admin Panel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}