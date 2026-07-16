"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import { ResponsiveChartCard } from "@/components/common/ResponsiveChartCard";
import { AlertTriangle, Users, Shield, Lightbulb } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";

// Data dummy skor burnout per unit (untuk bar chart)
const burnoutPerUnitBar = [
  { name: "IGD", score: 86, fill: "#095300" },
  { name: "ICU/NICU/PICU", score: 82, fill: "#106e00" },
  { name: "Kamar Operasi", score: 74, fill: "#1b5e20" },
  { name: "Ruang Bersalin", score: 71, fill: "#2ae500" },
  { name: "Rawat Inap", score: 68, fill: "#39ff14" },
];

// Data untuk Gauge Burnout Risk per Unit
const unitGaugeData = {
  IGD: [
    { subject: "Beban Pasien", value: 78 },
    { subject: "Shift Malam", value: 65 },
    { subject: "Lembur", value: 80 },
    { subject: "Absensi", value: 45 },
    { subject: "Tekanan Emergency", value: 85 },
  ],
  ICU_NICU_PICU: [
    { subject: "Beban Pasien", value: 85 },
    { subject: "Shift Malam", value: 70 },
    { subject: "Lembur", value: 75 },
    { subject: "Absensi", value: 40 },
    { subject: "Tekanan Emergency", value: 80 },
  ],
  KamarOperasi: [
    { subject: "Beban Pasien", value: 70 },
    { subject: "Shift Malam", value: 50 },
    { subject: "Lembur", value: 85 },
    { subject: "Absensi", value: 30 },
    { subject: "Tekanan Emergency", value: 75 },
  ],
  RuangBersalin: [
    { subject: "Beban Pasien", value: 75 },
    { subject: "Shift Malam", value: 60 },
    { subject: "Lembur", value: 70 },
    { subject: "Absensi", value: 35 },
    { subject: "Tekanan Emergency", value: 80 },
  ],
  RawatInap: [
    { subject: "Beban Pasien", value: 65 },
    { subject: "Shift Malam", value: 80 },
    { subject: "Lembur", value: 60 },
    { subject: "Absensi", value: 50 },
    { subject: "Tekanan Emergency", value: 60 },
  ],
};

const unitLabelMap: Record<keyof typeof unitGaugeData, string> = {
  IGD: "Unit IGD",
  ICU_NICU_PICU: "Unit ICU/NICU/PICU",
  KamarOperasi: "Unit Kamar Operasi",
  RuangBersalin: "Unit Ruang Bersalin",
  RawatInap: "Unit Rawat Inap",
};

const DonutGauge = ({ value, label }: { value: number; label: string }) => {
  const data = [
    { name: "Value", value: value, fill: "#1b5e20" }, // Green match with web theme
    { name: "Remainder", value: 100 - value, fill: "#ebefed" }, // Light track
  ];
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-[14%] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.05)]">
          <span className="text-lg sm:text-xl font-bold text-on-surface">
            {value}%
          </span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-semibold text-on-surface-variant mt-3 text-center leading-tight whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};

// Data tabel monitoring staf risiko tinggi (I)
const staffMonitoring = [
  {
    nama: "dr. Andika Pratama",
    profesi: "Dokter",
    unit: "IGD",
    shiftDominan: "Malam",
    skorFatigue: 88,
    risikoBurnout: "Kritis",
    rekomendasiAI: "Jeda 24 jam dan hindari shift malam berikutnya",
  },
  {
    nama: "Ns. Rina Wulandari",
    profesi: "Perawat",
    unit: "ICU",
    shiftDominan: "Malam",
    skorFatigue: 84,
    risikoBurnout: "Tinggi",
    rekomendasiAI: "Batasi lembur dan rotasi ke shift sore",
  },
  {
    nama: "dr. Maya Lestari",
    profesi: "Dokter",
    unit: "Kamar Operasi",
    shiftDominan: "Pagi",
    skorFatigue: 79,
    risikoBurnout: "Tinggi",
    rekomendasiAI: "Kurangi jadwal operasi panjang berturut-turut",
  },
  {
    nama: "Ns. Siti Aisyah",
    profesi: "Perawat",
    unit: "Ruang Bersalin",
    shiftDominan: "Malam",
    skorFatigue: 76,
    risikoBurnout: "Sedang",
    rekomendasiAI: "Atur ulang jadwal on-call",
  },
  {
    nama: "Ns. Dwi Santoso",
    profesi: "Perawat",
    unit: "Rawat Inap",
    shiftDominan: "Sore",
    skorFatigue: 73,
    risikoBurnout: "Sedang",
    rekomendasiAI: "Rekomendasikan rotasi bangsal periodik",
  },
];

// Heatmap burnout berdasarkan hari dan shift
const heatmapBurnout: {
  hari: string;
  Pagi: number;
  Sore: number;
  Malam: number;
}[] = [
  { hari: "Senin", Pagi: 42, Sore: 55, Malam: 72 },
  { hari: "Selasa", Pagi: 38, Sore: 50, Malam: 68 },
  { hari: "Rabu", Pagi: 45, Sore: 58, Malam: 78 },
  { hari: "Kamis", Pagi: 40, Sore: 52, Malam: 70 },
  { hari: "Jumat", Pagi: 48, Sore: 62, Malam: 80 },
  { hari: "Sabtu", Pagi: 55, Sore: 68, Malam: 85 },
  { hari: "Minggu", Pagi: 58, Sore: 72, Malam: 88 },
];

