/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { AttendanceStatus, AttendanceDayMap } from '../../types';
import { formatReadableDate, parseISODate, formatDateToISO } from '../../utils/dateUtils';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Save,
  CheckCheck,
  X,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const MarkAttendanceView: React.FC = () => {
  const {
    students,
    attendance,
    saveAttendanceRecord,
    showToast,
    selectedAttendanceDate,
    setSelectedAttendanceDate,
  } = useAttendance();

  // Local state for the date being marked
  const [currentDate, setCurrentDate] = useState<string>(selectedAttendanceDate || '2026-09-18');

  // Working day map for current date: rollNumber -> AttendanceStatus
  const [dayStatuses, setDayStatuses] = useState<Record<string, AttendanceStatus | null>>({});

  // Sync when currentDate changes or when underlying attendance changes
  useEffect(() => {
    const existing = attendance[currentDate];
    const initialMap: Record<string, AttendanceStatus | null> = {};

    students.forEach((s) => {
      if (existing && s.rollNumber in existing) {
        initialMap[s.rollNumber] = existing[s.rollNumber];
      } else {
        initialMap[s.rollNumber] = null; // not marked
      }
    });

    setDayStatuses(initialMap);
  }, [currentDate, attendance, students]);

  // Keep global selectedAttendanceDate in sync
  const handleDateChange = (newDate: string) => {
    setCurrentDate(newDate);
    setSelectedAttendanceDate(newDate);
  };

  // Day step buttons
  const stepDate = (days: number) => {
    const { year, month, day } = parseISODate(currentDate);
    const d = new Date(year, month - 1, day + days);
    handleDateChange(formatDateToISO(d));
  };

  const handleStatusChange = (rollNumber: string, status: AttendanceStatus) => {
    setDayStatuses((prev) => ({
      ...prev,
      [rollNumber]: status,
    }));
  };

  // Mark All Present
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus | null> = {};
    students.forEach((s) => {
      updated[s.rollNumber] = 'present';
    });
    setDayStatuses(updated);
    showToast('All students marked present.', 'info');
  };

  // Mark All Absent
  const handleMarkAllAbsent = () => {
    const updated: Record<string, AttendanceStatus | null> = {};
    students.forEach((s) => {
      updated[s.rollNumber] = 'absent';
    });
    setDayStatuses(updated);
    showToast('All students marked absent.', 'info');
  };

  // Save Attendance
  const handleSaveAttendance = () => {
    if (!currentDate) {
      showToast('Please select a valid date.', 'error');
      return;
    }

    // Check if every student has a status
    const unmarkedStudents = students.filter(
      (s) => !dayStatuses[s.rollNumber]
    );

    if (unmarkedStudents.length > 0) {
      showToast('Please mark attendance for every student.', 'warning');
      return;
    }

    const finalRecords: AttendanceDayMap = {};
    students.forEach((s) => {
      finalRecords[s.rollNumber] = dayStatuses[s.rollNumber] as AttendanceStatus;
    });

    saveAttendanceRecord(currentDate, finalRecords);
  };

  // Counts for the active day form
  const presentCount = students.filter((s) => dayStatuses[s.rollNumber] === 'present').length;
  const absentCount = students.filter((s) => dayStatuses[s.rollNumber] === 'absent').length;
  const unmarkedCount = students.filter((s) => !dayStatuses[s.rollNumber]).length;
  const isExistingRecord = !!attendance[currentDate];

  return (
    <div id="mark-attendance-container" className="space-y-6">
      {/* Top Header & Date Selection Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Mark Attendance
              </h2>
              {isExistingRecord ? (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Existing Record (Editable)</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Not Marked Yet</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select date, mark Present/Absent for each student, and click Save Attendance.
            </p>
          </div>

          {/* Date Picker Control */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="prev-day-btn"
              onClick={() => stepDate(-1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="relative">
              <input
                id="attendance-date-picker"
                type="date"
                value={currentDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="pl-3.5 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              />
            </div>

            <button
              id="next-day-btn"
              onClick={() => stepDate(1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              id="date-sept-18-btn"
              onClick={() => handleDateChange('2026-09-18')}
              className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              Sep 18, 2026
            </button>
          </div>
        </div>

        {/* Real-time Status Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Selected: <strong className="text-slate-900 dark:text-slate-100">{formatReadableDate(currentDate)}</strong>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-slate-500 dark:text-slate-400">
              Total: <strong className="text-slate-800 dark:text-slate-200">{students.length}</strong>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              Absent: <strong>{absentCount}</strong>
            </span>
            {unmarkedCount > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold animate-pulse">
                Unmarked: <strong>{unmarkedCount}</strong>
              </span>
            )}
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="mark-all-present-btn"
              type="button"
              onClick={handleMarkAllPresent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark All Present</span>
            </button>

            <button
              id="mark-all-absent-btn"
              type="button"
              onClick={handleMarkAllAbsent}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-rose-600" />
              <span>Mark All Absent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Marking Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="mark-attendance-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Roll Number
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Class &amp; Section
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right sm:text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {students.map((student) => {
                const currentStatus = dayStatuses[student.rollNumber];
                const isPresent = currentStatus === 'present';
                const isAbsent = currentStatus === 'absent';

                return (
                  <tr
                    key={student.id}
                    id={`attendance-row-${student.rollNumber}`}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Student Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                            {student.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block sm:hidden">
                            {student.rollNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3.5 px-5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {student.rollNumber}
                    </td>

                    {/* Class & Section */}
                    <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-300">
                      <span>{student.className}</span>
                      <span className="ml-1 text-slate-400">({student.section})</span>
                    </td>

                    {/* Segmented Radio Toggle: [ Present ] [ Absent ] */}
                    <td className="py-3.5 px-5 text-right sm:text-center">
                      <div
                        id={`toggle-group-${student.rollNumber}`}
                        className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 gap-1"
                        role="radiogroup"
                        aria-label={`Attendance for ${student.name}`}
                      >
                        {/* Present Button */}
                        <button
                          type="button"
                          id={`toggle-present-${student.rollNumber}`}
                          onClick={() => handleStatusChange(student.rollNumber, 'present')}
                          role="radio"
                          aria-checked={isPresent}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isPresent
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isPresent ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          <span>Present</span>
                        </button>

                        {/* Absent Button */}
                        <button
                          type="button"
                          id={`toggle-absent-${student.rollNumber}`}
                          onClick={() => handleStatusChange(student.rollNumber, 'absent')}
                          role="radio"
                          aria-checked={isAbsent}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isAbsent
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                          }`}
                        >
                          <XCircle className={`w-3.5 h-3.5 ${isAbsent ? 'text-white' : 'text-rose-600 dark:text-rose-400'}`} />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {unmarkedCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{unmarkedCount} student{unmarkedCount !== 1 ? 's' : ''} not marked yet. Status is required for all before saving.</span>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>All {students.length} students marked. Ready to save attendance.</span>
              </span>
            )}
          </div>

          <button
            id="save-attendance-btn"
            type="button"
            onClick={handleSaveAttendance}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
