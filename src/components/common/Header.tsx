/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  Bell,
  Moon,
  Sun,
  LogOut,
  Menu,
  GraduationCap,
  AlertTriangle,
  ChevronDown,
  User,
} from 'lucide-react';
import { getLowAttendanceStudents } from '../../utils/storage';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    activeTab,
    auth,
    logout,
    settings,
    updateSettings,
    attendance,
    students,
    setActiveTab,
    setViewingStudent,
  } = useAttendance();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const lowAttendanceStudents = getLowAttendanceStudents(75, attendance, students);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const titles: Record<string, { title: string; desc: string }> = {
    dashboard: { title: 'Dashboard', desc: 'Overview of student attendance statistics' },
    students: { title: 'Students', desc: 'Enrolled students and individual records' },
    attendance: { title: 'Mark Attendance', desc: 'Daily attendance marking and review' },
    calendar: { title: 'Attendance Calendar', desc: 'Monthly attendance visual breakdown' },
    reports: { title: 'Attendance Reports', desc: 'Comprehensive analytics and exports' },
    settings: { title: 'Settings', desc: 'Teacher profile & application preferences' },
  };

  const currentInfo = titles[activeTab] || { title: 'AttendEase', desc: 'Attendance Management' };

  // Formatted demo date: "Friday, Sep 18, 2026"
  const formattedToday = new Date(2026, 8, 18).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      id="main-header"
      className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            {currentInfo.title}
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-500 dark:text-slate-400">
            {currentInfo.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Current Date Badge */}
        <div
          id="header-current-date"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/60"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{formattedToday}</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-quick-toggle"
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark theme"
        >
          {settings.darkMode ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="notification-bell-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {lowAttendanceStudents.length > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900">
                {lowAttendanceStudents.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              id="notification-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Notifications
                </span>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                  {lowAttendanceStudents.length} alert{lowAttendanceStudents.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {lowAttendanceStudents.length > 0 ? (
                  lowAttendanceStudents.map((item) => (
                    <div
                      key={item.student.id}
                      onClick={() => {
                        setViewingStudent(item.student);
                        setNotificationsOpen(false);
                      }}
                      className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors flex items-start gap-3"
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          Low Attendance: {item.student.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Currently at {item.percentage}% ({item.presentDays}/{item.totalWorkingDays} days)
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No active warnings. All students are above 75%.
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Full Reports
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shadow-indigo-600/20">
              {auth.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {auth.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {auth.role}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div
              id="user-profile-dropdown"
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{auth.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  @{auth.username}
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                  {auth.role}
                </span>
              </div>

              <div className="p-1">
                <button
                  id="profile-settings-btn"
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  id="header-logout-btn"
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
