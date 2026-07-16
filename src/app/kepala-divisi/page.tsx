"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSIMRSDatasetStore } from "@/context/useSIMRSDatasetStore";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { FloatingChat } from "@/components/common/FloatingChat";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Home,
  Lock,
  User,
  UserCheck,
  ClipboardList,
  Clock,
  X,
  Check,
  ShieldCheck,
  ShieldAlert,
  ArrowLeftRight,
  Calendar,
  Send,
  ChevronRight,
  TrendingUp,
  XCircle,
  Layers,
  LayoutDashboard,
} from "lucide-react";
import { formatDateShort } from "@/lib/formatters";
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import type { ShiftSwapRequest } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────
type Tab = "dashboard" | "pengajuan";
type FilterStatus =
  | "all"
  | "PENDING_KADIV"
  | "PENDING_ADMIN"
  | "REJECTED"
  | "Disetujui";

// ─── Helpers ─────────────────────────────────────────────────
function getDayStr(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return "";
    return format(d, "eeee", { locale: id });
  } catch {
    return "";
  }
}

function getAiScoreBarColor(score: number) {
  if (score >= 80) return "bg-[#106e00]";
  if (score >= 50) return "bg-[#ffb300]";
  return "bg-[#e57373]";
}

function getBorderTopColor(status: string) {
  if (status === "PENDING_KADIV") return "border-t-amber-400";
  if (status === "PENDING_ADMIN") return "border-t-indigo-400";
  if (status === "REJECTED") return "border-t-rose-400";
  if (status === "Disetujui") return "border-t-emerald-500";
  return "border-t-outline-variant";
}

