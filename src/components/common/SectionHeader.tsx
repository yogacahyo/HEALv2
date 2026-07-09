'use client';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  simulationLabel?: string;
  badge?: string;
}

export function SectionHeader({ title, subtitle, simulationLabel, badge }: SectionHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">{title}</h2>
        {badge && (
          <span className="clay-badge bg-[#e8f5e9] text-[#106e00] border border-[#a5d6a7] text-[10px] sm:text-xs">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs sm:text-sm text-on-surface-variant">{subtitle}</p>}
    </div>
  );
}
