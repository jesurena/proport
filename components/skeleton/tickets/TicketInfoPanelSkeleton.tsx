'use client';

import { AppSkeleton } from '@/components/ui/skeleton';
import React from 'react';

export function TicketInfoPanelSkeleton() {
  return (
    <div
      style={{
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Title */}
      <AppSkeleton variant="text" width={130} height={15} style={{ marginBottom: '4px' }} />

      {/* Field 1: Buyer (Assignee) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <AppSkeleton variant="text" width={100} height={10} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppSkeleton variant="circular" width={24} height={24} />
          <AppSkeleton variant="text" width={110} height={13} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

      {/* Field 2: Priority */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <AppSkeleton variant="text" width={60} height={10} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppSkeleton variant="circular" width={10} height={10} />
          <AppSkeleton variant="text" width={75} height={13} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

      {/* Field 3: Business Unit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <AppSkeleton variant="text" width={90} height={10} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppSkeleton variant="circular" width={14} height={14} />
          <AppSkeleton variant="text" width={140} height={13} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

      {/* Field 4: Sales Rep (Requester) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <AppSkeleton variant="text" width={120} height={10} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AppSkeleton variant="circular" width={24} height={24} />
          <AppSkeleton variant="text" width={120} height={13} />
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', opacity: 0.5 }} />

      {/* Timestamps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppSkeleton variant="text" width={60} height={11} />
          <AppSkeleton variant="text" width={110} height={11} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <AppSkeleton variant="text" width={60} height={11} />
          <AppSkeleton variant="text" width={110} height={11} />
        </div>
      </div>
    </div>
  );
}
