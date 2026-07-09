'use client';

import { useMemo } from 'react';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { KPICard } from '@/components/common/KPICard';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import { TrendingUp, Users, AlertTriangle, Calendar } from 'lucide-react';
import { generateForecast, estimateRequiredStaff } from '@/lib/forecast-simulation';
import { formatDateShort } from '@/lib/formatters';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';

export default function ClinicalLoadForecastPage() {
  const { state } = useSIMRSDatasetStore();

  const forecast = useMemo(() => generateForecast({
    registrations: state.activeRegistration,
    appointments: state.activeAppointments,
    queues: state.activeQueueNumbers,
    medicalRecords: state.activeMedicalRecords,
    followUps: state.activeFollowUpAppointments,
    days: 14,
  }), [state.activeRegistration, state.activeAppointments, state.activeQueueNumbers, state.activeMedicalRecords, state.activeFollowUpAppointments]);

  const chartData = forecast.map((f) => ({
    date: formatDateShort(f.date),
    'Prediksi Pasien': f.predicted_patients,
    'Emergency': f.predicted_emergency,
    'Appointment': f.predicted_appointments,
    'Follow Up': f.predicted_follow_ups,
    confidence: Math.round(f.confidence * 100),
  }));

  const avgPredicted = forecast.length > 0
    ? Math.round(forecast.reduce((s, f) => s + f.predicted_patients, 0) / forecast.length)
    : 0;
  const maxDay = forecast.reduce((max, f) => f.predicted_patients > max.predicted_patients ? f : max, forecast[0]);
  const staffNeeded = estimateRequiredStaff(avgPredicted);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Clinical Load Forecast"
        subtitle="Prediksi 14 hari ke depan menggunakan moving average + faktor emergency, appointment, dan follow-up"
        simulationLabel="Simulation Mode"
      />

      <div className="kpi-grid">
        <KPICard title="Rata-rata Prediksi/Hari" value={avgPredicted} icon={TrendingUp} color="blue" />
        <KPICard title="Hari Puncak" value={maxDay ? formatDateShort(maxDay.date) : '-'} subtitle={`${maxDay?.predicted_patients || 0} pasien`} icon={Calendar} color="rose" />
        <KPICard title="Dokter Dibutuhkan" value={staffNeeded.doctors} icon={Users} color="green" subtitle="(rasio 1:10)" />
        <KPICard title="Perawat Dibutuhkan" value={staffNeeded.nurses} icon={Users} color="cyan" subtitle="(rasio 1:6)" />
      </div>

      <ResponsiveChartCard title="Prediksi Pasien 14 Hari" subtitle="Moving average + emergency/appointment/follow-up factors" height={320}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrediksi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ae500" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2ae500" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area type="monotone" dataKey="Prediksi Pasien" stroke="#2ae500" strokeWidth={3} fillOpacity={1} fill="url(#colorPrediksi)" activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="Emergency" stroke="#e57373" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            <Area type="monotone" dataKey="Follow Up" stroke="#106e00" strokeWidth={2} strokeDasharray="5 5" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      <ResponsiveChartCard title="Confidence Level per Hari" subtitle="Semakin jauh prediksi, semakin rendah confidence">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="confidence" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.confidence > 65 ? '#106e00' : entry.confidence > 50 ? '#ffb300' : '#e57373'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      {/* Forecast Table */}
      <div className="clay-card-sm overflow-hidden">
        <div className="p-4 border-b border-surface-container-high">
          <h3 className="text-sm font-semibold text-on-surface">Detail Prediksi</h3>
        </div>
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container border-b border-surface-container-high">
                <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Tanggal</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Prediksi</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Emergency</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Follow Up</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Confidence</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Dokter</th>
                <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">Perawat</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((f) => {
                const staff = estimateRequiredStaff(f.predicted_patients);
                return (
                  <tr key={f.date} className="border-b border-surface-container hover:bg-surface-container/50">
                    <td className="p-3 text-xs font-medium">{formatDateShort(f.date)}</td>
                    <td className="p-3 text-right text-xs font-semibold">{f.predicted_patients}</td>
                    <td className="p-3 text-right text-xs text-[#c62828]">{f.predicted_emergency}</td>
                    <td className="p-3 text-right text-xs text-[#106e00]">{f.predicted_follow_ups}</td>
                    <td className="p-3 text-right text-xs">{Math.round(f.confidence * 100)}%</td>
                    <td className="p-3 text-right text-xs">{staff.doctors}</td>
                    <td className="p-3 text-right text-xs">{staff.nurses}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
