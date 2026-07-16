"use client";

import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import { ResponsiveChartCard } from "@/components/common/ResponsiveChartCard";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  Lightbulb,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// Data prediksi beban pasien per unit 14 hari
const forecastData = [
  { tanggal: "10 Jul", IGD: 42, ICU: 28, KamarOperasi: 18, RuangBersalin: 22, RawatInap: 15 },
  { tanggal: "11 Jul", IGD: 45, ICU: 30, KamarOperasi: 22, RuangBersalin: 20, RawatInap: 16 },
  { tanggal: "12 Jul", IGD: 50, ICU: 32, KamarOperasi: 20, RuangBersalin: 25, RawatInap: 14 },
  { tanggal: "13 Jul", IGD: 55, ICU: 35, KamarOperasi: 24, RuangBersalin: 28, RawatInap: 18 },
  { tanggal: "14 Jul", IGD: 52, ICU: 33, KamarOperasi: 19, RuangBersalin: 26, RawatInap: 17 },
  { tanggal: "15 Jul", IGD: 58, ICU: 36, KamarOperasi: 21, RuangBersalin: 30, RawatInap: 19 },
  { tanggal: "16 Jul", IGD: 62, ICU: 38, KamarOperasi: 16, RuangBersalin: 32, RawatInap: 20 },
  { tanggal: "17 Jul", IGD: 48, ICU: 31, KamarOperasi: 23, RuangBersalin: 24, RawatInap: 16 },
  { tanggal: "18 Jul", IGD: 46, ICU: 29, KamarOperasi: 20, RuangBersalin: 22, RawatInap: 15 },
  { tanggal: "19 Jul", IGD: 53, ICU: 34, KamarOperasi: 22, RuangBersalin: 27, RawatInap: 18 },
  { tanggal: "20 Jul", IGD: 56, ICU: 36, KamarOperasi: 18, RuangBersalin: 29, RawatInap: 19 },
  { tanggal: "21 Jul", IGD: 60, ICU: 37, KamarOperasi: 15, RuangBersalin: 31, RawatInap: 21 },
  { tanggal: "22 Jul", IGD: 64, ICU: 40, KamarOperasi: 17, RuangBersalin: 34, RawatInap: 22 },
  { tanggal: "23 Jul", IGD: 58, ICU: 35, KamarOperasi: 20, RuangBersalin: 28, RawatInap: 18 },
];

// Prediksi lonjakan per shift
const shiftPrediction = [
  { unit: "IGD", Pagi: 35, Sore: 42, Malam: 55 },
  { unit: "ICU/NICU/PICU", Pagi: 22, Sore: 28, Malam: 38 },
  { unit: "Kamar Operasi", Pagi: 30, Sore: 18, Malam: 8 },
  { unit: "Ruang Bersalin", Pagi: 15, Sore: 20, Malam: 32 },
  { unit: "Rawat Inap", Pagi: 12, Sore: 14, Malam: 18 },
];

// Indikator unit potensi beban tertinggi
const unitPotensiTertinggi = [
  { unit: "IGD", prediksi: 64, peningkatan: "+18%", level: "Kritis" },
  {
    unit: "ICU / NICU / PICU",
    prediksi: 40,
    peningkatan: "+12%",
    level: "Tinggi",
  },
  {
    unit: "Ruang Bersalin",
    prediksi: 34,
    peningkatan: "+10%",
    level: "Sedang",
  },
  {
    unit: "Rawat Inap",
    prediksi: 22,
    peningkatan: "+8%",
    level: "Sedang",
  },
  { unit: "Kamar Operasi", prediksi: 24, peningkatan: "+5%", level: "Rendah" },
];

const tooltipStyle = {
  borderRadius: "16px",
  border: "none",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  fontFamily: "Plus Jakarta Sans",
};

export default function ClinicalLoadForecastPage() {
  const avgPredicted = 53;
  const peakDay = "16 Jul";
  const peakPatients = 168;

  return (
    <div className="space-y-6">
      <SectionHeader title="Prediksi Beban Kerja" />

      <div className="kpi-grid">
        <KPICard
          title="Rata-rata Prediksi per Hari"
          value={`${avgPredicted} pasien`}
          icon={TrendingUp}
          color="blue"
        />
        <KPICard
          title="Hari Puncak Beban"
          value={peakDay}
          subtitle={`${peakPatients} pasien total`}
          icon={Calendar}
          color="rose"
        />
        <KPICard
          title="Unit Beban Tertinggi"
          value="IGD"
          subtitle="Prediksi lonjakan shift malam +18%"
          icon={AlertTriangle}
          color="rose"
        />
        <KPICard
          title="Kebutuhan Staf Tambahan"
          value="12 orang"
          subtitle="Estimasi berdasarkan rasio ideal"
          icon={Users}
          color="green"
        />
      </div>

      {/* Grafik Tren Prediksi Beban Pasien per Unit */}
      <ResponsiveChartCard
        title="Grafik Tren Prediksi Beban Pasien per Unit"
        subtitle="Peramalan 14 hari ke depan berdasarkan data historis dan faktor musiman"
        height={320}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={forecastData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIGD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#095300" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#095300" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorICU" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ae500" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2ae500" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ebefed"
            />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 10, fill: "#6b7c63" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7c63" }}
              axisLine={false}
              tickLine={false}
              dx={-10}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            />
            <Area
              type="monotone"
              dataKey="IGD"
              name="IGD"
              stroke="#095300"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIGD)"
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="ICU"
              name="ICU/NICU/PICU"
              stroke="#2ae500"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorICU)"
            />
            <Area
              type="monotone"
              dataKey="KamarOperasi"
              name="Kamar Operasi"
              stroke="#106e00"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="RuangBersalin"
              name="Ruang Bersalin"
              stroke="#095300"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="RawatInap"
              name="Rawat Inap"
              stroke="#2ae500"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      {/* Prediksi Lonjakan per Shift */}
      <ResponsiveChartCard
        title="Prediksi Lonjakan Pasien Berdasarkan Shift"
        subtitle="Perbandingan rata-rata prediksi pasien per shift (Pagi, Sore, Malam) di setiap unit"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={shiftPrediction}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ebefed"
            />
            <XAxis
              dataKey="unit"
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
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f6faf8" }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
            />
            <Bar dataKey="Pagi" name="Shift Pagi" fill="#39ff14" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Sore" name="Shift Sore" fill="#2ae500" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Malam" name="Shift Malam" fill="#106e00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveChartCard>

      {/* Indikator Unit Potensi Beban Tertinggi */}
      <div>
        <SectionHeader
          title="Indikator Unit dengan Potensi Beban Kerja Tertinggi"
          subtitle="Prediksi beban puncak berdasarkan tren historis dan faktor musiman"
        />
        <div className="clay-card-sm overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Unit
                  </th>
                  <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">
                    Prediksi Puncak (pasien)
                  </th>
                  <th className="text-right p-3 font-semibold text-on-surface-variant text-xs">
                    Peningkatan vs Rata-rata
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Level Risiko
                  </th>
                </tr>
              </thead>
              <tbody>
                {unitPotensiTertinggi.map((row) => (
                  <tr
                    key={row.unit}
                    className="border-b border-surface-container hover:bg-surface-container/50"
                  >
                    <td className="p-3 text-xs font-medium text-on-surface">
                      {row.unit}
                    </td>
                    <td className="p-3 text-right text-xs font-semibold">
                      {row.prediksi}
                    </td>
                    <td className="p-3 text-right text-xs font-semibold text-[#c62828]">
                      {row.peningkatan}
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={row.level} />
                    </td>
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
