'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KPICard } from '@/components/common/KPICard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ResponsiveChartCard } from '@/components/common/ResponsiveChartCard';
import {
  AlertTriangle, Users, TrendingUp,
  Home, Shield, Lightbulb, Activity, HeartPulse, X,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, Legend,
} from 'recharts';

// ─── Data tren risiko burnout mingguan ───
const trendBurnoutData = [
  { minggu: 'Mg 1', rataRata: 58 },
  { minggu: 'Mg 2', rataRata: 62 },
  { minggu: 'Mg 3', rataRata: 60 },
  { minggu: 'Mg 4', rataRata: 65 },
  { minggu: 'Mg 5', rataRata: 63 },
  { minggu: 'Mg 6', rataRata: 68 },
  { minggu: 'Mg 7', rataRata: 64 },
];

// ─── Rekomendasi strategis per unit ───
const rekomendasiStrategis = [
  { unit: 'IGD', prioritas: 'Tinggi', rekomendasi: 'Terapkan shift maksimal 8 jam dengan rotasi maju dan jeda 24 jam setelah shift malam untuk menurunkan risiko burnout 86%.' },
  { unit: 'ICU / NICU / PICU', prioritas: 'Tinggi', rekomendasi: 'Batasi lembur dan hindari double-shift. Jaga rasio perawat-pasien 1:1 atau 1:2 untuk keselamatan pasien kritis.' },
  { unit: 'Kamar Operasi', prioritas: 'Sedang', rekomendasi: 'Seimbangkan jadwal operasi elektif dan berikan kompensasi waktu istirahat setelah operasi berdurasi panjang.' },
  { unit: 'Ruang Bersalin', prioritas: 'Sedang', rekomendasi: 'Susun on-call team terstruktur untuk mengurangi panggilan mendadak dan kecemasan staf pada shift malam.' },
  { unit: 'Isolasi / Onkologi', prioritas: 'Rendah', rekomendasi: 'Terapkan rotasi periodik antar-bangsal setiap 6 bulan untuk menurunkan compassion fatigue.' },
];

// ─── Data detail modal: Kontribusi Risiko per Unit ───
const kontribusiBurnoutData = [
  { unit: 'IGD', risiko: 86 },
  { unit: 'ICU/NICU/PICU', risiko: 82 },
  { unit: 'Kamar Operasi', risiko: 74 },
  { unit: 'Ruang Bersalin', risiko: 71 },
  { unit: 'Isolasi/Onkologi', risiko: 68 },
];
const burnoutBarColors = ['#c62828', '#e57373', '#ffb74d', '#ffb74d', '#81c784'];

// ─── Data detail modal: Faktor Risiko IGD ───
const faktorRisikoIGD = [
  { faktor: 'Lonjakan pasien malam', dampak: 'Kelelahan fisik dan mental meningkat', rekomendasi: 'Tambahkan buffer staf pada shift malam' },
  { faktor: 'Shift beruntun', dampak: 'Risiko fatigue meningkat', rekomendasi: 'Hindari penjadwalan shift malam berturut-turut' },
  { faktor: 'Kondisi darurat tidak terprediksi', dampak: 'Stres kerja meningkat', rekomendasi: 'Gunakan prediksi beban pasien berbasis historis' },
  { faktor: 'Waktu istirahat pendek', dampak: 'Pemulihan tidak optimal', rekomendasi: 'Terapkan jeda 12–24 jam setelah shift malam' },
];

// ─── Data detail modal: Staf Monitoring ───
const staffMonitoring = [
  { nama: 'dr. Andika Pratama', profesi: 'Dokter', unit: 'IGD', shift: 'Malam', skor: 88, risiko: 'Kritis', rekomendasi: 'Jeda 24 jam dan hindari shift malam berikutnya' },
  { nama: 'Ns. Rina Wulandari', profesi: 'Perawat', unit: 'ICU', shift: 'Malam', skor: 84, risiko: 'Tinggi', rekomendasi: 'Batasi lembur dan rotasi ke shift sore' },
  { nama: 'dr. Maya Lestari', profesi: 'Dokter', unit: 'Kamar Operasi', shift: 'Pagi', skor: 79, risiko: 'Tinggi', rekomendasi: 'Kurangi jadwal operasi panjang berturut-turut' },
  { nama: 'Ns. Siti Aisyah', profesi: 'Perawat', unit: 'Ruang Bersalin', shift: 'Malam', skor: 76, risiko: 'Sedang', rekomendasi: 'Atur ulang jadwal on-call' },
  { nama: 'Ns. Dwi Santoso', profesi: 'Perawat', unit: 'Onkologi', shift: 'Sore', skor: 73, risiko: 'Sedang', rekomendasi: 'Rekomendasikan rotasi bangsal periodik' },
];

