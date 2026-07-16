"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, ShieldCheck } from "lucide-react";

type NotifType = "info" | "warning" | "success";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  isRead: boolean;
  time: string;
}

export function NotificationDropdown({ align = "right" }: { align?: "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Jadwal Shift Baru",
      message: "Jadwal shift bulan depan telah dipublikasikan dan bisa dilihat di menu.",
      type: "info",
      isRead: false,
      time: "2 jam yang lalu",
    },
    {
      id: "2",
      title: "Peringatan Burnout",
      message: "Terdeteksi ada 3 staf dengan risiko burnout tinggi di unit IGD.",
      type: "warning",
      isRead: false,
      time: "5 jam yang lalu",
    },
    {
      id: "3",
      title: "Pengajuan Disetujui",
      message: "Pengajuan yang Anda kirimkan telah disetujui oleh Kepala Divisi.",
      type: "success",
      isRead: true,
      time: "1 hari yang lalu",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getIcon = (type: NotifType) => {
    switch (type) {
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "success":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getBgColor = (type: NotifType) => {
    switch (type) {
      case "info":
        return "bg-blue-50";
      case "warning":
        return "bg-amber-50";
      case "success":
        return "bg-emerald-50";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-white/10 hover:bg-black/5 transition-colors"
        title="Notifikasi"
      >
        <Bell className="w-5 h-5 text-current" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-transparent" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={`absolute mt-2 w-[280px] sm:w-80 bg-white rounded-2xl shadow-xl border border-surface-container-high z-50 overflow-hidden text-on-surface ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container-high bg-surface-container">
            <h3 className="font-bold text-sm">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-semibold text-[#0d9488] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Tandai dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-on-surface-variant">
                Tidak ada notifikasi baru.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-surface-container-high last:border-0 hover:bg-surface-container/50 transition-colors ${
                    notif.isRead ? "opacity-70" : "bg-blue-50/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getBgColor(notif.type)}`}
                    >
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className={`text-xs font-bold truncate pr-2 ${notif.isRead ? "text-on-surface-variant" : "text-on-surface"}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[9px] text-outline mt-1.5 font-medium">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
