'use client';

import { useState } from 'react';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { ArrowLeftRight, Check, X, RotateCcw, MessageSquare, Filter, ShieldCheck, ShieldAlert, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime, formatDateShort } from '@/lib/formatters';
import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

function getDayStr(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return '';
    return format(d, 'eeee', { locale: id });
  } catch {
    return '';
  }
}

type FilterStatus = 'all' | 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak' | 'Perlu Perbaikan';

export default function ShiftSwapApprovalPage() {
  const { state, approveShiftSwapRequest, rejectShiftSwapRequest, requestShiftSwapImprovement } = useSIMRSDatasetStore();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [selectedReqForCalendar, setSelectedReqForCalendar] = useState<any>(null);

  const filteredRequests = state.shiftSwapRequests.filter((r) =>
    filterStatus === 'all' ? true : r.status === filterStatus
  );

  const handleApprove = (requestId: string) => {
    approveShiftSwapRequest(requestId, adminNote[requestId]);
    setAdminNote((prev) => ({ ...prev, [requestId]: '' }));
  };

  const handleReject = (requestId: string) => {
    rejectShiftSwapRequest(requestId, adminNote[requestId]);
    setAdminNote((prev) => ({ ...prev, [requestId]: '' }));
  };

  const handleImprovement = (requestId: string) => {
    if (!adminNote[requestId]) return;
    requestShiftSwapImprovement(requestId, adminNote[requestId]);
    setAdminNote((prev) => ({ ...prev, [requestId]: '' }));
  };

  const statusCounts = {
    all: state.shiftSwapRequests.length,
    'Menunggu Persetujuan': state.shiftSwapRequests.filter((r) => r.status === 'Menunggu Persetujuan').length,
    'Disetujui': state.shiftSwapRequests.filter((r) => r.status === 'Disetujui').length,
    'Ditolak': state.shiftSwapRequests.filter((r) => r.status === 'Ditolak').length,
    'Perlu Perbaikan': state.shiftSwapRequests.filter((r) => r.status === 'Perlu Perbaikan').length,
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Shift Swap & Approval"
        subtitle="Kelola pengajuan pergantian shift dari tenaga medis"
        simulationLabel="Simulation Mode"
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(statusCounts) as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`clay-btn px-3 py-2 text-xs font-medium transition-colors ${
              filterStatus === status
                ? 'bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]'
                : 'bg-white text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {status === 'all' ? 'Semua' : status} ({statusCounts[status]})
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <EmptyState
          title="Belum ada pengajuan"
          message="Pengajuan pergantian shift dari tenaga medis akan muncul di sini. Gunakan menu Tenaga Medis untuk membuat pengajuan."
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div key={req.request_id} className="clay-card p-5 border-t-4 border-t-emerald-500">
              <div className="flex flex-col lg:flex-row gap-6 justify-between">
                
                {/* Left Side: Swap Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface-variant">{req.request_id}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full border border-outline-variant">{req.department_name}</span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    {req.requester_name || `ID: ${req.requester_id}`}
                    <button
                      onClick={() => setSelectedReqForCalendar(req)}
                      className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      title="Lihat Jadwal 2 Bulan"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </h4>

                  {req.requested_shift === 'Cuti' ? (
                    <div className="flex items-center gap-3 w-max bg-surface-container px-4 py-2.5 rounded-xl border border-surface-container-high">
                      <span className="text-sm font-bold text-gray-700">Pengajuan Cuti</span>
                      <span className="text-outline">|</span>
                      <span className="text-sm font-semibold text-on-surface">
                        {getDayStr(req.requested_date)}, {formatDateShort(req.requested_date)}
                        {req.requested_end_date ? ` s.d. ${getDayStr(req.requested_end_date)}, ${formatDateShort(req.requested_end_date)}` : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-max bg-surface-container px-4 py-2.5 rounded-xl border border-surface-container-high">
                      <span className="text-sm font-semibold text-on-surface">{req.current_shift} ({getDayStr(req.current_date)})</span>
                      <ArrowLeftRight className="w-4 h-4 text-outline" />
                      <span className="text-sm font-bold text-[#1565c0]">{req.requested_shift} ({getDayStr(req.requested_date)})</span>
                    </div>
                  )}

                  <p className="text-sm text-on-surface-variant mt-2">
                    <span className="font-semibold text-on-surface-variant">Alasan:</span> {req.reason}
                  </p>
                </div>

                {/* Right Side: AI Assessment & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-start lg:items-center">
                  
                  {/* AI Assessment Box */}
                  <div className="bg-surface-container rounded-2xl p-4 w-full sm:w-80 border border-surface-container-high">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-[10px] font-bold text-on-surface-variant tracking-wider">AI ASSESSMENT</h5>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        req.ai_recommendation === 'Approved' ? 'bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]' :
                        req.ai_recommendation === 'Review' ? 'bg-[#fff8e1] text-[#f57f17] border-[#ffe082]' :
                        'bg-[#fce8e8] text-[#c62828] border-rose-200'
                      }`}>
                        Rekomendasi: {req.ai_recommendation || 'Review'}
                      </span>
                    </div>

                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px] font-medium text-on-surface-variant">
                        <span>Swap Suitability Score</span>
                        <span className="font-bold text-on-surface">{req.ai_suitability_score || 0}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (req.ai_suitability_score || 0) >= 80 ? 'bg-primary' :
                            (req.ai_suitability_score || 0) >= 50 ? 'bg-[#ffb300]' : 'bg-[#e57373]'
                          }`}
                          style={{ width: `${req.ai_suitability_score || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className={`flex items-start gap-1.5 text-xs font-semibold ${
                      req.ai_recommendation === 'Rejected' ? 'text-[#c62828]' : 
                      req.ai_recommendation === 'Review' ? 'text-[#f57f17]' : 'text-[#106e00]'
                    }`}>
                      {req.ai_recommendation === 'Approved' ? <ShieldCheck className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                      <p>{req.ai_constraint_message || 'Tidak ada pelanggaran hard constraints.'}</p>
                    </div>
                  </div>

                  {/* Actions (Only if waiting) */}
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {req.status === 'Menunggu Persetujuan' ? (
                      <>
                        <button onClick={() => handleApprove(req.request_id)} className="clay-btn px-6 py-2.5 bg-primary text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#095300] w-full sm:w-32">
                          <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleReject(req.request_id)} className="clay-btn px-6 py-2.5 bg-white text-[#c62828] border border-rose-200 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#fce8e8] w-full sm:w-32">
                          <X className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <StatusBadge status={req.status} size="md" />
                    )}
                  </div>
                </div>

              </div>

              {/* Admin Note Input (Optional) */}
              {req.status === 'Menunggu Persetujuan' && (
                <div className="mt-4 pt-4 border-t border-surface-container-high">
                  <textarea
                    placeholder="Catatan admin (opsional)..."
                    value={adminNote[req.request_id] || ''}
                    onChange={(e) => setAdminNote((prev) => ({ ...prev, [req.request_id]: e.target.value }))}
                    className="clay-input w-full p-3 text-sm resize-none"
                    rows={1}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Calendar Modal */}
      {selectedReqForCalendar && (() => {
        // Dummy data explicitly defined
        const prevMonthShifts = Array.from({ length: 30 }).map((_, i) => {
          const shifts = ['P', 'S', 'M', 'O', 'C', 'P', 'S'];
          return shifts[i % 7];
        });
        const currMonthShifts = Array.from({ length: 31 }).map((_, i) => {
          const shifts = ['S', 'M', 'O', 'P', 'C', 'S', 'O'];
          return shifts[i % 7];
        });

        const prevP = prevMonthShifts.filter(s => s === 'P').length;
        const prevS = prevMonthShifts.filter(s => s === 'S').length;
        const prevM = prevMonthShifts.filter(s => s === 'M').length;
        const prevO = prevMonthShifts.filter(s => s === 'O').length;
        const prevC = prevMonthShifts.filter(s => s === 'C').length;

        const currP = currMonthShifts.filter(s => s === 'P').length;
        const currS = currMonthShifts.filter(s => s === 'S').length;
        const currM = currMonthShifts.filter(s => s === 'M').length;
        const currO = currMonthShifts.filter(s => s === 'O').length;
        const currC = currMonthShifts.filter(s => s === 'C').length;

        return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-container-high">
              <div>
                <h3 className="text-xl font-extrabold text-on-surface">
                  Jadwal {selectedReqForCalendar.requester_name || `ID: ${selectedReqForCalendar.requester_id}`}
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {selectedReqForCalendar.department_name} • Riwayat 2 Bulan Terakhir
                </p>
              </div>
              <button
                onClick={() => setSelectedReqForCalendar(null)}
                className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Shift Summary / Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                
                {/* Total Bulan Sebelumnya */}
                <div className="flex flex-col gap-2 bg-surface-container-low p-3 sm:p-4 rounded-xl border border-surface-container">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center md:text-left">Total 1 Bulan Terakhir</span>
                  <div className="flex items-center justify-between gap-1 overflow-x-auto">
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-blue-700">{prevP}</span><span className="text-[10px] font-bold text-on-surface-variant">Pagi</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-amber-700">{prevS}</span><span className="text-[10px] font-bold text-on-surface-variant">Sore</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-slate-700">{prevM}</span><span className="text-[10px] font-bold text-on-surface-variant">Malam</span></div>
                    <div className="w-px bg-surface-container-high h-6 mx-1"></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-green-700">{prevO}</span><span className="text-[10px] font-bold text-on-surface-variant">Off</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-gray-700">{prevC}</span><span className="text-[10px] font-bold text-on-surface-variant">Cuti</span></div>
                  </div>
                </div>

                {/* Total Bulan Ini */}
                <div className="flex flex-col gap-2 bg-surface-container-low p-3 sm:p-4 rounded-xl border border-primary/20">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider text-center md:text-left">Total Bulan Ini</span>
                  <div className="flex items-center justify-between gap-1 overflow-x-auto">
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-blue-700">{currP}</span><span className="text-[10px] font-bold text-on-surface-variant">Pagi</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-amber-700">{currS}</span><span className="text-[10px] font-bold text-on-surface-variant">Sore</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-slate-700">{currM}</span><span className="text-[10px] font-bold text-on-surface-variant">Malam</span></div>
                    <div className="w-px bg-surface-container-high h-6 mx-1"></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-green-700">{currO}</span><span className="text-[10px] font-bold text-on-surface-variant">Off</span></div>
                    <div className="text-center min-w-max"><span className="block text-lg font-extrabold text-gray-700">{currC}</span><span className="text-[10px] font-bold text-on-surface-variant">Cuti</span></div>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Previous Month */}
                <div className="space-y-4">
                  <div className="text-center font-bold text-on-surface">Bulan Sebelumnya</div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                      <div key={d} className="text-xs font-semibold text-on-surface-variant py-2">{d}</div>
                    ))}
                    {prevMonthShifts.map((shift, i) => {
                      let bgColor = 'bg-gray-100';
                      let textColor = 'text-gray-800';
                      if (shift === 'P') { bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; }
                      if (shift === 'S') { bgColor = 'bg-amber-100'; textColor = 'text-amber-800'; }
                      if (shift === 'M') { bgColor = 'bg-slate-700'; textColor = 'text-slate-100'; }
                      if (shift === 'O') { bgColor = 'bg-green-100'; textColor = 'text-green-800'; }
                      if (shift === 'C') { bgColor = 'bg-gray-200'; textColor = 'text-gray-600'; }
                      return (
                        <div key={`prev-${i}`} className="aspect-square flex flex-col items-center justify-center p-1 border border-surface-container-low rounded-lg">
                          <span className="text-[10px] text-outline mb-1">{i + 1}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bgColor} ${textColor}`}>
                            {shift}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Current Month */}
                <div className="space-y-4">
                  <div className="text-center font-bold text-on-surface">Bulan Ini</div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                      <div key={d} className="text-xs font-semibold text-on-surface-variant py-2">{d}</div>
                    ))}
                    {currMonthShifts.map((shift, i) => {
                      let bgColor = 'bg-gray-100';
                      let textColor = 'text-gray-800';
                      if (shift === 'P') { bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; }
                      if (shift === 'S') { bgColor = 'bg-amber-100'; textColor = 'text-amber-800'; }
                      if (shift === 'M') { bgColor = 'bg-slate-700'; textColor = 'text-slate-100'; }
                      if (shift === 'O') { bgColor = 'bg-green-100'; textColor = 'text-green-800'; }
                      if (shift === 'C') { bgColor = 'bg-gray-200'; textColor = 'text-gray-600'; }
                      return (
                        <div key={`curr-${i}`} className={`aspect-square flex flex-col items-center justify-center p-1 border rounded-lg ${i + 1 === 16 ? 'border-primary bg-primary/5' : 'border-surface-container-low'}`}>
                          <span className="text-[10px] text-outline mb-1">{i + 1}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bgColor} ${textColor}`}>
                            {shift}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 text-xs justify-center border-t border-surface-container-high pt-4">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></span> Pagi (07-14)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></span> Sore (14-21)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-700 border border-slate-800"></span> Malam (21-07)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100 border border-green-200"></span> Libur (Off)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></span> Cuti</div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
