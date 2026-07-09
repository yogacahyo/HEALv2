"use client";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "urgency" | "shift" | "burnout" | "attendance";
  size?: "sm" | "md";
}

const statusColors: Record<string, string> = {
  // Shift swap status
  "Menunggu Persetujuan": "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Disetujui: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Ditolak: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  "Perlu Perbaikan": "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  // Urgency
  Rendah: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Sedang: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Tinggi: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  High: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  Medium: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Low: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  // Shift
  Pagi: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Sore: "bg-[#fff3e0] text-[#e65100] border-[#ffcc80]",
  Malam: "bg-[#e8eaf6] text-[#283593] border-[#9fa8da]",
  // Attendance
  Present: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Hadir: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Late: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Terlambat: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Absent: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  "Tidak Hadir": "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  "Early Leave": "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  "Pulang Awal": "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  "Belum Absen":
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  "Sudah Absen Masuk": "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  "Shift Selesai": "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  // Room
  Available: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Occupied: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  Maintenance: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  // Queue
  Waiting: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Called: "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  Served: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Cancelled:
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  // Registration
  Active: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Completed:
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  // Priority
  Normal:
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  Priority: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Emergency: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  // Generic
  Scheduled: "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  "In Progress": "bg-[#e0f7fa] text-[#00838f] border-[#80deea]",
  Pending: "bg-[#fff8e1] text-[#f57f17] border-[#ffe082]",
  Approved: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  Rejected: "bg-[#fce8e8] text-[#c62828] border-[#ef9a9a]",
  Paid: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
  // Roles
  dokter: "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]",
  perawat: "bg-[#e8f5e9] text-[#106e00] border-[#a5d6a7]",
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const colorClass =
    statusColors[status] ||
    "bg-surface-container-high text-on-surface-variant border-outline-variant";
  const sizeClass =
    size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${colorClass} ${sizeClass}`}
      style={{
        boxShadow:
          "1px 1px 3px rgba(0,0,0,0.04), inset 1px 1px 2px rgba(255,255,255,0.5)",
      }}
    >
      {status}
    </span>
  );
}
