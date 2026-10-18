/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to format Date to YYYY-MM-DD in local time
export function formatDateToISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD safely into year, month, day
export function parseISODate(dateStr: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

// Human readable string: "September 18, 2026"
export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return '';
  const { year, month, day } = parseISODate(dateStr);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Human readable short: "Sep 18, 2026"
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const { year, month, day } = parseISODate(dateStr);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// "September 2026"
export function formatMonthYear(year: number, monthIndex: number): string {
  const date = new Date(year, monthIndex, 1);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// Get days in a given month
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Get the starting day of week for a month (0 = Sunday, 1 = Monday, etc.)
export function getFirstDayOfWeek(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay();
}

// Generate calendar grid for month
export interface CalendarCell {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function generateCalendarGrid(year: number, monthIndex: number, todayISO: string): CalendarCell[] {
  const daysInCurrentMonth = getDaysInMonth(year, monthIndex);
  const startDay = getFirstDayOfWeek(year, monthIndex); // 0 (Sun) to 6 (Sat)
  const prevMonthDays = getDaysInMonth(year, monthIndex - 1);

  const cells: CalendarCell[] = [];

  // Previous month trailing days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonthDate = new Date(year, monthIndex - 1, day);
    const dateStr = formatDateToISO(prevMonthDate);
    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayISO,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const currentDate = new Date(year, monthIndex, day);
    const dateStr = formatDateToISO(currentDate);
    cells.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayISO,
    });
  }

  // Next month leading days to complete grid (multiples of 7)
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const nextMonthDate = new Date(year, monthIndex + 1, day);
      const dateStr = formatDateToISO(nextMonthDate);
      cells.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: dateStr === todayISO,
      });
    }
  }

  return cells;
}
