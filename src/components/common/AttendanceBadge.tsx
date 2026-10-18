/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AttendanceStatus } from '../../types';
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react';

interface AttendanceBadgeProps {
  status?: AttendanceStatus | 'not_marked' | null;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  if (status === 'present') {
    return (
      <span
        id="badge-present"
        className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60 ${sizeClasses[size]}`}
      >
        {showIcon && <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 dark:text-emerald-400`} />}
        <span>Present</span>
      </span>
    );
  }

  if (status === 'absent') {
    return (
      <span
        id="badge-absent"
        className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60 ${sizeClasses[size]}`}
      >
        {showIcon && <XCircle className={`${iconSizes[size]} text-rose-600 dark:text-rose-400`} />}
        <span>Absent</span>
      </span>
    );
  }

  return (
    <span
      id="badge-not-marked"
      className={`inline-flex items-center rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 ${sizeClasses[size]}`}
    >
      {showIcon && <MinusCircle className={`${iconSizes[size]} text-slate-400 dark:text-slate-500`} />}
      <span>Not Marked</span>
    </span>
  );
};
