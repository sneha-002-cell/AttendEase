/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { calculateStudentAttendance } from '../../utils/storage';
import { StudentDetailModal } from './StudentDetailModal';
import { Search, Users, Eye, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { Student } from '../../types';

export const StudentsView: React.FC = () => {
  const { students, attendance, viewingStudent, setViewingStudent } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on search query (name, roll number, email)
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  return (
    <div id="students-view-container" className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Students
            </h2>
            <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse students, monitor overall attendance percentages, and inspect attendance logs.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="student-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, roll number, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table id="students-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Student
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Roll Number
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Class
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Section
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Attendance %
                </th>
                <th className="py-3.5 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const stats = calculateStudentAttendance(student.rollNumber, attendance, students);
                  const isLow = stats.percentage < 75;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono sm:hidden">
                              {student.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="py-3.5 px-5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {student.rollNumber}
                      </td>

                      {/* Class */}
                      <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {student.className}
                      </td>

                      {/* Section */}
                      <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                          {student.section}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-400">
                        <a
                          href={`mailto:${student.email}`}
                          className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
                        >
                          {student.email}
                        </a>
                      </td>

                      {/* Attendance % */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold ${
                              isLow
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900'
                            }`}
                          >
                            {stats.percentage}%
                          </span>
                          <span className="text-[11px] text-slate-400 hidden md:inline">
                            ({stats.presentDays}/{stats.totalWorkingDays} days)
                          </span>
                        </div>
                      </td>

                      {/* Action View */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          id={`view-student-${student.rollNumber}`}
                          onClick={() => setViewingStudent(student)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No students found.
                      </p>
                      <p className="text-xs text-slate-400">
                        No matching student records found for "{searchQuery}". Try clearing your search.
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Clear search filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailModal
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />
    </div>
  );
};
