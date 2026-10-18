/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, logout, auth, students } = useAttendance();

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: students.length },
    { id: 'attendance', label: 'Mark Attendance', icon: ClipboardCheck },
    { id: 'calendar', label: 'Attendance Calendar', icon: CalendarDays },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const handleLogout = () => {
    onCloseMobile();
    logout();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-white tracking-tight">AttendEase</span>
              <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              School & College Attendance
            </p>
          </div>
        </div>

        {/* Close button on mobile */}
        <button
          id="close-mobile-sidebar-btn"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Menu
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class Section Info Pill */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Class</span>
        </div>
        <div className="text-slate-200 font-medium truncate">B.Sc Computer Science</div>
        <div className="text-slate-400 text-[11px]">Section A &bull; Semester 1</div>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
              {auth.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white truncate max-w-[120px]">
                {auth.name}
              </div>
              <div className="text-[10px] text-slate-400">{auth.role.split('/')[0]}</div>
            </div>
          </div>
        </div>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-600 rounded-xl border border-rose-800/40 hover:border-transparent transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            id="mobile-sidebar-backdrop"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div
            id="mobile-sidebar-panel"
            className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
