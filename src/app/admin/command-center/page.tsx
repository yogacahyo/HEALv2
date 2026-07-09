"use client";

import { KPICard } from "@/components/common/KPICard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ResponsiveChartCard } from "@/components/common/ResponsiveChartCard";
import {
  AlertTriangle,
  Activity,
  Users,
  TrendingUp,
  Brain,
  Lightbulb,
  Sparkles,
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

// Data dummy Risiko Burnout per Unit (B)
const burnoutPerUnitData = [
  { unit: "IGD", risiko: 86 },
  { unit: "ICU/NICU/PICU", risiko: 82 },
  { unit: "Kamar Operasi", risiko: 74 },
  { unit: "Ruang Bersalin", risiko: 71 },
  { unit: "Isolasi/Onkologi", risiko: 68 },
];

const burnoutBarColors = ["#c62828", "#e57373", "#ffb74d", "#ffb74d", "#81c784"];

// Data dummy Beban Kerja per Shift (C)
const bebanKerjaData = [
  { unit: "IGD", Pagi: 78, Sore: 84, Malam: 92 },
  { unit: "ICU/NICU/PICU", Pagi: 75, Sore: 80, Malam: 88 },
  { unit: "Kamar Operasi", Pagi: 86, Sore: 72, Malam: 58 },
  { unit: "Ruang Bersalin", Pagi: 66, Sore: 74, Malam: 85 },
  { unit: "Isolasi/Onkologi", Pagi: 70, Sore: 69, Malam: 73 },
];

// Data dummy Heatmap Risiko Kelelahan (D)
const heatmapData: { hari: string; Pagi: number; Sore: number; Malam: number }[] = [
  { hari: "Senin", Pagi: 2, Sore: 2, Malam: 3 },
  { hari: "Selasa", Pagi: 1, Sore: 2, Malam: 3 },
  { hari: "Rabu", Pagi: 2, Sore: 3, Malam: 4 },
  { hari: "Kamis", Pagi: 1, Sore: 2, Malam: 3 },
  { hari: "Jumat", Pagi: 2, Sore: 3, Malam: 4 },
  { hari: "Sabtu", Pagi: 3, Sore: 3, Malam: 4 },
  { hari: "Minggu", Pagi: 3, Sore: 4, Malam: 4 },
];

const risikoLabel: Record<number, string> = {
  1: "Rendah",
  2: "Sedang",
  3: "Tinggi",
  4: "Kritis",
};

const risikoColor: Record<number, string> = {
  1: "#e8f5e9",
  2: "#fff8e1",
  3: "#fff3e0",
  4: "#fce8e8",
};

const risikoTextColor: Record<number, string> = {
  1: "#106e00",
  2: "#f57f17",
  3: "#e65100",
  4: "#c62828",
};

// Data Insight AI (H)
const aiInsights = [
  {
    id: 1,
    text: "IGD menjadi unit dengan risiko burnout tertinggi karena kombinasi lonjakan pasien malam, shift beruntun, dan kebutuhan respons cepat.",
    severity: "high" as const,
  },
  {
    id: 2,
    text: "ICU / NICU / PICU membutuhkan pengendalian lembur yang lebih ketat karena tingginya tuntutan monitoring pasien kritis.",
    severity: "high" as const,
  },
  {
    id: 3,
    text: "Kamar Operasi perlu pengaturan jadwal elektif yang lebih seimbang agar durasi kerja panjang tidak menumpuk pada tim yang sama.",
    severity: "medium" as const,
  },
  {
    id: 4,
    text: "Ruang Bersalin membutuhkan sistem on-call yang lebih terstruktur untuk mengurangi kecemasan staf saat hari libur.",
    severity: "medium" as const,
  },
  {
    id: 5,
    text: "Isolasi / Onkologi membutuhkan rotasi berkala untuk menurunkan compassion fatigue pada perawat.",
    severity: "low" as const,
  },
];

const tooltipStyle = {
  borderRadius: "16px",
  border: "none",
  boxShadow:
    "4px 4px 10px rgba(0,0,0,0.08), -2px -2px 6px rgba(255,255,255,0.8), inset 1px 1px 2px rgba(255,255,255,0.6)",
  fontFamily: "Plus Jakarta Sans",
};

export default function CommandCenterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Command Center"
          subtitle="Dashboard ringkasan eksekutif — pemantauan burnout dan efektivitas optimasi shift tenaga medis"
          simulationLabel="Simulation Mode"
        />
        <div className="flex items-center gap-2">
          <span className="clay-badge bg-[#e8f5e9] text-[#106e00] border border-[#a5d6a7] text-xs">
            <Brain className="w-3 h-3" />
            AI Core Engine Aktif
          </span>
        </div>
      </div>

      {/* Data Integration Status */}
      <div className="clay-card-sm p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#106e00] font-medium">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse-soft" />
            Sistem AI Shifting Aktif
          </div>
          <div className="text-outline-variant">|</div>
          <div className="text-on-surface-variant">
            Unit Terpantau: 5 Unit Prioritas
          </div>
          <div className="text-outline-variant">|</div>
          <div className="text-on-surface-variant">
            Engine: Peramalan • Pelacak Kelelahan • Optimasi Jadwal
          </div>
        </div>
      </div>

      {/* KPI Grid (A) - Dashboard Ringkasan Eksekutif */}
      <div className="kpi-grid">
        <KPICard
          title="Rata-rata Risiko Burnout"
          value="64%"
          subtitle="Risiko burnout gabungan dokter dan perawat pada unit prioritas"
          icon={AlertTriangle}
          color="amber"
        />
        <KPICard
          title="Unit Risiko Tertinggi"
          value="IGD"
          subtitle="Unit dengan kombinasi beban kerja, stres, dan shift malam tertinggi"
          icon={Activity}
          color="rose"
        />
        <KPICard
          title="Staf Membutuhkan Istirahat"
          value="28 orang"
          subtitle="Staf dengan skor kelelahan tinggi atau jadwal kerja berisiko"
          icon={Users}
          color="rose"
        />
        <KPICard
          title="Efektivitas Optimasi Jadwal"
          value="82%"
          subtitle="Tingkat keberhasilan AI dalam menurunkan konflik shift dan beban berlebih"
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* (B) Grafik Risiko Burnout per Unit */}
        <ResponsiveChartCard
          title="Risiko Burnout Berdasarkan Unit Prioritas"
          subtitle="Grafik ini menunjukkan tingkat risiko burnout berdasarkan kombinasi beban pasien, intensitas shift malam, lembur, dan skor kesejahteraan staf."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={burnoutPerUnitData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#ebefed"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#6b7c63" }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <YAxis
                dataKey="unit"
                type="category"
                tick={{ fontSize: 11, fill: "#6b7c63" }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "#f6faf8" }}
                formatter={(value: any) => [`${value}%`, "Risiko Burnout"]}
              />
              <Bar dataKey="risiko" radius={[0, 8, 8, 0]} name="Risiko Burnout (%)">
                {burnoutPerUnitData.map((_, index) => (
                  <Cell key={index} fill={burnoutBarColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>

        {/* (C) Distribusi Beban Kerja per Shift */}
        <ResponsiveChartCard
          title="Distribusi Beban Kerja per Shift"
          subtitle="Visualisasi ini membantu mengidentifikasi unit dan waktu kerja dengan tekanan operasional tertinggi."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={bebanKerjaData}
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
                domain={[0, 100]}
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
                dataKey="Pagi"
                fill="#ffb300"
                radius={[4, 4, 0, 0]}
                name="Shift Pagi"
              />
              <Bar
                dataKey="Sore"
                fill="#e65100"
                radius={[4, 4, 0, 0]}
                name="Shift Sore"
              />
              <Bar
                dataKey="Malam"
                fill="#283593"
                radius={[4, 4, 0, 0]}
                name="Shift Malam"
              />
            </BarChart>
          </ResponsiveContainer>
        </ResponsiveChartCard>
      </div>

      {/* (D) Heatmap Risiko Kelelahan */}
      <div>
        <SectionHeader
          title="Peta Risiko Kelelahan Berdasarkan Hari dan Shift"
          subtitle="Heatmap ini menampilkan pola kelelahan tenaga medis berdasarkan akumulasi shift dan intensitas kerja mingguan."
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
                {heatmapData.map((row) => (
                  <tr
                    key={row.hari}
                    className="border-b border-surface-container"
                  >
                    <td className="p-3 text-xs font-medium text-on-surface">
                      {row.hari}
                    </td>
                    {(["Pagi", "Sore", "Malam"] as const).map((shift) => {
                      const level = row[shift];
                      return (
                        <td key={shift} className="p-2 text-center">
                          <div
                            className="rounded-xl py-2 px-3 text-xs font-semibold mx-auto max-w-[120px]"
                            style={{
                              backgroundColor: risikoColor[level],
                              color: risikoTextColor[level],
                            }}
                          >
                            {risikoLabel[level]}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Legenda Heatmap */}
          <div className="p-4 border-t border-surface-container-high">
            <div className="flex flex-wrap gap-4 text-xs">
              {[1, 2, 3, 4].map((level) => (
                <div key={level} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: risikoColor[level] }}
                  />
                  <span style={{ color: risikoTextColor[level] }}>
                    {risikoLabel[level]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* (H) AI Insight Center */}
      <div>
        <SectionHeader
          title="Insight Otomatis Berbasis AI"
          subtitle="Analisis cerdas dari tiga AI Core Engine terhadap kondisi terkini unit prioritas"
        />
        <div className="space-y-3">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`clay-card-sm p-4 border-l-4 ${
                insight.severity === "high"
                  ? "border-l-[#e57373]"
                  : insight.severity === "medium"
                    ? "border-l-[#ffb74d]"
                    : "border-l-[#81c784]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <div className="flex items-start gap-2 flex-1">
                  <Lightbulb
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      insight.severity === "high"
                        ? "text-[#e57373]"
                        : insight.severity === "medium"
                          ? "text-[#ffb74d]"
                          : "text-[#81c784]"
                    }`}
                  />
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {insight.text}
                  </p>
                </div>
                <StatusBadge
                  status={
                    insight.severity === "high"
                      ? "Tinggi"
                      : insight.severity === "medium"
                        ? "Sedang"
                        : "Rendah"
                  }
                />
              </div>
              <p className="text-[10px] text-outline mt-1 ml-6">
                Sumber: AI Core Engine — Analisis Otomatis
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer notice */}
      <p className="text-xs text-outline text-center py-4">
        Data yang ditampilkan merupakan dataset simulasi AI Shifting untuk
        pemantauan burnout tenaga medis. Implementasi produksi membutuhkan
        validasi keamanan, audit akses, dan kepatuhan kebijakan rumah sakit.
      </p>
    </div>
  );
}
