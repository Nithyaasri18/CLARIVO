import React, { useState } from 'react';
import { Shield, ArrowRight, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomer } from '../CustomerContext';
import { BrandLogo } from './BrandLogo';

interface CustomerAuthPageProps {
  initialMode?: 'login' | 'signup';
  onNavigateToEmployeeLogin?: () => void;
  onSuccess?: () => void;
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({
  initialMode = 'login',
  onNavigateToEmployeeLogin,
  onSuccess,
}) => {
  const { login, signup } = useCustomer();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);
      const res = await signup({ name, email, phone, password });
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        if (onSuccess) setTimeout(onSuccess, 800);
      } else {
        setErrorMessage(res.error || 'Failed to create customer account.');
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your email and password.');
        return;
      }

      setIsSubmitting(true);
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage('Signed in successfully! Redirecting...');
        if (onSuccess) setTimeout(onSuccess, 800);
      } else {
        setErrorMessage(res.error || 'Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#FAF9F5] text-stone-900 px-4 py-8 select-none">
      <div className="w-full max-w-md bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden p-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <BrandLogo size="lg" />
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Welcome back to Clarivo' : 'Create Customer Account'}
          </h1>
          <p className="mt-1.5 text-xs text-stone-500 max-w-sm">
            {mode === 'login'
              ? 'Sign in to ask questions, track broadband requests, and manage your fiber account.'
              : 'Sign up for instant status tracking and seamless customer support.'}
          </p>
        </div>

        {/* Form Messages */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="email"
                required
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="tel"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="text-xs text-stone-600">Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please contact support@clarivo.telecom.in for password reset assistance.');
                }}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Processing...' : mode === 'login' ? 'Sign In to Customer Portal' : 'Create Account'}</span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Mode Toggle & Employee Link */}
        <div className="mt-6 pt-6 border-t border-stone-200 flex flex-col items-center gap-3 text-xs text-stone-600">
          <div>
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Create Customer Account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 w-full text-center">
            <span className="text-stone-400">Are you an authorized support agent? </span>
            <button
              type="button"
              onClick={onNavigateToEmployeeLogin}
              className="font-medium text-stone-800 hover:text-stone-900 underline"
            >
              Employee Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
