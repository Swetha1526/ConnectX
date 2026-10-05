import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import AuthLayout from '../components/auth/AuthLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const Login = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(formData.email, formData.password);
      success('Welcome back to ConnectX!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    try {
      setLoading(true);
      setError('');
      await login(demoEmail, 'password123');
      success(`Logged in as demo user!`);
      navigate('/', { replace: true });
    } catch (err) {
      toastError('Demo login failed. Make sure server is running and database is seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your ConnectX account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          icon={Mail}
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            icon={Lock}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={loading}
          icon={LogIn}
        >
          Sign In
        </Button>

        {/* 1-Click Demo Accounts for Testing & Evaluation */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider">
            Quick Demo Login (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('swetha@connectx.com')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo: Swetha
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('adhithian@connectx.com')}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Demo: Adhithian
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
