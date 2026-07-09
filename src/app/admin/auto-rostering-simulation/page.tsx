"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { KPICard } from "@/components/common/KPICard";
import {
  CalendarClock,
  Users,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

// Types
interface DailyShift {
  day: number;
  shift: string;
}

interface StaffSchedule {
  nama: string;
  profesi: string;
  unit: string;
  risiko: string;
  dailyShifts: DailyShift[];
  totalShift: number;
  totalPagi: number;
  totalSore: number;
  totalMalam: number;
  totalOff: number;
  fairnessScore: number;
  status: string;
}

interface ConflictInfo {
  staff: string;
  unit: string;
  tanggal: string;
  jenis: string;
  penyebab: string;
  rekomendasi: string;
}

// Seed Data
const dummyStaffList = [
  {
    nama: "dr. Andika Pratama",
    profesi: "Dokter",
    unit: "IGD",
    risiko: "Kritis",
  },
  {
    nama: "Ns. Rina Wulandari",
    profesi: "Perawat",
    unit: "ICU / NICU / PICU",
    risiko: "Tinggi",
  },
  {
    nama: "dr. Maya Lestari",
    profesi: "Dokter",
    unit: "Kamar Operasi",
    risiko: "Tinggi",
  },
  {
    nama: "Ns. Siti Aisyah",
    profesi: "Perawat",
    unit: "Ruang Bersalin",
    risiko: "Sedang",
  },
  {
    nama: "Ns. Dwi Santoso",
    profesi: "Perawat",
    unit: "Isolasi / Onkologi",
    risiko: "Sedang",
  },
  {
    nama: "dr. Bima Saputra",
    profesi: "Dokter",
    unit: "IGD",
    risiko: "Sedang",
  },
  {
    nama: "Ns. Laila Putri",
    profesi: "Perawat",
    unit: "ICU / NICU / PICU",
    risiko: "Sedang",
  },
  {
    nama: "Ns. Arif Hidayat",
    profesi: "Perawat",
    unit: "IGD",
    risiko: "Tinggi",
  },
  {
    nama: "dr. Citra Dewi",
    profesi: "Dokter",
    unit: "Ruang Bersalin",
    risiko: "Sedang",
  },
  {
    nama: "Ns. Yoga Prasetyo",
    profesi: "Perawat",
    unit: "Kamar Operasi",
    risiko: "Rendah",
  },
  {
    nama: "Ns. Hana Maharani",
    profesi: "Perawat",
    unit: "Isolasi / Onkologi",
    risiko: "Rendah",
  },
  {
    nama: "dr. Fajar Nugroho",
    profesi: "Dokter",
    unit: "ICU / NICU / PICU",
    risiko: "Sedang",
  },
];

function generateScheduleData() {
  const daysInMonth = 31;
  const schedules: StaffSchedule[] = [];
  const conflicts: ConflictInfo[] = [];

  const baseSequence = ["P", "S", "M", "O"];

  for (let i = 0; i < dummyStaffList.length; i++) {
    const staff = dummyStaffList[i];
    const dailyShifts: DailyShift[] = [];

    let totalShift = 0;
    let totalPagi = 0;
    let totalSore = 0;
    let totalMalam = 0;
    let totalOff = 0;

    const sequenceOffset = i % 4;

    for (let day = 1; day <= daysInMonth; day++) {
      let shift = baseSequence[(day + sequenceOffset) % 4];

      // Aturan khusus berdasarkan risiko dan unit
      if (staff.risiko === "Kritis" || staff.risiko === "Tinggi") {
        if (shift === "M" && day % 3 === 0) {
          shift = "O"; // kurangi shift malam
        }
      }

      if (shift !== "O" && shift !== "C") totalShift++;
      if (shift === "P") totalPagi++;
      if (shift === "S") totalSore++;
      if (shift === "M") totalMalam++;
      if (shift === "O") totalOff++;

      dailyShifts.push({ day, shift });
    }

    const fairnessScore = Math.max(
      0,
      100 - Math.max(0, totalMalam - 6) * 5 - Math.max(0, totalShift - 22) * 4,
    );

    let status = "Aman";
    if (fairnessScore < 70) status = "Rekomendasi Revisi";
    else if (totalMalam > 6) status = "Perlu Review";

    schedules.push({
      ...staff,
      dailyShifts,
      totalShift,
      totalPagi,
      totalSore,
      totalMalam,
      totalOff,
      fairnessScore,
      status,
    });
  }

  return { schedules, conflicts };
}

// Komponen Badge Shift
const ShiftBadge = ({ shift }: { shift: string }) => {
  let bgColor = "";
  let textColor = "";
  let tooltip = "";

  switch (shift) {
    case "P":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      tooltip = "Shift Pagi 07:00–14:00";
      break;
    case "S":
      bgColor = "bg-amber-100";
      textColor = "text-amber-800";
      tooltip = "Shift Sore 14:00–21:00";
      break;
    case "M":
      bgColor = "bg-slate-700";
      textColor = "text-slate-100";
      tooltip = "Shift Malam 21:00–07:00";
      break;
    case "O":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      tooltip = "Off / Istirahat";
      break;
    case "C":
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      tooltip = "Cuti";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      tooltip = "";
  }

  return (
    <div className="relative group flex items-center justify-center w-7 h-7 shrink-0">
      <div
        className={`w-full h-full flex items-center justify-center rounded-md text-xs font-bold cursor-default ${bgColor} ${textColor}`}
        title={tooltip}
      >
        {shift}
      </div>
    </div>
  );
};

export default function AutoRosteringPage() {
  const { schedules: allSchedules, conflicts: allConflicts } = useMemo(
    () => generateScheduleData(),
    [],
  );

  const [filterUnit, setFilterUnit] = useState("Semua Unit");
  const [filterProfesi, setFilterProfesi] = useState("Semua Profesi");
  const [filterRisiko, setFilterRisiko] = useState("Semua Risiko");

  const filteredSchedules = useMemo(() => {
    return allSchedules.filter((s) => {
      if (filterUnit !== "Semua Unit" && s.unit !== filterUnit) return false;
      if (filterProfesi !== "Semua Profesi" && s.profesi !== filterProfesi)
        return false;
      if (filterRisiko !== "Semua Risiko" && !s.risiko.includes(filterRisiko))
        return false;

      return true;
    });
  }, [allSchedules, filterUnit, filterProfesi, filterRisiko]);

  const filteredConflicts = useMemo(() => {
    return allConflicts.filter((c) => {
      if (filterUnit !== "Semua Unit" && c.unit !== filterUnit) return false;
      return true;
    });
  }, [allConflicts, filterUnit]);

  // Aggregate KPIs
  const totalStaff = filteredSchedules.length;
  const totalSlots = filteredSchedules.reduce(
    (acc, curr) => acc + curr.totalShift,
    0,
  );
  const totalConflicts = filteredConflicts.length;
  const avgFairness =
    totalStaff > 0
      ? Math.round(
          filteredSchedules.reduce((acc, curr) => acc + curr.fairnessScore, 0) /
            totalStaff,
        )
      : 0;

  const handleReset = () => {
    setFilterUnit("Semua Unit");
    setFilterProfesi("Semua Profesi");
    setFilterRisiko("Semua Risiko");
  };

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Auto Rostering Simulation" />
      </div>

      {/* Main Simulation Table */}
      <div>
        <div className="clay-card-sm overflow-hidden">
          <div className="w-full overflow-x-auto max-w-full pb-4">
            <table className="w-full text-sm border-collapse min-w-max">
              <thead>
                <tr className="bg-surface-container border-b border-surface-container-high">
                  <th className="sticky left-0 z-30 bg-surface-container text-center p-3 font-semibold text-on-surface-variant text-xs border-r border-surface-container-high min-w-[40px] max-w-[40px]">
                    No
                  </th>
                  <th className="sticky left-[40px] z-30 bg-surface-container text-left p-3 font-semibold text-on-surface-variant text-xs border-r border-surface-container-high min-w-[160px] max-w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] xl:shadow-none">
                    Nama Staf
                  </th>
                  <th className="static xl:sticky xl:left-[200px] z-30 bg-surface-container text-left p-3 font-semibold text-on-surface-variant text-xs border-r border-surface-container-high min-w-[90px] max-w-[90px]">
                    Profesi
                  </th>
                  <th className="static xl:sticky xl:left-[290px] z-30 bg-surface-container text-left p-3 font-semibold text-on-surface-variant text-xs border-r border-surface-container-high min-w-[140px] max-w-[140px]">
                    Unit
                  </th>

                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <th
                      key={day}
                      className="text-center p-2 font-semibold text-on-surface-variant text-xs border-r border-surface-container-high min-w-[40px] max-w-[40px]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((staff, index) => (
                    <tr
                      key={staff.nama}
                      className="border-b border-surface-container hover:bg-surface-container/50"
                    >
                      <td className="sticky left-0 z-10 bg-surface text-center p-3 text-xs font-medium text-on-surface border-r border-surface-container-high min-w-[40px] max-w-[40px]">
                        {index + 1}
                      </td>
                      <td className="sticky left-[40px] z-10 bg-surface p-3 text-xs font-bold text-on-surface border-r border-surface-container-high truncate min-w-[160px] max-w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] xl:shadow-none">
                        {staff.nama}
                      </td>
                      <td className="static xl:sticky xl:left-[200px] z-10 bg-surface p-3 border-r border-surface-container-high min-w-[90px] max-w-[90px]">
                        <StatusBadge
                          status={
                            staff.profesi === "Dokter" ? "dokter" : "perawat"
                          }
                        />
                      </td>
                      <td className="static xl:sticky xl:left-[290px] z-10 bg-surface p-3 text-xs text-on-surface-variant border-r border-surface-container-high truncate min-w-[140px] max-w-[140px]">
                        {staff.unit}
                      </td>

                      {staff.dailyShifts.map((ds) => (
                        <td
                          key={ds.day}
                          className="p-1 border-r border-surface-container-high text-center min-w-[40px] max-w-[40px]"
                        >
                          <div className="flex justify-center">
                            <ShiftBadge shift={ds.shift} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={35}
                      className="p-8 text-center text-sm text-on-surface-variant"
                    >
                      Tidak ada data staf yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Legend */}
        <div className="clay-card-sm p-4">
          <h4 className="text-xs font-semibold text-on-surface-variant mb-2">
            Legenda Shift
          </h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                P
              </div>{" "}
              <span>Pagi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                S
              </div>{" "}
              <span>Sore</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-700 text-slate-100 flex items-center justify-center font-bold">
                M
              </div>{" "}
              <span>Malam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-green-100 text-green-800 flex items-center justify-center font-bold">
                O
              </div>{" "}
              <span>Off</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold">
                C
              </div>{" "}
              <span>Cuti</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
