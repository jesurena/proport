'use client';

import React from 'react';
import { AppSelect } from '@/components/ui';
import { AppAvatar } from '@integrated-computer-system/ui-kit';
import type { User } from '@/lib/types';

interface AppUserSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  users: User[];
  placeholder?: string;
  variant?: 'default' | 'borderless';
  className?: string;
}

export function AppUserSelect({
  value,
  onChange,
  users,
  placeholder = 'Select user...',
  variant = 'default',
  className,
}: AppUserSelectProps) {
  const options = users.map((u) => {
    const avatarUrl = u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name.split(' ').map(n => n[0]).join('')}`;
    
    return {
      value: u.id,
      label: (
        <div className="flex items-center gap-2 py-0.5">
          <AppAvatar
            src={avatarUrl}
            name={u.name}
            size={18}
            className="text-[9px] font-bold bg-accent-1 text-white shrink-0"
          />
          <span className="truncate">{u.name}</span>
        </div>
      ),
    };
  });

  return (
    <AppSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant={variant}
      className={className}
      showSearch
    />
  );
}
