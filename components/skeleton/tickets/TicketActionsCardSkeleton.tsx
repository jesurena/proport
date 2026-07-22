'use client';

import { AppSkeleton } from '@/components/ui/skeleton';
import React from 'react';


export function TicketActionsCardSkeleton() {
  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: 'var(--card-bg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Colored Status Header Box */}
      <div
        style={{
          padding: '20px',
          background: 'var(--neutral)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <AppSkeleton variant="rounded" width={100} height={18} />
          <AppSkeleton variant="text" width={45} height={14} style={{ marginLeft: 'auto' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <AppSkeleton variant="text" width="60%" height={16} />
          <AppSkeleton variant="text" width="95%" height={12} />
          <AppSkeleton variant="text" width="80%" height={12} />
        </div>
      </div>

      {/* Action Controls & Assignment Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Status Dropdown / Action Button */}
        <AppSkeleton variant="rounded" width="100%" height={38} />

        {/* Assignees Section */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AppSkeleton variant="text" width={100} height={11} />
          
          {/* Assignee item pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--neutral)',
            }}
          >
            <AppSkeleton variant="circular" width={20} height={20} />
            <AppSkeleton variant="text" width={120} height={12} />
          </div>

          {/* Update Assignment Button */}
          <AppSkeleton variant="rounded" width="100%" height={36} style={{ marginTop: '4px' }} />
        </div>
      </div>
    </div>
  );
}
