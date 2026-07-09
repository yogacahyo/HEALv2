'use client';

import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { Users, Stethoscope, HeartPulse, UserCheck, UserX, Clock } from 'lucide-react';
import { getDoctors, getNurses, getMedicalStaff, getEmployeeRole } from '@/lib/simrs-calculations';
import { getToday, formatTime, getAttendanceStatusLabel } from '@/lib/formatters';

export default function SIMRSWorkforcePage() {
  const { state } = useSIMRSDatasetStore();
  const today = getToday();

  const doctors = getDoctors(state.activeEmployees, state.activePositions);
  const nurses = getNurses(state.activeEmployees, state.activePositions);
  const medicalStaff = getMedicalStaff(state.activeEmployees, state.activePositions);
  const todayAttendance = state.activeAttendance.filter((a) => a.date === today);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Data Tenaga Medis SIMRS"
        subtitle="Data dari tabel employees, positions, departments, attendance"
        simulationLabel="Active Dataset"
      />

      <div className="kpi-grid">
        <KPICard title="Total Pegawai" value={state.activeEmployees.length} icon={Users} color="slate" />
        <KPICard title="Dokter" value={doctors.length} icon={Stethoscope} color="blue" />
        <KPICard title="Perawat" value={nurses.length} icon={HeartPulse} color="green" />
        <KPICard title="Hadir Hari Ini" value={todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length} icon={UserCheck} color="green" />
      </div>

      {/* Employee Table */}
      <div className="clay-card-sm overflow-hidden">
        <div className="p-4 border-b border-surface-container-high">
          <h3 className="text-sm font-semibold text-on-surface">Daftar Tenaga Medis</h3>
        </div>
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-surface-container-high">
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">NIP</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Nama</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Role</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Posisi</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Departemen</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Status</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Absensi Hari Ini</th>
              </tr>
            </thead>
            <tbody>
              {state.activeEmployees.map((emp) => {
                const pos = state.activePositions.find((p) => p.position_id === emp.position_id);
                const dept = pos ? state.activeDepartments.find((d) => d.department_id === pos.department_id) : null;
                const role = pos ? getEmployeeRole(pos) : 'lainnya';
                const att = todayAttendance.find((a) => a.employee_id === emp.employee_id);
                return (
                  <tr key={emp.employee_id} className="border-b border-surface-container hover:bg-surface-container/50">
                    <td className="p-3 font-mono text-xs">{emp.employee_number}</td>
                    <td className="p-3 text-xs font-medium text-on-surface">{emp.first_name} {emp.last_name}</td>
                    <td className="p-3"><StatusBadge status={role} /></td>
                    <td className="p-3 text-xs text-on-surface-variant">{pos?.position_name || '-'}</td>
                    <td className="p-3 text-xs text-on-surface-variant">{dept?.department_name || '-'}</td>
                    <td className="p-3"><StatusBadge status={emp.status} /></td>
                    <td className="p-3 text-xs">
                      {att ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={getAttendanceStatusLabel(att.status)} />
                          <span className="text-outline">{formatTime(att.check_in)} - {formatTime(att.check_out)}</span>
                        </div>
                      ) : (
                        <span className="text-outline">Belum absen</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Requests */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Pengajuan Cuti Aktif</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.activeLeaveRequests.map((lr) => {
            const emp = state.activeEmployees.find((e) => e.employee_id === lr.employee_id);
            return (
              <div key={lr.request_id} className="clay-card-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-on-surface">{emp?.first_name} {emp?.last_name}</span>
                  <StatusBadge status={lr.status} />
                </div>
                <p className="text-xs text-on-surface-variant">{lr.start_date} — {lr.end_date}</p>
                <p className="text-xs text-outline mt-1">{lr.reason}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
