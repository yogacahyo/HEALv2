// ============================================================
// Roster Simulation — Auto rostering with constraints
// ============================================================

import type { Employee, Position, DoctorSchedule, Attendance, LeaveRequest, DoctorQueueQuota, ShiftSwapRequest, RosterEntry, ShiftType } from './types';
import { isDoctorPosition, isNursePosition, getEmployeeRole } from './simrs-calculations';

const SHIFTS: { type: ShiftType; start: string; end: string }[] = [
  { type: 'Pagi', start: '07:00', end: '14:00' },
  { type: 'Sore', start: '14:00', end: '21:00' },
  { type: 'Malam', start: '21:00', end: '07:00' },
];

/** Generate monthly roster for next month */
export function generateMonthlyRoster(params: {
  employees: Employee[];
  positions: Position[];
  schedules: DoctorSchedule[];
  attendance: Attendance[];
  leaveRequests: LeaveRequest[];
  quotas: DoctorQueueQuota[];
  shiftSwapRequests: ShiftSwapRequest[];
  year: number;
  month: number;
}): RosterEntry[] {
  const { employees, positions, schedules, attendance, leaveRequests, shiftSwapRequests, year, month } = params;
  const roster: RosterEntry[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Filter medical staff only
  const medicalStaff = employees.filter((emp) => {
    const pos = positions.find((p) => p.position_id === emp.position_id);
    return pos && (isDoctorPosition(pos) || isNursePosition(pos)) && emp.status === 'Active';
  });

  for (const emp of medicalStaff) {
    const pos = positions.find((p) => p.position_id === emp.position_id)!;
    const role = getEmployeeRole(pos);
    const dept = pos.description || pos.position_name;
    const empSchedules = schedules.filter((s) => s.doctor_id === emp.employee_id && s.is_active);

    // Check approved leave
    const approvedLeaves = leaveRequests.filter((lr) => lr.employee_id === emp.employee_id && lr.status === 'Approved');

    // Check late/absent history
    const lateCount = attendance.filter((a) => a.employee_id === emp.employee_id && a.status === 'Late').length;
    const absentCount = attendance.filter((a) => a.employee_id === emp.employee_id && a.status === 'Absent').length;

    // Check approved shift swaps
    const approvedSwaps = shiftSwapRequests.filter(
      (s) => s.requester_id === String(emp.employee_id) && s.status === 'Disetujui'
    );

    let consecutiveNights = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1; // Convert to 0=Monday

      // Check if on leave
      const isOnLeave = approvedLeaves.some((lr) => date >= lr.start_date && date <= lr.end_date);
      if (isOnLeave) {
        roster.push({
          employee_id: emp.employee_id,
          employee_name: `${emp.first_name} ${emp.last_name}`,
          role: role as 'dokter' | 'perawat',
          department: dept,
          date,
          shift: 'Pagi',
          start_time: '-',
          end_time: '-',
          is_leave: true,
          has_alert: false,
          alert_message: 'Cuti disetujui',
        });
        consecutiveNights = 0;
        continue;
      }

      // Check if there's a shift swap for this date
      const swap = approvedSwaps.find((s) => s.current_date === date);

      // Find schedule for this day
      const daySchedule = empSchedules.find((s) => s.day_of_week === dayOfWeek);

      let shift: ShiftType;
      let startTime: string;
      let endTime: string;

      if (swap) {
        shift = swap.requested_shift;
        const shiftInfo = SHIFTS.find((s) => s.type === shift)!;
        startTime = shiftInfo.start;
        endTime = shiftInfo.end;
      } else if (daySchedule) {
        const startHour = parseInt(daySchedule.start_time.split(':')[0], 10);
        if (startHour >= 7 && startHour < 14) shift = 'Pagi';
        else if (startHour >= 14 && startHour < 21) shift = 'Sore';
        else shift = 'Malam';
        startTime = daySchedule.start_time;
        endTime = daySchedule.end_time;
      } else if (isNursePosition(pos)) {
        // Nurses rotate shifts
        const shiftIndex = (emp.employee_id + day) % 3;
        const shiftInfo = SHIFTS[shiftIndex];
        shift = shiftInfo.type;
        startTime = shiftInfo.start;
        endTime = shiftInfo.end;
      } else {
        continue; // No schedule for this day
      }

      // Track consecutive nights
      if (shift === 'Malam') {
        consecutiveNights++;
      } else {
        consecutiveNights = 0;
      }

      // Generate alerts
      let hasAlert = false;
      let alertMessage = '';

      if (consecutiveNights > 2) {
        hasAlert = true;
        alertMessage = `Jadwal malam beruntun: ${consecutiveNights} hari`;
      }

      if (lateCount >= 3) {
        hasAlert = true;
        alertMessage += (alertMessage ? '; ' : '') + `Riwayat terlambat: ${lateCount}x`;
      }

      if (absentCount >= 2) {
        hasAlert = true;
        alertMessage += (alertMessage ? '; ' : '') + `Riwayat absent: ${absentCount}x`;
      }

      roster.push({
        employee_id: emp.employee_id,
        employee_name: `${emp.first_name} ${emp.last_name}`,
        role: role as 'dokter' | 'perawat',
        department: dept,
        date,
        shift,
        start_time: startTime,
        end_time: endTime,
        is_leave: false,
        has_alert: hasAlert,
        alert_message: alertMessage || undefined,
      });
    }
  }

  return roster;
}
