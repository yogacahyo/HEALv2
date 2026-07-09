'use client';

import { useMemo, useState } from 'react';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { CalendarClock, Users, AlertTriangle, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateMonthlyRoster } from '@/lib/roster-simulation';
import { getMonthName } from '@/lib/formatters';

export default function AutoRosteringPage() {
  const { state } = useSIMRSDatasetStore();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const roster = useMemo(() => generateMonthlyRoster({
    employees: state.activeEmployees,
    positions: state.activePositions,
    schedules: state.activeDoctorSchedules,
    attendance: state.activeAttendance,
    leaveRequests: state.activeLeaveRequests,
    quotas: state.activeDoctorQueueQuotas,
    shiftSwapRequests: state.shiftSwapRequests,
    year,
    month,
  }), [state.activeEmployees, state.activePositions, state.activeDoctorSchedules, state.activeAttendance, state.activeLeaveRequests, state.activeDoctorQueueQuotas, state.shiftSwapRequests, year, month]);

  const uniqueEmployees = [...new Set(roster.map((r) => r.employee_id))];
  const alertEntries = roster.filter((r) => r.has_alert);
  const leaveEntries = roster.filter((r) => r.is_leave);
  const nightEntries = roster.filter((r) => r.shift === 'Malam');

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Group by employee
  const employeeRoster = uniqueEmployees.map((empId) => {
    const entries = roster.filter((r) => r.employee_id === empId);
    const first = entries[0];
    return { empId, name: first?.employee_name || '', role: first?.role || 'perawat', department: first?.department || '', entries };
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Auto Rostering Simulation"
        subtitle="Simulasi jadwal otomatis dengan constraint: maks 2 malam beruntun, cuti, shift swap, attendance history"
        simulationLabel="Simulation Mode"
      />

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="clay-btn p-2 hover:bg-surface-container">
          <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
        </button>
        <h3 className="text-lg font-bold text-on-surface">{getMonthName(month)} {year}</h3>
        <button onClick={nextMonth} className="clay-btn p-2 hover:bg-surface-container">
          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
        </button>
      </div>

      <div className="kpi-grid">
        <KPICard title="Tenaga Medis Terjadwal" value={uniqueEmployees.length} icon={Users} color="green" />
        <KPICard title="Total Jadwal" value={roster.length} icon={CalendarClock} color="blue" />
        <KPICard title="Alert/Warning" value={alertEntries.length} icon={AlertTriangle} color="rose" />
        <KPICard title="Shift Malam" value={nightEntries.length} icon={Moon} color="indigo" />
      </div>

      {/* Roster per Employee */}
      <div className="space-y-4">
        {employeeRoster.map(({ empId, name, role, department, entries }) => (
          <div key={empId} className="clay-card-sm overflow-hidden">
            <div className="p-3 border-b border-surface-container-high flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-on-surface">{name}</span>
                <StatusBadge status={role} />
              </div>
              <span className="text-xs text-outline">{department}</span>
            </div>
            <div className="table-responsive">
              <div className="flex gap-0.5 p-2 min-w-[600px]">
                {entries.slice(0, 31).map((entry, i) => {
                  const day = parseInt(entry.date.split('-')[2], 10);
                  const bgColor = entry.is_leave
                    ? 'bg-slate-200'
                    : entry.shift === 'Pagi'
                    ? 'bg-amber-100'
                    : entry.shift === 'Sore'
                    ? 'bg-orange-100'
                    : 'bg-[#c5cae9]';
                  return (
                    <div
                      key={i}
                      className={`flex-shrink-0 w-8 h-10 ${bgColor} rounded-lg flex flex-col items-center justify-center text-[9px] relative ${
                        entry.has_alert ? 'ring-2 ring-rose-300' : ''
                      }`}
                      title={`${entry.date}: ${entry.is_leave ? 'Cuti' : entry.shift} ${entry.start_time}-${entry.end_time}${entry.alert_message ? ` (Alert: ${entry.alert_message})` : ''}`}
                    >
                      <span className="font-bold text-on-surface">{day}</span>
                      <span className="text-[8px] text-on-surface-variant">{entry.is_leave ? 'C' : entry.shift[0]}</span>
                      {entry.has_alert && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="clay-card-sm p-4">
        <h4 className="text-xs font-semibold text-on-surface-variant mb-2">Legenda</h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-amber-100" /><span>Pagi (P)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-orange-100" /><span>Sore (S)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-[#c5cae9]" /><span>Malam (M)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-slate-200" /><span>Cuti (C)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400" /><span>Alert</span></div>
        </div>
      </div>
    </div>
  );
}
