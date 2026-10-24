import React, { useState } from 'react';
import {
  X,
  Shield,
  User,
  Wrench,
  Smartphone,
  Lock,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { User as UserType, UserRole, RegisterPayload, LoginPayload } from '../types/index.ts';
import { api } from '../services/api.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultRole = 'customer',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>(defaultRole);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [address, setAddress] = useState('Indiranagar, Bengaluru');
  const [tradeCategory, setTradeCategory] = useState('electrical');
  const [specialtyTitle, setSpecialtyTitle] = useState('Grade A Master Electrician');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP Verification state
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [debugOtpMessage, setDebugOtpMessage] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!phone.trim() || phone.replace(/[^\d]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setOtpSending(true);
    setError(null);
    try {
      const res = await api.sendOtp(phone.trim());
      setOtpSent(true);
      if (res.debugOtp) {
        setDebugOtpMessage(`[Dev SMS Gateway] OTP Code: ${res.debugOtp}`);
      } else {
        setDebugOtpMessage('OTP sent successfully. Check your SMS messages.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the 6-digit OTP received via SMS.');
      return;
    }
    setOtpVerifying(true);
    setError(null);
    try {
      await api.verifyOtp(phone.trim(), otpCode.trim());
      setPhoneVerified(true);
      setDebugOtpMessage(null);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setOtpVerifying(false);
    }
  };

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    // Keep digits and spaces/dashes
    const clean = val.replace(/[^\d\s+]/g, '');
    setPhone(clean);
  };

  const handleDemoLogin = async (demoRole: 'customer' | 'worker_pro') => {
    setLoading(true);
    setError(null);
    try {
      const demoId = demoRole === 'customer' ? 'aditi.roy@example.in' : 'rajesh.sharma@aegispro.in';
      const res = await api.login({ identifier: demoId, password: 'password123' });
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        if (!phone.trim()) {
          throw new Error('Please enter your mobile number or email');
        }
        const payload: LoginPayload = {
          identifier: phone.trim(),
          password: password || 'password123',
        };
        const res = await api.login(payload);
        onSuccess(res.user);
        onClose();
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (!phone.trim()) throw new Error('Please enter your 10-digit mobile number');
        if (!phoneVerified) throw new Error('Phone number verification via OTP is required before registration.');

        const cleanPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/^0+/, '').trim()}`;

        const payload: RegisterPayload = {
          name: name.trim(),
          phone: cleanPhone,
          phoneVerified: true,
          email: email.trim() || undefined,
          password: password || 'password123',
          role,
          city,
          pincode,
          address,
          tradeCategory: role === 'worker_pro' ? tradeCategory : undefined,
          specialtyTitle: role === 'worker_pro' ? specialtyTitle : undefined,
        };

        const res = await api.register(payload);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                AegisCraft <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">India Gateway</span>
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'login' ? 'Sign in with your verified credentials' : 'Register a new verified account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Demo Logins banner */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/30 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> INSTANT 1-CLICK DEMO ACCESS
              </span>
              <span className="text-[10px] text-slate-400">Pre-seeded KYC Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/50 text-xs font-medium text-white transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Customer (Aditi Roy)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('worker_pro')}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-amber-900/40 border border-slate-700 hover:border-amber-500/50 text-xs font-medium text-white transition-all cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" />
                <span>Worker Pro (Rajesh S.)</span>
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs (Login / Register) */}
          <div className="flex border border-slate-800 bg-slate-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Selector (Customer vs Worker Pro) */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'customer'
                    ? 'border-emerald-500/80 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'customer' ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Customer Portal</div>
                  <div className="text-[10px] text-slate-400">Post jobs, escrow, track pros</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('worker_pro')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'worker_pro'
                    ? 'border-amber-500/80 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    role === 'worker_pro' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Worker Pro Terminal</div>
                  <div className="text-[10px] text-slate-400">Live dispatch, bidding & payouts</div>
                </div>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'customer' ? 'e.g. Aditi Roy' : 'e.g. Rajesh Sharma'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-slate-400">
                  Indian Mobile Number (+91)
                </label>
                {mode === 'register' && (
                  phoneVerified ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified ✓
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-400 font-mono">
                      OTP Verification Required
                    </span>
                  )
                )}
              </div>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    disabled={phoneVerified && mode === 'register'}
                    value={phone}
                    onChange={(e) => {
                      handlePhoneChange(e.target.value);
                      if (phoneVerified) setPhoneVerified(false);
                    }}
                    placeholder={mode === 'login' ? 'e.g. +91 98450 12345' : '+91 98450 12345'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                {mode === 'register' && !phoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {otpSending ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* OTP Input Row if OTP sent but not verified */}
              {mode === 'register' && otpSent && !phoneVerified && (
                <div className="mt-2.5 p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono">Enter 6-Digit OTP</span>
                    {debugOtpMessage && <span className="text-amber-400 text-[11px] font-mono">{debugOtpMessage}</span>}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white tracking-widest font-mono text-center focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpVerifying || otpCode.length !== 6}
                      className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">City</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="560038"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {role === 'worker_pro' && (
                  <div className="p-3 bg-slate-950 border border-amber-500/20 rounded-xl space-y-2.5">
                    <div className="text-xs font-semibold text-amber-400 font-mono uppercase">
                      Pro Trade Certification
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Primary Trade Specialty</label>
                      <select
                        value={tradeCategory}
                        onChange={(e) => setTradeCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="electrical">Electrical Engineering</option>
                        <option value="plumbing">Sanitary & Plumbing</option>
                        <option value="hvac">HVAC & Climate Control</option>
                        <option value="carpentry">Woodwork & Carpentry</option>
                        <option value="appliance">Major Appliance Service</option>
                        <option value="locksmith">Security & Locksmith</option>
                        <option value="masonry">Structural Masonry</option>
                        <option value="roofing">Waterproofing & Roofing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Title / Designation</label>
                      <input
                        type="text"
                        value={specialtyTitle}
                        onChange={(e) => setSpecialtyTitle(e.target.value)}
                        placeholder="e.g. Master Grade A Electrician"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">PIN / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'worker_pro'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-950/40'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/40'
              }`}
            >
              {loading ? (
                <span>Authenticating with Node...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Verify & Launch Portal' : 'Register & Join Network'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 256-bit Encrypted Token
          </span>
          <span className="font-mono text-slate-400">IST Asia/Kolkata Node</span>
        </div>
      </div>
    </div>
  );
};
