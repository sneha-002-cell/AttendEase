/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { CalendarDateDetailModal } from './CalendarDateDetailModal';
import {
  generateCalendarGrid,
  formatMonthYear,
  formatDateToISO,
} from '../../utils/dateUtils';
import { calculateClassAttendance } from '../../utils/storage';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CalendarDays,
  Info,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { attendance, students, todayDate } = useAttendance();

  // Calendar view month & year (default: September 2026, monthIndex: 8)
  const [currentView, setCurrentView] = useState({ year: 2026, monthIndex: 8 });
  const [selectedDateModal, setSelectedDateModal] = useState<string | null>(null);

  const handlePrevMonth = () => {
    setCurrentView((prev) => {
      if (prev.monthIndex === 0) {
        return { year: prev.year - 1, monthIndex: 11 };
      }
      return { year: prev.year, monthIndex: prev.monthIndex - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentView((prev) => {
      if (prev.monthIndex === 11) {
        return { year: prev.year + 1, monthIndex: 0 };
      }
      return { year: prev.year, monthIndex: prev.monthIndex + 1 };
    });
  };

  const handleToday = () => {
    // Jump to demo date month: September 2026
    setCurrentView({ year: 2026, monthIndex: 8 });
  };

  const calendarCells = generateCalendarGrid(
    currentView.year,
    currentView.monthIndex,
    todayDate
  );

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Monthly summary stats
  const monthKey = `${currentView.year}-${String(currentView.monthIndex + 1).padStart(2, '0')}`;
  const datesInMonthWithRecords = Object.keys(attendance).filter((d) => d.startsWith(monthKey));

  return (
    <div id="calendar-view-container" className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Attendance Calendar
            </h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {datesInMonthWithRecords.length} days recorded
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click on any date to inspect the attendance logs, percentages, and student status list.
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            id="calendar-today-btn"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Today (Sep 2026)
          </button>

          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-1">
            <button
              id="calendar-prev-month-btn"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span
              id="calendar-month-year-heading"
              className="px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 min-w-[130px] text-center"
            >
              {formatMonthYear(currentView.year, currentView.monthIndex)}
            </span>

            <button
              id="calendar-next-month-btn"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              High Attendance (≥ 75%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Low Attendance (&lt; 75%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              No Attendance Recorded
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500 italic hidden sm:block">
          Click any date for details or to mark attendance
        </div>
      </div>

      {/* Main Calendar Grid Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Day of week headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-center">
          {weekDayNames.map((name, i) => (
            <div
              key={name}
              className={`py-3 text-xs font-bold uppercase tracking-wider ${
                i === 0 || i === 6
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800/80 border-b border-slate-100 dark:border-slate-800">
          {calendarCells.map((cell) => {
            const daySummary = calculateClassAttendance(cell.dateStr, attendance, students);
            const isHigh = daySummary.isMarked && daySummary.percentage >= 75;
            const isLow = daySummary.isMarked && daySummary.percentage < 75;

            return (
              <div
                key={cell.dateStr}
                id={`calendar-cell-${cell.dateStr}`}
                onClick={() => setSelectedDateModal(cell.dateStr)}
                className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 transition-all cursor-pointer group flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 opacity-40 hover:opacity-80'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/90 dark:hover:bg-slate-800/60'
                } ${cell.isToday ? 'ring-2 ring-indigo-500 ring-inset' : ''}`}
              >
                {/* Date number header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      cell.isToday
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Dot status indicator */}
                  {daySummary.isMarked && (
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isHigh ? 'bg-emerald-500 shadow-emerald-500/50 shadow-xs' : 'bg-rose-500 shadow-rose-500/50 shadow-xs'
                      }`}
                      title={isHigh ? 'High Attendance' : 'Low Attendance'}
                    />
                  )}
                </div>

                {/* Day content badge */}
                <div className="mt-2">
                  {daySummary.isMarked ? (
                    <div
                      className={`p-1.5 rounded-lg text-left transition-colors ${
                        isHigh
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-black">
                          {daySummary.percentage}%
                        </span>
                        <span className="text-[9px] font-bold opacity-80">
                          {daySummary.presentCount}/{daySummary.totalStudents}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                        {daySummary.presentCount} present
                      </div>
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 text-center">
                      <span className="hidden sm:inline">Not marked</span>
                      <span className="sm:hidden">-</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Detail Modal */}
      <CalendarDateDetailModal
        dateStr={selectedDateModal}
        onClose={() => setSelectedDateModal(null)}
      />
    </div>
  );
};
