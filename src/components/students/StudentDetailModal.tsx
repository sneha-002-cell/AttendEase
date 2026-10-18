/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student } from '../../types';
import { useAttendance } from '../../context/AttendanceContext';
import { Modal } from '../common/Modal';
import { AttendanceBadge } from '../common/AttendanceBadge';
import { calculateStudentAttendance } from '../../utils/storage';
import { formatReadableDate, parseISODate, getDaysInMonth, getFirstDayOfWeek, formatDateToISO } from '../../utils/dateUtils';
import {
  User,
  Mail,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Percent,
  Clock,
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const { attendance } = useAttendance();

  if (!student) return null;

  const stats = calculateStudentAttendance(student.rollNumber, attendance);

  // Collect history records for this student sorted chronologically descending
  const historyDates = Object.keys(attendance)
    .filter((date) => student.rollNumber in attendance[date])
    .sort((a, b) => b.localeCompare(a));

  // Mini calendar for September 2026
  const [selectedMonth] = useState({ year: 2026, month: 8 }); // 8 = September (0-indexed)
  const daysInMonth = getDaysInMonth(selectedMonth.year, selectedMonth.month);
  const firstDay = getFirstDayOfWeek(selectedMonth.year, selectedMonth.month);

  const miniCalendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    miniCalendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(selectedMonth.year, selectedMonth.month, day);
    const dateStr = formatDateToISO(d);
    const status = attendance[dateStr] ? attendance[dateStr][student.rollNumber] || null : null;
    miniCalendarDays.push({ day, dateStr, status });
  }

  return (
    <Modal
      isOpen={!!student}
      onClose={onClose}
      title={student.name}
      subtitle={`Roll Number: ${student.rollNumber} • ${student.className} (Sec ${student.section})`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Student Profile Info */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold">{student.className}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Section:</span>
            <span>{student.section}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-slate-400" />
            <a href={`mailto:${student.email}`} className="hover:underline text-indigo-600 dark:text-indigo-400">
              {student.email}
            </a>
          </div>
        </div>

        {/* 4 Attendance Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
              Overall Rate
            </span>
            <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">
              {stats.percentage}%
            </span>
            <span className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 block mt-0.5 font-semibold">
              {stats.percentage >= 75 ? 'Good Standing' : 'Needs Attention'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Total Days
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {stats.totalWorkingDays}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recorded</span>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
              Present
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {stats.presentDays}
            </span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block mt-0.5">Days Attended</span>
          </div>

          <div className="bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-xl p-3 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
              Absent
            </span>
            <span className="text-2xl font-black text-rose-700 dark:text-rose-400">
              {stats.absentDays}
            </span>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mt-0.5">Days Missed</span>
          </div>
        </div>

        {/* Mini Calendar for September 2026 */}
        <div className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-200/70 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>September 2026 Attendance Heatmap</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Present
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Absent
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" /> Not Marked
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="font-bold text-slate-400 text-[10px] py-0.5">
                {day}
              </div>
            ))}
            {miniCalendarDays.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-7" />;
              }

              let bgClass = 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500';
              if (cell.status === 'present') {
                bgClass = 'bg-emerald-500 text-white font-bold shadow-xs';
              } else if (cell.status === 'absent') {
                bgClass = 'bg-rose-500 text-white font-bold shadow-xs';
              }

              return (
                <div
                  key={cell.dateStr}
                  title={`${cell.dateStr}: ${cell.status || 'No record'}`}
                  className={`h-7 rounded-lg flex items-center justify-center text-[11px] transition-all ${bgClass}`}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Attendance History Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Attendance Log ({historyDates.length} entries)
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300">Date</th>
                  <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300">Day</th>
                  <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyDates.length > 0 ? (
                  historyDates.map((dateStr) => {
                    const status = attendance[dateStr][student.rollNumber];
                    const { year, month, day } = parseISODate(dateStr);
                    const d = new Date(year, month - 1, day);
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <tr
                        key={dateStr}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {formatReadableDate(dateStr)}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                          {dayName}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <AttendanceBadge status={status} size="sm" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      No attendance records found for this student.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
