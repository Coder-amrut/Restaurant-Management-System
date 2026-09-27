import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  UserCheck,
  Shield,
  User,
  Phone,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import { api, setToken } from '../services/api';

export function LoginScreen({ onLoginSuccess }) {
  // Mode: 'signin' | 'signup' | 'admin'
  const [authMode, setAuthMode] = useState('signin');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Switch tabs
  const handleTabChange = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccessMsg('');
    setShowPassword(false);

    if (mode === 'admin') {
      setEmail('admin@restaurant.com');
      setPassword('admin123');
    } else {
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
    }
  };

  const handleUseDemo = () => {
    setAuthMode('admin');
    setEmail('admin@restaurant.com');
    setPassword('admin123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (authMode === 'signup') {
        const payload = {
          name: fullName.trim() || email.split('@')[0] || 'Customer User',
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: 'customer'
        };
        const res = await api.register(payload);
        if (res.token) {
          setToken(res.token);
          setSuccessMsg('Account created & saved in MongoDB database! Logging you in...');
          onLoginSuccess(res.user);
        } else {
          throw new Error('Registration failed');
        }
      } else if (authMode === 'admin' || email.trim().toLowerCase() === 'admin@restaurant.com') {
        const res = await api.login(email.trim(), password);
        if (res.token) {
          setToken(res.token);
          onLoginSuccess({ ...res.user, role: 'admin' });
        } else {
          throw new Error('No authentication token returned from server');
        }
      } else {
        // Customer Sign In
        try {
          const res = await api.login(email.trim(), password);
          if (res.token) {
            setToken(res.token);
            onLoginSuccess({ ...res.user, role: 'Customer' });
            return;
          }
        } catch (loginErr) {
          // Auto create customer in MongoDB if not registered yet
          try {
            const regRes = await api.register({
              name: email.split('@')[0] || 'Customer User',
              email: email.trim(),
              phone: phone.trim(),
              password,
              role: 'customer'
            });
            if (regRes.token) {
              setToken(regRes.token);
              onLoginSuccess(regRes.user);
              return;
            }
          } catch (regErr) {
            throw new Error(loginErr.message || regErr.message || 'Invalid email or password.');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setAuthMode('admin');
    setEmail('admin@restaurant.com');
    setPassword('admin123');
    setIsLoading(true);
    setError('');

    try {
      const res = await api.login('admin@restaurant.com', 'admin123');
      if (res.token) {
        setToken(res.token);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError('Initializing demo database seed...');
      try {
        await api.seedDemoMenu();
        const res2 = await api.login('admin@restaurant.com', 'admin123');
        if (res2.token) {
          setToken(res2.token);
          onLoginSuccess(res2.user);
        }
      } catch (err2) {
        setError('Login failed: ' + err2.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6 font-body relative overflow-hidden">

      {/* Subtle Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* SINGLE CENTERED AUTH CONTAINER */}
      <div className="login-container bg-white w-full max-w-md rounded-[32px] p-6 sm:p-9 shadow-2xl border border-slate-200/90 space-y-6 relative z-10 m-auto">

        {/* Container Top Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#f59e0b] text-black flex items-center justify-center font-black shadow-md mx-auto">
            <Utensils className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
            BISTRO CLEMENTINE
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Unified Restaurant Portal
          </p>
        </div>

        {/* 1 & 2. Segmented Mode Tabs: Sign In | Create Account | Admin Login */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-between border border-slate-200 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-heading ${authMode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-heading ${authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer font-heading ${authMode === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Mode Title & Paragraph */}
        <div className="text-center space-y-1 pt-1">
          <h3 className="text-lg font-extrabold text-slate-900 font-heading">
            {authMode === 'signin' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Customer Account'}
            {authMode === 'admin' && 'Restaurant Admin Verification'}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {authMode === 'signin' && 'Sign in to place food orders and track status.'}
            {authMode === 'signup' && 'Register now to explore gourmet food and exclusive offers.'}
            {authMode === 'admin' && 'Staff credentials required to manage orders & KDS.'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Success:</span> {successMsg}
            </div>
          </div>
        )}

        {/* Form Inputs with Proper Gaps */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name (Sign Up only) */}
          {authMode === 'signup' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-heading">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sophia Miller"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-heading">
              {authMode === 'admin' ? 'Admin Email ID *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authMode === 'admin' ? 'admin@restaurant.com' : 'user@example.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Phone Number (Sign Up only) */}
          {authMode === 'signup' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-heading">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* Password with Show / Hide Toggle Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-heading">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-bold text-slate-500 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5 text-amber-600" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Demo Auto-fill Helper for Admin */}
          {authMode === 'admin' && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer underline"
              >
                Use Demo Admin Credentials
              </button>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="settings-style-btn active w-full py-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {authMode === 'signup' && <UserPlus className="w-4 h-4" />}
                  {authMode === 'admin' && <ShieldCheck className="w-4 h-4" />}
                  <span>
                    {authMode === 'signup' && 'Create Account'}
                    {authMode === 'signin' && 'Sign In'}
                    {authMode === 'admin' && 'Verify & Enter Admin'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Demo One-Click Login */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs text-slate-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick 1-Click Admin Demo Login</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}