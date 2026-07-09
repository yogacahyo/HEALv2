'use client';

import Link from 'next/link';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import {
  AlertTriangle, Users, TrendingUp,
  Home, Shield, Lightbulb, Activity, HeartPulse,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Data tren risiko burnout mingguan
const trendBurnoutData = [
  { minggu: 'Mg 1', rataRata: 58 },
  { minggu: 'Mg 2', rataRata: 62 },
  { minggu: 'Mg 3', rataRata: 60 },
  { minggu: 'Mg 4', rataRata: 65 },
  { minggu: 'Mg 5', rataRata: 63 },
  { minggu: 'Mg 6', rataRata: 68 },
  { minggu: 'Mg 7', rataRata: 64 },
];

// Rekomendasi strategis per unit
const rekomendasiStrategis = [
  {
    unit: 'IGD',
    prioritas: 'Tinggi',
    rekomendasi: 'Terapkan shift maksimal 8 jam dengan rotasi maju dan jeda 24 jam setelah shift malam untuk menurunkan risiko burnout 86%.',
  },
  {
    unit: 'ICU / NICU / PICU',
    prioritas: 'Tinggi',
    rekomendasi: 'Batasi lembur dan hindari double-shift. Jaga rasio perawat-pasien 1:1 atau 1:2 untuk keselamatan pasien kritis.',
  },
  {
    unit: 'Kamar Operasi',
    prioritas: 'Sedang',
    rekomendasi: 'Seimbangkan jadwal operasi elektif dan berikan kompensasi waktu istirahat setelah operasi berdurasi panjang.',
  },
  {
    unit: 'Ruang Bersalin',
    prioritas: 'Sedang',
    rekomendasi: 'Susun on-call team terstruktur untuk mengurangi panggilan mendadak dan kecemasan staf pada shift malam.',
  },
  {
    unit: 'Isolasi / Onkologi',
    prioritas: 'Rendah',
    rekomendasi: 'Terapkan rotasi periodik antar-bangsal setiap 6 bulan untuk menurunkan compassion fatigue.',
  },
];

const tooltipStyle = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)',
  fontFamily: 'Plus Jakarta Sans',
};

export default function DirekturPage() {
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
              <p className="text-xs sm:text-sm opacity-80">AI Shifting — Pemantauan Burnout Tenaga Medis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* KPI Cards (A) */}
        <div className="kpi-grid">
          <KPICard
            title="Rata-rata Risiko Burnout"
            value="64%"
            subtitle="Gabungan dokter dan perawat pada 5 unit prioritas"
            icon={AlertTriangle}
            color="amber"
          />
          <KPICard
            title="Unit Risiko Tertinggi"
            value="IGD"
            subtitle="Skor burnout 86% — kombinasi beban kerja dan shift malam"
            icon={Activity}
            color="rose"
          />
          <KPICard
            title="Staf Membutuhkan Istirahat"
            value="28 orang"
            subtitle="Staf dengan skor kelelahan tinggi"
            icon={Users}
            color="rose"
          />
          <KPICard
            title="Efektivitas Optimasi"
            value="82%"
            subtitle="Keberhasilan AI menurunkan konflik shift"
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tren Risiko Burnout Mingguan */}
          <ResponsiveChartCard title="Tren Risiko Burnout Mingguan" subtitle="Rata-rata skor burnout seluruh unit prioritas per minggu" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendBurnoutData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBurnoutTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e57373" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e57373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
                <XAxis dataKey="minggu" tick={{ fontSize: 10, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} dx={-10} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, 'Risiko Burnout']} />
                <Area type="monotone" dataKey="rataRata" stroke="#e57373" strokeWidth={3} fillOpacity={1} fill="url(#colorBurnoutTrend)" activeDot={{ r: 6, strokeWidth: 0, fill: '#c62828' }} name="Rata-rata Burnout" />
              </AreaChart>
            </ResponsiveContainer>
          </ResponsiveChartCard>

          {/* Rekomendasi Strategis */}
          <div className="clay-card-sm p-5 sm:p-6">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-on-surface tracking-tight">Rekomendasi Strategis AI</h3>
              <p className="text-xs text-outline mt-0.5">Insight otomatis dari tiga AI Core Engine</p>
            </div>
            <div className="space-y-2">
              {rekomendasiStrategis.map((rec) => (
                <div key={rec.unit} className={`p-3 rounded-xl border-l-4 ${
                  rec.prioritas === 'Tinggi' ? 'bg-[#fce8e8] border-l-[#e57373]' :
                  rec.prioritas === 'Sedang' ? 'bg-[#fff8e1] border-l-[#ffb74d]' :
                  'bg-[#e8f5e9] border-l-[#81c784]'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">{rec.unit}</span>
                    <StatusBadge status={rec.prioritas} />
                  </div>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant">{rec.rekomendasi}</p>
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
            <div className="p-4 rounded-2xl text-center bg-[#fff8e1]"
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">64%</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">Rata-rata Risiko Burnout</p>
            </div>
            <div className="p-4 rounded-2xl text-center bg-[#fce8e8]"
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">IGD</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">Unit Risiko Tertinggi</p>
            </div>
            <div className="p-4 rounded-2xl text-center bg-[#e8f5e9]"
              style={{ boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.04)' }}>
              <p className="text-2xl font-extrabold text-on-surface">82%</p>
              <p className="text-xs text-on-surface-variant mt-1 font-medium">Efektivitas Optimasi Jadwal</p>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="clay-card-sm p-4 border-l-4 border-l-[#42a5f5]">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-[#42a5f5] mt-0.5 shrink-0" />
            <div className="text-xs sm:text-sm text-on-surface-variant leading-relaxed space-y-1">
              <p><strong>Ringkasan Eksekutif:</strong> Sistem AI Shifting berhasil menurunkan potensi double-shift sebesar 32% dan meningkatkan pemerataan beban kerja sebesar 82%. Namun, IGD masih memerlukan perhatian khusus dengan skor burnout tertinggi di 86%.</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-outline text-center py-4">
          Dashboard eksekutif — seluruh data berasal dari AI Core Engine simulation untuk pemantauan burnout tenaga medis.
        </p>
      </main>
    </div>
  );
}