// ─── Data detail modal: Optimasi Sebelum/Sesudah ───
const optimasiData = [
  { indikator: 'Risiko Double-Shift', Sebelum: 38, Sesudah: 14, satuan: '%' },
  { indikator: 'Beban Tidak Merata', Sebelum: 46, Sesudah: 21, satuan: '%' },
  { indikator: 'Staf Burnout Tinggi', Sebelum: 34, Sesudah: 18, satuan: 'orang' },
  { indikator: 'Konflik Jadwal', Sebelum: 41, Sesudah: 17, satuan: 'kasus' },
];

const tooltipStyle = {
  borderRadius: '16px',
  border: 'none',
  boxShadow: '4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)',
  fontFamily: 'Plus Jakarta Sans',
};

type ModalType = 'burnout' | 'unit' | 'staf' | 'optimasi' | null;

export default function DirekturPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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
        {/* KPI Cards (A) — Clickable */}
        <div className="kpi-grid">
          <div onClick={() => setActiveModal('burnout')} className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] h-full [&>div]:h-full" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActiveModal('burnout')}>
            <KPICard title="Rata-rata Risiko Burnout" value="64%" subtitle="Gabungan dokter dan perawat pada 5 unit prioritas" icon={AlertTriangle} color="amber" />
          </div>
          <div onClick={() => setActiveModal('unit')} className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] h-full [&>div]:h-full" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActiveModal('unit')}>
            <KPICard title="Unit Risiko Tertinggi" value="IGD" subtitle="Skor burnout 86% — kombinasi beban kerja dan shift malam" icon={Activity} color="rose" />
          </div>
          <div onClick={() => setActiveModal('staf')} className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] h-full [&>div]:h-full" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActiveModal('staf')}>
            <KPICard title="Staf Membutuhkan Istirahat" value="28 orang" subtitle="Staf dengan skor kelelahan tinggi" icon={Users} color="rose" />
          </div>
          <div onClick={() => setActiveModal('optimasi')} className="cursor-pointer transition-transform duration-200 hover:scale-[1.02] h-full [&>div]:h-full" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setActiveModal('optimasi')}>
            <KPICard title="Efektivitas Optimasi" value="82%" subtitle="Keberhasilan AI menurunkan konflik shift" icon={TrendingUp} color="green" />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      {/* ══════════════════════════════════════════════
          MODAL OVERLAY
          ══════════════════════════════════════════════ */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setActiveModal(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Modal Panel */}
          <div
            className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white sm:rounded-2xl rounded-t-2xl animate-slide-up z-10"
            style={{
              boxShadow: '0 -8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-5 sm:px-6 pt-5 pb-3 border-b border-surface-container-high flex items-center justify-between" style={{ borderRadius: 'inherit' }}>
              <h2 className="text-base sm:text-lg font-bold text-on-surface tracking-tight">
                {activeModal === 'burnout' && 'Detail Rata-rata Risiko Burnout'}
                {activeModal === 'unit' && 'Detail Unit Risiko Tertinggi'}
                {activeModal === 'staf' && 'Detail Staf Membutuhkan Istirahat'}
                {activeModal === 'optimasi' && 'Detail Efektivitas Optimasi Jadwal AI'}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-surface-container rounded-xl transition-colors shrink-0"
                aria-label="Tutup detail"
              >
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 sm:px-6 py-5 space-y-5">

              {/* ── MODAL 1: Rata-rata Risiko Burnout ── */}
              {activeModal === 'burnout' && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="clay-icon-tray bg-[#fff8e1]">
                      <AlertTriangle className="w-5 h-5 text-[#ffb300]" />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-on-surface">64%</p>
                      <p className="text-xs text-on-surface-variant">Risiko burnout gabungan dokter dan perawat pada 5 unit prioritas.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['IGD', 'ICU / NICU / PICU', 'Kamar Operasi', 'Ruang Bersalin', 'Isolasi / Onkologi'].map((u) => (
                      <span key={u} className="clay-badge bg-surface-container text-on-surface-variant border border-surface-container-high text-xs">{u}</span>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Kontribusi Risiko Burnout per Unit</h4>
                    <div className="chart-container" style={{ height: '220px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kontribusiBurnoutData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ebefed" />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} unit="%" />
                          <YAxis dataKey="unit" type="category" tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} width={110} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f6faf8' }} formatter={(value: any) => [`${value}%`, 'Risiko Burnout']} />
                          <Bar dataKey="risiko" radius={[0, 8, 8, 0]} name="Risiko Burnout (%)">
                            {kontribusiBurnoutData.map((_, i) => (<Cell key={i} fill={burnoutBarColors[i]} />))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fff8e1] border-l-4 border-l-[#ffb74d]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#ffb300] mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Rata-rata risiko burnout berada pada kategori sedang-tinggi. IGD dan ICU menjadi penyumbang risiko terbesar karena intensitas pasien tinggi, tekanan klinis berat, serta frekuensi shift malam yang lebih dominan.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ── MODAL 2: Unit Risiko Tertinggi ── */}
              {activeModal === 'unit' && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="clay-icon-tray bg-[#fce8e8]">
                      <Activity className="w-5 h-5 text-[#e57373]" />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-on-surface">IGD</p>
                      <p className="text-xs text-on-surface-variant">Skor burnout: <strong>86%</strong></p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-2">Faktor Utama</h4>
                    <div className="space-y-1.5">
                      {[
                        'Lonjakan pasien tidak terprediksi',
                        'Shift malam dengan beban tinggi',
                        'Respons cepat terhadap kondisi darurat',
                        'Potensi shift beruntun',
                        'Tekanan pengambilan keputusan klinis',
                      ].map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#e57373] shrink-0" />
                          <p className="text-xs sm:text-sm text-on-surface-variant">{f}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Analisis Risiko dan Rekomendasi</h4>
                    <div className="overflow-x-auto table-responsive">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-container border-b border-surface-container-high">
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Faktor Risiko</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Dampak terhadap Staf</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Rekomendasi AI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faktorRisikoIGD.map((row) => (
                            <tr key={row.faktor} className="border-b border-surface-container">
                              <td className="p-3 text-xs font-medium text-on-surface">{row.faktor}</td>
                              <td className="p-3 text-xs text-on-surface-variant">{row.dampak}</td>
                              <td className="p-3 text-xs text-on-surface-variant">{row.rekomendasi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fce8e8] border-l-4 border-l-[#e57373]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#e57373] mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        IGD menjadi unit dengan risiko tertinggi karena kombinasi beban pasien tinggi, kondisi darurat tidak terprediksi, dan intensitas kerja pada shift malam.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ── MODAL 3: Staf Membutuhkan Istirahat ── */}
              {activeModal === 'staf' && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="clay-icon-tray bg-[#fce8e8]">
                      <Users className="w-5 h-5 text-[#e57373]" />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-on-surface">28 orang</p>
                      <p className="text-xs text-on-surface-variant">Staf dengan skor kelelahan tinggi berdasarkan pola absensi, lembur, shift malam, dan hasil asesmen burnout.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Ringkasan Kategori Risiko</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Risiko Rendah', value: '42 staf', bg: '#e8f5e9', text: '#106e00' },
                        { label: 'Risiko Sedang', value: '35 staf', bg: '#fff8e1', text: '#f57f17' },
                        { label: 'Risiko Tinggi', value: '21 staf', bg: '#fff3e0', text: '#e65100' },
                        { label: 'Risiko Kritis', value: '7 staf', bg: '#fce8e8', text: '#c62828' },
                      ].map((cat) => (
                        <div key={cat.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: cat.bg }}>
                          <p className="text-lg font-extrabold" style={{ color: cat.text }}>{cat.value}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant mt-0.5">{cat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Tabel Monitoring Staf</h4>
                    <div className="overflow-x-auto table-responsive">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-surface-container border-b border-surface-container-high">
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Nama Staf</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Profesi</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Unit</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Shift</th>
                            <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Skor</th>
                            <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">Risiko</th>
                            <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">Rekomendasi AI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffMonitoring.map((s) => (
                            <tr key={s.nama} className="border-b border-surface-container">
                              <td className="p-3 text-xs font-medium text-on-surface whitespace-nowrap">{s.nama}</td>
                              <td className="p-3"><StatusBadge status={s.profesi === 'Dokter' ? 'dokter' : 'perawat'} /></td>
                              <td className="p-3 text-xs text-on-surface-variant">{s.unit}</td>
                              <td className="p-3"><StatusBadge status={s.shift} /></td>
                              <td className="p-3 text-center">
                                <span className={`text-sm font-bold ${s.skor >= 80 ? 'text-[#c62828]' : s.skor >= 70 ? 'text-[#e65100]' : 'text-[#f57f17]'}`}>{s.skor}</span>
                              </td>
                              <td className="p-3 text-center"><StatusBadge status={s.risiko} /></td>
                              <td className="p-3 text-xs text-on-surface-variant max-w-[180px]">{s.rekomendasi}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#fce8e8] border-l-4 border-l-[#e57373]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#e57373] mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Sebanyak 28 staf membutuhkan penyesuaian jadwal atau waktu pemulihan karena memiliki akumulasi beban kerja tinggi, terutama pada unit IGD, ICU, dan Kamar Operasi.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ── MODAL 4: Efektivitas Optimasi ── */}
              {activeModal === 'optimasi' && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="clay-icon-tray bg-[#e8f5e9]">
                      <TrendingUp className="w-5 h-5 text-[#2ae500]" />
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-on-surface">82%</p>
                      <p className="text-xs text-on-surface-variant">Tingkat keberhasilan AI dalam menurunkan konflik shift, mengurangi beban berlebih, dan meningkatkan pemerataan jadwal.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-3">Perbandingan Sebelum dan Sesudah Optimasi</h4>
                    <div className="chart-container" style={{ height: '260px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={optimasiData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebefed" />
                          <XAxis dataKey="indikator" tick={{ fontSize: 10, fill: '#6b7c63' }} axisLine={false} tickLine={false} dy={10} />
                          <YAxis tick={{ fontSize: 11, fill: '#6b7c63' }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f6faf8' }} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                          <Bar dataKey="Sebelum" fill="#e57373" radius={[4, 4, 0, 0]} name="Sebelum Optimasi" />
                          <Bar dataKey="Sesudah" fill="#106e00" radius={[4, 4, 0, 0]} name="Sesudah Optimasi" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {optimasiData.map((item) => {
                      const penurunan = item.Sebelum - item.Sesudah;
                      const pct = Math.round((penurunan / item.Sebelum) * 100);
                      return (
                        <div key={item.indikator} className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-center">
                          <p className="text-[10px] font-semibold text-on-surface-variant mb-1">{item.indikator}</p>
                          <div className="flex items-center justify-center gap-1.5 mb-1">
                            <span className="text-xs text-[#c62828] font-bold">{item.Sebelum}</span>
                            <span className="text-[10px] text-outline">→</span>
                            <span className="text-xs text-[#106e00] font-bold">{item.Sesudah}</span>
                          </div>
                          <p className="text-[10px] text-[#106e00] font-semibold">↓ {pct}%</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-xl bg-[#e8f5e9] border-l-4 border-l-[#81c784]">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-[#106e00] mt-0.5 shrink-0" />
                      <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        Optimasi AI berhasil meningkatkan pemerataan beban kerja dan menurunkan risiko jadwal berlebih. Dampak paling signifikan terlihat pada penurunan risiko double-shift dan konflik jadwal.
                      </p>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
