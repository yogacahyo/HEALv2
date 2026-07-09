"use client";

import { type ReactNode } from "react";

interface ResponsiveChartCardProps {
  title: string;
  subtitle?: string;
  height?: number;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function ResponsiveChartCard({
  title,
  subtitle,
  height = 250,
  headerAction,
  children,
}: ResponsiveChartCardProps) {
  return (
    <div className="clay-card-sm p-5 sm:p-6">
      <div className="mb-4 flex justify-between items-start gap-4">
        <div>
          <h3 className="text-sm font-bold text-on-surface tracking-tight">
            {title}
          </h3>
          {subtitle && <p className="text-xs text-outline mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      <div className="chart-container" style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
}
