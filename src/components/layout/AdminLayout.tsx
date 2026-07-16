"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Database,
  Activity,
  Users,
  Calendar,
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  CalendarClock,
  BarChart3,
  Settings,
  Menu,
  X,
  Home,
  User,
} from "lucide-react";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { FloatingChat } from "@/components/common/FloatingChat";

const menuItems = [
  {
    label: "Command Center",
    href: "/admin/command-center",
    icon: LayoutDashboard,
  },


  {
    label: "Data Tenaga Medis SIMRS",
    href: "/admin/simrs-workforce",
    icon: Users,
  },
  { label: "Jadwal & Antrean", href: "/admin/simrs-schedule", icon: Calendar },
  {
    label: "Shift Swap & Approval",
    href: "/admin/shift-swap-approval",
    icon: ArrowLeftRight,
  },
  { label: "Burnout Radar", href: "/admin/burnout-radar", icon: AlertTriangle },
  {
    label: "Clinical Load Forecast",
    href: "/admin/clinical-load-forecast",
    icon: TrendingUp,
  },
  {
    label: "Auto Rostering Simulation",
    href: "/admin/auto-rostering-simulation",
    icon: CalendarClock,
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-start bg-[var(--clay-bg)]">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-40 sidebar-transition lg:translate-x-0 lg:sticky lg:top-0 lg:self-start lg:h-screen lg:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow:
            "4px 0 12px rgba(0,0,0,0.04), inset -1px 0 0 rgba(0,0,0,0.03)",
          borderRadius: "0 1.5rem 1.5rem 0",
        }}
      >
        {/* Profile Area */}
        <div className="p-5 pb-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center"
                style={{
                  boxShadow:
                    "inset 2px 2px 4px rgba(255,255,255,0.7), inset -2px -2px 4px rgba(0,0,0,0.05), 2px 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                <User className="w-6 h-6 text-outline" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-on-surface leading-tight">
                  HEAL Admin
                </h1>
                <p className="text-[10px] text-outline font-medium">
                  Dashboard Panel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-outline">
                <NotificationDropdown align="left" />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 hover:bg-surface-container rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>
          </div>
        </div>

        <nav
          className="px-3 space-y-0.5 pb-8 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 90px)" }}
        >
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
          <div className="border-t border-surface-container-high my-2" />
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container font-medium"
                }`}
                style={
                  isActive
                    ? {
                        boxShadow:
                          "3px 3px 8px rgba(16,110,0,0.2), -2px -2px 6px rgba(57,255,20,0.15), inset 1px 1px 3px rgba(57,255,20,0.2)",
                      }
                    : undefined
                }
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-on-primary" : "text-outline"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top bar mobile */}
        <header
          className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-surface-container-high px-4 py-3 lg:hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-surface-container rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"
                style={{ boxShadow: "2px 2px 6px rgba(16,110,0,0.2)" }}
              >
                <Activity className="w-3.5 h-3.5 text-on-primary" />
              </div>
              <span className="text-sm font-bold text-on-surface">
                HEAL Admin
              </span>
            </div>
            <div className="text-on-surface-variant">
              <NotificationDropdown />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>

      <FloatingChat />
    </div>
  );
}
