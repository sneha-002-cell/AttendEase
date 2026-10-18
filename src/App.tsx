/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudentsView } from './components/students/StudentsView';
import { MarkAttendanceView } from './components/attendance/MarkAttendanceView';
import { CalendarView } from './components/calendar/CalendarView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { auth, activeTab } = useAttendance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not authenticated, strictly show the Login page (section 4)
  if (!auth.isAuthenticated) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'students' && <StudentsView />}
          {activeTab === 'attendance' && <MarkAttendanceView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Persistent Toasts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AttendanceProvider>
      <MainLayout />
    </AttendanceProvider>
  );
}
