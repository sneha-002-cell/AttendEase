/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'indigo' | 'emerald' | 'rose' | 'amber';
  trend?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'indigo',
  trend,
}) => {
  const variantStyles = {
    indigo: {
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      iconBg: 'bg-indigo-600 text-white',
      border: 'border-indigo-100 dark:border-indigo-900/40',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
    emerald: {
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-600 text-white',
      border: 'border-emerald-100 dark:border-emerald-900/40',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      iconBg: 'bg-rose-600 text-white',
      border: 'border-rose-100 dark:border-rose-900/40',
      text: 'text-rose-600 dark:text-rose-400',
    },
    amber: {
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-600 text-white',
      border: 'border-amber-100 dark:border-amber-900/40',
      text: 'text-amber-600 dark:text-amber-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      id={id}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg} shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <span className={`text-xs font-bold ${style.text}`}>
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
