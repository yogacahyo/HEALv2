'use client';

import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import { Calendar, Clock, Users, Stethoscope } from 'lucide-react';
import { getDayName } from '@/lib/simrs-calculations';
import { formatTime, getToday } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SIMRSSchedulePage() {
  const { state } = useSIMRSDatasetStore();
  const today = getToday();

  const activeSchedules = state.activeDoctorSchedules.filter((s) => s.is_active);
  const todayQuotas = state.activeDoctorQueueQuotas.filter((q) => q.date === today);
  const waitingQueues = state.activeQueueNumbers.filter((q) => q.status === 'Waiting');

  // Schedule by day chart
  const scheduleByDay = Array.from({ length: 7 }, (_, i) => ({
    name: getDayName(i),
    jadwal: activeSchedules.filter((s) => s.day_of_week === i).length,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Jadwal & Antrean SIMRS"
        subtitle="Data dari tabel doctor_schedules, doctor_queue_quotas, queue_numbers"
        simulationLabel="Active Dataset"
      />

      <div className="kpi-grid">
        <KPICard title="Jadwal Aktif" value={activeSchedules.length} icon={Calendar} color="blue" />
        <KPICard title="Kuota Hari Ini" value={todayQuotas.length} icon={Users} color="green" />
        <KPICard title="Antrean Menunggu" value={waitingQueues.length} icon={Clock} color="amber" />
      </div>

      <ResponsiveChartCard title="Distribusi Jadwal per Hari" subtitle="Jumlah jadwal praktik dokter per hari">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scheduleByDay} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSchedule" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="jadwal" fill="url(#colorSchedule)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      {/* Doctor Schedules Table */}
      <div className="clay-card-sm overflow-hidden">
        <div className="p-4 border-b border-surface-container-high">
          <h3 className="text-sm font-semibold text-on-surface">Jadwal Praktik Dokter</h3>
        </div>
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-surface-container-high">
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Dokter (employee_id)</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Hari</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Jam</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Max Pasien</th>
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {activeSchedules.map((sched) => {
                const emp = state.activeEmployees.find((e) => e.employee_id === sched.doctor_id);
                return (
                  <tr key={sched.schedule_id} className="border-b border-surface-container hover:bg-surface-container/50">
                    <td className="p-3 text-xs text-on-surface">{emp ? `${emp.first_name} ${emp.last_name}` : `ID: ${sched.doctor_id}`}</td>
                    <td className="p-3 text-xs">{getDayName(sched.day_of_week)}</td>
                    <td className="p-3 text-xs font-mono">{formatTime(sched.start_time)} - {formatTime(sched.end_time)}</td>
                    <td className="p-3 text-xs">{sched.max_patients}</td>
                    <td className="p-3"><StatusBadge status={sched.is_active ? 'Active' : 'Inactive'} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Queue Quotas */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Kuota Dokter Hari Ini</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {todayQuotas.map((quota) => {
            const emp = state.activeEmployees.find((e) => e.employee_id === quota.doctor_id);
            const pct = quota.max_patients > 0 ? (quota.current_patients / quota.max_patients) * 100 : 0;
            return (
              <div key={quota.quota_id} className="clay-card-sm p-4">
                <p className="text-sm font-semibold text-on-surface mb-2">{emp ? `${emp.first_name} ${emp.last_name}` : `ID: ${quota.doctor_id}`}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-2xl font-bold text-on-surface">{quota.current_patients}</span>
                  <span className="text-sm text-outline">/ {quota.max_patients}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct > 85 ? 'bg-rose-400' : pct > 60 ? 'bg-amber-400' : 'bg-neon'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-outline mt-1">{Math.round(pct)}% terisi</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Queue Monitor */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Monitor Antrean</h3>
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">No. Antrean</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Tipe</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Prioritas</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Status</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {state.activeQueueNumbers.map((q) => {
                  const qType = state.activeQueueTypes.find((t) => t.type_id === q.type_id);
                  return (
                    <tr key={q.queue_id} className="border-b border-surface-container hover:bg-surface-container/50">
                      <td className="p-3 font-mono text-xs font-semibold">{q.queue_number}</td>
                      <td className="p-3 text-xs">{qType?.type_name || '-'}</td>
                      <td className="p-3"><StatusBadge status={q.priority} /></td>
                      <td className="p-3"><StatusBadge status={q.status} /></td>
                      <td className="p-3 text-xs text-outline">{q.created_at.split(' ')[1] || q.created_at}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
