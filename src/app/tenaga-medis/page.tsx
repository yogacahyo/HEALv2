"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSIMRSDatasetStore } from "@/context/useSIMRSDatasetStore";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Calendar,
  Clock,
  ClipboardCheck,
  History,
  ArrowLeftRight,
  Home,
  Sparkles,
  Activity,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Check,
  HeartPulse,
  Send,
  Lock,
  User,
} from "lucide-react";
import {
  getShiftFromTime,
  getShiftLabel,
  calculatePostShiftBurnoutScore,
  getBurnoutCategory,
  getBurnoutRecommendation,
  getDoctors,
  getNurses,
} from "@/lib/simrs-calculations";
import {
  getToday,
  getCurrentTime,
  formatDateShort,
  formatTime,
  getMonthName,
  getDayOfWeekFromDate,
  getAttendanceStatusLabel,
} from "@/lib/formatters";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";
import type { ShiftType } from "@/lib/types";
import { getDayName } from "@/lib/simrs-calculations";

type Tab = "schedule" | "attendance" | "burnout" | "history" | "swap";

const POST_SHIFT_QUESTIONS = [
  "Apakah Anda merasa sangat kelelahan setelah shift ini?",
  "Apakah Anda merasa kurang tidur dalam 24 jam terakhir?",
  "Apakah Anda merasa tekanan kerja yang sangat tinggi selama shift?",
  "Apakah Anda menangani lebih banyak pasien dari biasanya?",
  "Apakah Anda merasa kurang fokus atau membuat kesalahan?",
  "Apakah Anda mengalami konflik atau tekanan emosional saat shift?",
  "Apakah Anda merasa tidak ingin kembali bekerja besok?",
];

