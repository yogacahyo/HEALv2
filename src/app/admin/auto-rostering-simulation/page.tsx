"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getDaysInMonth,
  startOfMonth,
  getDay,
  format,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";

// ─── Types ───────────────────────────────────────────────────
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

// ─── Seed Data ───────────────────────────────────────────────
const dummyStaffList = [
  { nama: "dr. Andika Pratama",  profesi: "Dokter",  unit: "IGD",                  risiko: "Kritis" },
  { nama: "Ns. Rina Wulandari",  profesi: "Perawat", unit: "ICU / NICU / PICU",    risiko: "Tinggi" },
  { nama: "dr. Maya Lestari",    profesi: "Dokter",  unit: "Kamar Operasi",         risiko: "Tinggi" },
  { nama: "Ns. Siti Aisyah",     profesi: "Perawat", unit: "Ruang Bersalin",        risiko: "Sedang" },
  { nama: "Ns. Dwi Santoso",     profesi: "Perawat", unit: "Isolasi / Onkologi",    risiko: "Sedang" },
  { nama: "dr. Bima Saputra",    profesi: "Dokter",  unit: "IGD",                  risiko: "Sedang" },
  { nama: "Ns. Laila Putri",     profesi: "Perawat", unit: "ICU / NICU / PICU",    risiko: "Sedang" },
  { nama: "Ns. Arif Hidayat",    profesi: "Perawat", unit: "IGD",                  risiko: "Tinggi" },
  { nama: "dr. Citra Dewi",      profesi: "Dokter",  unit: "Ruang Bersalin",        risiko: "Sedang" },
  { nama: "Ns. Yoga Prasetyo",   profesi: "Perawat", unit: "Kamar Operasi",         risiko: "Rendah" },
  { nama: "Ns. Hana Maharani",   profesi: "Perawat", unit: "Isolasi / Onkologi",    risiko: "Rendah" },
  { nama: "dr. Fajar Nugroho",   profesi: "Dokter",  unit: "ICU / NICU / PICU",    risiko: "Sedang" },
];

// ─── Hari Libur Nasional Indonesia ───────────────────────────
// Format: "YYYY-MM-DD" → nama libur
const INDONESIAN_HOLIDAYS: Record<string, string> = {
  // ── 2025 ──
  "2025-01-01": "Tahun Baru 2025",
  "2025-01-27": "Isra Mikraj",
  "2025-01-28": "Cuti Bersama Isra Mikraj",
  "2025-01-29": "Tahun Baru Imlek",
  "2025-03-28": "Hari Suci Nyepi",
  "2025-03-29": "Cuti Bersama Nyepi",
  "2025-03-31": "Hari Raya Idul Fitri",
  "2025-04-01": "Hari Raya Idul Fitri",
  "2025-04-02": "Cuti Bersama Idul Fitri",
  "2025-04-03": "Cuti Bersama Idul Fitri",
  "2025-04-04": "Cuti Bersama Idul Fitri",
  "2025-04-07": "Cuti Bersama Idul Fitri",
  "2025-04-18": "Wafat Yesus Kristus",
  "2025-05-01": "Hari Buruh Internasional",
  "2025-05-12": "Hari Raya Waisak",
  "2025-05-13": "Cuti Bersama Waisak",
  "2025-05-29": "Kenaikan Yesus Kristus",
  "2025-05-30": "Cuti Bersama Kenaikan Yesus",
  "2025-06-01": "Hari Lahir Pancasila",
  "2025-06-06": "Hari Raya Idul Adha",
  "2025-06-27": "Tahun Baru Islam 1447 H",
  "2025-08-17": "Hari Kemerdekaan RI",
  "2025-09-05": "Maulid Nabi Muhammad SAW",
  "2025-12-25": "Hari Raya Natal",
  "2025-12-26": "Cuti Bersama Natal",
  // ── 2026 ──
  "2026-01-01": "Tahun Baru 2026",
  "2026-01-16": "Isra Mikraj",
  "2026-01-17": "Tahun Baru Imlek",
  "2026-03-17": "Hari Suci Nyepi",
  "2026-03-20": "Hari Raya Idul Fitri",
  "2026-03-21": "Hari Raya Idul Fitri",
  "2026-03-23": "Cuti Bersama Idul Fitri",
  "2026-03-24": "Cuti Bersama Idul Fitri",
  "2026-04-03": "Wafat Yesus Kristus",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-31": "Hari Raya Waisak",
  "2026-05-27": "Hari Raya Idul Adha",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-16": "Tahun Baru Islam 1448 H",
  "2026-08-17": "Hari Kemerdekaan RI",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-12-25": "Hari Raya Natal",
  // ── 2027 ──
  "2027-01-01": "Tahun Baru 2027",
  "2027-01-06": "Isra Mikraj",
  "2027-01-07": "Tahun Baru Imlek",
  "2027-03-05": "Hari Suci Nyepi",
  "2027-03-09": "Hari Raya Idul Fitri",
  "2027-03-10": "Hari Raya Idul Fitri",
  "2027-03-26": "Wafat Yesus Kristus",
  "2027-05-01": "Hari Buruh Internasional",
  "2027-05-04": "Kenaikan Yesus Kristus",
  "2027-05-20": "Hari Raya Waisak",
  "2027-05-17": "Hari Raya Idul Adha",
  "2027-06-01": "Hari Lahir Pancasila",
  "2027-06-05": "Tahun Baru Islam 1449 H",
  "2027-08-14": "Maulid Nabi Muhammad SAW",
  "2027-08-17": "Hari Kemerdekaan RI",
  "2027-12-25": "Hari Raya Natal",
};

