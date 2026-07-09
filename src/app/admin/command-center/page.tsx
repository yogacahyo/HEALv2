'use client';

import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { KPICard } from '@/components/common/KPICard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import {
  Users, UserCheck, UserX, Bed, Activity, AlertTriangle, Clock, Stethoscope,
  ClipboardList, BarChart3, Shield, Database, ArrowLeftRight,
  TrendingUp, HeartPulse,
} from 'lucide-react';
import {
  calculateBOR, calculateCapacityUtilization, calculatePatientToStaffRatio,
  generateSmartActions, getDoctors, getNurses, getMedicalStaff,
} from '@/lib/simrs-calculations';
import { formatPercentage, getToday } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar, Legend, CartesianGrid } from 'recharts';

const CHART_COLORS = ['#106e00', '#2ae500', '#39ff14', '#81c784', '#6b7c63', '#baccb0'];

export default function CommandCenterPage() {
  const { state } = useSIMRSDatasetStore();
  const today = getToday();

  // KPI Calculations from active dataset
  const todayRegs = state.activeRegistration.filter((r) => r.registration_date.startsWith(today));
  const activeRegs = state.activeRegistration.filter((r) => r.status === 'Active');
  const todayAppts = state.activeAppointments.filter((a) => a.appointment_date === today);
  const activeQueues = state.activeQueueNumbers.filter((q) => q.status === 'Waiting' || q.status === 'Called');
  const emergencyQueues = state.activeQueueNumbers.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting');
  const bor = calculateBOR(state.activeRooms);
  const doctors = getDoctors(state.activeEmployees, state.activePositions);
  const nurses = getNurses(state.activeEmployees, state.activePositions);
  const medicalStaff = getMedicalStaff(state.activeEmployees, state.activePositions);
  const todayAttendance = state.activeAttendance.filter((a) => a.date === today);
  const presentStaff = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late');
  const absentStaff = state.activeEmployees.length - presentStaff.length;
  const avgUtilization = state.activeDoctorQueueQuotas.length > 0
    ? state.activeDoctorQueueQuotas.reduce((sum, q) => sum + calculateCapacityUtilization(q), 0) / state.activeDoctorQueueQuotas.length
    : 0;
  const patientDoctorRatio = calculatePatientToStaffRatio(todayRegs.length, doctors.filter((d) => d.status === 'Active').length);

  // Smart Actions
  const smartActions = generateSmartActions({
    queues: state.activeQueueNumbers,
    quotas: state.activeDoctorQueueQuotas,
    rooms: state.activeRooms,
    attendance: state.activeAttendance,
    registrations: state.activeRegistration,
    params: state.simulationParameters,
  });

  // Chart data
  const regTypeData = ['Rawat Jalan', 'Rawat Inap', 'Gawat Darurat', 'Penunjang'].map((type, index) => ({
    name: type,
    value: state.activeRegistration.filter((r) => r.registration_type === type).length,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const queueStatusData = ['Waiting', 'Called', 'Served', 'Cancelled'].map((status) => ({
    name: status,
    value: state.activeQueueNumbers.filter((q) => q.status === status).length,
  }));

  const tooltipStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)',
    fontFamily: 'Plus Jakarta Sans',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Command Center"
          subtitle="Dashboard operasional berbasis database SIMRS aktif"
          simulationLabel="Simulation Mode"
        />
        <div className="flex items-center gap-2">
          <span className="clay-badge bg-[#e8f5e9] text-[#106e00] border border-[#a5d6a7] text-xs">
            <Database className="w-3 h-3" />
            {state.datasetSource === 'dummy' ? 'Dummy Dataset Loaded' : 'Uploaded SQL Dataset Active'}
          </span>
        </div>
      </div>

      {/* Data Integration Status */}
      <div className="clay-card-sm p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#106e00] font-medium">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse-soft" />
            Data Source: {state.datasetSource === 'dummy' ? 'Dummy SIMRS Dataset' : 'Uploaded Dataset'}
          </div>
          <div className="text-outline-variant">|</div>
          <div className="text-on-surface-variant">Tabel Aktif: {state.activePatients.length > 0 ? '30+' : '0'}</div>
          <div className="text-outline-variant">|</div>
          <div className="text-on-surface-variant" suppressHydrationWarning>Update: {state.lastUpdated ? new Date(state.lastUpdated).toLocaleString('id-ID') : '-'}</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard title="Total Pasien Hari Ini" value={todayRegs.length} icon={Users} color="green" />
        <KPICard title="Registrasi Aktif" value={activeRegs.length} icon={ClipboardList} color="blue" />
        <KPICard title="Appointment Hari Ini" value={todayAppts.length} icon={Clock} color="cyan" />
        <KPICard title="Antrean Aktif" value={activeQueues.length} icon={Users} color="amber" />
        <KPICard title="Emergency Queue" value={emergencyQueues.length} icon={AlertTriangle} color="rose" />
        <KPICard title="BOR Simulation" value={formatPercentage(bor)} icon={Bed} color={bor > 0.85 ? 'rose' : 'green'} />
        <KPICard title="Dokter Aktif" value={doctors.filter((d) => d.status === 'Active').length} icon={Stethoscope} color="blue" />
        <KPICard title="Perawat Aktif" value={nurses.filter((n) => n.status === 'Active').length} icon={HeartPulse} color="green" />
        <KPICard title="Tenaga Medis Aktif" value={medicalStaff.filter((m) => m.status === 'Active').length} icon={UserCheck} color="green" />
        <KPICard title="Pegawai Hadir" value={presentStaff.length} icon={UserCheck} color="green" />
        <KPICard title="Pegawai Absent" value={absentStaff} icon={UserX} color={absentStaff > 3 ? 'rose' : 'slate'} />
        <KPICard title="Doctor Utilization" value={formatPercentage(avgUtilization)} icon={BarChart3} color={avgUtilization > 0.85 ? 'rose' : 'blue'} />
        <KPICard title="Patient:Doctor Ratio" value={`${patientDoctorRatio}:1`} icon={Activity} color="indigo" />
        <KPICard title="Burnout Risk (Sim.)" value={`${state.burnoutAssessments.filter((b) => b.burnout_category === 'Tinggi').length} tinggi`} icon={AlertTriangle} color="amber" />
        <KPICard title="Shift Swap Aktif" value={state.shiftSwapRequests.filter((s) => s.status === 'Menunggu Persetujuan').length} icon={ArrowLeftRight} color="blue" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ResponsiveChartCard title="Distribusi Tipe Registrasi" subtitle="Generated from active SIMRS dataset">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" barSize={12} data={regTypeData} startAngle={90} endAngle={-270}>
              <RadialBar
                background={{ fill: '#ebefed' }}
                dataKey="value"
                cornerRadius={99}
              />
              <Legend iconType="circle" iconSize={10} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', color: '#6b7c63', paddingTop: '10px' }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={tooltipStyle} className="bg-white p-3">
                        <p className="text-[#181c1c] font-bold text-[13px] mb-1">{payload[0].payload.name}</p>
                        <p className="text-[#3c4b35] text-[12px] font-medium">Jumlah: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }} 
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>

        <ResponsiveChartCard title="Status Antrean" subtitle="Generated from active SIMRS dataset">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={queueStatusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorQueue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39ff14" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#106e00" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f6faf8' }} />
              <Bar dataKey="value" fill="url(#colorQueue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>
      </div>

      {/* Smart Action Center */}
      <div>
        <SectionHeader title="Smart Action Center" simulationLabel="Rule-based Simulation" subtitle="Tindakan prioritas berdasarkan analisis database SIMRS" />
        {smartActions.length === 0 ? (
          <div className="clay-card-sm p-6 text-center">
            <div className="clay-icon-tray bg-[#e8f5e9] mx-auto mb-2">
              <Shield className="w-5 h-5 text-[#2ae500]" />
            </div>
            <p className="text-sm text-on-surface-variant">Tidak ada tindakan prioritas tinggi. Dataset SIMRS saat ini berada dalam batas simulasi aman.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {smartActions.map((action) => (
              <div key={action.id} className={`clay-card-sm p-4 border-l-4 ${
                action.severity === 'high' ? 'border-l-[#e57373]' : action.severity === 'medium' ? 'border-l-[#ffb74d]' : 'border-l-[#81c784]'
              }`}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-on-surface">{action.title}</h4>
                  <StatusBadge status={action.severity === 'high' ? 'Tinggi' : action.severity === 'medium' ? 'Sedang' : 'Rendah'} />
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant">{action.description}</p>
                <p className="text-[10px] text-outline mt-1">Sumber: {action.source}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Status */}
      <div>
        <SectionHeader title="Status Kamar" subtitle="Data dari tabel rooms" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {state.activeRooms.map((room) => (
            <div key={room.room_id} className="clay-card-sm p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-on-surface">{room.room_number}</span>
                <StatusBadge status={room.status} />
              </div>
              <p className="text-xs text-on-surface-variant">{room.room_type} • Lt. {room.floor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer notice */}
      <p className="text-xs text-outline text-center py-4">
        Data yang ditampilkan merupakan dataset dummy/simulasi berdasarkan struktur database SIMRS. 
        Implementasi produksi membutuhkan validasi keamanan, audit akses, dan kepatuhan kebijakan rumah sakit.
      </p>
    </div>
  );
}
