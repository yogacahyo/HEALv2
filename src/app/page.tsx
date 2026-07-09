'use client';

import Link from 'next/link';
import { Stethoscope, ShieldCheck, BarChart3, Database, BookOpen, Cpu, Activity } from 'lucide-react';

const roles = [
  {
    title: 'Tenaga Medis',
    description: 'Akses mobile untuk dokter dan perawat: melihat jadwal 1 bulan, absensi, asesmen burnout, riwayat jadwal, dan pengajuan pergantian shift.',
    href: '/tenaga-medis',
    icon: Stethoscope,
    iconBg: 'bg-[#e8f5e9]',
    iconColor: 'text-[#2ae500]',
    accent: 'text-[#106e00]',
  },
  {
    title: 'Admin',
    description: 'Dashboard operasional untuk membaca data SIMRS, monitoring beban layanan, mengelola simulasi jadwal, dan menyetujui pengajuan pergantian shift.',
    href: '/admin/command-center',
    icon: ShieldCheck,
    iconBg: 'bg-[#e3f2fd]',
    iconColor: 'text-[#42a5f5]',
    accent: 'text-[#1565c0]',
  },
  {
    title: 'Direktur',
    description: 'Dashboard eksekutif minimalis untuk melihat risiko beban kerja, prediksi pasien, burnout simulation, dan rekomendasi strategis.',
    href: '/direktur',
    icon: BarChart3,
    iconBg: 'bg-[#e8eaf6]',
    iconColor: 'text-[#5c6bc0]',
    accent: 'text-[#283593]',
  },
  {
    title: 'Tabel Data SIMRS',
    description: 'Dokumentasi tabel dan kolom database SIMRS yang digunakan dalam prototype.',
    href: '/tabel-data-simrs',
    icon: Database,
    iconBg: 'bg-surface-container-high',
    iconColor: 'text-outline',
    accent: 'text-on-surface-variant',
  },
  {
    title: 'Panduan Penggunaan',
    description: 'Panduan lengkap penggunaan website untuk seluruh role.',
    href: '/panduan',
    icon: BookOpen,
    iconBg: 'bg-[#fff8e1]',
    iconColor: 'text-[#ffb300]',
    accent: 'text-[#f57f17]',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12 animate-fade-in max-w-3xl">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary mb-6"
          style={{
            boxShadow: '6px 6px 16px rgba(16,110,0,0.25), -4px -4px 10px rgba(57,255,20,0.2), inset 2px 2px 4px rgba(57,255,20,0.3), inset -2px -2px 4px rgba(0,0,0,0.1)',
          }}>
          <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-on-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface mb-3 tracking-tight">
          Hermina Employee<br className="sm:hidden" /> Allocation Logic
        </h1>
        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-6">
          Prototype simulasi berbasis database SIMRS untuk membaca beban pasien, ketersediaan dokter dan perawat, risiko fatigue, dan rekomendasi alokasi shift.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="clay-badge bg-[#e8f5e9] text-[#106e00] border border-[#a5d6a7]">
            <Cpu className="w-3.5 h-3.5" />
            Ready for Backend AI Integration
          </span>
          <span className="clay-badge bg-surface-container text-on-surface-variant border border-outline-variant">
            <Database className="w-3.5 h-3.5" />
            Dummy Dataset Loaded
          </span>
        </div>
      </div>

      {/* Ringkasan Fungsi */}
      <div className="clay-card p-4 sm:p-6 mb-8 sm:mb-12 max-w-3xl w-full animate-slide-up">
        <h2 className="text-sm font-bold text-outline uppercase tracking-wider mb-3">Ringkasan Fungsi Sistem</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-on-surface-variant">
          {[
            'Monitoring beban pasien',
            'Ketersediaan dokter & perawat',
            'Prediksi kunjungan pasien',
            'Simulasi risiko burnout',
            'Rekomendasi alokasi shift',
            'Simulasi jadwal otomatis',
            'Pengajuan tukar shift',
            'Dashboard eksekutif',
            'Data Integration Status',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl w-full">
        {roles.map((role, i) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.title}
              href={role.href}
              className="clay-card p-5 sm:p-6 group cursor-pointer hover:-translate-y-1 transition-all duration-200"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`clay-icon-tray ${role.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${role.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">{role.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{role.description}</p>
              <div className={`mt-4 inline-flex items-center text-sm font-bold ${role.accent}`}>
                Masuk →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-10 sm:mt-16 text-center max-w-2xl">
        <p className="text-xs text-outline leading-relaxed">
          Data yang ditampilkan merupakan dataset dummy/simulasi berdasarkan struktur database SIMRS. 
          Implementasi produksi membutuhkan validasi keamanan, audit akses, dan kepatuhan kebijakan rumah sakit.
        </p>
      </div>
    </div>
  );
}
