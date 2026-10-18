/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import {
  User,
  Shield,
  Sliders,
  Moon,
  Sun,
  Bell,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Lock,
  GraduationCap,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { auth, settings, updateSettings, resetAllData, showToast } = useAttendance();

  const [defaultClass, setDefaultClass] = useState(settings.defaultClass);
  const [defaultSection, setDefaultSection] = useState(settings.defaultSection);
  const [darkMode, setDarkMode] = useState(settings.darkMode);
  const [attendanceReminder, setAttendanceReminder] = useState(settings.attendanceReminder);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      defaultClass,
      defaultSection,
      darkMode,
      attendanceReminder,
      reminderTime,
    });
    showToast('Settings saved successfully!', 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all attendance and student data to default sample demo state?')) {
      resetAllData();
    }
  };

  return (
    <div id="settings-view-container" className="space-y-6 max-w-4xl">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings &amp; Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage teacher credentials, application defaults, dark theme preferences, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Teacher Profile */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Teacher Profile
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              {auth.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                {auth.name}
              </h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                {auth.role}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Username: @{auth.username} &bull; {auth.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Name
              </label>
              <input
                type="text"
                disabled
                value={auth.name}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Username
              </label>
              <input
                type="text"
                disabled
                value={auth.username}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold font-mono text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Role
              </label>
              <input
                type="text"
                disabled
                value={auth.role}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Application Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Application Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Default Class
              </label>
              <input
                id="setting-default-class"
                type="text"
                value={defaultClass}
                onChange={(e) => setDefaultClass(e.target.value)}
                placeholder="e.g. B.Sc Computer Science"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Default Section
              </label>
              <input
                id="setting-default-section"
                type="text"
                value={defaultSection}
                onChange={(e) => setDefaultSection(e.target.value)}
                placeholder="e.g. A"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Dark Mode
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toggle high-contrast dark theme for low-light classrooms.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="setting-darkmode-toggle"
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Attendance Reminder */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Bell className="w-4 h-4 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Daily Attendance Reminder
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Receive prompt notifications to mark daily student records.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {attendanceReminder && (
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold"
                />
              )}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="setting-reminder-toggle"
                  type="checkbox"
                  checked={attendanceReminder}
                  onChange={(e) => setAttendanceReminder(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600" />
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Reset Demo Data */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Sample Data</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Restore the original 5 sample students and September 1–18 attendance records.
            </p>
          </div>

          <button
            type="button"
            id="reset-demo-data-btn"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Reset to Sample Data
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            id="save-settings-btn"
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