// ─── Helper: get day info for a specific date ─────────────────
function getDayInfo(year: number, month: number, day: number) {
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
  const dateKey = format(d, "yyyy-MM-dd");
  const isHoliday = !!INDONESIAN_HOLIDAYS[dateKey];
  const isWeekend = dayOfWeek === 0; // only Sunday is red
  const isRed = isHoliday || isWeekend;
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const dayLabel = dayNames[dayOfWeek];
  const holidayName = INDONESIAN_HOLIDAYS[dateKey] || null;
  return { isRed, dayLabel, holidayName, dayOfWeek };
}

// ─── Schedule Generator (dynamic per month) ──────────────────
function generateScheduleData(year: number, month: number) {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1));
  const schedules: StaffSchedule[] = [];
  const baseSequence = ["P", "S", "M", "O"];

  for (let i = 0; i < dummyStaffList.length; i++) {
    const staff = dummyStaffList[i];
    const dailyShifts: DailyShift[] = [];

    let totalShift = 0, totalPagi = 0, totalSore = 0, totalMalam = 0, totalOff = 0;
    const sequenceOffset = i % 4;

    for (let day = 1; day <= daysInMonth; day++) {
      const { isRed } = getDayInfo(year, month, day);
      let shift = baseSequence[(day + sequenceOffset) % 4];

      // Pada hari libur/merah: staf risiko Rendah/Sedang cenderung Off
      if (isRed && (staff.risiko === "Rendah" || staff.risiko === "Sedang") && day % 2 === 0) {
        shift = "O";
      }

      // Aturan khusus berdasarkan risiko
      if ((staff.risiko === "Kritis" || staff.risiko === "Tinggi") && shift === "M" && day % 3 === 0) {
        shift = "O";
      }

      if (shift !== "O" && shift !== "C") totalShift++;
      if (shift === "P") totalPagi++;
      if (shift === "S") totalSore++;
      if (shift === "M") totalMalam++;
      if (shift === "O") totalOff++;

      dailyShifts.push({ day, shift });
    }

    const fairnessScore = Math.max(0, 100 - Math.max(0, totalMalam - 6) * 5 - Math.max(0, totalShift - 22) * 4);
    let status = "Aman";
    if (fairnessScore < 70) status = "Rekomendasi Revisi";
    else if (totalMalam > 6) status = "Perlu Review";

    schedules.push({ ...staff, dailyShifts, totalShift, totalPagi, totalSore, totalMalam, totalOff, fairnessScore, status });
  }

  return schedules;
}

