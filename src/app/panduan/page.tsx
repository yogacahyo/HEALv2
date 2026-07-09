'use client';

import Link from 'next/link';
import { Home, Sparkles, Stethoscope, ShieldCheck, BarChart3, Database, BookOpen, ArrowRight } from 'lucide-react';

const sections = [
  {
    title: '1. Beranda (Landing Page)',
    content: 'Halaman awal dengan 5 tombol akses role: Tenaga Medis, Admin, Direktur, Tabel Data SIMRS, dan Panduan. Dari halaman ini, Anda dapat memilih role yang sesuai.',
  },
  {
    title: '2. Menu Tenaga Medis',
    icon: Stethoscope,
    content: 'Dirancang mobile-first untuk dokter dan perawat. Memiliki 5 tab di navigation bar bawah:',
    items: [
      { label: 'Jadwal', desc: 'Melihat jadwal praktik/shift bulan ini berdasarkan tabel doctor_schedules.' },
      { label: 'Absensi', desc: 'Simulasi absen masuk dan keluar. Data dari tabel attendance.' },
      { label: 'Burnout', desc: 'Asesmen burnout pasca-shift dengan 7 pertanyaan Ya/Tidak. Skor dihitung: (Ya/7)*100. Kategori: Rendah (<34), Sedang (34-66), Tinggi (>66).' },
      { label: 'Riwayat', desc: 'Riwayat absensi dan asesmen burnout yang pernah diisi.' },
      { label: 'Shift Swap', desc: 'Formulir pengajuan pergantian shift. Pilih tanggal/shift saat ini, tanggal/shift yang diinginkan, alasan, dan urgensi.' },
    ],
  },
  {
    title: '3. Menu Admin',
    icon: ShieldCheck,
    content: 'Dashboard operasional dengan 11 sub-halaman di sidebar kiri:',
    items: [
      { label: 'Command Center', desc: '15 KPI card, Smart Action Center (5 rules), chart distribusi, status kamar.' },
      { label: 'SIMRS Data Hub', desc: 'Overview semua tabel dan jumlah record di active dataset.' },
      { label: 'Patient Flow', desc: 'Aliran pasien: distribusi per departemen, tipe kunjungan, tabel registrasi.' },
      { label: 'Data Tenaga Medis', desc: 'Daftar pegawai, role, posisi, absensi hari ini, pengajuan cuti.' },
      { label: 'Jadwal & Antrean', desc: 'Jadwal dokter per hari, kuota harian, monitor antrean real-time.' },
      { label: 'Shift Swap & Approval', desc: 'Kelola pengajuan shift dari tenaga medis: setujui, tolak, atau minta perbaikan.' },
      { label: 'Burnout Radar', desc: 'Skor burnout per tenaga medis. Radar chart + bar chart. 5 faktor: kapasitas, terlambat, absent, emergency, malam.' },
      { label: 'Clinical Load Forecast', desc: 'Prediksi 14 hari ke depan menggunakan moving average + emergency/appointment/follow-up factors.' },
      { label: 'Auto Rostering', desc: 'Simulasi jadwal otomatis per bulan. Constraint: maks 2 malam beruntun, cuti, shift swap.' },
      { label: 'Executive Insight', desc: 'Ringkasan eksekutif: BOR, risiko departemen, rekomendasi alokasi.' },
      { label: 'Parameter Simulasi', desc: 'Konfigurasi threshold simulasi: kapasitas, BOR, emergency, burnout, dll.' },
    ],
  },
  {
    title: '4. Menu Direktur',
    icon: BarChart3,
    content: 'Dashboard eksekutif minimalis dengan 8 KPI, chart prediksi 7 hari, rekomendasi strategis, dan status risiko keseluruhan. Data sama seperti admin namun dalam tampilan ringkas untuk pengambilan keputusan.',
  },
  {
    title: '5. Tabel Data SIMRS',
    icon: Database,
    content: 'Dokumentasi lengkap seluruh tabel database SIMRS. Fitur: pencarian tabel, filter berdasarkan penggunaan (Patient Load, Clinical Load, Staffing, Burnout, Executive), detail kolom per tabel, catatan privasi data.',
  },
  {
    title: '6. Keamanan & Privasi',
    content: 'Jangan tampilkan data sensitif pasien pada dashboard AI Shifting: nama lengkap, alamat, telepon, email, emergency contact. Gunakan secure ID (patient_id, registration_number, medical_record_number). Data pasien hanya ditampilkan secara agregat.',
  },
  {
    title: '7. Catatan Penting',
    content: 'Website ini adalah prototype simulasi. Semua fitur prediksi, burnout, rostering, dan shift swap berlabel "Simulation Mode". Seluruh data berasal dari active SIMRS dataset (dummy atau uploaded). Untuk implementasi produksi, diperlukan validasi keamanan, audit akses, dan kepatuhan kebijakan rumah sakit.',
  },
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-[#106e00] to-[#095300] text-white px-4 sm:px-8 py-6" style={{ boxShadow: '0 4px 16px rgba(16,110,0,0.3), inset 0 1px 0 rgba(57,255,20,0.15)' }}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">Panduan Penggunaan</h1>
            </div>
            <p className="text-xs sm:text-sm opacity-80">Panduan lengkap penggunaan website HEAL untuk seluruh role</p>
          </div>
          <span className="clay-badge bg-white/20 text-white border border-white/30 text-xs">
            <BookOpen className="w-3 h-3" />
            User Guide
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="clay-card p-5 sm:p-6 animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start gap-3 mb-3">
              {section.icon && (
                <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center shrink-0">
                  <section.icon className="w-4 h-4 text-[#106e00]" />
                </div>
              )}
              <h2 className="text-base sm:text-lg font-bold text-on-surface">{section.title}</h2>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{section.content}</p>
            {section.items && (
              <div className="space-y-2 ml-3">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-sm font-semibold text-on-surface">{item.label}:</span>{' '}
                      <span className="text-sm text-on-surface-variant">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="text-center py-8">
          <Link href="/" className="clay-btn inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold hover:bg-[#095300]">
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
