"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "green" | "blue" | "amber" | "rose" | "indigo" | "cyan" | "slate";
  children?: ReactNode;
}

const colorMap = {
  green: { bg: "bg-[#e8f5e9]", text: "text-[#106e00]", icon: "text-[#2ae500]" },
  blue: { bg: "bg-[#e3f2fd]", text: "text-[#1565c0]", icon: "text-[#42a5f5]" },
  amber: { bg: "bg-[#fff8e1]", text: "text-[#f57f17]", icon: "text-[#ffb300]" },
  rose: { bg: "bg-[#fce8e8]", text: "text-[#c62828]", icon: "text-[#e57373]" },
  indigo: {
    bg: "bg-[#e8eaf6]",
    text: "text-[#283593]",
    icon: "text-[#5c6bc0]",
  },
  cyan: { bg: "bg-[#e0f7fa]", text: "text-[#00838f]", icon: "text-[#26c6da]" },
  slate: {
    bg: "bg-surface-container-high",
    text: "text-on-surface-variant",
    icon: "text-outline",
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "green",
  children,
}: KPICardProps) {
  const c = colorMap[color];
  return (
    <div className="clay-card-sm p-5 sm:p-6">
      <div className="flex items-start gap-4">
        {/* Icon Left */}
        <div className={`clay-icon-tray shrink-0 ${c.bg}`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>

        {/* Text Right */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xl sm:text-2xl font-bold text-on-surface mb-0.5 tracking-tight">
                {value}
              </p>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                {title}
              </p>
              {subtitle && (
                <p className="text-[10px] sm:text-xs text-outline mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Trend Indicator (if exists) */}
            {trend && (
              <span
                className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${trend.value >= 0 ? "bg-[#e8f5e9] text-[#106e00]" : "bg-[#fce8e8] text-[#c62828]"}`}
              >
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}
                {trend.label}
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
