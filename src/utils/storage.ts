/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  AttendanceRecords,
  AttendanceDayMap,
  StudentAttendanceSummary,
  DayAttendanceSummary,
  AppSettings,
  AuthUser,
} from '../types';
import { INITIAL_STUDENTS, INITIAL_ATTENDANCE } from './sampleData';

const STORAGE_KEYS = {
  STUDENTS: 'attendease_students',
  ATTENDANCE: 'attendease_attendance',
  SETTINGS: 'attendease_settings',
  AUTH: 'attendease_auth',
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultClass: 'B.Sc Computer Science',
  defaultSection: 'A',
  darkMode: false,
  attendanceReminder: true,
  reminderTime: '09:00',
};

export const DEMO_USER: AuthUser = {
  name: 'Admin',
  username: 'admin1',
  role: 'Teacher / Administrator',
  email: 'admin@attendease.edu',
  isAuthenticated: true,
};

// Safe localStorage access
function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key ${key} to localStorage:`, error);
  }
}

// Students
export function getStoredStudents(): Student[] {
  const students = safeGetItem<Student[]>(STORAGE_KEYS.STUDENTS, []);
  if (!students || students.length === 0) {
    safeSetItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  }
  return students;
}

export function saveStoredStudents(students: Student[]): void {
  safeSetItem(STORAGE_KEYS.STUDENTS, students);
}

// Attendance Records
export function getStoredAttendance(): AttendanceRecords {
  const attendance = safeGetItem<AttendanceRecords | null>(STORAGE_KEYS.ATTENDANCE, null);
  if (!attendance || Object.keys(attendance).length === 0) {
    safeSetItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    return INITIAL_ATTENDANCE;
  }
  return attendance;
}

export function saveStoredAttendance(records: AttendanceRecords): void {
  safeSetItem(STORAGE_KEYS.ATTENDANCE, records);
}

// Settings
export function getStoredSettings(): AppSettings {
  return safeGetItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveStoredSettings(settings: AppSettings): void {
  safeSetItem(STORAGE_KEYS.SETTINGS, settings);
}

// Auth state
export function getStoredAuth(): AuthUser {
  return safeGetItem<AuthUser>(STORAGE_KEYS.AUTH, {
    name: 'Admin',
    username: 'admin1',
    role: 'Teacher / Administrator',
    email: 'admin@attendease.edu',
    isAuthenticated: false,
  });
}

export function saveStoredAuth(auth: AuthUser): void {
  safeSetItem(STORAGE_KEYS.AUTH, auth);
}

export function clearStoredAuth(): void {
  safeSetItem(STORAGE_KEYS.AUTH, {
    name: 'Admin',
    username: 'admin1',
    role: 'Teacher / Administrator',
    email: 'admin@attendease.edu',
    isAuthenticated: false,
  });
}

// Reset data to initial demo state
export function resetDemoData(): { students: Student[]; attendance: AttendanceRecords } {
  safeSetItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  safeSetItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  return {
    students: INITIAL_STUDENTS,
    attendance: INITIAL_ATTENDANCE,
  };
}

// Core reusable data functions as required in section 29
export function getAttendanceForDate(date: string, records: AttendanceRecords = getStoredAttendance()): AttendanceDayMap | null {
  return records[date] || null;
}

export function saveAttendanceForDate(
  date: string,
  dayRecords: AttendanceDayMap,
  currentRecords: AttendanceRecords = getStoredAttendance()
): AttendanceRecords {
  const updated: AttendanceRecords = {
    ...currentRecords,
    [date]: { ...dayRecords },
  };
  saveStoredAttendance(updated);
  return updated;
}

export function calculateStudentAttendance(
  rollNumber: string,
  records: AttendanceRecords = getStoredAttendance(),
  studentList: Student[] = getStoredStudents(),
  monthFilter?: string // format YYYY-MM
): StudentAttendanceSummary {
  const student = studentList.find((s) => s.rollNumber === rollNumber) || {
    id: rollNumber,
    name: rollNumber,
    rollNumber,
    className: 'B.Sc Computer Science',
    section: 'A',
    email: '',
  };

  const dates = Object.keys(records).filter((date) => {
    if (monthFilter) {
      return date.startsWith(monthFilter);
    }
    return true;
  });

  let totalWorkingDays = 0;
  let presentDays = 0;
  let absentDays = 0;

  dates.forEach((date) => {
    const dayMap = records[date];
    if (dayMap && rollNumber in dayMap) {
      totalWorkingDays += 1;
      if (dayMap[rollNumber] === 'present') {
        presentDays += 1;
      } else if (dayMap[rollNumber] === 'absent') {
        absentDays += 1;
      }
    }
  });

  const percentage = totalWorkingDays > 0 ? Math.round((presentDays / totalWorkingDays) * 100) : 0;

  return {
    student,
    totalWorkingDays,
    presentDays,
    absentDays,
    percentage,
  };
}

export function calculateClassAttendance(
  date: string,
  records: AttendanceRecords = getStoredAttendance(),
  studentList: Student[] = getStoredStudents()
): DayAttendanceSummary {
  const dayRecords = records[date];
  const totalStudents = studentList.length;

  if (!dayRecords || Object.keys(dayRecords).length === 0) {
    return {
      date,
      totalStudents,
      presentCount: 0,
      absentCount: 0,
      percentage: 0,
      isMarked: false,
      records: {},
    };
  }

  let presentCount = 0;
  let absentCount = 0;

  studentList.forEach((s) => {
    const status = dayRecords[s.rollNumber];
    if (status === 'present') presentCount += 1;
    else if (status === 'absent') absentCount += 1;
  });

  const markedCount = presentCount + absentCount;
  const percentage = markedCount > 0 ? Math.round((presentCount / markedCount) * 100) : 0;

  return {
    date,
    totalStudents,
    presentCount,
    absentCount,
    percentage,
    isMarked: markedCount > 0,
    records: dayRecords,
  };
}

export function getPresentCount(date: string, records: AttendanceRecords = getStoredAttendance()): number {
  const dayMap = records[date];
  if (!dayMap) return 0;
  return Object.values(dayMap).filter((status) => status === 'present').length;
}

export function getAbsentCount(date: string, records: AttendanceRecords = getStoredAttendance()): number {
  const dayMap = records[date];
  if (!dayMap) return 0;
  return Object.values(dayMap).filter((status) => status === 'absent').length;
}

export function calculateMonthlyAttendance(
  monthStr: string, // YYYY-MM e.g. "2026-09"
  records: AttendanceRecords = getStoredAttendance(),
  studentList: Student[] = getStoredStudents()
) {
  const dates = Object.keys(records)
    .filter((d) => d.startsWith(monthStr))
    .sort();

  const studentSummaries: StudentAttendanceSummary[] = studentList.map((s) =>
    calculateStudentAttendance(s.rollNumber, records, studentList, monthStr)
  );

  const totalPossible = studentSummaries.reduce((acc, curr) => acc + curr.totalWorkingDays, 0);
  const totalPresent = studentSummaries.reduce((acc, curr) => acc + curr.presentDays, 0);

  const averagePercentage = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

  return {
    monthStr,
    daysMarked: dates.length,
    dates,
    averagePercentage,
    studentSummaries,
  };
}

export function getLowAttendanceStudents(
  threshold = 75,
  records: AttendanceRecords = getStoredAttendance(),
  studentList: Student[] = getStoredStudents(),
  monthFilter?: string
): StudentAttendanceSummary[] {
  return studentList
    .map((s) => calculateStudentAttendance(s.rollNumber, records, studentList, monthFilter))
    .filter((summary) => summary.totalWorkingDays > 0 && summary.percentage < threshold)
    .sort((a, b) => a.percentage - b.percentage);
}
