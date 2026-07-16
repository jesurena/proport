'use client';

import React from 'react';
import { AppChip } from '@/components/ui';

interface BrandTicketChipProps {
  brandName?: string;
  brandType?: string;
  className?: string;
}

export function BrandTicketChip({
  brandName,
  brandType,
  className,
}: BrandTicketChipProps) {
  const isFocus = brandType === 'Focus';
  const label = brandName || 'General';

  return (
    <AppChip
      label={label}
      variant={isFocus ? 'focus' : 'non-focus'}
      size="sm"
      className={className}
    />
  );
}
