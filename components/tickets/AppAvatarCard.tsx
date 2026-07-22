'use client';

import React from 'react';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { AppCard } from '@/components/ui';
import type { User } from '@/lib/types';
import { cn } from '@/components/utils/cn';

interface AppAvatarCardProps {
  user: User;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
}

export function AppAvatarCard({
  user,
  draggable,
  onDragStart,
  className,
}: AppAvatarCardProps) {
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;

  return (
    <AppCard
      variant="interactive"
      padding="sm"
      draggable={draggable}
      onDragStart={onDragStart}
      className={cn(
        "flex items-center gap-2 cursor-grab active:cursor-grabbing hover:border-border transition-all select-none !rounded-lg !py-2 !px-3",
        className
      )}
    >
      <AppAvatar src={avatarUrl} name={user.name} size={32} />
      <div className="flex-1 min-w-0 text-left">
        <AppLabel as="span" className="text-xs font-bold text-text uppercase block truncate leading-none mb-0.5">
          {user.name}
        </AppLabel>
        <AppLabel as="span" variant="description" className="text-[9px] uppercase font-bold text-text-info/70 tracking-wide block leading-none">
          {user.role}
        </AppLabel>
      </div>
    </AppCard>
  );
}
