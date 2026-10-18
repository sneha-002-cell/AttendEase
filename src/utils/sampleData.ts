/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, AttendanceRecords } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stud-1',
    name: 'Aarav Sharma',
    rollNumber: 'CS001',
    className: 'B.Sc Computer Science',
    section: 'A',
    email: 'aarav@example.com',
  },
  {
    id: 'stud-2',
    name: 'Ananya Reddy',
    rollNumber: 'CS002',
    className: 'B.Sc Computer Science',
    section: 'A',
    email: 'ananya@example.com',
  },
  {
    id: 'stud-3',
    name: 'Rahul Kumar',
    rollNumber: 'CS003',
    className: 'B.Sc Computer Science',
    section: 'A',
    email: 'rahul@example.com',
  },
  {
    id: 'stud-4',
    name: 'Priya Singh',
    rollNumber: 'CS004',
    className: 'B.Sc Computer Science',
    section: 'A',
    email: 'priya@example.com',
  },
  {
    id: 'stud-5',
    name: 'Arjun Patel',
    rollNumber: 'CS005',
    className: 'B.Sc Computer Science',
    section: 'A',
    email: 'arjun@example.com',
  },
];

/**
 * Pre-populated attendance records for September 1 to September 18, 2026.
 * Target totals across 18 days:
 * Aarav Sharma:  16 Present, 2 Absent  (89%)
 * Ananya Reddy:  17 Present, 1 Absent  (94%)
 * Rahul Kumar:   13 Present, 5 Absent  (72%)
 * Priya Singh:   15 Present, 3 Absent  (83%)
 * Arjun Patel:   12 Present, 6 Absent  (67%)
 * 
 * On Sep 18, 2026 specifically:
 * Aarav: Present, Ananya: Present, Rahul: Absent, Priya: Present, Arjun: Absent (3 Present, 2 Absent = 60%)
 */
export const INITIAL_ATTENDANCE: AttendanceRecords = {
  '2026-09-01': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-02': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'absent',
  },
  '2026-09-03': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'absent',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-04': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'absent',
  },
  '2026-09-05': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'absent',
    CS005: 'present',
  },
  '2026-09-06': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'absent',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-07': {
    CS001: 'absent',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-08': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'absent',
  },
  '2026-09-09': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'absent',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-10': {
    CS001: 'present',
    CS002: 'absent',
    CS003: 'present',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-11': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'absent',
    CS005: 'present',
  },
  '2026-09-12': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'absent',
  },
  '2026-09-13': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'absent',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-14': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'absent',
  },
  '2026-09-15': {
    CS001: 'absent',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-16': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'absent',
    CS005: 'present',
  },
  '2026-09-17': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'present',
    CS004: 'present',
    CS005: 'present',
  },
  '2026-09-18': {
    CS001: 'present',
    CS002: 'present',
    CS003: 'absent',
    CS004: 'present',
    CS005: 'absent',
  },
};
