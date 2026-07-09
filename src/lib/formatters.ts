// ============================================================
// Formatters — Indonesian locale date/time/number formatting
// ============================================================

import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

/** Format date to Indonesian locale */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'd MMMM yyyy', { locale: id });
  } catch {
    return dateStr;
  }
}

/** Format date short */
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'd MMM yyyy', { locale: id });
  } catch {
    return dateStr;
  }
}

/** Format time (HH:mm) */
export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '-';
  // Already in HH:mm or HH:mm:ss format
  const parts = timeStr.split(':');
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return timeStr;
}

/** Format datetime */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, 'd MMM yyyy HH:mm', { locale: id });
  } catch {
    return dateStr;
  }
}

/** Format number with Indonesian locale */
export function formatNumber(num: number | null | undefined): string {
  if (num == null) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

/** Format currency in IDR */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

/** Format percentage */
export function formatPercentage(value: number | null | undefined, decimals: number = 0): string {
  if (value == null) return '-';
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format percentage from already-percentage value */
export function formatPercentageValue(value: number | null | undefined, decimals: number = 0): string {
  if (value == null) return '-';
  return `${value.toFixed(decimals)}%`;
}

/** Get today's date as ISO string (YYYY-MM-DD) */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

/** Get current time as HH:mm:ss */
export function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

/** Get attendance status label */
export function getAttendanceStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    Present: 'Hadir',
    Late: 'Terlambat',
    'Early Leave': 'Pulang Awal',
    Absent: 'Tidak Hadir',
  };
  return labels[status] || status;
}

/** Get registration type color */
export function getRegistrationTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'Rawat Jalan': 'emerald',
    'Rawat Inap': 'blue',
    'Gawat Darurat': 'rose',
    Penunjang: 'amber',
  };
  return colors[type] || 'slate';
}

/** Get visit type color */
export function getVisitTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'First Visit': 'emerald',
    'Follow Up': 'blue',
    Emergency: 'rose',
    'Routine Checkup': 'cyan',
  };
  return colors[type] || 'slate';
}

/** Generate unique ID */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Day of week from date string */
export function getDayOfWeekFromDate(dateStr: string): number {
  const date = new Date(dateStr);
  // JavaScript: 0=Sunday, we need 0=Monday
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

/** Get month name in Indonesian */
export function getMonthName(month: number): string {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[month] || '';
}
