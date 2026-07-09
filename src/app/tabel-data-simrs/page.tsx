'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSIMRSDatasetStore } from '@/context/useSIMRSDatasetStore';
import { SIMRS_TABLES, type TableSchema } from '@/lib/simrs-schema';
import { Database, Home, Search, Table2, Shield, Activity, AlertTriangle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function TabelDataSIMRSPage() {
  const { state } = useSIMRSDatasetStore();
  const [search, setSearch] = useState('');
  const [expandedTable, setExpandedTable] = useState<string | null>(null);
  const [filterUsedFor, setFilterUsedFor] = useState<string | null>(null);

  const getTableData = (tableName: string, state: any) => {
    switch (tableName) {
      case 'patients': return state.activePatients;
      case 'doctors': return state.activeDoctors;
      case 'employees': return state.activeEmployees;
      case 'departments': return state.activeDepartments;
      case 'positions': return state.activePositions;
      case 'registration': return state.activeRegistration;
      case 'outpatient_visits': return state.activeOutpatientVisits;
      case 'appointments': return state.activeAppointments;
      case 'queue_numbers': return state.activeQueueNumbers;
      case 'doctor_schedules': return state.activeDoctorSchedules;
      case 'doctor_queue_quotas': return state.activeDoctorQueueQuotas;
      case 'rooms': return state.activeRooms;
      case 'attendance': return state.activeAttendance;
      case 'leave_requests': return state.activeLeaveRequests;
      case 'billing': return state.activeBilling;
      case 'medical_records': return state.activeMedicalRecords;
      default: return [];
    }
  };

  const filtered = SIMRS_TABLES.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterUsedFor || (t.usedFor as Record<string, boolean>)[filterUsedFor];
    return matchSearch && matchFilter;
  });

  const filterButtons = [
    { key: null, label: 'Semua' },
    { key: 'patientLoad', label: 'Patient Load' },
    { key: 'clinicalLoad', label: 'Clinical Load' },
    { key: 'staffingSimulation', label: 'Staffing' },
    { key: 'burnoutSimulation', label: 'Burnout' },
    { key: 'executiveInsight', label: 'Executive' },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-[#106e00] to-[#095300] text-white px-4 sm:px-8 py-6" style={{ boxShadow: '0 4px 16px rgba(16,110,0,0.3), inset 0 1px 0 rgba(57,255,20,0.15)' }}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
                <Home className="w-5 h-5" />
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold">Tabel Data SIMRS</h1>
            </div>
            <p className="text-xs sm:text-sm opacity-80">Dokumentasi {SIMRS_TABLES.length} tabel database SIMRS yang digunakan dalam prototype</p>
          </div>
          <span className="clay-badge sim-badge text-xs">
            <Sparkles className="w-3 h-3" />
            Schema Documentation
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Search & Filter */}
        <div className="clay-card p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-outline" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama tabel atau deskripsi..."
              className="clay-input w-full pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((f) => (
              <button
                key={f.key || 'all'}
                onClick={() => setFilterUsedFor(f.key)}
                className={`clay-btn px-3 py-1.5 text-xs font-medium ${
                  filterUsedFor === f.key
                    ? 'bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]'
                    : 'bg-white text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-outline">{filtered.length} tabel ditemukan</p>

        {/* Table List */}
        <div className="space-y-3">
          {filtered.map((table) => (
            <div key={table.name} className="clay-card-sm overflow-hidden">
              <button
                onClick={() => setExpandedTable(expandedTable === table.name ? null : table.name)}
                className="w-full p-4 flex items-center justify-between hover:bg-surface-container/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center">
                    <Table2 className="w-4 h-4 text-on-surface-variant" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-on-surface">{table.name}</p>
                    <p className="text-xs text-outline">{table.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-outline">{table.columns.length} kolom</span>
                  {expandedTable === table.name ? <ChevronUp className="w-4 h-4 text-outline" /> : <ChevronDown className="w-4 h-4 text-outline" />}
                </div>
              </button>

              {expandedTable === table.name && (
                <div className="border-t border-surface-container-high p-4 animate-fade-in">
                  {table.privacyNote && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#fff8e1] mb-4">
                      <AlertTriangle className="w-4 h-4 text-[#ffb300] mt-0.5 shrink-0" />
                      <p className="text-xs text-[#f57f17]">{table.privacyNote}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {Object.entries(table.usedFor)
                      .filter(([, v]) => v)
                      .map(([k]) => (
                        <span key={k} className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#106e00] border border-[#a5d6a7]">
                          {k}
                        </span>
                      ))}
                  </div>

                  <div className="table-responsive">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-surface-container">
                          {table.columns.map((col) => (
                            <th key={col.name} className="text-left p-2 font-semibold text-on-surface-variant whitespace-nowrap">
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getTableData(table.name, state).slice(0, 10).map((row: any, i: number) => (
                          <tr key={i} className="border-b border-surface-container hover:bg-surface-container/30">
                            {table.columns.map((col) => (
                              <td key={col.name} className="p-2 text-on-surface-variant whitespace-nowrap">
                                {String(row[col.name] ?? '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                        {getTableData(table.name, state).length === 0 && (
                          <tr>
                            <td colSpan={table.columns.length} className="p-4 text-center text-outline">Tidak ada data</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {getTableData(table.name, state).length > 10 && (
                    <p className="text-[10px] text-outline mt-3 text-center">
                      Menampilkan 10 data pertama dari total {getTableData(table.name, state).length} data.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
