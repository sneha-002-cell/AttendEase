/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  ClipboardCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  Check,
  GraduationCap,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, showToast } = useAttendance();

  const [username, setUsername] = useState('admin1');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Username is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = login(username.trim(), password);
      if (!success) {
        setErrorMessage('Invalid username or password.');
      }
      setLoading(false);
    }, 250);
  };

  const handleFillDemo = () => {
    setUsername('admin1');
    setPassword('Admin@123');
    setErrorMessage('');
    showToast('Demo credentials auto-filled', 'info', 2000);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast(
      'Demo reset: For testing, please log in with username: admin1 and password: Admin@123',
      'info',
      4500
    );
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors"
    >
      <div className="w-full max-w-md">
        {/* Brand Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            AttendEase
          </h1>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 uppercase tracking-wider">
            Simple, Smart & Reliable Attendance Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Teacher Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in to manage student attendance, view analytics, and generate reports.
            </p>
          </div>

          {errorMessage && (
            <div
              id="login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Remember Me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div
            id="demo-credentials-box"
            className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Demo Teacher Account</span>
              </div>
              <button
                type="button"
                id="fill-demo-credentials-btn"
                onClick={handleFillDemo}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded"
              >
                Use Demo
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs font-mono border border-slate-200/70 dark:border-slate-700/60 space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Username:</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">admin1</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Password:</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">Admin@123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          AttendEase &bull; Secure Teacher Attendance Management System
        </p>
      </div>
    </div>
  );
};
