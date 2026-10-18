/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Student,
  AttendanceRecords,
  AttendanceDayMap,
  AppSettings,
  AuthUser,
  ToastItem,
  ToastType,
  NavigationTab,
} from '../types';
import {
  getStoredStudents,
  saveStoredStudents,
  getStoredAttendance,
  saveStoredAttendance,
  getStoredSettings,
  saveStoredSettings,
  getStoredAuth,
  saveStoredAuth,
  clearStoredAuth,
  resetDemoData,
  DEMO_USER,
} from '../utils/storage';

interface AttendanceContextType {
  students: Student[];
  attendance: AttendanceRecords;
  settings: AppSettings;
  auth: AuthUser;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedAttendanceDate: string;
  setSelectedAttendanceDate: (date: string) => void;
  viewingStudent: Student | null;
  setViewingStudent: (student: Student | null) => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  saveAttendanceRecord: (date: string, records: AttendanceDayMap) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  resetAllData: () => void;
  todayDate: string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

// Reference demo date is September 18, 2026
export const DEMO_DATE = '2026-09-18';

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => getStoredStudents());
  const [attendance, setAttendance] = useState<AttendanceRecords>(() => getStoredAttendance());
  const [settings, setSettings] = useState<AppSettings>(() => getStoredSettings());
  const [auth, setAuth] = useState<AuthUser>(() => getStoredAuth());
  
  // Navigation
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    // Check url hash or path if available
    const path = window.location.hash.replace('#/', '').replace('#', '') || window.location.pathname.replace('/', '');
    const validTabs: NavigationTab[] = ['dashboard', 'students', 'attendance', 'calendar', 'reports', 'settings'];
    if (validTabs.includes(path as NavigationTab)) {
      return path as NavigationTab;
    }
    return 'dashboard';
  });

  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(DEMO_DATE);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Dark mode sync to HTML document root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Synchronize browser history / URL hash with activeTab
  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    window.location.hash = `#/${tab}`;
  }, []);

  // Listen to hash changes (e.g. browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hashPath = window.location.hash.replace('#/', '').replace('#', '');
      const validTabs: NavigationTab[] = ['dashboard', 'students', 'attendance', 'calendar', 'reports', 'settings'];
      if (validTabs.includes(hashPath as NavigationTab)) {
        setActiveTabState(hashPath as NavigationTab);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast notifications
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = { id, message, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  // Save attendance record for date
  const saveAttendanceRecord = useCallback(
    (date: string, dayRecords: AttendanceDayMap) => {
      setAttendance((prev) => {
        const updated: AttendanceRecords = {
          ...prev,
          [date]: { ...dayRecords },
        };
        saveStoredAttendance(updated);
        return updated;
      });
      showToast('Attendance saved successfully!', 'success');
    },
    [showToast]
  );

  // Update Settings
  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        saveStoredSettings(updated);
        return updated;
      });
      showToast('Settings updated successfully', 'success');
    },
    [showToast]
  );

  // Login handler
  const login = useCallback(
    (username: string, password: string): boolean => {
      if (username === 'admin1' && password === 'Admin@123') {
        const authenticatedUser: AuthUser = {
          ...DEMO_USER,
          isAuthenticated: true,
        };
        setAuth(authenticatedUser);
        saveStoredAuth(authenticatedUser);
        setActiveTab('dashboard');
        showToast('Welcome back, Admin!', 'success');
        return true;
      }
      showToast('Invalid username or password.', 'error');
      return false;
    },
    [setActiveTab, showToast]
  );

  // Logout handler
  const logout = useCallback(() => {
    clearStoredAuth();
    setAuth({
      name: 'Admin',
      username: 'admin1',
      role: 'Teacher / Administrator',
      email: 'admin@attendease.edu',
      isAuthenticated: false,
    });
    showToast('You have been logged out.', 'info');
  }, [showToast]);

  // Reset to demo data
  const resetAllData = useCallback(() => {
    const fresh = resetDemoData();
    setStudents(fresh.students);
    setAttendance(fresh.attendance);
    showToast('Sample demo data reset successfully!', 'info');
  }, [showToast]);

  return (
    <AttendanceContext.Provider
      value={{
        students,
        attendance,
        settings,
        auth,
        activeTab,
        setActiveTab,
        selectedAttendanceDate,
        setSelectedAttendanceDate,
        viewingStudent,
        setViewingStudent,
        toasts,
        showToast,
        removeToast,
        saveAttendanceRecord,
        updateSettings,
        login,
        logout,
        resetAllData,
        todayDate: DEMO_DATE,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export function useAttendance(): AttendanceContextType {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
