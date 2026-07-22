'use client';

import { AppSkeleton } from '@/components/ui/skeleton';
import React from 'react';


function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        gap: '16px',
        borderBottom: '1px solid var(--border)',
        minHeight: '60px',
      }}
    >
      {/* #ID — 50px */}
      <div style={{ width: '50px', flexShrink: 0 }}>
        <AppSkeleton variant="text" width={38} height={13} />
      </div>

      {/* Brand chip — 80px */}
      <div style={{ width: '80px', flexShrink: 0 }}>
        <AppSkeleton variant="rounded" width={68} height={22} />
      </div>

      {/* Subject — flex 1, avatar + two text lines */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AppSkeleton variant="circular" width={36} height={36} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <AppSkeleton variant="text" width="68%" height={14} />
          <AppSkeleton variant="text" width="42%" height={11} />
        </div>
      </div>

      {/* Assignee avatars — 100px */}
      <div style={{ width: '100px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginLeft: '-6px' }}>
          <AppSkeleton variant="circular" width={24} height={24} style={{ outline: '2px solid var(--background)', zIndex: 3 }} />
          <AppSkeleton variant="circular" width={24} height={24} style={{ outline: '2px solid var(--background)', zIndex: 2, marginLeft: '-6px' }} />
          <AppSkeleton variant="circular" width={24} height={24} style={{ outline: '2px solid var(--background)', zIndex: 1, marginLeft: '-6px' }} />
        </div>
      </div>

      {/* Status chip — 80px */}
      <div style={{ width: '80px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <AppSkeleton variant="rounded" width={70} height={22} />
      </div>

      {/* Replies — 60px */}
      <div style={{ width: '60px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <AppSkeleton variant="text" width={24} height={13} />
      </div>

      {/* Last Updated — 100px */}
      <div style={{ width: '100px', flexShrink: 0 }}>
        <AppSkeleton variant="text" width={80} height={13} />
      </div>

      {/* Last Transaction — 100px */}
      <div style={{ width: '100px', flexShrink: 0 }}>
        <AppSkeleton variant="text" width={80} height={13} />
      </div>
    </div>
  );
}

export function TicketTableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--card-bg)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 16px',
          gap: '16px',
          background: 'var(--neutral)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ width: '50px', flexShrink: 0 }}>
          <AppSkeleton variant="text" width={28} height={11} />
        </div>
        <div style={{ width: '80px', flexShrink: 0 }}>
          <AppSkeleton variant="text" width={38} height={11} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <AppSkeleton variant="text" width={56} height={11} />
        </div>
        <div style={{ width: '100px', flexShrink: 0 }}>
          <AppSkeleton variant="text" width={58} height={11} />
        </div>
        <div style={{ width: '80px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <AppSkeleton variant="text" width={44} height={11} />
        </div>
        <div style={{ width: '60px', flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <AppSkeleton variant="text" width={40} height={11} />
        </div>
        <div style={{ width: '100px', flexShrink: 0 }}>
          <AppSkeleton variant="text" width={72} height={11} />
        </div>
        <div style={{ width: '100px', flexShrink: 0 }}>
          <AppSkeleton variant="text" width={88} height={11} />
        </div>
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
