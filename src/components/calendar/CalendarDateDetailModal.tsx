/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { Modal } from '../common/Modal';
import { AttendanceBadge } from '../common/AttendanceBadge';
import { calculateClassAttendance } from '../../utils/storage';
import { formatReadableDate } from '../../utils/dateUtils';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  ClipboardCheck,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface CalendarDateDetailModalProps {
  dateStr: string | null;
  onClose: () => void;
}

export const CalendarDateDetailModal: React.FC<CalendarDateDetailModalProps> = ({
  dateStr,
  onClose,
}) => {
  const { students, attendance, setActiveTab, setSelectedAttendanceDate } = useAttendance();

  if (!dateStr) return null;

  const daySummary = calculateClassAttendance(dateStr, attendance, students);
  const formattedTitle = `Attendance for ${formatReadableDate(dateStr)}`;

  const handleMarkAttendanceForDate = () => {
    setSelectedAttendanceDate(dateStr);
    onClose();
    setActiveTab('attendance');
  };

  return (
    <Modal
      isOpen={!!dateStr}
      onClose={onClose}
      title={formattedTitle}
      subtitle={daySummary.isMarked ? 'Daily attendance breakdown' : 'Unmarked date'}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {daySummary.isMarked ? (
          <>
            {/* 4 Summary Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Total Students
                </span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {daySummary.totalStudents}
                </span>
              </div>

              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                  Present
                </span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  {daySummary.presentCount}
                </span>
              </div>

              <div className="bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1">
                  Absent
                </span>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-400">
                  {daySummary.absentCount}
                </span>
              </div>

              <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-3 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
                  Attendance
                </span>
                <span className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                  {daySummary.percentage}%
                </span>
              </div>
            </div>

            {/* Student List Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Students Attendance Status
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300">
                        Student
                      </th>
                      <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300">
                        Roll Number
                      </th>
                      <th className="py-2.5 px-4 font-bold text-slate-600 dark:text-slate-300 text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((student) => {
                      const status = daySummary.records[student.rollNumber];
                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {student.name}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                            {student.rollNumber}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <AttendanceBadge status={status} size="sm" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Want to revise records for this date?
              </span>
              <button
                id="edit-attendance-date-btn"
                onClick={handleMarkAttendanceForDate}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
              >
                <ClipboardCheck className="w-4 h-4 text-indigo-600" />
                <span>Edit Attendance</span>
              </button>
            </div>
          </>
        ) : (
          /* Empty State if not marked */
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No attendance has been marked for this date.
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Attendance records have not yet been recorded for {formatReadableDate(dateStr)}.
              </p>
            </div>

            <button
              id="calendar-mark-attendance-btn"
              onClick={handleMarkAttendanceForDate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Mark Attendance for this Date</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
