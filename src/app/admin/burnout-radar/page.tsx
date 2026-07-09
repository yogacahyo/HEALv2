'use client';

import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KPICard } from '@/components/common/KPICard';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import { AlertTriangle, Users, Shield, Lightbulb } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid
} from 'recharts';

// Data dummy skor burnout per unit (untuk bar chart)
const burnoutPerUnitBar = [
  { name: 'IGD', score: 86, fill: '#c62828' },
  { name: 'ICU', score: 82, fill: '#e57373' },
  { name: 'OK', score: 74, fill: '#ffb74d' },
  { name: 'VK', score: 71, fill: '#ffb74d' },
  { name: 'Isolasi', score: 68, fill: '#81c784' },
];

// Data radar chart — profil risiko IGD (unit tertinggi)
const radarData = [
  { subject: 'Beban Pasien', value: 92 },
  { subject: 'Shift Malam', value: 85 },
  { subject: 'Lembur', value: 78 },
  { subject: 'Absensi', value: 45 },
  { subject: 'Tekanan Emergency', value: 90 },
];

// Data tabel monitoring staf risiko tinggi (I)
const staffMonitoring = [
  {
    nama: 'dr. Andika Pratama',
    profesi: 'Dokter',
    unit: 'IGD',
    shiftDominan: 'Malam',
    skorFatigue: 88,
    risikoBurnout: 'Kritis',
    rekomendasiAI: 'Jeda 24 jam dan hindari shift malam berikutnya',
  },
  {
    nama: 'Ns. Rina Wulandari',
    profesi: 'Perawat',
    unit: 'ICU',
    shiftDominan: 'Malam',
    skorFatigue: 84,
    risikoBurnout: 'Tinggi',
    rekomendasiAI: 'Batasi lembur dan rotasi ke shift sore',
  },
  {
    nama: 'dr. Maya Lestari',
    profesi: 'Dokter',
    unit: 'Kamar Operasi',
    shiftDominan: 'Pagi',
    skorFatigue: 79,
    risikoBurnout: 'Tinggi',
    rekomendasiAI: 'Kurangi jadwal operasi panjang berturut-turut',
  },
  {
    nama: 'Ns. Siti Aisyah',
    profesi: 'Perawat',
    unit: 'Ruang Bersalin',
    shiftDominan: 'Malam',
    skorFatigue: 76,
    risikoBurnout: 'Sedang',
    rekomendasiAI: 'Atur ulang jadwal on-call',
  },
  {
    nama: 'Ns. Dwi Santoso',
    profesi: 'Perawat',
    unit: 'Onkologi',
    shiftDominan: 'Sore',
    skorFatigue: 73,
    risikoBurnout: 'Sedang',
    rekomendasiAI: 'Rekomendasikan rotasi bangsal periodik',
  },
];

// Heatmap burnout berdasarkan hari dan shift
const heatmapBurnout: { hari: string; Pagi: number; Sore: number; Malam: number }[] = [
  { hari: 'Senin', Pagi: 42, Sore: 55, Malam: 72 },
  { hari: 'Selasa', Pagi: 38, Sore: 50, Malam: 68 },
  { hari: 'Rabu', Pagi: 45, Sore: 58, Malam: 78 },
  { hari: 'Kamis', Pagi: 40, Sore: 52, Malam: 70 },
  { hari: 'Jumat', Pagi: 48, Sore: 62, Malam: 80 },
  { hari: 'Sabtu', Pagi: 55, Sore: 68, Malam: 85 },
  { hari: 'Minggu', Pagi: 58, Sore: 72, Malam: 88 },
];

function getHeatColor(val: number) {
  if (val >= 80) return { bg: '#fce8e8', text: '#c62828' };
  if (val >= 60) return { bg: '#fff3e0', text: '#e65100' };
  if (val >= 45) return { bg: '#fff8e1', text: '#f57f17' };
  return { bg: '#e8f5e9', text: '#106e00' };
}

const tooltipStyle = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)',
  fontFamily: 'Plus Jakarta Sans',
};

