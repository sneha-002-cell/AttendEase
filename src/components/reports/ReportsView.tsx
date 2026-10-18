/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateStudentAttendance, calculateMonthlyAttendance, getLowAttendanceStudents } from '../../utils/storage';
import { StudentDetailModal } from '../students/StudentDetailModal';
import {
  Download,
  Printer,
  Calendar,
  Filter,
  BarChart3,
  Users,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { Student } from '../../types';

export const ReportsView: React.FC = () => {
  const { students, attendance, viewingStudent, setViewingStudent } = useAttendance();

  // Filter States
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09'); // Default: September 2026
  const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('B.Sc Computer Science');
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (selectedStudentId !== 'all' && s.rollNumber !== selectedStudentId) {
      return false;
    }
    if (selectedClass && s.className !== selectedClass) {
      return false;
    }
    if (selectedSection && s.section !== selectedSection) {
      return false;
    }
    return true;
  });

  // Calculate stats for each filtered student for the selected month
  const reportRows = filteredStudents.map((student) => {
    return calculateStudentAttendance(student.rollNumber, attendance, students, selectedMonth);
  });

  // Calculate class average
  const totalDaysAcross = reportRows.reduce((sum, r) => sum + r.totalWorkingDays, 0);
  const totalPresentAcross = reportRows.reduce((sum, r) => sum + r.presentDays, 0);
  const averageAttendance = totalDaysAcross > 0 ? Math.round((totalPresentAcross / totalDaysAcross) * 100) : 0;

  // Low attendance warning for this filtered view
  const lowAttendanceList = reportRows.filter((r) => r.totalWorkingDays > 0 && r.percentage < 75);

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Student Name',
      'Roll Number',
      'Class',
      'Section',
      'Present Days',
      'Absent Days',
      'Attendance Percentage',
    ];

    const rows = reportRows.map((r) => [
      `"${r.student.name}"`,
      `"${r.student.rollNumber}"`,
      `"${r.student.className}"`,
      `"${r.student.section}"`,
      r.presentDays,
      r.absentDays,
      `"${r.percentage}%"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance-report-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-view-container" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Attendance Reports
            </h2>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              September 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate analytical attendance reports, evaluate trends, export CSV spreadsheets, and print summaries.
          </p>
        </div>

        {/* Action Buttons: Export CSV & Print */}
        <div className="flex items-center gap-2.5 self-start md:self-auto no-print">
          <button
            id="export-csv-btn"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs no-print">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span>Report Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Month Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Month
            </label>
            <select
              id="report-month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2026-09">September 2026</option>
              <option value="2026-08">August 2026</option>
              <option value="2026-10">October 2026</option>
            </select>
          </div>

          {/* Student Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Student
            </label>
            <select
              id="report-student-filter"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Students ({students.length})</option>
              {students.map((s) => (
                <option key={s.id} value={s.rollNumber}>
                  {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Class
            </label>
            <select
              id="report-class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="B.Sc Computer Science">B.Sc Computer Science</option>
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Section
            </label>
            <select
              id="report-section-filter"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Summary Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Students
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {filteredStudents.length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Attendance
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {averageAttendance}%
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Below 75% Threshold
            </span>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {lowAttendanceList.length} Student{lowAttendanceList.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Comparative Attendance Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Student Attendance Comparison ({selectedMonth})
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> ≥ 75% Target
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> &lt; 75% Low
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {reportRows.map((row) => {
            const isLow = row.percentage < 75;
            return (
              <div key={row.student.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-slate-100">{row.student.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({row.student.rollNumber})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      {row.presentDays} / {row.totalWorkingDays} days
                    </span>
                    <span className={`font-black ${isLow ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {row.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                  {/* 75% threshold guide line */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 z-10"
                    style={{ left: '75%' }}
                    title="75% Attendance Requirement Line"
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLow
                        ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, row.percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Report Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Attendance Summary Table
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculated dynamically from attendance log records
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table id="report-summary-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Roll Number
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Present
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Absent
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Attendance %
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right no-print">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {reportRows.map((row) => {
                const isLow = row.percentage < 75;
                return (
                  <tr
                    key={row.student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {row.student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {row.student.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                      {row.student.rollNumber}
                    </td>

                    <td className="py-3.5 px-5 text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {row.presentDays}
                    </td>

                    <td className="py-3.5 px-5 text-xs font-bold text-rose-600 dark:text-rose-400 text-right">
                      {row.absentDays}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs font-extrabold ${
                          isLow
                            ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900'
                        }`}
                      >
                        {row.percentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right no-print">
                      <button
                        onClick={() => setViewingStudent(row.student)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Attendance Warning Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Low Attendance Students (&lt; 75%)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Official Attendance Benchmark: 75%
          </span>
        </div>

        <div className="mt-4">
          {lowAttendanceList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lowAttendanceList.map((item) => (
                <div
                  key={item.student.id}
                  onClick={() => setViewingStudent(item.student)}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base text-amber-600">⚠</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.student.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {item.student.rollNumber} &bull; {item.presentDays} of {item.totalWorkingDays} days
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold">All students have attendance above 75%.</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />
    </div>
  );
};