export default function TenagaMedisPage() {
  const {
    state,
    submitAttendanceIn,
    submitAttendanceOut,
    submitPostShiftBurnoutForm,
    submitShiftSwapRequest,
    setSelectedEmployee,
  } = useSIMRSDatasetStore();
  const [activeTab, setActiveTab] = useState<Tab>("attendance");
  const today = getToday();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "Rina Susanti",
    password: "password",
  });

  // Fixed personal employee (since this is personal dashboard)
  const medicalStaff = useMemo(() => {
    const docs = getDoctors(state.activeEmployees, state.activePositions);
    const nurs = getNurses(state.activeEmployees, state.activePositions);
    return [...docs, ...nurs];
  }, [state.activeEmployees, state.activePositions]);

  // Using the first nurse as the logged in personal user for the prototype
  const selectedEmp =
    medicalStaff.find(
      (m) => m.first_name === "Budi" && m.last_name === "Santoso",
    ) ||
    medicalStaff.find((m) => m.employee_id === 6) ||
    medicalStaff[0];
  const empPos = state.activePositions.find(
    (p) => p.position_id === selectedEmp?.position_id,
  );

  // Schedule data
  const empSchedules = state.activeDoctorSchedules.filter(
    (s) => s.doctor_id === selectedEmp?.employee_id && s.is_active,
  );

  // Calendar setup
  const currentDate = parseISO(today);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Attendance
  const empAttendance = state.activeAttendance.filter(
    (a) => a.employee_id === selectedEmp?.employee_id,
  );
  const todayAtt = empAttendance.find((a) => a.date === today);
  const todaySimAtt = state.attendanceSimulations.find(
    (a) => a.employee_id === selectedEmp?.employee_id && a.date === today,
  );

  // Burnout
  const empBurnouts = state.burnoutAssessments.filter(
    (b) => b.employee_id === selectedEmp?.employee_id,
  );
  const latestBurnout = empBurnouts[empBurnouts.length - 1];
  const [burnoutAnswers, setBurnoutAnswers] = useState<number[]>(
    new Array(7).fill(3),
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showBurnoutThanks, setShowBurnoutThanks] = useState(false);

  // Shift swap form
  const [swapForm, setSwapForm] = useState({
    target_employee_id: "",
    current_date: today,
    current_shift: "Pagi" as ShiftType,
    requested_date: "",
    requested_shift: "Pagi" as ShiftType,
    reason: "",
    urgency: "Sedang" as "Rendah" | "Sedang" | "Tinggi",
  });

  const [cutiForm, setCutiForm] = useState({
    target_employee_id: "",
    requested_date: "",
    requested_end_date: "",
    reason: "",
    urgency: "Sedang" as "Rendah" | "Sedang" | "Tinggi",
  });

  const empShiftSwaps = state.shiftSwapRequests.filter(
    (r) => r.requester_id === String(selectedEmp?.employee_id),
  );

  const handleCheckIn = () => {
    if (selectedEmp) submitAttendanceIn(selectedEmp.employee_id);
  };
  const handleCheckOut = () => {
    if (selectedEmp) {
      submitAttendanceOut(selectedEmp.employee_id);
      setActiveTab("burnout");
    }
  };
  const handleBurnoutSubmit = () => {
    if (!selectedEmp) return;
    const currentShift = getShiftFromTime(getCurrentTime()) || "Pagi";
    const boolAnswers = burnoutAnswers.map((score) => score <= 3);
    submitPostShiftBurnoutForm(
      selectedEmp.employee_id,
      boolAnswers,
      currentShift,
    );
    setBurnoutAnswers(new Array(7).fill(3));
    setCurrentQuestion(0);
    setShowBurnoutThanks(true);
    setTimeout(() => {
      setShowBurnoutThanks(false);
      setActiveTab("attendance");
    }, 3000);
  };

  const handleScoreSelect = (score: number) => {
    const newScores = [...burnoutAnswers];
    newScores[currentQuestion] = score;
    setBurnoutAnswers(newScores);
    if (currentQuestion < 6) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 250);
    }
  };
  const handleSwapSubmit = () => {
    if (!selectedEmp || !swapForm.requested_date || !swapForm.reason) return;
    submitShiftSwapRequest({
      requester_id: String(selectedEmp.employee_id),
      requester_role: empPos?.position_name.toLowerCase().includes("doctor")
        ? "dokter"
        : "perawat",
      requester_name: `${selectedEmp.first_name} ${selectedEmp.last_name}`,
      department_name: empPos?.description || "",
      ...swapForm,
    });
    setSwapForm({
      current_date: today,
      current_shift: "Pagi",
      requested_date: "",
      requested_shift: "Pagi",
      reason: "",
      urgency: "Sedang",
    });
  };

  const handleCutiSubmit = () => {
    if (!selectedEmp || !cutiForm.requested_date || !cutiForm.requested_end_date || !cutiForm.reason) return;
    submitShiftSwapRequest({
      requester_id: String(selectedEmp.employee_id),
      requester_role: empPos?.position_name.toLowerCase().includes("doctor")
        ? "dokter"
        : "perawat",
      requester_name: `${selectedEmp.first_name} ${selectedEmp.last_name}`,
      department_name: empPos?.description || "",
      current_date: cutiForm.requested_date,
      current_shift: "Pagi", // Dummy untuk cuti
      requested_date: cutiForm.requested_date,
      requested_end_date: cutiForm.requested_end_date,
      requested_shift: "Cuti",
      reason: cutiForm.reason,
      urgency: cutiForm.urgency,
    });
    setCutiForm({
      requested_date: "",
      requested_end_date: "",
      reason: "",
      urgency: "Sedang",
    });
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "attendance", label: "Absensi", icon: ClipboardCheck },
    { id: "schedule", label: "Jadwal", icon: Calendar },
    { id: "history", label: "Riwayat", icon: History },
    { id: "swap", label: "Shift Swap", icon: ArrowLeftRight },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-container flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">HEAL Portal</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Tenaga Medis Personal Dashboard
            </p>
          </div>

          <div className="clay-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Username / NIP
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, username: e.target.value }))
                  }
                  className="clay-input w-full pl-9 pr-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="clay-input w-full pl-9 pr-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="clay-btn w-full px-4 py-3 bg-primary text-white text-sm font-semibold hover:bg-[#095300] mt-2"
            >
              Login ke Dashboard
            </button>
            <p className="text-[10px] text-center text-outline mt-4">
              *Halaman ini hanya untuk personal (perawat/dokter). Data mock Ns.
              Budi akan diload.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-[#106e00] font-medium hover:underline flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-primary to-[#095300] text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-bold">HEAL • Tenaga Medis</h1>
          </div>
          <div className="-mr-2">
            <NotificationDropdown />
          </div>
        </div>

        {/* Personal Info Profile */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">
              {selectedEmp?.first_name} {selectedEmp?.last_name}
            </p>
            <p className="text-xs text-white/80">{empPos?.position_name}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4">
        {/* Tab Content */}
        {activeTab === "schedule" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Calendar className="w-5 h-5 text-on-surface" />
                Jadwal Bulan Ini
              </h2>
              <span className="text-sm font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                {format(currentDate, "MMMM yyyy", { locale: id })}
              </span>
            </div>

            <div className="clay-card p-3">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] font-bold text-outline"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isToday = isSameDay(day, currentDate);

                  // Mock: Check if this day of week has a schedule for this employee
                  const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1; // 0 = Senin, 6 = Minggu in our DB
                  const daySchedule = empSchedules.find(
                    (s) => s.day_of_week === dayOfWeek,
                  );

                  return (
                    <div
                      key={idx}
                      className={`min-h-[60px] p-1 rounded-lg border ${
                        !isCurrentMonth
                          ? "bg-surface-container border-transparent opacity-50"
                          : isToday
                            ? "bg-[#e8f5e9] border-[#a5d6a7]"
                            : "bg-white border-surface-container-high"
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold mb-1 ${isToday ? "text-[#106e00]" : "text-on-surface-variant"}`}
                      >
                        {format(day, "d")}
                      </div>
                      {daySchedule && isCurrentMonth && (
                        <div className="bg-blue-100 text-[#1565c0] text-[9px] font-semibold px-1 py-0.5 rounded flex flex-col gap-0.5">
                          <span className="truncate">
                            {getShiftFromTime(daySchedule.start_time)}
                          </span>
                          <span className="text-[8px] opacity-80">
                            {formatTime(daySchedule.start_time)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-on-surface" />
              Absensi Simulasi
            </h2>

            <div className="clay-card p-5 text-center flex flex-col items-center justify-center min-h-[300px]">
              {!todaySimAtt || todaySimAtt.status === "Belum Absen" ? (
                <>
                  <p className="text-sm text-on-surface-variant mb-8">
                    Anda belum melakukan absensi hari ini.
                  </p>
                  <button
                    onClick={handleCheckIn}
                    className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 bg-primary text-white hover:bg-[#095300] transition-transform hover:scale-105 active:scale-95"
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(16,110,0,0.4), inset 0 2px 4px rgba(57,255,20,0.3)",
                    }}
                  >
                    <Clock className="w-10 h-10" />
                    <span className="font-bold text-lg">Absen Masuk</span>
                  </button>
                </>
              ) : todaySimAtt.status === "Sudah Absen Masuk" ? (
                <>
                  <div className="mb-8 text-center">
                    <p className="text-sm text-[#106e00] font-semibold flex items-center justify-center gap-1.5 mb-2">
                      <Check className="w-4 h-4" /> Waktu Masuk:{" "}
                      {todaySimAtt.check_in}
                    </p>
                    <StatusBadge status="Sudah Absen Masuk" />
                  </div>
                  <button
                    onClick={handleCheckOut}
                    className="w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 bg-rose-600 text-white hover:bg-rose-700 transition-transform hover:scale-105 active:scale-95"
                    style={{
                      boxShadow:
                        "0 8px 32px rgba(225,29,72,0.4), inset 0 2px 4px rgba(251,113,133,0.3)",
                    }}
                  >
                    <Clock className="w-10 h-10" />
                    <span className="font-bold text-lg">Absen Keluar</span>
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-[#e8f5e9] text-[#106e00] rounded-full flex items-center justify-center mb-4 shadow-inner border-4 border-white">
                    <Check className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface">
                    Shift Selesai
                  </h3>
                  <div className="space-y-1 bg-surface-container-low p-4 rounded-2xl mx-auto max-w-[250px]">
                    <p className="text-sm font-medium flex justify-between gap-4 text-on-surface-variant">
                      <span>Masuk:</span>{" "}
                      <span className="font-bold text-on-surface">
                        {todaySimAtt.check_in}
                      </span>
                    </p>
                    <p className="text-sm font-medium flex justify-between gap-4 text-on-surface-variant">
                      <span>Keluar:</span>{" "}
                      <span className="font-bold text-on-surface">
                        {todaySimAtt.check_out}
                      </span>
                    </p>
                  </div>
                  {!todaySimAtt.burnout_completed && (
                    <p className="text-xs text-[#f57f17] mt-2 flex items-center justify-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Silakan isi
                      asesmen burnout pasca-shift
                    </p>
                  )}
                  <p className="text-xs text-outline italic mt-4">
                    Terima kasih atas kerja keras Anda hari ini!
                  </p>
                </div>
              )}
            </div>

            <div className="clay-card-sm p-4 mt-6">
              <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Detail Jadwal
                Mingguan
              </h3>
              {empSchedules.length === 0 ? (
                <p className="text-xs text-on-surface-variant">
                  Tidak ada jadwal aktif.
                </p>
              ) : (
                <div className="space-y-2">
                  {empSchedules.map((sched) => (
                    <div
                      key={sched.schedule_id}
                      className="flex items-center justify-between py-3 border-b border-surface-container last:border-0"
                    >
                      <p className="text-sm font-medium text-on-surface">
                        {getDayName(sched.day_of_week)}
                      </p>
                      <div className="text-right flex flex-col items-end">
                        <StatusBadge
                          status={getShiftFromTime(sched.start_time) || "Pagi"}
                        />
                        <p className="text-[10px] text-outline mt-1.5 font-mono">
                          {formatTime(sched.start_time)} -{" "}
                          {formatTime(sched.end_time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "burnout" && (
          <div className="space-y-4 animate-fade-in">
            {showBurnoutThanks ? (
              <div className="clay-card p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 mx-auto bg-[#e8f5e9] text-[#106e00] rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white">
                  <HeartPulse className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">
                  Terima Kasih!
                </h3>
                <p className="text-sm text-on-surface-variant">
                  Tanggapan Anda telah kami simpan. Selamat beristirahat setelah
                  bekerja keras hari ini.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-4">
                  <HeartPulse className="w-5 h-5 text-on-surface" />
                  Asesmen Burnout Pasca-Shift
                </h2>

                {/* Form */}
                <div className="clay-card p-6 max-w-2xl mx-auto">
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm font-semibold text-on-surface-variant">
                      Pertanyaan {currentQuestion + 1} dari 7
                    </p>
                    <div className="flex gap-1.5">
                      {POST_SHIFT_QUESTIONS.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-6 rounded-full transition-colors ${i === currentQuestion ? "bg-primary" : i < currentQuestion ? "bg-[#a5d6a7]" : "bg-surface-container"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="min-h-[120px] flex items-center justify-center mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-on-surface text-center">
                      "{POST_SHIFT_QUESTIONS[currentQuestion]}"
                    </h3>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between items-center mb-6 px-1">
                      <span
                        className={`text-4xl transition-all cursor-pointer select-none ${burnoutAnswers[currentQuestion] === 1 ? "scale-125 grayscale-0" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110"}`}
                        onClick={() => handleScoreSelect(1)}
                      >
                        😡
                      </span>
                      <span
                        className={`text-4xl transition-all cursor-pointer select-none ${burnoutAnswers[currentQuestion] === 2 ? "scale-125 grayscale-0" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110"}`}
                        onClick={() => handleScoreSelect(2)}
                      >
                        🙁
                      </span>
                      <span
                        className={`text-4xl transition-all cursor-pointer select-none ${burnoutAnswers[currentQuestion] === 3 ? "scale-125 grayscale-0" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110"}`}
                        onClick={() => handleScoreSelect(3)}
                      >
                        😐
                      </span>
                      <span
                        className={`text-4xl transition-all cursor-pointer select-none ${burnoutAnswers[currentQuestion] === 4 ? "scale-125 grayscale-0" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110"}`}
                        onClick={() => handleScoreSelect(4)}
                      >
                        🙂
                      </span>
                      <span
                        className={`text-4xl transition-all cursor-pointer select-none ${burnoutAnswers[currentQuestion] === 5 ? "scale-125 grayscale-0" : "grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-110"}`}
                        onClick={() => handleScoreSelect(5)}
                      >
                        😄
                      </span>
                    </div>
                    <div className="px-3">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={burnoutAnswers[currentQuestion]}
                        onChange={(e) => {
                          const newScores = [...burnoutAnswers];
                          newScores[currentQuestion] = parseInt(e.target.value);
                          setBurnoutAnswers(newScores);
                        }}
                        onMouseUp={() => {
                          if (currentQuestion < 6)
                            setTimeout(
                              () => setCurrentQuestion((p) => p + 1),
                              250,
                            );
                        }}
                        onTouchEnd={() => {
                          if (currentQuestion < 6)
                            setTimeout(
                              () => setCurrentQuestion((p) => p + 1),
                              250,
                            );
                        }}
                        className="w-full h-2 rounded-lg cursor-pointer outline-none accent-[#181c1c]"
                        style={{
                          background:
                            "linear-gradient(to right, #ef4444, #f97316, #eab308, #84cc16, #22c55e)",
                        }}
                      />
                      <div className="flex justify-between text-[10px] font-bold text-outline uppercase mt-3">
                        <span>Sangat Ya (Buruk)</span>
                        <span>Tidak Sama Sekali (Baik)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center gap-4">
                    <button
                      onClick={() =>
                        setCurrentQuestion((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentQuestion === 0}
                      className="clay-btn px-6 py-2.5 text-sm font-semibold text-on-surface-variant disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>

                    {currentQuestion < 6 ? (
                      <button
                        onClick={() => setCurrentQuestion((prev) => prev + 1)}
                        className="clay-btn px-8 py-2.5 bg-primary text-white text-sm font-bold"
                      >
                        Selanjutnya
                      </button>
                    ) : (
                      <button
                        onClick={handleBurnoutSubmit}
                        className="clay-btn px-8 py-2.5 bg-[#1565c0] text-white text-sm font-bold"
                      >
                        Selesai & Kirim
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <History className="w-5 h-5 text-on-surface" />
              Riwayat Absensi & Jadwal
            </h2>
            <div className="space-y-2">
              {empAttendance
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((att) => (
                  <div
                    key={att.attendance_id}
                    className="clay-card-sm p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-on-surface">
                        {formatDateShort(att.date)}
                      </p>
                      <p className="text-xs text-outline">
                        {formatTime(att.check_in)} — {formatTime(att.check_out)}
                      </p>
                    </div>
                    <StatusBadge
                      status={getAttendanceStatusLabel(att.status)}
                    />
                  </div>
                ))}
              {empAttendance.length === 0 && (
                <div className="clay-card-sm p-6 text-center text-sm text-on-surface-variant">
                  Belum ada riwayat absensi.
                </div>
              )}
            </div>

            {/* Burnout History */}
            {empBurnouts.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-on-surface mt-4">
                  Riwayat Asesmen Burnout
                </h3>
                <div className="space-y-2">
                  {empBurnouts
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))
                    .map((b) => (
                      <div
                        key={b.assessment_id}
                        className="clay-card-sm p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-on-surface">
                            {formatDateShort(b.date)}
                          </p>
                          <p className="text-xs text-outline">
                            Shift {b.shift} • Skor: {b.burnout_score}
                          </p>
                        </div>
                        <StatusBadge status={b.burnout_category} />
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "swap" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-on-surface" />
              Pengajuan Pergantian Shift
            </h2>

            {/* Swap Form */}
            <div className="clay-card p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nama Tenaga Medis
                </label>
                <select
                  value={swapForm.target_employee_id}
                  onChange={(e) =>
                    setSwapForm((p) => ({
                      ...p,
                      target_employee_id: e.target.value,
                    }))
                  }
                  className="clay-input w-full px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Tenaga Medis --</option>
                  {medicalStaff.map((staff) => (
                    <option key={staff.employee_id} value={staff.employee_id}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tanggal Saat Ini
                  </label>
                  <input
                    type="date"
                    value={swapForm.current_date}
                    onChange={(e) =>
                      setSwapForm((p) => ({
                        ...p,
                        current_date: e.target.value,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Shift Saat Ini
                  </label>
                  <select
                    value={swapForm.current_shift}
                    onChange={(e) =>
                      setSwapForm((p) => ({
                        ...p,
                        current_shift: e.target.value as ShiftType,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  >
                    <option value="Pagi">Pagi</option>
                    <option value="Sore">Sore</option>
                    <option value="Malam">Malam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tanggal Diinginkan
                  </label>
                  <input
                    type="date"
                    value={swapForm.requested_date}
                    onChange={(e) =>
                      setSwapForm((p) => ({
                        ...p,
                        requested_date: e.target.value,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Shift Diinginkan
                  </label>
                  <select
                    value={swapForm.requested_shift}
                    onChange={(e) =>
                      setSwapForm((p) => ({
                        ...p,
                        requested_shift: e.target.value as ShiftType,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  >
                    <option value="Pagi">Pagi</option>
                    <option value="Sore">Sore</option>
                    <option value="Malam">Malam</option>
                    <option value="Off">Libur (Off)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Alasan
                </label>
                <textarea
                  value={swapForm.reason}
                  onChange={(e) =>
                    setSwapForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="clay-input w-full px-3 py-2 text-sm resize-none"
                  rows={3}
                  placeholder="Jelaskan alasan pengajuan..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Urgensi
                </label>
                <div className="flex gap-2">
                  {(["Rendah", "Sedang", "Tinggi"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setSwapForm((p) => ({ ...p, urgency: u }))}
                      className={`clay-btn px-3 py-2 text-xs font-medium ${swapForm.urgency === u ? "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]" : "bg-white text-on-surface-variant"}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSwapSubmit}
                disabled={!swapForm.target_employee_id || !swapForm.requested_date || !swapForm.reason}
                className="clay-btn w-full px-4 py-3 bg-[#1565c0] text-white text-sm font-semibold hover:bg-[#0d47a1] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Ajukan Pergantian Shift
              </button>
            </div>

            {/* Cuti Form */}
            <div className="clay-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                Pengajuan Cuti
              </h3>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nama Tenaga Medis
                </label>
                <select
                  value={cutiForm.target_employee_id}
                  onChange={(e) =>
                    setCutiForm((p) => ({
                      ...p,
                      target_employee_id: e.target.value,
                    }))
                  }
                  className="clay-input w-full px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Tenaga Medis --</option>
                  {medicalStaff.map((staff) => (
                    <option key={staff.employee_id} value={staff.employee_id}>
                      {staff.first_name} {staff.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tanggal Mulai Cuti
                  </label>
                  <input
                    type="date"
                    value={cutiForm.requested_date}
                    onChange={(e) =>
                      setCutiForm((p) => ({
                        ...p,
                        requested_date: e.target.value,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tanggal Akhir Cuti
                  </label>
                  <input
                    type="date"
                    value={cutiForm.requested_end_date}
                    onChange={(e) =>
                      setCutiForm((p) => ({
                        ...p,
                        requested_end_date: e.target.value,
                      }))
                    }
                    className="clay-input w-full px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Alasan
                </label>
                <textarea
                  value={cutiForm.reason}
                  onChange={(e) =>
                    setCutiForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="clay-input w-full px-3 py-2 text-sm resize-none"
                  rows={3}
                  placeholder="Jelaskan alasan pengajuan cuti..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Urgensi
                </label>
                <div className="flex gap-2">
                  {(["Rendah", "Sedang", "Tinggi"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setCutiForm((p) => ({ ...p, urgency: u }))}
                      className={`clay-btn px-3 py-2 text-xs font-medium ${cutiForm.urgency === u ? "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]" : "bg-white text-on-surface-variant"}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCutiSubmit}
                disabled={!cutiForm.target_employee_id || !cutiForm.requested_date || !cutiForm.requested_end_date || !cutiForm.reason}
                className="clay-btn w-full px-4 py-3 bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Ajukan Cuti
              </button>
            </div>

            {/* History */}
            {empShiftSwaps.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-on-surface mb-2">
                  Riwayat Pengajuan
                </h3>
                <div className="space-y-2">
                  {empShiftSwaps
                    .sort((a, b) => b.created_at.localeCompare(a.created_at))
                    .map((sw) => (
                      <div key={sw.request_id} className="clay-card-sm p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={sw.current_shift} />
                            <span className="text-xs text-outline">→</span>
                            <StatusBadge status={sw.requested_shift} />
                          </div>
                          <StatusBadge status={sw.status} />
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          {sw.reason}
                        </p>
                        {sw.admin_note && (
                          <p className="text-xs text-[#1565c0] mt-1">
                            Admin: {sw.admin_note}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-surface-container-high shadow-[0_-4px_16px_rgba(0,0,0,0.06)] z-30">
        <div className="flex items-center justify-around py-2 px-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 ${
                  isActive ? "text-[#106e00]" : "text-outline"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-[#2ae500]" : ""}`}
                />
                <span className="text-[10px] font-medium truncate">
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