function getHeatColor(val: number) {
  if (val >= 80) return { bg: "#d0f9d6", text: "#095300" };
  if (val >= 60) return { bg: "#e0fbe3", text: "#106e00" };
  if (val >= 45) return { bg: "#edfced", text: "#1b5e20" };
  return { bg: "#f6faf8", text: "#6b7c63" };
}

const tooltipStyle = {
  borderRadius: "16px",
  border: "none",
  boxShadow:
    "4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)",
  fontFamily: "Plus Jakarta Sans",
};

export default function BurnoutRadarPage() {
  const [selectedUnit, setSelectedUnit] =
    useState<keyof typeof unitGaugeData>("IGD");
  const currentGaugeData = unitGaugeData[selectedUnit];

  return (
    <div className="space-y-6">
      <SectionHeader title="Pelacak Kelelahan & Kesejahteraan Staf" />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KPICard
          title="Staf Risiko Tinggi"
          value={2}
          icon={AlertTriangle}
          color="rose"
        />
        <KPICard
          title="Staf Risiko Sedang"
          value={2}
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="Staf Risiko Rendah"
          value={1}
          icon={Shield}
          color="green"
        />
        <KPICard
          title="Total Staf Terpantau"
          value={5}
          icon={Users}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gauge Chart Grid — Profil Risiko Unit */}
        <ResponsiveChartCard
          title={`Burnout Risk Gauge Grid Dashboard: ${unitLabelMap[selectedUnit]}`}
          subtitle="5 burnout risk factors in the unit with the highest scores."
          height={320}
          headerAction={
            <select
              value={selectedUnit}
              onChange={(e) =>
                setSelectedUnit(e.target.value as keyof typeof unitGaugeData)
              }
              className="text-sm border border-surface-container-high rounded-lg px-2 py-1 bg-surface outline-none focus:ring-1 focus:ring-[#1b5e20]"
            >
              {(Object.keys(unitGaugeData) as Array<keyof typeof unitGaugeData>).map((unit) => (
                <option key={unit} value={unit}>
                  {unitLabelMap[unit]}
                </option>
              ))}
            </select>
          }
        >
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 py-2">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {currentGaugeData.slice(0, 3).map((item, idx) => (
                <DonutGauge key={idx} value={item.value} label={item.subject} />
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
              {currentGaugeData.slice(3, 5).map((item, idx) => (
                <DonutGauge
                  key={idx + 3}
                  value={item.value}
                  label={item.subject}
                />
              ))}
            </div>
          </div>
        </ResponsiveChartCard>

        {/* Bar Chart — Skor Burnout per Unit */}
        <ResponsiveChartCard
          title="Skor Risiko Burnout per Unit Prioritas"
          subtitle="Dihitung dari kombinasi beban pasien, shift malam, lembur, dan kesejahteraan staf"
          height={320}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={burnoutPerUnitBar}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#ebefed"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6b7c63" }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#6b7c63" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#f6faf8" }}
                formatter={(value: any) => [`${value}%`, "Risiko Burnout"]}
              />
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
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs w-24">
                    Hari
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Shift Pagi
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Shift Sore
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Shift Malam
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatmapBurnout.map((row) => (
                  <tr
                    key={row.hari}
                    className="border-b border-surface-container"
                  >
                    <td className="p-3 text-xs font-medium text-on-surface">
                      {row.hari}
                    </td>
                    {(["Pagi", "Sore", "Malam"] as const).map((shift) => {
                      const val = row[shift];
                      const color = getHeatColor(val);
                      return (
                        <td key={shift} className="p-2 text-center">
                          <div
                            className="rounded-xl py-2 px-3 text-xs font-bold mx-auto max-w-[80px]"
                            style={{
                              backgroundColor: color.bg,
                              color: color.text,
                            }}
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
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Nama Staf
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Profesi
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Unit
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Shift Dominan
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Skor Kelelahan
                  </th>
                  <th className="text-center p-3 font-semibold text-on-surface-variant text-xs">
                    Risiko Burnout
                  </th>
                  <th className="text-left p-3 font-semibold text-on-surface-variant text-xs">
                    Rekomendasi AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffMonitoring.map((staff) => (
                  <tr
                    key={staff.nama}
                    className="border-b border-surface-container hover:bg-surface-container/50"
                  >
                    <td className="p-3 text-xs font-medium text-on-surface">
                      {staff.nama}
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        status={
                          staff.profesi === "Dokter" ? "dokter" : "perawat"
                        }
                      />
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant">
                      {staff.unit}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={staff.shiftDominan} />
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-sm font-bold ${
                          staff.skorFatigue >= 80
                            ? "text-[#c62828]"
                            : staff.skorFatigue >= 70
                              ? "text-[#e65100]"
                              : "text-[#f57f17]"
                        }`}
                      >
                        {staff.skorFatigue}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <StatusBadge status={staff.risikoBurnout} />
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant max-w-[200px]">
                      {staff.rekomendasiAI}
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
