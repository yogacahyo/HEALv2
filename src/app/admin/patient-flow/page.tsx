'use client';

import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import { Activity, Users, UserCheck, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatDateShort } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

export default function PatientFlowPage() {
  const { state } = useSIMRSDatasetStore();

  const todayRegs = state.activeRegistration.filter((r) => r.status === 'Active');
  const emergencyRegs = state.activeRegistration.filter((r) => r.registration_type === 'Gawat Darurat');
  const waitingVisits = state.activeOutpatientVisits.filter((v) => v.status === 'Waiting');
  const completedVisits = state.activeOutpatientVisits.filter((v) => v.status === 'Completed');

  // Department distribution
  const deptDistribution = state.activeDepartments
    .filter((d) => d.department_name.includes('Poli') || d.department_name === 'IGD')
    .map((dept) => ({
      name: dept.department_name.replace('Poli ', ''),
      registrasi: state.activeRegistration.filter((r) => r.department === dept.department_name).length,
      kunjungan: state.activeOutpatientVisits.filter((v) => v.department_id === dept.department_id).length,
    }));

  // Visit type breakdown
  const visitTypeData = ['First Visit', 'Follow Up', 'Emergency', 'Routine Checkup'].map((type) => ({
    name: type,
    value: state.activeOutpatientVisits.filter((v) => v.visit_type === type).length,
  }));

  // Registration table
  const recentRegs = [...state.activeRegistration].sort((a, b) =>
    b.registration_date.localeCompare(a.registration_date)
  ).slice(0, 15);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Patient Flow Analytics"
        subtitle="Aliran pasien dari registrasi ke kunjungan — data dari tabel registration, outpatient_visits, queue_numbers"
        simulationLabel="Active Dataset"
      />

      <div className="kpi-grid">
        <KPICard title="Registrasi Aktif" value={todayRegs.length} icon={Users} color="green" />
        <KPICard title="Gawat Darurat" value={emergencyRegs.length} icon={AlertTriangle} color="rose" />
        <KPICard title="Menunggu Pelayanan" value={waitingVisits.length} icon={Clock} color="amber" />
        <KPICard title="Kunjungan Selesai" value={completedVisits.length} icon={UserCheck} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponsiveChartCard title="Distribusi per Departemen" subtitle="Registrasi & kunjungan per poli">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptDistribution} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#ebefed" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)' }} cursor={{ fill: '#f6faf8' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="registrasi" fill="#106e00" radius={[0, 4, 4, 0]} name="Registrasi" />
              <Bar dataKey="kunjungan" fill="#2ae500" radius={[0, 4, 4, 0]} name="Kunjungan" />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>

        <ResponsiveChartCard title="Tipe Kunjungan" subtitle="Breakdown per visit type">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={visitTypeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39ff14" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#39ff14" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)' }} cursor={{ fill: '#f6faf8' }} />
              <Bar dataKey="value" fill="url(#colorVisit)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>
      </div>

      {/* Registration Table */}
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Registrasi Terbaru</h3>
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">No. Registrasi</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Tipe</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Departemen</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Tanggal</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRegs.map((reg) => (
                  <tr key={reg.registration_id} className="border-b border-surface-container hover:bg-surface-container/50">
                    <td className="p-3 font-mono text-xs">{reg.registration_number}</td>
                    <td className="p-3"><StatusBadge status={reg.registration_type} /></td>
                    <td className="p-3 text-xs text-on-surface-variant">{reg.department || '-'}</td>
                    <td className="p-3 text-xs text-on-surface-variant">{formatDateShort(reg.registration_date.split(' ')[0])}</td>
                    <td className="p-3"><StatusBadge status={reg.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="clay-card-sm p-4 bg-[#fff8e1]/50 border border-[#ffe082]">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-[#ffb300] mt-0.5 shrink-0" />
          <p className="text-xs text-[#f57f17]">
            <strong>Kepatuhan Privasi:</strong> Nama, alamat, telepon, email, dan emergency contact pasien tidak ditampilkan pada dashboard AI Shifting. 
            Data pasien hanya ditampilkan secara agregat menggunakan secure ID.
          </p>
        </div>
      </div>
    </div>
  );
}
