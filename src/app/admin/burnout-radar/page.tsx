'use client';

import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import { AlertTriangle, Users, Shield, TrendingUp } from 'lucide-react';
import {
  calculateBurnoutRiskScore, getBurnoutCategory, getBurnoutRecommendation,
  getDoctors, getNurses, calculateCapacityUtilization, isNightSchedule,
} from '@/lib/simrs-calculations';
import { getToday, formatPercentageValue } from '@/lib/formatters';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';

export default function BurnoutRadarPage() {
  const { state } = useSIMRSDatasetStore();
  const today = getToday();
  const params = state.simulationParameters;

  // Calculate burnout risk for each medical staff
  const doctors = getDoctors(state.activeEmployees, state.activePositions);
  const nurses = getNurses(state.activeEmployees, state.activePositions);
  const medicalStaff = [...doctors, ...nurses];

  const burnoutData = medicalStaff.map((emp) => {
    const quota = state.activeDoctorQueueQuotas.find((q) => q.doctor_id === emp.employee_id);
    const capacityPressure = quota ? calculateCapacityUtilization(quota) : 0;
    const attendanceRecords = state.activeAttendance.filter((a) => a.employee_id === emp.employee_id);
    const lateCount = attendanceRecords.filter((a) => a.status === 'Late').length;
    const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;
    const schedule = state.activeDoctorSchedules.find((s) => s.doctor_id === emp.employee_id);
    const nightFlag = schedule ? isNightSchedule(schedule.start_time, schedule.end_time, params) : false;
    const emergencyQueues = state.activeQueueNumbers.filter((q) => q.priority === 'Emergency' && q.status === 'Waiting').length;
    const emergencyPressure = Math.min(emergencyQueues / params.highEmergencyQueueThreshold, 1);
    const highPatientLoad = quota ? quota.current_patients > params.highPatientLoadThreshold * 0.5 : false;

    const score = calculateBurnoutRiskScore({
      capacityPressure,
      lateFlag: lateCount >= params.lateAlertThreshold,
      absentFlag: absentCount >= params.absentAlertThreshold,
      emergencyPressure,
      nightScheduleFlag: nightFlag,
      highPatientLoadFlag: highPatientLoad,
    });

    const category = getBurnoutCategory(score, params);
    return {
      employee_id: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      score,
      category,
      recommendation: getBurnoutRecommendation(category),
      capacityPressure: Math.round(capacityPressure * 100),
      lateCount,
      absentCount,
      nightFlag,
      emergencyPressure: Math.round(emergencyPressure * 100),
    };
  });

  const highRisk = burnoutData.filter((d) => d.category === 'Tinggi');
  const mediumRisk = burnoutData.filter((d) => d.category === 'Sedang');
  const lowRisk = burnoutData.filter((d) => d.category === 'Rendah');

  // Radar chart data for first high-risk person or first person
  const radarTarget = highRisk[0] || mediumRisk[0] || burnoutData[0];
  const radarData = radarTarget
    ? [
        { subject: 'Kapasitas', value: radarTarget.capacityPressure },
        { subject: 'Terlambat', value: radarTarget.lateCount * 20 },
        { subject: 'Absent', value: radarTarget.absentCount * 25 },
        { subject: 'Emergency', value: radarTarget.emergencyPressure },
        { subject: 'Malam', value: radarTarget.nightFlag ? 80 : 10 },
      ]
    : [];

  // Bar chart
  const barData = burnoutData.map((d) => ({
    name: d.name.split(' ')[0],
    score: d.score,
    fill: d.category === 'Tinggi' ? '#e57373' : d.category === 'Sedang' ? '#ffb300' : '#106e00',
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Burnout Radar"
        subtitle="Skor burnout dihitung dari: capacityPressure, lateFlag, absentFlag, emergencyPressure, nightScheduleFlag, highPatientLoadFlag"
        simulationLabel="Simulation Mode"
      />

      <div className="kpi-grid">
        <KPICard title="Risiko Tinggi" value={highRisk.length} icon={AlertTriangle} color="rose" />
        <KPICard title="Risiko Sedang" value={mediumRisk.length} icon={AlertTriangle} color="amber" />
        <KPICard title="Risiko Rendah" value={lowRisk.length} icon={Shield} color="green" />
        <KPICard title="Total Tenaga Medis" value={medicalStaff.length} icon={Users} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {radarTarget && (
          <ResponsiveChartCard title={`Radar Burnout: ${radarTarget.name}`} subtitle="5 faktor risiko burnout" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#ebefed" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7c63' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#e57373" strokeWidth={2} fill="#e57373" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </ResponsiveChartCard>
        )}

        <ResponsiveChartCard title="Skor Burnout per Tenaga Medis" subtitle="Computed from active SIMRS dataset" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)' }} cursor={{ fill: '#f6faf8' }} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>
      </div>

      {/* Burnout Detail Cards */}
      <div className="space-y-3">
        {burnoutData.sort((a, b) => b.score - a.score).map((d) => (
          <div key={d.employee_id} className={`clay-card-sm p-4 border-l-4 ${
            d.category === 'Tinggi' ? 'border-l-rose-400' : d.category === 'Sedang' ? 'border-l-amber-400' : 'border-l-emerald-400'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-semibold text-on-surface">{d.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-on-surface">{d.score}</span>
                <StatusBadge status={d.category} />
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mb-2">{d.recommendation}</p>
            <div className="flex flex-wrap gap-3 text-[10px] text-outline">
              <span>Kapasitas: {d.capacityPressure}%</span>
              <span>Terlambat: {d.lateCount}x</span>
              <span>Absent: {d.absentCount}x</span>
              <span>Emergency: {d.emergencyPressure}%</span>
              <span>Malam: {d.nightFlag ? 'Ya' : 'Tidak'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
