'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import {
  BarChart3, AlertTriangle, Users, Stethoscope, HeartPulse,
  Activity, Home, TrendingUp, Bed, Shield,
} from 'lucide-react';
import { generateRecommendations } from '@/lib/recommendation-engine';
import { calculateBOR, getDoctors, getNurses, getBurnoutCategory, getBurnoutRecommendation } from '@/lib/simrs-calculations';
import { generateForecast, estimateRequiredStaff } from '@/lib/forecast-simulation';
import { formatPercentage, formatDateShort } from '@/lib/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DirekturPage() {
  const { state } = useSIMRSDatasetStore();

  const bor = calculateBOR(state.activeRooms);
  const doctors = getDoctors(state.activeEmployees, state.activePositions);
  const nurses = getNurses(state.activeEmployees, state.activePositions);

  const recommendations = useMemo(() => generateRecommendations({
    registrations: state.activeRegistration,
    queues: state.activeQueueNumbers,
    quotas: state.activeDoctorQueueQuotas,
    employees: state.activeEmployees,
    positions: state.activePositions,
    departments: state.activeDepartments,
    attendance: state.activeAttendance,
    rooms: state.activeRooms,
  }), [state]);

  const forecast = useMemo(() => generateForecast({
    registrations: state.activeRegistration,
    appointments: state.activeAppointments,
    queues: state.activeQueueNumbers,
    medicalRecords: state.activeMedicalRecords,
    followUps: state.activeFollowUpAppointments,
    days: 7,
  }), [state]);

  const highPriority = recommendations.filter((r) => r.priority === 'High');
  const avgForecast = forecast.length > 0 ? Math.round(forecast.reduce((s, f) => s + f.predicted_patients, 0) / forecast.length) : 0;
  const staffNeeded = estimateRequiredStaff(avgForecast);
  const highBurnout = state.burnoutAssessments.filter((b) => b.burnout_category === 'Tinggi').length;

  const forecastChart = forecast.map((f) => ({
    date: f.date.slice(5),
    pasien: f.predicted_patients,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#106e00] to-[#095300] text-white px-4 sm:px-8 py-6"
        style={{ boxShadow: '0 4px 16px rgba(16,110,0,0.3), inset 0 1px 0 rgba(57,255,20,0.15)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Dashboard Direktur</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-[#39ff14] text-[#107100] px-2 py-0.5 rounded-full">Ringkasan eksekutif</span>
              <p className="text-xs sm:text-sm opacity-80">Hermina Employee Allocation Logic</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="kpi-grid">
          <KPICard title="BOR Simulation" value={formatPercentage(bor)} icon={Bed} color={bor > 0.85 ? 'rose' : 'green'} />
          <KPICard title="Dept. Risiko Tinggi" value={highPriority.length} icon={AlertTriangle} color="rose" />
          <KPICard title="Dokter Aktif" value={doctors.filter((d) => d.status === 'Active').length} icon={Stethoscope} color="blue" />
          <KPICard title="Perawat Aktif" value={nurses.filter((n) => n.status === 'Active').length} icon={HeartPulse} color="green" />
          <KPICard title="Prediksi Rata-rata" value={`${avgForecast} pasien/hari`} icon={TrendingUp} color="blue" />
          <KPICard title="Burnout Tinggi" value={highBurnout} icon={AlertTriangle} color={highBurnout > 0 ? 'rose' : 'green'} />
          <KPICard title="Registrasi Aktif" value={state.activeRegistration.filter((r) => r.status === 'Active').length} icon={Users} color="cyan" />
          <KPICard title="Shift Swap Pending" value={state.shiftSwapRequests.filter((s) => s.status === 'Menunggu Persetujuan').length} icon={Activity} color="amber" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResponsiveChartCard title="Prediksi Pasien 7 Hari" subtitle="Forecast simulation" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)', fontFamily: 'Plus Jakarta Sans' }}
                />
                <Area type="monotone" dataKey="pasien" stroke="#106e00" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" activeDot={{ r: 6, strokeWidth: 0, fill: '#39ff14' }} />
              </AreaChart>
            </ResponsiveContainer>
          </ResponsiveChartCard>

          <div className="clay-card-sm p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-on-surface tracking-tight">Rekomendasi Strategis</h3>
              <p className="text-xs text-outline mt-0.5">Suggested clinical optimizations</p>
            </div>
            <div className="space-y-2">
              {recommendations.slice(0, 5).map((rec) => (
                <div key={rec.department} className={`p-3 rounded-xl border-l-4 ${
                  rec.priority === 'High' ? 'bg-[#fce8e8] border-l-[#e57373]' : rec.priority === 'Medium' ? 'bg-[#fff8e1] border-l-[#ffb74d]' : 'bg-[#e8f5e9] border-l-[#81c784]'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">{rec.department}</span>
                    <StatusBadge status={rec.priority} />
                  </div>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant">{rec.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="clay-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="clay-icon-tray bg-[#e8eaf6]">
              <Shield className="w-5 h-5 text-[#5c6bc0]" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Status Risiko Keseluruhan</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl text-center ${bor > 0.85 ? 'bg-[#fce8e8]' : 'bg-[#e8f5e9]'}`}
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">{formatPercentage(bor)}</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">BOR Simulation</p>
            </div>
            <div className={`p-4 rounded-2xl text-center ${highPriority.length > 0 ? 'bg-[#fce8e8]' : 'bg-[#e8f5e9]'}`}
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">{highPriority.length}</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">Departemen Risiko Tinggi</p>
            </div>
            <div className={`p-4 rounded-2xl text-center ${highBurnout > 0 ? 'bg-[#fff8e1]' : 'bg-[#e8f5e9]'}`}
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">{highBurnout}</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">Tenaga Medis Burnout Tinggi</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-outline text-center py-4">
          Dashboard eksekutif — seluruh data berasal dari active SIMRS dataset simulation.
        </p>
      </main>
    </div>
  );
}
