"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import { ResponsiveChartCard } from "@/components/common/ResponsiveChartCard";
import {
  CalendarClock,
  Users,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

// (E) Tabel Rekomendasi Jadwal Cerdas
const rekomendasiJadwal = [
  {
    unit: "IGD",
    risikoSaatIni: "Kritis",
    masalahUtama: "Lonjakan pasien malam dan shift beruntun",
    rekomendasiAI:
      "Terapkan shift maksimal 8 jam, rotasi maju, dan jeda 24 jam setelah shift malam",
    dampak: "Penurunan fatigue dan risiko kesalahan kerja",
    prioritas: "Sangat Tinggi",
  },
  {
    unit: "ICU / NICU / PICU",
    risikoSaatIni: "Tinggi",
    masalahUtama:
      "Beban emosional tinggi dan kebutuhan monitoring pasien kritis",
    rekomendasiAI:
      "Batasi lembur, hindari double-shift, dan jaga rasio perawat-pasien 1:1 atau 1:2",
    dampak: "Peningkatan fokus klinis dan keselamatan pasien",
    prioritas: "Sangat Tinggi",
  },
  {
    unit: "Kamar Operasi",
    risikoSaatIni: "Tinggi",
    masalahUtama: "Operasi panjang dan penumpukan jadwal elektif",
    rekomendasiAI:
      "Seimbangkan jadwal operasi elektif dan berikan waktu pemulihan setelah operasi panjang",
    dampak: "Penurunan kelelahan fisik dan peningkatan kesiapan tim operasi",
    prioritas: "Tinggi",
  },
  {
    unit: "Ruang Bersalin",
    risikoSaatIni: "Sedang",
    masalahUtama: "Lonjakan persalinan malam dan panggilan mendadak",
    rekomendasiAI:
      "Susun on-call team terstruktur dan jadwal cadangan yang transparan",
    dampak: "Penurunan kecemasan staf dan peningkatan kesiapan layanan",
    prioritas: "Tinggi",
  },
  {
    unit: "Isolasi / Onkologi",
    risikoSaatIni: "Sedang",
    masalahUtama:
      "Compassion fatigue dan interaksi jangka panjang dengan pasien kronis",
    rekomendasiAI: "Terapkan rotasi periodik antar-bangsal setiap 6 bulan",
    dampak: "Penyegaran mental dan penurunan kelelahan emosional",
    prioritas: "Menengah-Tinggi",
  },
];

// (G) Data Sebelum vs Sesudah Optimasi
const optimasiData = [
  {
    indikator: "Risiko Double-Shift",
    Sebelum: 38,
    Sesudah: 14,
    satuan: "%",
  },
  {
    indikator: "Beban Tidak Merata",
    Sebelum: 46,
    Sesudah: 21,
    satuan: "%",
  },
  {
    indikator: "Staf Burnout Tinggi",
    Sebelum: 34,
    Sesudah: 18,
    satuan: "orang",
  },
  {
    indikator: "Konflik Jadwal",
    Sebelum: 41,
    Sesudah: 17,
    satuan: "kasus",
  },
];

const tooltipStyle = {
  borderRadius: "16px",
  border: "none",
  boxShadow:
    "4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)",
  fontFamily: "Plus Jakarta Sans",
};

export default function AutoRosteringPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Mesin Optimasi Jadwal Cerdas"
        subtitle="Engine B — Otak utama sistem yang menerima input dari Engine A (Peramalan) dan Engine C (Kelelahan) untuk menyusun jadwal optimal yang adil, aman, dan sesuai batas risiko burnout"
        simulationLabel="Simulation Mode"
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Jadwal Teroptimasi"
          value="152"
          subtitle="Total jadwal shift yang berhasil dioptimasi bulan ini"
          icon={CalendarClock}
          color="green"
        />
        <KPICard
          title="Konflik Dikurangi"
          value="24 kasus"
          subtitle="Potensi konflik jadwal yang berhasil dieliminasi"
          icon={CheckCircle}
          color="blue"
        />
        <KPICard
          title="Double-Shift Dicegah"
          value="32%"
          subtitle="Penurunan risiko double-shift dari optimasi"
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="Pemerataan Beban"
          value="82%"
          subtitle="Tingkat pemerataan beban kerja antar-staf"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* (G) Grafik Sebelum dan Sesudah Optimasi */}
      <ResponsiveChartCard
        title="Perbandingan Kondisi Sebelum dan Sesudah Optimasi AI"
        subtitle="Grafik ini menunjukkan dampak AI dalam menurunkan konflik jadwal, risiko double-shift, dan jumlah staf dengan risiko burnout tinggi."
        height={300}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={optimasiData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ebefed"
            />
            <XAxis
              dataKey="indikator"
              tick={{ fontSize: 10, fill: "#6b7c63" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7c63" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "#f6faf8" }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            />
            <Bar
              dataKey="Sebelum"
              fill="#e57373"
              radius={[4, 4, 0, 0]}
              name="Sebelum Optimasi"
            />
            <Bar
              dataKey="Sesudah"
              fill="#106e00"
              radius={[4, 4, 0, 0]}
              name="Sesudah Optimasi"
            />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      {/* Detail Sebelum vs Sesudah */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {optimasiData.map((item) => {
          const penurunan = item.Sebelum - item.Sesudah;
          const pct = Math.round((penurunan / item.Sebelum) * 100);
          return (
            <div key={item.indikator} className="clay-card-sm p-4">
              <p className="text-xs font-semibold text-on-surface-variant mb-2">
                {item.indikator}
              </p>
              <div className="flex items-end gap-3 mb-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-[#c62828]">
                    {item.Sebelum}
                    <span className="text-xs ml-0.5">{item.satuan}</span>
                  </p>
                  <p className="text-[10px] text-outline">Sebelum</p>
                </div>
                <span className="text-outline text-sm mb-1">→</span>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#106e00]">
                    {item.Sesudah}
                    <span className="text-xs ml-0.5">{item.satuan}</span>
                  </p>
                  <p className="text-[10px] text-outline">Sesudah</p>
                </div>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[10px] text-[#106e00] font-semibold mt-1">
                ↓ {pct}% penurunan
              </p>
            </div>
          );
        })}
      </div>

      {/* (E) Tabel Rekomendasi Jadwal Cerdas */}
      <div>
        <SectionHeader
          title="Tabel Rekomendasi Jadwal Cerdas"
          subtitle="Rekomendasi optimasi jadwal per unit berdasarkan analisis Engine A dan Engine C"
        />
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Unit
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Risiko Saat Ini
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Masalah Utama
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Rekomendasi AI
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Dampak yang Diharapkan
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Prioritas
                  </th>
                </tr>
              </thead>
              <tbody>
                {rekomendasiJadwal.map((row) => (
                  <tr
                    key={row.unit}
                    className="border-b border-surface-container hover:bg-surface-container/50"
                  >
                    <td className="p-3 text-xs font-medium text-on-surface whitespace-nowrap">
                      {row.unit}
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={row.risikoSaatIni} />
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant max-w-[180px]">
                      {row.masalahUtama}
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant max-w-[220px]">
                      {row.rekomendasiAI}
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant max-w-[180px]">
                      {row.dampak}
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={row.prioritas} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insight */}
      <div className="clay-card-sm p-4 border-l-4 border-l-[#81c784]">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-[#106e00] mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            <strong>Insight Engine B:</strong> Optimasi jadwal berhasil
            menurunkan potensi double-shift sebesar 32% dan meningkatkan
            pemerataan beban kerja antar-staf. Sistem merekomendasikan
            penerapan rotasi maju (pagi → sore → malam) di seluruh unit
            prioritas untuk hasil optimal.
          </p>
        </div>
      </div>

      {/* Legenda Prioritas */}
      <div className="clay-card-sm p-4">
        <h4 className="text-xs font-semibold text-on-surface-variant mb-2">
          Legenda Prioritas
        </h4>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#fce8e8]" />
            <span className="text-[#c62828]">Kritis / Sangat Tinggi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#fff8e1]" />
            <span className="text-[#f57f17]">Tinggi / Sedang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#e8f5e9]" />
            <span className="text-[#106e00]">Rendah / Menengah</span>
          </div>
        </div>
      </div>
    </div>
  );
}