// ─── Shift Badge ─────────────────────────────────────────────
const ShiftBadge = ({ shift, isRed }: { shift: string; isRed: boolean }) => {
  let bgColor = "";
  let textColor = "";
  let tooltip = "";

  switch (shift) {
    case "P":
      bgColor = isRed ? "bg-blue-200" : "bg-blue-100";
      textColor = "text-blue-800";
      tooltip = "Shift Pagi 07:00–14:00";
      break;
    case "S":
      bgColor = isRed ? "bg-amber-200" : "bg-amber-100";
      textColor = "text-amber-800";
      tooltip = "Shift Sore 14:00–21:00";
      break;
    case "M":
      bgColor = "bg-slate-700";
      textColor = "text-slate-100";
      tooltip = "Shift Malam 21:00–07:00";
      break;
    case "O":
      bgColor = isRed ? "bg-green-200" : "bg-green-100";
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

// ─── Month names in Indonesian ────────────────────────────────
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// ─── Main Page ────────────────────────────────────────────────
export default function AutoRosteringPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based

  const [filterUnit, setFilterUnit] = useState("Semua Unit");
  const [filterProfesi, setFilterProfesi] = useState("Semua Profesi");
  const [filterRisiko, setFilterRisiko] = useState("Semua Risiko");

  // Navigate months
  const goToPrev = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goToNext = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const daysInMonth = getDaysInMonth(new Date(year, month - 1));

  // Day info array for column headers
  const dayInfos = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => getDayInfo(year, month, i + 1)),
    [year, month, daysInMonth],
  );

  const allSchedules = useMemo(
    () => generateScheduleData(year, month),
    [year, month],
  );

  const filteredSchedules = useMemo(() => {
    return allSchedules.filter((s) => {
      if (filterUnit !== "Semua Unit" && s.unit !== filterUnit) return false;
      if (filterProfesi !== "Semua Profesi" && s.profesi !== filterProfesi) return false;
      if (filterRisiko !== "Semua Risiko" && !s.risiko.includes(filterRisiko)) return false;
      return true;
    });
  }, [allSchedules, filterUnit, filterProfesi, filterRisiko]);

  // Count holidays in this month
  const holidayCount = dayInfos.filter((d) => d.holidayName).length;

  return (
    <div className="space-y-6">
      <div>
        <SectionHeader title="Auto Rostering Simulation" />
      </div>

      {/* Month Navigator */}
      <div className="clay-card-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Title & Month Nav */}
          <div className="flex items-center gap-3">
            <CalendarClock className="w-5 h-5 text-on-surface-variant" />
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrev}
                className="clay-btn p-1.5 hover:bg-surface-container transition-colors"
                title="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
              </button>

              <div className="min-w-[160px] text-center">
                <p className="text-base font-extrabold text-on-surface">
                  {MONTH_NAMES[month - 1]} {year}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {daysInMonth} hari · {holidayCount} hari libur
                </p>
              </div>

              <button
                onClick={goToNext}
                className="clay-btn p-1.5 hover:bg-surface-container transition-colors"
                title="Bulan Berikutnya"
              >
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value)}
              className="clay-input text-xs px-3 py-2"
            >
              <option>Semua Unit</option>
              {[...new Set(dummyStaffList.map((s) => s.unit))].map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>

            <select
              value={filterProfesi}
              onChange={(e) => setFilterProfesi(e.target.value)}
              className="clay-input text-xs px-3 py-2"
            >
              <option>Semua Profesi</option>
              <option>Dokter</option>
              <option>Perawat</option>
            </select>

            <select
              value={filterRisiko}
              onChange={(e) => setFilterRisiko(e.target.value)}
              className="clay-input text-xs px-3 py-2"
            >
              <option>Semua Risiko</option>
              <option>Kritis</option>
              <option>Tinggi</option>
              <option>Sedang</option>
              <option>Rendah</option>
            </select>

            <button
              onClick={() => { setFilterUnit("Semua Unit"); setFilterProfesi("Semua Profesi"); setFilterRisiko("Semua Risiko"); }}
              className="clay-btn text-xs px-3 py-2 text-on-surface-variant hover:bg-surface-container"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Holiday chips */}
        {holidayCount > 0 && (
          <div className="mt-3 pt-3 border-t border-surface-container-high flex flex-wrap gap-1.5">
            {dayInfos.map((info, i) =>
              info.holidayName ? (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full"
                >
                  <span className="font-bold">{i + 1}</span>
                  <span className="text-rose-400">·</span>
                  {info.holidayName}
                </span>
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* Main Simulation Table */}
      <div>
        <div className="clay-card-sm overflow-hidden">
          <div className="w-full overflow-x-auto max-w-full pb-4">
            <table className="w-full text-sm border-collapse min-w-max">
              <thead>
                {/* Row 1: hari (day name) */}
                <tr className="bg-surface-container border-b border-surface-container-high">
                  {/* Sticky columns placeholders */}
                  <th className="sticky left-0 z-30 bg-surface-container border-r border-surface-container-high min-w-[40px] max-w-[40px]" />
                  <th className="sticky left-[40px] z-30 bg-surface-container border-r border-surface-container-high min-w-[160px] max-w-[160px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] xl:shadow-none" />
                  <th className="static xl:sticky xl:left-[200px] z-30 bg-surface-container border-r border-surface-container-high min-w-[90px] max-w-[90px]" />
                  <th className="static xl:sticky xl:left-[290px] z-30 bg-surface-container border-r border-surface-container-high min-w-[140px] max-w-[140px]" />

                  {dayInfos.map((info, i) => (
                    <th
                      key={i}
                      className={`text-center px-1 pt-2 pb-1 text-[10px] font-bold border-r border-surface-container-high min-w-[40px] max-w-[40px] ${
                        info.isRed ? "text-rose-500 bg-rose-50" : "text-on-surface-variant bg-surface-container"
                      }`}
                      title={info.holidayName || ""}
                    >
                      {info.dayLabel}
                    </th>
                  ))}
                </tr>

                {/* Row 2: tanggal */}
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

                  {dayInfos.map((info, i) => (
                    <th
                      key={i}
                      className={`text-center px-1 pb-2 pt-1 font-bold text-xs border-r border-surface-container-high min-w-[40px] max-w-[40px] ${
                        info.isRed
                          ? "text-rose-600 bg-rose-50"
                          : "text-on-surface-variant bg-surface-container"
                      }`}
                      title={info.holidayName || ""}
                    >
                      <span className="flex flex-col items-center gap-0.5">
                        <span>{i + 1}</span>
                        {info.holidayName && (
                          <span className="block w-1.5 h-1.5 rounded-full bg-rose-400" />
                        )}
                      </span>
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
                        <StatusBadge status={staff.profesi === "Dokter" ? "dokter" : "perawat"} />
                      </td>
                      <td className="static xl:sticky xl:left-[290px] z-10 bg-surface p-3 text-xs text-on-surface-variant border-r border-surface-container-high truncate min-w-[140px] max-w-[140px]">
                        {staff.unit}
                      </td>

                      {staff.dailyShifts.map((ds) => {
                        const info = dayInfos[ds.day - 1];
                        return (
                          <td
                            key={ds.day}
                            className={`p-1 border-r border-surface-container-high text-center min-w-[40px] max-w-[40px] ${
                              info?.isRed ? "bg-rose-50/40" : ""
                            }`}
                            title={info?.holidayName || ""}
                          >
                            <div className="flex justify-center">
                              <ShiftBadge shift={ds.shift} isRed={info?.isRed ?? false} />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4 + daysInMonth}
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

        {/* Legend + Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {/* Shift Legend */}
          <div className="clay-card-sm p-4">
            <h4 className="text-xs font-semibold text-on-surface-variant mb-2">Legenda Shift</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-bold">P</div>
                <span>Pagi (07:00–14:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">S</div>
                <span>Sore (14:00–21:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-700 text-slate-100 flex items-center justify-center font-bold">M</div>
                <span>Malam (21:00–07:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-100 text-green-800 flex items-center justify-center font-bold">O</div>
                <span>Off</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-100 text-gray-600 flex items-center justify-center font-bold">C</div>
                <span>Cuti</span>
              </div>
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="clay-card-sm p-4">
            <h4 className="text-xs font-semibold text-on-surface-variant mb-2">Keterangan Kalender</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold text-[10px]">7</div>
                <span className="text-rose-600">Minggu / Hari Libur Nasional</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="block w-2 h-2 rounded-full bg-rose-400 mt-0.5" />
                <span>Titik merah = Hari libur nasional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
