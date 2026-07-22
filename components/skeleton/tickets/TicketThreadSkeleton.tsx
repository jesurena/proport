'use client';

import { AppSkeleton } from '@/components/ui/skeleton';
import React from 'react';


export function TicketThreadSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            paddingTop: i === 0 ? '0px' : '16px',
            paddingBottom: i === count - 1 ? '8px' : '16px',
            borderBottom: i === count - 1 ? 'none' : '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
              {/* Avatar 36px */}
              <AppSkeleton variant="circular" width={36} height={36} style={{ flexShrink: 0 }} />

              {/* Author & Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
                <AppSkeleton variant="text" width={130} height={14} />
                <AppSkeleton variant="text" width={160} height={11} />
              </div>
            </div>

            {/* Time ago + Expand Chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingTop: '4px' }}>
              <AppSkeleton variant="text" width={55} height={11} />
              <AppSkeleton variant="circular" width={14} height={14} />
            </div>
          </div>

          {/* Body Content Placeholder */}
          <div style={{ paddingLeft: '48px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <AppSkeleton variant="text" width="94%" height={13} />
            <AppSkeleton variant="text" width={i % 2 === 0 ? '78%' : '60%'} height={13} />
          </div>
        </div>
      ))}
    </div>
  );
}
