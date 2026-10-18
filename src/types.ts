/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AttendanceStatus = 'present' | 'absent';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  email: string;
  avatarUrl?: string;
}

export type AttendanceDayMap = Record<string, AttendanceStatus>; // rollNumber -> status

export type AttendanceRecords = Record<string, AttendanceDayMap>; // YYYY-MM-DD -> { [rollNumber]: status }

export interface StudentAttendanceSummary {
  student: Student;
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  percentage: number;
}

export interface DayAttendanceSummary {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  percentage: number;
  isMarked: boolean;
  records: AttendanceDayMap;
}

export interface AppSettings {
  defaultClass: string;
  defaultSection: string;
  darkMode: boolean;
  attendanceReminder: boolean;
  reminderTime: string;
}

export interface AuthUser {
  name: string;
  username: string;
  role: string;
  email: string;
  isAuthenticated: boolean;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'calendar'
  | 'reports'
  | 'settings';
