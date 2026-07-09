'use client';

import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="clay-card-sm p-8 sm:p-12 text-center">
      <div className="clay-icon-tray bg-surface-container-high mx-auto mb-4">
        <Inbox className="w-6 h-6 text-outline" />
      </div>
      {title && <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>}
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
  );
}