export default function BurnoutRadarPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Pelacak Kelelahan & Kesejahteraan Staf"
        subtitle="Engine C — Memproses data absensi, lembur, pola shift malam, dan hasil survei WBI untuk menghitung skor risiko burnout staf secara real-time"
        simulationLabel="Simulation Mode"
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard title="Staf Risiko Tinggi" value={2} icon={AlertTriangle} color="rose" />
        <KPICard title="Staf Risiko Sedang" value={2} icon={AlertTriangle} color="amber" />
        <KPICard title="Staf Risiko Rendah" value={1} icon={Shield} color="green" />
        <KPICard title="Total Staf Terpantau" value={5} icon={Users} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar Chart — Profil Risiko Unit Tertinggi */}
        <ResponsiveChartCard title="Radar Risiko Burnout: IGD" subtitle="5 faktor risiko burnout pada unit dengan skor tertinggi" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#ebefed" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7c63' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} />
              <Radar name="Skor" dataKey="value" stroke="#e57373" strokeWidth={2} fill="#e57373" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>

        {/* Bar Chart — Skor Burnout per Unit */}
        <ResponsiveChartCard title="Skor Risiko Burnout per Unit Prioritas" subtitle="Dihitung dari kombinasi beban pasien, shift malam, lembur, dan kesejahteraan staf" height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={burnoutPerUnitBar} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f6faf8' }} formatter={(value: any) => [`${value}%`, 'Risiko Burnout']} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} name="Risiko Burnout">
                {burnoutPerUnitBar.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>
      </div>

      {/* Heatmap Risiko Burnout per Hari dan Shift */}
      <div>
        <SectionHeader
          title="Heatmap Risiko Burnout Berdasarkan Hari dan Shift"
          subtitle="Pola risiko burnout mingguan — skor lebih tinggi pada shift malam dan akhir pekan"
        />
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs w-24">Hari</th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Shift Pagi</th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Shift Sore</th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Shift Malam</th>
                </tr>
              </thead>
              <tbody>
                {heatmapBurnout.map((row) => (
                  <tr key={row.hari} className="border-b border-surface-container">
                    <td className="p-3 text-xs font-medium text-on-surface">{row.hari}</td>
                    {(['Pagi', 'Sore', 'Malam'] as const).map((shift) => {
                      const val = row[shift];
                      const color = getHeatColor(val);
                      return (
                        <td key={shift} className="p-2 text-center">
                          <div
                            className="rounded-xl py-2 px-3 text-xs font-bold mx-auto max-w-[80px]"
                            style={{ backgroundColor: color.bg, color: color.text }}
                          >
                            {val}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ringkasan Insight */}
      <div className="clay-card-sm p-4 border-l-4 border-l-[#e57373]">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-[#e57373] mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Sebanyak <strong>12 staf ICU</strong> berada pada kategori risiko sedang hingga tinggi karena akumulasi shift malam dan lembur berulang.
            Sistem merekomendasikan rotasi shift dan pembatasan lembur untuk menurunkan risiko burnout.
          </p>
        </div>
      </div>

      {/* (I) Tabel Monitoring Staf Risiko Tinggi */}
      <div>
        <SectionHeader
          title="Monitoring Staf Risiko Tinggi"
          subtitle="Tabel pemantauan staf dengan skor kelelahan tinggi dan rekomendasi AI"
        />
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Nama Staf</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Profesi</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Unit</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Shift Dominan</th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Skor Kelelahan</th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Risiko Burnout</th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Rekomendasi AI</th>
                </tr>
              </thead>
              <tbody>
                {staffMonitoring.map((staff) => (
                  <tr key={staff.nama} className="border-b border-surface-container hover:bg-surface-container/50">
                    <td className="p-3 text-xs font-medium text-on-surface">{staff.nama}</td>
                    <td className="p-3"><StatusBadge status={staff.profesi === 'Dokter' ? 'dokter' : 'perawat'} /></td>
                    <td className="p-3 text-xs text-on-surface-variant">{staff.unit}</td>
                    <td className="p-3"><StatusBadge status={staff.shiftDominan} /></td>
                    <td className="p-3 text-center">
                      <span className={`text-sm font-bold ${
                        staff.skorFatigue >= 80 ? 'text-[#c62828]' :
                        staff.skorFatigue >= 70 ? 'text-[#e65100]' : 'text-[#f57f17]'
                      }`}>
                        {staff.skorFatigue}
                      </span>
                    </td>
                    <td className="p-3 text-center"><StatusBadge status={staff.risikoBurnout} /></td>
                    <td className="p-3 text-xs text-on-surface-variant max-w-[200px]">{staff.rekomendasiAI}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
