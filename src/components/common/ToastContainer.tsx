/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAttendance();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let bgClass = 'bg-slate-900 text-white border-slate-700';
        let IconComponent = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bgClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-emerald-500/30 dark:border-emerald-500/40 shadow-emerald-500/10';
          IconComponent = CheckCircle2;
          iconColor = 'text-emerald-600 dark:text-emerald-400';
        } else if (toast.type === 'error') {
          bgClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-rose-500/30 dark:border-rose-500/40 shadow-rose-500/10';
          IconComponent = AlertCircle;
          iconColor = 'text-rose-600 dark:text-rose-400';
        } else if (toast.type === 'warning') {
          bgClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-amber-500/30 dark:border-amber-500/40 shadow-amber-500/10';
          IconComponent = AlertTriangle;
          iconColor = 'text-amber-500 dark:text-amber-400';
        } else {
          bgClass = 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-indigo-500/30 dark:border-indigo-500/40 shadow-indigo-500/10';
          IconComponent = Info;
          iconColor = 'text-indigo-600 dark:text-indigo-400';
        }

        return (
          <div
            key={toast.id}
            id={`toast-item-${toast.id}`}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-3 duration-200 ${bgClass}`}
            role="alert"
          >
            <div className="flex items-center gap-3">
              <IconComponent className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-sm font-medium leading-tight">{toast.message}</p>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
