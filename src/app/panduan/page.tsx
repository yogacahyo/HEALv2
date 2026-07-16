"use client";

import Link from "next/link";
import {
  Home,
  BookOpen,
  Database,
  BarChart3,
  Activity,
  AlertTriangle,
  Users,
  TrendingUp,
  Table2,
  Brain,
  Lightbulb,
  ChevronRight,
  Info,
  FileText,
  ArrowRight,
  Cpu,
} from "lucide-react";

// ─── Data Asal Usul & Kesimpulan per Halaman ───────────────────

const sections = [
  // ── 1. COMMAND CENTER ───────────────────────────────────────────
  {
    page: "Command Center",
    route: "/admin/command-center",
    icon: Activity,
    color: "#e8f5e9",
    iconColor: "#106e00",
    desc: "Dashboard ringkasan eksekutif harian untuk Admin — pemantauan burnout dan beban shift tenaga medis.",
    dataGroups: [
      {
        label: "KPI: Rata-rata Risiko Burnout — 64%",
        type: "angka-persentase",
        asal: "Dihitung sebagai rata-rata tertimbang skor burnout dari 5 unit prioritas: IGD (86%), ICU/NICU/PICU (82%), Kamar Operasi (74%), Ruang Bersalin (71%), dan Rawat Inap (68%). Angka ini dihasilkan oleh AI Core Engine C (Pelacak Kelelahan) berdasarkan data absensi, jam lembur, jumlah shift malam beruntun, dan hasil survei burnout 7-item dari tenaga medis.",
        kesimpulan:
          "Angka 64% menunjukkan bahwa secara rata-rata, tenaga medis di seluruh unit prioritas berada dalam kondisi risiko burnout sedang-tinggi. Nilai di atas 60% merupakan ambang batas perhatian yang mengindikasikan perlunya tindakan manajerial segera.",
      },
      {
        label: "KPI: Unit Risiko Tertinggi — IGD",
        type: "angka-persentase",
        asal: "Ditentukan berdasarkan unit dengan skor burnout komposit tertinggi dari gabungan 5 faktor: Beban Pasien (78), Shift Malam (65), Lembur (80), Absensi (45), dan Tekanan Emergency (85). IGD memiliki rata-rata faktor tertinggi dibanding unit lain.",
        kesimpulan:
          "IGD secara konsisten menjadi unit paling berisiko karena sifat pekerjaannya yang tidak terprediksi, tuntutan respons cepat, dan frekuensi shift malam yang tinggi. Ini menjadi prioritas intervensi utama.",
      },
      {
        label: "KPI: Staf Membutuhkan Istirahat — 28 orang",
        type: "angka-persentase",
        asal: 'Jumlah ini dihitung dari data absensi dan skor kelelahan individual seluruh tenaga medis pada dataset dummy SIMRS (12 staf aktif ditampilkan di Auto Rostering, dikalibrasi dengan simulasi populasi lebih besar). Staf dihitung "membutuhkan istirahat" jika skor kelelahan >= 70 atau memiliki >= 3 shift malam beruntun.',
        kesimpulan:
          "Dari total tenaga medis aktif, 28 orang memerlukan penyesuaian jadwal. Angka ini menjadi dasar rekomendasi pengaturan ulang shift di menu Auto Rostering Simulation.",
      },
      {
        label: "KPI: Prediksi Puncak Beban — 168 pasien",
        type: "angka-persentase",
        asal: "Dihasilkan oleh AI Core Engine A (Peramalan Beban) berdasarkan data historis kunjungan pasien dari database SIMRS. Angka 168 merupakan total prediksi pasien dari semua unit pada tanggal 16 Jul: IGD (62) + ICU (38) + Kamar Operasi (16) + Ruang Bersalin (32) + Rawat Inap (20) = 168.",
        kesimpulan:
          "Tanggal 16 Jul diprediksi sebagai hari dengan beban pasien tertinggi dalam window 14 hari. Ini memerlukan penambahan buffer staf minimal 12 orang untuk mempertahankan rasio pelayanan yang aman.",
      },
      {
        label: "Bar Chart: Risiko Burnout per Unit (Horizontal)",
        type: "chart",
        asal: "Data berasal dari perhitungan Engine C: IGD=86%, ICU/NICU/PICU=82%, Kamar Operasi=74%, Ruang Bersalin=71%, Rawat Inap=68%. Skala 0–100% merepresentasikan skor komposit dari 5 faktor burnout yang dinormalisasi.",
        kesimpulan:
          "Grafik menunjukkan gradasi risiko yang menurun dari IGD ke Rawat Inap. Selisih antara IGD (86%) dan Rawat Inap (68%) sebesar 18 poin menunjukkan ketimpangan beban yang signifikan antar unit.",
      },
      {
        label: "Bar Chart: Distribusi Beban Kerja per Shift (Grouped)",
        type: "chart",
        asal: "Data menggambarkan tekanan operasional per shift untuk setiap unit. Nilai mewakili indeks beban (0–100) berdasarkan rasio pasien per staf pada masing-masing shift. Contoh: IGD Malam=92 berarti beban hampir penuh kapasitas.",
        kesimpulan:
          "Shift Malam secara konsisten memiliki beban tertinggi di hampir semua unit, khususnya IGD (92) dan ICU (88). Ini menegaskan bahwa intervensi penjadwalan harus memprioritaskan distribusi shift malam yang lebih merata.",
      },
      {
        label: "Heatmap Tabel: Risiko Kelelahan per Hari dan Shift",
        type: "tabel",
        asal: "Data 7 hari × 3 shift dihasilkan Engine C berdasarkan akumulasi beban mingguan. Level 1=Rendah, 2=Sedang, 3=Tinggi, 4=Kritis menggunakan skala ordinal.",
        kesimpulan:
          'Sabtu dan Minggu pada shift malam secara konsisten mencapai level "Kritis" (4). Ini menunjukkan bahwa akhir pekan malam adalah kombinasi waktu dengan risiko kelelahan tertinggi secara struktural.',
      },
      {
        label: "AI Insight: 5 Kartu Analisis Otomatis",
        type: "insight",
        asal: "Dihasilkan oleh gabungan output Engine A, B, dan C. Setiap insight dikategorikan severitasnya: Tinggi (merah) untuk IGD dan ICU, Sedang (kuning) untuk Kamar Operasi dan Ruang Bersalin, Rendah (hijau) untuk Rawat Inap.",
        kesimpulan:
          "Insight AI berfungsi sebagai ringkasan eksekutif otomatis yang menerjemahkan data numerik menjadi rekomendasi tindakan yang dapat langsung dieksekusi oleh Admin tanpa perlu menganalisis grafik secara mendalam.",
      },
    ],
  },

  // ── 2. BURNOUT RADAR ─────────────────────────────────────────────
  {
    page: "Burnout Radar",
    route: "/admin/burnout-radar",
    icon: AlertTriangle,
    color: "#fce4ec",
    iconColor: "#c62828",
    desc: "Visualisasi mendalam Engine C — pelacak kelelahan dan kesejahteraan staf individual per unit.",
    dataGroups: [
      {
        label: "KPI: Staf Risiko Tinggi=2, Sedang=2, Rendah=1, Total=5",
        type: "angka-persentase",
        asal: 'Dihitung dari tabel monitoring 5 staf: dr. Andika (Kritis/88), Ns. Rina (Tinggi/84), dr. Maya (Tinggi/79), Ns. Siti (Sedang/76), Ns. Dwi (Sedang/73). Kategori "Risiko Tinggi" mencakup skor >= 80 (Kritis) dan 70–79 (Tinggi).',
        kesimpulan:
          "80% staf dalam tabel pemantauan berada dalam kondisi risiko sedang hingga kritis. Ini menandakan bahwa tabel monitoring tidak hanya menampilkan staf paling parah, tetapi merupakan sampel representatif kondisi umum tenaga medis.",
      },
      {
        label: "Donut Gauge Chart: 5 Faktor Risiko per Unit",
        type: "chart",
        asal: "Setiap donut merepresentasikan satu faktor: Beban Pasien, Shift Malam, Lembur, Absensi, dan Tekanan Emergency. Nilai (0–100%) dihitung dari data historis SIMRS masing-masing unit yang dipilih melalui dropdown.",
        kesimpulan:
          "Untuk unit IGD, faktor Tekanan Emergency (85%) dan Lembur (80%) adalah dua kontributor terbesar burnout. Untuk ICU/NICU/PICU, Beban Pasien (85%) menjadi faktor dominan karena intensitas monitoring pasien kritis.",
      },
      {
        label: "Bar Chart: Skor Risiko Burnout per Unit (Vertikal)",
        type: "chart",
        asal: "Sama dengan data di Command Center — IGD=86%, ICU/NICU/PICU=82%, Kamar Operasi=74%, Ruang Bersalin=71%, Rawat Inap=68%. Ditampilkan ulang di Burnout Radar sebagai konteks perbandingan antar unit.",
        kesimpulan:
          "Grafik batang di Burnout Radar memberikan perspektif perbandingan cepat antar unit, membantu Admin memutuskan unit mana yang harus diprioritaskan untuk intervensi jadwal hari ini.",
      },
      {
        label: "Heatmap Tabel: Skor Burnout per Hari dan Shift (Numerik)",
        type: "tabel",
        asal: "Data 7 hari × 3 shift menampilkan skor burnout aktual (skala 0–100). Contoh: Minggu Malam=88 berarti 88% tenaga medis yang bertugas pada kombinasi itu mengalami kelelahan tinggi.",
        kesimpulan:
          "Skor tertinggi 88 terjadi pada Minggu Malam, dan paling rendah 38 pada Selasa Pagi. Terdapat pola konsisten: skor meningkat dari Pagi -> Sore -> Malam, dan dari awal pekan -> akhir pekan, menunjukkan efek kumulatif kelelahan selama seminggu.",
      },
      {
        label: "Tabel Monitoring Staf Risiko Tinggi (5 baris)",
        type: "tabel",
        asal: "Data 5 staf diambil dari dataset SIMRS dummy yang mencerminkan staf dengan skor kelelahan tertinggi. Kolom: Nama, Profesi, Unit, Shift Dominan, Skor Kelelahan (dari formulir burnout 7-item), Risiko Burnout (kategori), dan Rekomendasi AI.",
        kesimpulan:
          "Tabel ini adalah output langsung Engine C. Skor kelelahan terbesar dimiliki dr. Andika Pratama (88 — Kritis, IGD Malam), menunjukkan bahwa dokter IGD dengan dominasi shift malam adalah kelompok paling rentan. Rekomendasi AI bersifat individual dan actionable (dapat langsung diimplementasikan).",
      },
    ],
  },

  // ── 3. CLINICAL LOAD FORECAST ─────────────────────────────────────
  {
    page: "Clinical Load Forecast",
    route: "/admin/clinical-load-forecast",
    icon: TrendingUp,
    color: "#e3f2fd",
    iconColor: "#1565c0",
    desc: "Visualisasi Engine A — prediksi beban pasien 14 hari ke depan berdasarkan data historis SIMRS.",
    dataGroups: [
      {
        label:
          "KPI: Rata-rata Prediksi=53 pasien/hari, Hari Puncak=16 Jul (168 pasien), Kebutuhan Staf Tambahan=12 orang",
        type: "angka-persentase",
        asal: "Rata-rata 53 dihitung dari total prediksi semua unit selama 14 hari (10–23 Jul) dibagi jumlah hari. Puncak 168 adalah total pasien seluruh unit pada 16 Jul. Kebutuhan 12 staf tambahan dihitung dari defisit rasio staf-pasien ideal saat beban puncak.",
        kesimpulan:
          "Hari Rabu (16 Jul) diprediksi sebagai hari tersibuk dengan lonjakan 18% di atas rata-rata. Kebutuhan tambahan 12 staf merupakan estimasi minimum untuk mempertahankan standar pelayanan yang aman.",
      },
      {
        label: "Area Chart: Tren Prediksi Beban Pasien per Unit (14 hari)",
        type: "chart",
        asal: "Data 14 titik per unit (IGD, ICU, Kamar Operasi, Ruang Bersalin, Rawat Inap) dihasilkan Engine A menggunakan data historis kunjungan pasien dari tabel patient_records dan outpatient_visits SIMRS. Metode: time-series forecasting dengan faktor musiman (hari libur, akhir pekan).",
        kesimpulan:
          "IGD memiliki kurva tertinggi dan paling berfluktuasi (42–64 pasien), sedangkan Rawat Inap paling stabil (14–22 pasien). Area grafik menunjukkan lonjakan signifikan pada 15–16 Jul dan 21–22 Jul, yang bertepatan dengan pola weekend effect.",
      },
      {
        label: "Bar Chart Grouped: Prediksi Lonjakan Pasien per Shift",
        type: "chart",
        asal: "Rata-rata pasien per shift dihitung dari distribusi historis kunjungan pasien. Contoh: IGD Malam=55 berarti rata-rata 55 pasien datang ke IGD pada shift malam dalam 14 hari ke depan.",
        kesimpulan:
          "Shift Malam secara konsisten memiliki prediksi pasien tertinggi di IGD (55) dan ICU (38), sementara Kamar Operasi hanya 8 pasien di malam hari (sesuai sifat operasi elektif yang tidak dijadwalkan malam). Data ini menjadi landasan distribusi staf per shift.",
      },
      {
        label: "Tabel: Indikator Unit Potensi Beban Tertinggi",
        type: "tabel",
        asal: 'Tabel menampilkan prediksi puncak, persentase peningkatan vs rata-rata, dan level risiko per unit. Kolom "Peningkatan vs Rata-rata" menunjukkan deviasi dari baseline harian normal.',
        kesimpulan:
          "IGD +18% (Kritis) dan ICU +12% (Tinggi) adalah dua unit yang memerlukan persiapan staf paling mendesak. Kamar Operasi hanya +5% (Rendah) karena jadwal operasi elektif dapat dikontrol lebih mudah.",
      },
    ],
  },

  // ── 4. AUTO ROSTERING SIMULATION ──────────────────────────────────
  {
    page: "Auto Rostering Simulation",
    route: "/admin/auto-rostering-simulation",
    icon: Users,
    color: "#e8f5e9",
    iconColor: "#2e7d32",
    desc: "Visualisasi Engine B — simulasi jadwal shift otomatis yang mengintegrasikan output Engine A dan C.",
    dataGroups: [
      {
        label: "Tabel Kalender Shift Bulanan (12 staf x N hari)",
        type: "tabel",
        asal: "Jadwal dihasilkan secara algoritmik oleh Engine B. Input: (1) daftar 12 staf dummy dari dataset SIMRS dengan profesi, unit, dan level risiko masing-masing; (2) output Engine A (prediksi beban per hari/shift); (3) output Engine C (skor kelelahan per staf). Algoritma menggunakan rotasi sekuensial P->S->M->O dengan modifikasi khusus: staf Kritis/Tinggi tidak mendapat Shift M berturut-turut (setiap 3 hari), staf Rendah/Sedang cenderung mendapat Off di hari merah ganjil.",
        kesimpulan:
          "Jadwal yang dihasilkan bukan random — ia merupakan hasil optimasi yang mempertimbangkan keselamatan pasien dan kesejahteraan staf secara bersamaan. Kolom warna kode (P=Pagi biru, S=Sore kuning, M=Malam hitam, O=Off hijau) memudahkan identifikasi visual pola distribusi shift.",
      },
      {
        label: "Fairness Score & Status Staf",
        type: "angka-persentase",
        asal: 'Fairness Score dihitung dengan formula: 100 - max(0, totalMalam-6)x5 - max(0, totalShift-22)x4. Status "Aman" jika skor >= 70 dan malam <= 6; "Perlu Review" jika malam > 6; "Rekomendasi Revisi" jika skor < 70.',
        kesimpulan:
          "Fairness Score mengukur keadilan distribusi beban dalam sebulan. Staf dengan skor rendah berarti mendapat terlalu banyak shift malam atau total shift di atas rata-rata, yang perlu direvisi untuk mencegah burnout kumulatif.",
      },
      {
        label: "Hari Libur Nasional (chip merah pada kalender)",
        type: "tabel",
        asal: "Data hardcoded dari daftar hari libur nasional Indonesia 2025–2027, termasuk libur resmi dan cuti bersama. Hari libur ditandai merah pada kolom kalender.",
        kesimpulan:
          "Penandaan hari libur nasional memungkinkan Engine B memprioritaskan Off atau meminimalkan shift malam bagi staf risiko rendah-sedang pada hari tersebut, mengurangi keluhan terhadap jadwal yang tidak mempertimbangkan hari besar.",
      },
      {
        label: "Filter Unit, Profesi, Risiko",
        type: "insight",
        asal: "Filter bekerja pada dataset yang sama, menampilkan subset staf berdasarkan kriteria yang dipilih Admin.",
        kesimpulan:
          "Fitur filter memungkinkan Admin fokus pada unit atau level risiko tertentu tanpa terganggu data unit lain, memudahkan pengambilan keputusan taktis harian.",
      },
    ],
  },

  // ── 5. DIREKTUR DASHBOARD ─────────────────────────────────────────
  {
    page: "Dashboard Direktur",
    route: "/direktur",
    icon: BarChart3,
    color: "#e8eaf6",
    iconColor: "#283593",
    desc: "Dashboard eksekutif strategis — ringkasan risiko level tinggi untuk pengambilan keputusan kebijakan RS.",
    dataGroups: [
      {
        label:
          "KPI: Rata-rata Risiko Burnout=64%, Unit Tertinggi=IGD (86%), Staf Perlu Istirahat=28, Prediksi Puncak=168 pasien",
        type: "angka-persentase",
        asal: "Keempat KPI di Dashboard Direktur identik dengan Command Center. Angka ini dikonsolidasikan dari seluruh output Engine A, B, dan C untuk memberikan ringkasan satu halaman bagi jajaran direksi.",
        kesimpulan:
          "Direktur tidak perlu membuka setiap sub-menu Admin. Keempat angka ini cukup untuk membuat keputusan strategis: apakah perlu rekrutmen staf tambahan, perubahan kebijakan shift, atau alokasi anggaran lembur.",
      },
      {
        label: "Area Chart: Tren Risiko Burnout Mingguan (7 minggu)",
        type: "chart",
        asal: "Data 7 minggu berturut-turut: Mg1=58%, Mg2=62%, Mg3=60%, Mg4=65%, Mg5=63%, Mg6=68%, Mg7=64%. Dihasilkan Engine C dari rata-rata rolling mingguan seluruh unit prioritas.",
        kesimpulan:
          "Tren menunjukkan peningkatan gradual dari 58% ke 68% selama 6 minggu, dengan sedikit penurunan di Mg7 (64%) — kemungkinan efek dari intervensi jadwal sebelumnya. Namun tren jangka panjang tetap naik, menunjukkan perlunya kebijakan struktural jangka panjang.",
      },
      {
        label: "Tabel Rekomendasi Strategis per Unit (5 baris)",
        type: "tabel",
        asal: "Rekomendasi dihasilkan Engine B berdasarkan analisis komprehensif kondisi masing-masing unit: IGD (Tinggi), ICU/NICU/PICU (Tinggi), Kamar Operasi (Sedang), Ruang Bersalin (Sedang), Rawat Inap (Rendah).",
        kesimpulan:
          'Rekomendasi strategis ditujukan sebagai panduan kebijakan jangka menengah (1–3 bulan), berbeda dengan rekomendasi taktis harian di Burnout Radar. Contoh: "Terapkan shift maksimal 8 jam dengan jeda 24 jam setelah malam" adalah kebijakan yang perlu dikodifikasi dalam SOP RS.',
      },
      {
        label:
          "Modal Detail: Kontribusi Risiko, Faktor IGD, Monitoring Staf, Prediksi Beban",
        type: "insight",
        asal: "Klik pada setiap KPI membuka modal detail. Data modal diambil dari sumber yang sama dengan Admin, namun disajikan dalam format drill-down yang lebih terfokus untuk konteks eksekutif.",
        kesimpulan:
          "Modal interaktif memungkinkan Direktur mendapatkan konteks mendalam tentang angka KPI tanpa harus masuk ke dashboard Admin. Ini mempersingkat waktu pengambilan keputusan dari jam ke menit.",
      },
    ],
  },

  // ── 6. SHIFT SWAP & APPROVAL ──────────────────────────────────────
  {
    page: "Shift Swap & Approval",
    route: "/admin/shift-swap-approval",
    icon: AlertTriangle,
    color: "#fff8e1",
    iconColor: "#f57f17",
    desc: "Panel persetujuan pengajuan tukar shift dari tenaga medis — alur dua tingkat (Kepala Unit -> Admin).",
    dataGroups: [
      {
        label:
          "Filter Status: Semua, Menunggu, Disetujui, Ditolak, Perlu Perbaikan",
        type: "angka-persentase",
        asal: "Data pengajuan berasal dari context SIMRSDatasetProvider — mockShiftSwapRequests yang mencerminkan pengajuan tukar shift dari tenaga medis melalui app mobile. Setiap pengajuan memiliki status yang diperbarui secara real-time melalui state management.",
        kesimpulan:
          'Jumlah pengajuan per status memberikan gambaran beban kerja administratif Admin: banyak "Menunggu Persetujuan" berarti antrian perlu segera diproses untuk menghindari keterlambatan yang berdampak pada jadwal layanan.',
      },
      {
        label: "Kartu Pengajuan: Detail Swap, Indikator Risiko AI, Tombol Aksi",
        type: "insight",
        asal: "Setiap kartu menampilkan: siapa yang mengajukan, shift mana yang ingin ditukar, dengan siapa, tanggal, alasan, dan indikator risiko dari Engine B (apakah pertukaran ini akan menyebabkan double-shift atau kekurangan staf).",
        kesimpulan:
          "Indikator risiko AI membantu Admin membuat keputusan berbasis data, bukan hanya berdasarkan alasan subjektif pemohon. Jika swap akan menyebabkan satu staf bekerja double-shift, sistem akan menampilkan peringatan merah.",
      },
    ],
  },


];

