'use client';

import { useState } from 'react';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { ArrowLeftRight, Check, X, RotateCcw, MessageSquare, Filter, ShieldCheck, ShieldAlert } from 'lucide-react';
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
                  
                  <h4 className="text-lg font-bold text-on-surface">
                    {req.requester_name || `ID: ${req.requester_id}`}
                  </h4>

                  <div className="flex items-center gap-3 w-max bg-surface-container px-4 py-2.5 rounded-xl border border-surface-container-high">
                    <span className="text-sm font-semibold text-on-surface">{req.current_shift} ({getDayStr(req.current_date)})</span>
                    <ArrowLeftRight className="w-4 h-4 text-outline" />
                    <span className="text-sm font-bold text-[#1565c0]">{req.requested_shift} ({getDayStr(req.requested_date)})</span>
                  </div>

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
    </div>
  );
}
