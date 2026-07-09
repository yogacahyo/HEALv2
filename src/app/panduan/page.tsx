'use client';

import Link from 'next/link';
import { Home, Stethoscope, ShieldCheck, BarChart3, Database, BookOpen, ArrowRight, Brain, Info, Workflow } from 'lucide-react';

const sections = [
  {
    title: '1. Beranda (Portal Utama)',
    icon: Home,
    content: 'Halaman utama (/) yang berfungsi sebagai gerbang masuk. Sistem ini menggunakan arsitektur role-based, di mana Anda memilih peran untuk masuk ke dashboard yang sesuai: Tenaga Medis, Admin, atau Direktur.',
  },
  {
    title: '2. Alur Kerja (User Flow) Tenaga Medis',
    icon: Workflow,
    content: 'Aplikasi mobile-first (/tenaga-medis) ini adalah pendamping harian dokter dan perawat. Berikut adalah alur penggunaannya:',
    items: [
      { label: 'Cek Jadwal', desc: 'Sebelum bekerja, tenaga medis membuka tab "Jadwal" untuk melihat kapan dan di unit mana mereka bertugas hari itu. Jadwal ini sudah dioptimasi oleh AI.' },
      { label: 'Absensi', desc: 'Saat tiba di rumah sakit, buka tab "Absensi" dan lakukan absen masuk (clock-in). Saat shift selesai, lakukan absen keluar (clock-out).' },
      { label: 'Asesmen Burnout', desc: 'Setelah absen keluar, tenaga medis WAJIB membuka tab "Burnout" untuk mengisi 7 pertanyaan singkat tentang kelelahan fisik dan mental pasca-shift. Skor ini langsung dikirim ke AI Engine.' },
      { label: 'Tukar Shift (Opsional)', desc: 'Jika ada halangan, tenaga medis masuk ke tab "Shift Swap", memilih shift yang ingin ditukar, dan mengajukan alasan. Pengajuan ini akan masuk ke dashboard Admin untuk dievaluasi.' },
    ],
  },
  {
    title: '3. Alur Kerja (User Flow) Manajerial Admin',
    icon: Workflow,
    content: 'Dashboard Admin (/admin) digunakan oleh kepala perawat atau manajer operasional setiap hari dengan alur berikut:',
    items: [
      { label: 'Overview Harian', desc: 'Admin membuka "Command Center" setiap pagi untuk melihat rata-rata risiko burnout hari itu, serta membaca "AI Insight" otomatis tentang kondisi unit saat ini.' },
      { label: 'Tindak Lanjut Kelelahan', desc: 'Jika Command Center menunjukkan ada staf yang butuh istirahat, Admin membuka "Burnout Radar". Di sini, Admin melihat tabel rekomendasi staf yang berisiko "Kritis/Tinggi" dan mengambil tindakan (misal: meliburkan staf tersebut).' },
      { label: 'Persetujuan Shift', desc: 'Admin membuka "Shift Swap & Approval" untuk melihat apakah ada tenaga medis yang mengajukan tukar shift. AI akan memberikan indikator apakah pertukaran tersebut berisiko (misal: menyebabkan double-shift). Admin kemudian mengklik Approve atau Reject.' },
      { label: 'Persiapan Masa Depan', desc: 'Secara berkala, Admin membuka "Clinical Load Forecast" untuk melihat prediksi beban pasien minggu depan, lalu membuka "Auto Rostering" untuk memastikan jadwal shift minggu depan sudah terdistribusi dengan adil.' },
    ],
  },
  {
    title: '4. Cara Kerja & Aliran Data AI Core Engine',
    icon: Brain,
    content: 'Bagaimana AI bekerja di belakang layar mengatur shift tenaga medis? Sistem HEALv2 menggunakan tiga AI Core Engine yang berjalan berurutan:',
    items: [
      { label: 'Engine A (Peramalan Beban)', desc: 'AI mengambil data historis dari database SIMRS (kunjungan pasien, operasi). Kemudian AI memprediksi: "Minggu depan, IGD akan kedatangan 30% lebih banyak pasien pada shift malam."' },
      { label: 'Engine C (Pelacak Kelelahan)', desc: 'AI mengambil data dari menu Tenaga Medis (jam lembur absen, shift malam beruntun, dan hasil survei burnout). AI lalu menghitung skor kelelahan setiap individu, misalnya: "Ns. Rina memiliki skor burnout 84% (Kritis)."' },
      { label: 'Engine B (Optimasi Jadwal)', desc: 'AI menggabungkan output Engine A dan Engine C. Karena IGD akan ramai (A) dan Ns. Rina sedang kelelahan (C), maka jadwal pintar (B) tidak akan menempatkan Ns. Rina di IGD pada shift malam minggu depan. Jadwal final ini lalu dikirim kembali ke HP Tenaga Medis.' },
    ],
  },
  {
    title: '5. Penjelasan Detail Halaman Admin',
    icon: ShieldCheck,
    content: 'Rincian menu yang tersedia di sidebar Admin:',
    items: [
      { label: 'Command Center', desc: 'Dashboard operasional utama. Menampilkan KPI burnout, grafik risiko per unit, grafik beban per shift, dan heatmap kelelahan matriks hari/shift.' },
      { label: 'Data Tenaga Medis SIMRS', desc: 'Daftar master data pegawai. Menampilkan identitas, profesi, unit, dan jam kerja saat ini.' },
      { label: 'Jadwal & Antrean', desc: 'Tampilan live status antrean pasien per poliklinik dan kuota layanan harian dokter.' },
      { label: 'Shift Swap & Approval', desc: 'Panel persetujuan untuk pengajuan tukar shift tenaga medis.' },
      { label: 'Burnout Radar', desc: 'Visualisasi khusus Engine C. Menampilkan Radar Chart profil kelelahan unit dan tabel pemantauan staf risiko tinggi beserta rekomendasi AI.' },
      { label: 'Clinical Load Forecast', desc: 'Visualisasi khusus Engine A. Menampilkan Area Chart prediksi lonjakan beban pasien selama 14 hari ke depan.' },
      { label: 'Auto Rostering Simulation', desc: 'Visualisasi khusus Engine B. Menampilkan grafik perbandingan dampak sebelum vs sesudah optimasi jadwal, serta tabel rekomendasi strategis penjadwalan per unit.' },
    ],
  },
  {
    title: '6. Halaman Direktur (Executive Dashboard)',
    icon: BarChart3,
    content: 'Dashboard khusus jajaran direksi (/direktur). Alur penggunaannya adalah direktur membuka halaman ini sekali seminggu/sebulan untuk melihat Ringkasan Risiko Total, Tren Burnout Mingguan, dan membaca Rekomendasi Strategis level tinggi untuk pengambilan keputusan kebijakan RS.'
  },
  {
    title: '7. Tabel Data SIMRS (Dokumentasi)',
    icon: Database,
    content: 'Halaman (/tabel-data-simrs) yang mensimulasikan struktur database asli rumah sakit. Menampilkan skema tabel (seperti patient_records, staff_schedules, attendance_logs) yang dikonsumsi oleh AI.'
  },
  {
    title: '8. Istilah & Singkatan Unit Medis',
    icon: Info,
    content: 'Sistem HEALv2 menggunakan singkatan unit standar rumah sakit:',
    items: [
      { label: 'IGD', desc: 'Instalasi Gawat Darurat — Unit pertama penerima pasien darurat. (Risiko burnout tertinggi).' },
      { label: 'ICU / NICU / PICU', desc: 'Intensive Care Unit (Dewasa / Bayi / Anak) — Ruang perawatan kritis.' },
      { label: 'OK', desc: 'Operatie Kamer — Kamar Operasi untuk tindakan pembedahan.' },
      { label: 'VK', desc: 'Verlos Kamer — Ruang Bersalin khusus ibu hamil.' },
    ],
  },
];

export default function PanduanPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-[#106e00] to-[#095300] text-white px-4 sm:px-8 py-6" style={{ boxShadow: '0 4px 16px rgba(16,110,0,0.3), inset 0 1px 0 rgba(57,255,20,0.15)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">Panduan Komprehensif & Alur Pengguna</h1>
            </div>
            <p className="text-xs sm:text-sm opacity-80">Dokumentasi mendalam tentang fungsi halaman, alur sistem (user flow), dan cara kerja AI</p>
          </div>
          <span className="clay-badge bg-white/20 text-white border border-white/30 text-xs">
            <BookOpen className="w-3 h-3" />
            Full Reference
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
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
              <div className="space-y-3 ml-3">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                    <ArrowRight className="w-4 h-4 text-[#ffb74d] mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-on-surface block mb-1">{item.label}</span>
                      <span className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</span>
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