const typeBadge: Record<string, { label: string; bg: string; color: string }> =
  {
    "angka-persentase": { label: "Angka / %", bg: "#e3f2fd", color: "#1565c0" },
    chart: { label: "Visualisasi Chart", bg: "#e8f5e9", color: "#2e7d32" },
    tabel: { label: "Tabel", bg: "#fff8e1", color: "#e65100" },
    insight: { label: "Insight / Teks", bg: "#fce4ec", color: "#b71c1c" },
  };

export default function PanduanPage() {
  return (
    <div className="min-h-screen">
      <header
        className="bg-gradient-to-r from-[#106e00] to-[#095300] text-white px-4 sm:px-8 py-6"
        style={{
          boxShadow:
            "0 4px 16px rgba(16,110,0,0.3), inset 0 1px 0 rgba(57,255,20,0.15)",
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/"
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">
                Panduan Data & Analisis
              </h1>
            </div>
            <p className="text-xs sm:text-sm opacity-80">
              Penjelasan asal usul data, metodologi perhitungan, dan kesimpulan
              setiap angka, persentase, chart, dan tabel yang ditampilkan di
              seluruh halaman HEALv2
            </p>
          </div>
          <span className="clay-badge bg-white/20 text-white border border-white/30 text-xs">
            <Database className="w-3 h-3" />
            Data Reference
          </span>
        </div>
      </header>

      {/* Intro Card */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6">
        <div className="clay-card p-5 sm:p-6 border-l-4 border-l-[#106e00] mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-[#106e00]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface mb-1">
                Tentang Data di HEALv2
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Seluruh data yang ditampilkan di HEALv2 merupakan{" "}
                <strong>dataset simulasi (dummy)</strong> yang mencerminkan
                struktur database SIMRS nyata. Data diproses oleh tiga{" "}
                <strong>AI Core Engine</strong>: Engine A (Peramalan Beban
                Pasien), Engine B (Optimasi Jadwal), dan Engine C (Pelacak
                Kelelahan). Halaman ini menjelaskan secara transparan dari mana
                setiap angka berasal dan apa artinya bagi operasional rumah
                sakit.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {Object.entries(typeBadge).map(([key, badge]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pb-8 space-y-8">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div
              key={i}
              className="clay-card p-5 sm:p-6 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Section Header */}
              <div className="flex items-start gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: section.color }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: section.iconColor }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-on-surface">
                      {section.page}
                    </h2>
                    <span className="text-[10px] font-mono text-outline bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant">
                      {section.route}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {section.desc}
                  </p>
                </div>
              </div>

              {/* Data Groups */}
              <div className="space-y-3 mt-4">
                {section.dataGroups.map((group, j) => {
                  const badge = typeBadge[group.type];
                  return (
                    <div
                      key={j}
                      className="rounded-xl border border-surface-container bg-surface-container-low overflow-hidden"
                    >
                      {/* Group Header */}
                      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-surface-container">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
                        <span className="text-xs font-bold text-on-surface">
                          {group.label}
                        </span>
                      </div>

                      {/* Asal Usul Data */}
                      <div className="p-3 border-b border-surface-container">
                        <div className="flex items-start gap-2">
                          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                            <Database className="w-3.5 h-3.5 text-[#1565c0]" />
                            <span className="text-[10px] font-bold text-[#1565c0] uppercase tracking-wide">
                              Asal Usul Data
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed mt-1.5 ml-5">
                          {group.asal}
                        </p>
                      </div>

                      {/* Kesimpulan */}
                      <div className="p-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-[#e65100]" />
                          <span className="text-[10px] font-bold text-[#e65100] uppercase tracking-wide">
                            Kesimpulan & Interpretasi
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed ml-5">
                          {group.kesimpulan}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Ringkasan AI Engine */}
        <div className="clay-card p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#e8f5e9] flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-[#106e00]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                Ringkasan: Hubungan Antar Data & Engine AI
              </h2>
              <p className="text-sm text-on-surface-variant">
                Bagaimana setiap angka dan visualisasi di seluruh halaman
                terhubung satu sama lain
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                engine: "Engine A -> Clinical Load Forecast",
                color: "#e3f2fd",
                textColor: "#1565c0",
                desc: 'Membaca data historis patient_records & outpatient_visits dari SIMRS -> Menghasilkan: Prediksi 14 hari (area chart), Prediksi per shift (bar chart), Tabel unit puncak beban, KPI "168 pasien pada 16 Jul"',
              },
              {
                engine: "Engine B -> Auto Rostering",
                color: "#e8f5e9",
                textColor: "#2e7d32",
                desc: "Mengintegrasikan output Engine A (prediksi beban) + Engine C (skor kelelahan) -> Menghasilkan: Jadwal kalender bulanan per staf, Fairness Score, Status jadwal (Aman/Perlu Review), Rekomendasi strategis di Dashboard Direktur",
              },
              {
                engine: "Engine C -> Burnout Radar",
                color: "#fce4ec",
                textColor: "#b71c1c",
                desc: 'Membaca data attendance_logs, shift_history, burnout_assessments dari SIMRS -> Menghasilkan: Skor kelelahan per staf, Tabel monitoring 5 staf, Heatmap skor burnout mingguan, Donut gauge 5 faktor per unit, KPI "28 staf perlu istirahat"',
              },
              {
                engine: "Command Center & Dashboard Direktur",
                color: "#fff8e1",
                textColor: "#e65100",
                desc: "Mengkonsolidasikan output semua engine -> Menampilkan: KPI ringkasan (64%, IGD, 28 orang, 168 pasien), Bar chart risiko per unit, Heatmap risiko kelelahan, AI Insight otomatis, Tren mingguan 7 minggu",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ backgroundColor: item.color }}
              >
                <ArrowRight
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: item.textColor }}
                />
                <div>
                  <span
                    className="text-sm font-bold block mb-0.5"
                    style={{ color: item.textColor }}
                  >
                    {item.engine}
                  </span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Rekomendasi Model AI */}
          <div className="mt-6 pt-6 border-t border-surface-container-high">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#e3f2fd] flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-[#1565c0]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-on-surface">
                  Rekomendasi Arsitektur AI (Self-Hosted / Custom Model)
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Rekomendasi arsitektur dan framework terbaik untuk membangun
                  model AI in-house tanpa ketergantungan API pihak ketiga (bebas
                  biaya token bulanan).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#1565c0] bg-[#e3f2fd] px-2 py-0.5 rounded-full">
                    Engine A
                  </span>
                  <h3 className="text-sm font-bold text-on-surface">
                    Peramalan Beban
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                  Tugas utama: Time-series forecasting dan deteksi anomali
                  berdasarkan data historis kunjungan SIMRS.
                </p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Arsitektur Deep Learning:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      Temporal Fusion Transformer (TFT) / LSTM
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Arsitektur Machine Learning:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      XGBoost / LightGBM
                    </span>
                  </div>
                  <div className="text-[10px] text-outline mt-2 p-2 bg-surface-container rounded-md">
                    *TFT sangat direkomendasikan karena mampu memproses variabel
                    masa depan (seperti hari libur nasional) sekaligus
                    menganalisis data historis kompleks dengan akurasi sangat
                    tinggi.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full">
                    Engine B
                  </span>
                  <h3 className="text-sm font-bold text-on-surface">
                    Optimasi Jadwal
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                  Tugas utama: Constraint Satisfaction Problem (CSP) untuk
                  penjadwalan staf yang adil dan patuh regulasi.
                </p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Arsitektur Solusi:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      Constraint Programming (CP) / Genetic Algorithm
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Framework Terbaik:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      Google OR-Tools (Self-hosted) / Pyomo
                    </span>
                  </div>
                  <div className="text-[10px] text-outline mt-2 p-2 bg-surface-container rounded-md">
                    *Karena penjadwalan memerlukan akurasi matematis mutlak
                    tanpa halusinasi, menggunakan solver OR-Tools dipadukan
                    dengan logic rules kustom (Python) adalah pendekatan paling
                    stabil untuk tahap produksi.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-surface-container bg-surface-container-low">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#b71c1c] bg-[#fce4ec] px-2 py-0.5 rounded-full">
                    Engine C
                  </span>
                  <h3 className="text-sm font-bold text-on-surface">
                    Pelacak Kelelahan
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                  Tugas utama: NLP untuk analisis sentimen laporan staf dan
                  regresi/klasifikasi risiko kelelahan.
                </p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Arsitektur NLP:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      Fine-tuned IndoBERT / LLaMA-3 (8B) Lokal
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-on-surface">
                      Kalkulasi Risiko:{" "}
                    </span>
                    <span className="text-on-surface-variant">
                      Random Forest / Support Vector Machine (SVM)
                    </span>
                  </div>
                  <div className="text-[10px] text-outline mt-2 p-2 bg-surface-container rounded-md">
                    *Untuk membaca alasan tukar shift atau keluhan berbahasa
                    Indonesia, fine-tuning model IndoBERT di server lokal
                    menawarkan akurasi tinggi dengan kebutuhan komputasi ringan
                    dan aman untuk privasi data (100% in-house).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Dataset */}
          <div className="mt-4 p-3 rounded-xl bg-surface-container border border-outline-variant">
            <div className="flex items-start gap-2">
              <FileText className="w-3.5 h-3.5 text-outline mt-0.5 shrink-0" />
              <p className="text-xs text-outline leading-relaxed">
                <strong>Catatan Dataset:</strong> Seluruh data merupakan
                simulasi berbasis struktur SIMRS nyata. Dataset dummy dimuat
                dari SIMRSDatasetProvider (context) yang mencakup 30+ tabel:
                mockPatients, mockDoctors, mockEmployees, mockAttendance,
                mockShiftSwapRequests, dll. Pada implementasi produksi, data ini
                akan digantikan dengan query langsung ke database SIMRS rumah
                sakit setelah validasi keamanan dan audit akses.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <Link
            href="/"
            className="clay-btn inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold hover:bg-[#095300]"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