// ─── Request Card ─────────────────────────────────────────────
interface RequestCardProps {
  req: ShiftSwapRequest;
  kadivNote: string;
  onNoteChange: (val: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

function RequestCard({
  req,
  kadivNote,
  onNoteChange,
  onApprove,
  onReject,
}: RequestCardProps) {
  const isCuti = req.requested_shift === "Cuti";
  const isPending = req.status === "PENDING_KADIV";

  return (
    <div className={`clay-card p-5 border-t-4 ${getBorderTopColor(req.status)}`}>
      {/* Row 1: ID + Dept */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-on-surface-variant">
          {req.request_id}
        </span>
        {req.department_name && (
          <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant">
            {req.department_name}
          </span>
        )}
      </div>

      {/* Main layout: left info + right AI + actions */}
      <div className="flex flex-col lg:flex-row gap-5 justify-between">
        {/* Left */}
        <div className="flex-1 min-w-0 space-y-3">
          <h4 className="text-lg font-bold text-on-surface flex items-center gap-2">
            {req.requester_name || `ID: ${req.requester_id}`}
            <Calendar className="w-4 h-4 text-on-surface-variant opacity-40" />
          </h4>

          {isCuti ? (
            <div className="flex items-center gap-3 w-max bg-surface-container px-4 py-2.5 rounded-xl border border-surface-container-high">
              <span className="text-sm font-bold text-gray-700">Pengajuan Cuti</span>
              <span className="text-outline">|</span>
              <span className="text-sm font-semibold text-on-surface">
                {getDayStr(req.requested_date)}, {formatDateShort(req.requested_date)}
                {req.requested_end_date
                  ? ` s.d. ${getDayStr(req.requested_end_date)}, ${formatDateShort(req.requested_end_date)}`
                  : ""}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 w-max bg-surface-container px-4 py-2.5 rounded-xl border border-surface-container-high">
              <span className="text-sm font-semibold text-on-surface">
                {req.current_shift} ({getDayStr(req.current_date)})
              </span>
              <ArrowLeftRight className="w-4 h-4 text-outline shrink-0" />
              <span className="text-sm font-bold text-[#1565c0]">
                {req.requested_shift} ({getDayStr(req.requested_date)})
              </span>
            </div>
          )}

          <p className="text-sm text-on-surface-variant">
            <span className="font-semibold text-on-surface-variant">Alasan:</span>{" "}
            {req.reason}
          </p>
        </div>

        {/* Right: AI + Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 items-start sm:items-center lg:items-end shrink-0">
          {/* AI Assessment Box */}
          <div className="bg-surface-container rounded-2xl p-4 w-full sm:w-72 lg:w-72 border border-surface-container-high">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-[10px] font-bold text-on-surface-variant tracking-wider">
                AI ASSESSMENT
              </h5>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  req.ai_recommendation === "Approved"
                    ? "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]"
                    : req.ai_recommendation === "Review"
                      ? "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]"
                      : "bg-[#fce8e8] text-[#c62828] border-rose-200"
                }`}
              >
                Rekomendasi: {req.ai_recommendation || "Review"}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[11px] font-medium text-on-surface-variant">
                <span>Swap Suitability Score</span>
                <span className="font-bold text-on-surface">
                  {req.ai_suitability_score ?? 0}/100
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getAiScoreBarColor(req.ai_suitability_score ?? 0)}`}
                  style={{ width: `${req.ai_suitability_score ?? 0}%` }}
                />
              </div>
            </div>

            <div
              className={`flex items-start gap-1.5 text-xs font-semibold ${
                req.ai_recommendation === "Rejected"
                  ? "text-[#c62828]"
                  : req.ai_recommendation === "Review"
                    ? "text-[#f57f17]"
                    : "text-[#106e00]"
              }`}
            >
              {req.ai_recommendation === "Approved" ? (
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <p>{req.ai_constraint_message || "Tidak ada pelanggaran hard constraints."}</p>
            </div>
          </div>

          {/* Buttons or Status */}
          <div className="flex flex-col gap-2 w-full sm:w-auto lg:w-full">
            {isPending ? (
              <>
                <button
                  onClick={onApprove}
                  className="clay-btn px-6 py-2.5 bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#095300] w-full sm:w-36"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={onReject}
                  className="clay-btn px-6 py-2.5 bg-white text-[#c62828] border border-rose-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#fce8e8] w-full sm:w-36"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </>
            ) : (
              <div className="flex justify-start sm:justify-end lg:justify-start">
                <StatusBadge status={req.status} size="md" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Textarea for PENDING_KADIV */}
      {isPending && (
        <div className="mt-4 pt-4 border-t border-surface-container-high">
          <textarea
            placeholder="Catatan kepala unit (opsional)..."
            value={kadivNote}
            onChange={(e) => onNoteChange(e.target.value)}
            className="clay-input w-full p-3 text-sm resize-none"
            rows={1}
          />
        </div>
      )}

      {/* Show existing Kadiv note */}
      {req.kadiv_note && req.status !== "PENDING_KADIV" && (
        <div className="mt-4 pt-4 border-t border-surface-container-high">
          <p className="text-[10px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-wide">
            Catatan dari Kepala Unit:
          </p>
          <p className="text-xs text-on-surface-variant bg-surface-container px-3 py-2 rounded-lg">
            {req.kadiv_note}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function KepalaDivisiPage() {
  const { state, kadivApproveRequest, kadivRejectRequest } = useSIMRSDatasetStore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "dr. Agus Salim",
    password: "password",
  });
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [kadivNotes, setKadivNotes] = useState<Record<string, string>>({});

  const counts = useMemo(
    () => ({
      pending: state.shiftSwapRequests.filter((r) => r.status === "PENDING_KADIV").length,
      forwarded: state.shiftSwapRequests.filter((r) => r.status === "PENDING_ADMIN").length,
      rejected: state.shiftSwapRequests.filter((r) => r.status === "REJECTED").length,
      approved: state.shiftSwapRequests.filter((r) => r.status === "Disetujui").length,
      total: state.shiftSwapRequests.length,
    }),
    [state.shiftSwapRequests],
  );

  const filteredRequests = useMemo(() => {
    return state.shiftSwapRequests
      .filter((r) => filterStatus === "all" || r.status === filterStatus)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [state.shiftSwapRequests, filterStatus]);

  const filterOptions: { key: FilterStatus; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: counts.total },
    { key: "PENDING_KADIV", label: "Menunggu Persetujuan", count: counts.pending },
    { key: "PENDING_ADMIN", label: "Diteruskan", count: counts.forwarded },
    { key: "Disetujui", label: "Disetujui", count: counts.approved },
    { key: "REJECTED", label: "Ditolak", count: counts.rejected },
  ];

  const handleApprove = (requestId: string) => {
    kadivApproveRequest(requestId, kadivNotes[requestId] || undefined);
    setKadivNotes((prev) => ({ ...prev, [requestId]: "" }));
  };

  const handleReject = (requestId: string) => {
    kadivRejectRequest(requestId, kadivNotes[requestId] || undefined);
    setKadivNotes((prev) => ({ ...prev, [requestId]: "" }));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pengajuan", label: "Pengajuan", icon: ClipboardList },
  ];

  // ── Login Gate ───────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface-container flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)",
                boxShadow: "0 8px 24px rgba(13,148,136,0.35)",
              }}
            >
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">HEAL Portal</h1>
            <p className="text-sm text-on-surface-variant mt-1">Kepala Unit Dashboard</p>
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
                  onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
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
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  className="clay-input w-full pl-9 pr-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="clay-btn w-full px-4 py-3 text-white text-sm font-semibold mt-2"
              style={{ background: "linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)" }}
            >
              Login ke Dashboard
            </button>
            <p className="text-[10px] text-center text-outline mt-4">
              *Halaman ini untuk Kepala Unit. Data mock akan diload.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-[#0d9488] font-medium hover:underline flex items-center justify-center gap-1"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Kembali ke Landing Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Dashboard ───────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header
        className="sticky top-0 z-20 text-white px-4 py-4 shadow-lg"
        style={{ background: "linear-gradient(135deg, #0f766e 0%, #1e40af 100%)" }}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-bold">HEAL • Kepala Unit</h1>
          </div>
          <div className="-mr-2">
            <NotificationDropdown />
          </div>
        </div>

        {/* Profile */}
        <div className="mt-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">{loginForm.username}</p>
            <p className="text-xs text-white/80">Kepala Unit • Approval Tier 1</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4">

        {/* ─── DASHBOARD TAB ─── */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-on-surface" />
              Ringkasan Divisi
            </h2>

            {/* Bento KPI Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setActiveTab("pengajuan"); setFilterStatus("PENDING_KADIV"); }}
                className="clay-card p-4 flex flex-col gap-2 text-left hover:-translate-y-0.5 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-3xl font-extrabold text-amber-600">{counts.pending}</p>
                <p className="text-xs font-medium text-on-surface-variant leading-tight">Menunggu Review Anda</p>
              </button>

              <button
                onClick={() => { setActiveTab("pengajuan"); setFilterStatus("PENDING_ADMIN"); }}
                className="clay-card p-4 flex flex-col gap-2 text-left hover:-translate-y-0.5 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Send className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-3xl font-extrabold text-indigo-600">{counts.forwarded}</p>
                <p className="text-xs font-medium text-on-surface-variant leading-tight">Diteruskan ke Admin</p>
              </button>

              <button
                onClick={() => { setActiveTab("pengajuan"); setFilterStatus("REJECTED"); }}
                className="clay-card p-4 flex flex-col gap-2 text-left hover:-translate-y-0.5 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-3xl font-extrabold text-rose-600">{counts.rejected}</p>
                <p className="text-xs font-medium text-on-surface-variant leading-tight">Ditolak oleh Anda</p>
              </button>

              <button
                onClick={() => { setActiveTab("pengajuan"); setFilterStatus("all"); }}
                className="clay-card p-4 flex flex-col gap-2 text-left hover:-translate-y-0.5 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <Layers className="w-4 h-4 text-on-surface-variant" />
                </div>
                <p className="text-3xl font-extrabold text-on-surface">{counts.total}</p>
                <p className="text-xs font-medium text-on-surface-variant leading-tight">Total Pengajuan</p>
              </button>
            </div>

            {/* Alur Status Info */}
            <div className="clay-card-sm p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0d9488]" />
                Alur Persetujuan 2 Tahap
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#fff8e1] text-[#f57f17] font-semibold border border-[#ffe082]">
                  Pengajuan
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-outline shrink-0" />
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  Kadiv ← Anda
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-outline shrink-0" />
                <span className="px-2.5 py-1 rounded-full bg-[#e3f2fd] text-[#1565c0] font-semibold border border-[#90caf9]">
                  Admin
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-outline shrink-0" />
                <span className="px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#106e00] font-semibold border border-[#a5d6a7]">
                  Final ✓
                </span>
              </div>
            </div>

            {/* CTA shortcut */}
            {counts.pending > 0 && (
              <button
                onClick={() => { setActiveTab("pengajuan"); setFilterStatus("PENDING_KADIV"); }}
                className="clay-card w-full p-4 flex items-center justify-between text-left border-l-4 border-l-amber-400 hover:bg-amber-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    {counts.pending} pengajuan menunggu review Anda
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Ketuk untuk melihat dan memproses
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-500 shrink-0" />
              </button>
            )}
          </div>
        )}

        {/* ─── PENGAJUAN TAB ─── */}
        {activeTab === "pengajuan" && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-on-surface" />
              Shift Swap &amp; Approval
            </h2>

            {/* Filter Pills - horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilterStatus(opt.key)}
                  className={`clay-btn flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors ${
                    filterStatus === opt.key
                      ? "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]"
                      : "bg-white text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  {opt.label} ({opt.count})
                </button>
              ))}
            </div>

            {/* Request Cards */}
            {filteredRequests.length === 0 ? (
              <div className="clay-card-sm p-8 text-center">
                <ClipboardList className="w-10 h-10 text-outline mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant">Belum ada pengajuan</p>
                <p className="text-xs text-outline mt-1">
                  {filterStatus === "PENDING_KADIV"
                    ? "Semua pengajuan sudah diproses."
                    : "Tidak ada data pada kategori ini."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((req) => (
                  <RequestCard
                    key={req.request_id}
                    req={req}
                    kadivNote={kadivNotes[req.request_id] ?? ""}
                    onNoteChange={(val) =>
                      setKadivNotes((prev) => ({ ...prev, [req.request_id]: val }))
                    }
                    onApprove={() => handleApprove(req.request_id)}
                    onReject={() => handleReject(req.request_id)}
                  />
                ))}
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
                className={`relative flex flex-col items-center gap-0.5 px-6 py-1.5 rounded-xl transition-colors min-w-0 ${
                  isActive ? "text-[#0d9488]" : "text-outline"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#0d9488]" : ""}`} />
                <span className="text-[10px] font-medium truncate">{tab.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#0d9488]" />}
                {tab.id === "pengajuan" && counts.pending > 0 && !isActive && (
                  <span className="absolute top-0 right-2 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {counts.pending}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <FloatingChat fabOffset="bottom-20 sm:bottom-8 right-6 sm:right-8" />
    </div>
  );
}
