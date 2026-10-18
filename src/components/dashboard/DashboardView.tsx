/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAttendance, DEMO_DATE } from '../../context/AttendanceContext';
import { DashboardCard } from './DashboardCard';
import { AttendanceBadge } from '../common/AttendanceBadge';
import {
  calculateClassAttendance,
  getLowAttendanceStudents,
  calculateStudentAttendance,
} from '../../utils/storage';
import { formatReadableDate } from '../../utils/dateUtils';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  ClipboardCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    students,
    attendance,
    todayDate,
    setActiveTab,
    setSelectedAttendanceDate,
    setViewingStudent,
  } = useAttendance();

  // Dynamic calculations for today
  const todaySummary = calculateClassAttendance(todayDate, attendance, students);
  const lowAttendanceStudents = getLowAttendanceStudents(75, attendance, students);

  const formattedDate = formatReadableDate(todayDate);

  const handleMarkAttendanceClick = () => {
    setSelectedAttendanceDate(todayDate);
    setActiveTab('attendance');
  };

  return (
    <div id="dashboard-view-container" className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-2 backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, Admin!
            </h2>
            <p className="text-sm text-indigo-200/90 mt-1 max-w-xl font-medium">
              Here is your daily attendance summary for B.Sc Computer Science (Section A).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="dashboard-mark-attendance-banner-btn"
              onClick={handleMarkAttendanceClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-indigo-950 font-bold text-sm shadow-md transition-all duration-150 group"
            >
              <ClipboardCheck className="w-4.5 h-4.5 text-indigo-600 transition-transform group-hover:scale-110" />
              <span>Mark Attendance</span>
              <ArrowRight className="w-4 h-4 text-indigo-600 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <DashboardCard
          id="card-total-students"
          title="Total Students"
          value={students.length}
          subtitle="Enrolled in Section A"
          icon={Users}
          variant="indigo"
        />

        <DashboardCard
          id="card-present-today"
          title="Present Today"
          value={todaySummary.isMarked ? todaySummary.presentCount : '0'}
          subtitle={todaySummary.isMarked ? `Out of ${students.length} students` : 'Not yet marked'}
          icon={UserCheck}
          variant="emerald"
          trend={todaySummary.isMarked ? `${todaySummary.percentage}% present` : undefined}
        />

        <DashboardCard
          id="card-absent-today"
          title="Absent Today"
          value={todaySummary.isMarked ? todaySummary.absentCount : '0'}
          subtitle={todaySummary.isMarked ? `${students.length - todaySummary.absentCount} attending` : 'Not yet marked'}
          icon={UserX}
          variant="rose"
        />

        <DashboardCard
          id="card-attendance-percentage"
          title="Attendance Rate"
          value={todaySummary.isMarked ? `${todaySummary.percentage}%` : 'N/A'}
          subtitle="For selected date"
          icon={Percent}
          variant={todaySummary.percentage >= 75 ? 'emerald' : 'amber'}
        />
      </div>

      {/* Grid: Today's Attendance Table (2/3) + Low Attendance Warnings (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Attendance Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Today's Attendance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Status records for {formattedDate}
              </p>
            </div>
            <button
              id="dashboard-mark-attendance-btn"
              onClick={handleMarkAttendanceClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors w-fit"
            >
              <ClipboardCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Mark Attendance</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table id="today-attendance-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Student
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Roll Number
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {students.map((student) => {
                  const dayMap = attendance[todayDate];
                  const status = dayMap ? dayMap[student.rollNumber] || null : null;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 block sm:hidden">
                              {student.rollNumber}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
                        {student.rollNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <AttendanceBadge status={status} />
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setViewingStudent(student)}
                          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Attendance Students Warning Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Low Attendance Students
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                &lt; 75%
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {lowAttendanceStudents.length > 0 ? (
                lowAttendanceStudents.map((item) => (
                  <div
                    key={item.student.id}
                    id={`low-attendance-item-${item.student.rollNumber}`}
                    onClick={() => setViewingStudent(item.student)}
                    className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center justify-center">
                        {item.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {item.student.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {item.student.rollNumber} &bull; {item.presentDays}/{item.totalWorkingDays} days
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-md text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <span className="font-semibold">All students have attendance above 75%.</span>
                  <span className="text-[11px] text-slate-400">Great job! No attendance interventions required.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Attendance Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
