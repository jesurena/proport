'use client';

import React from 'react';
import { Tooltip } from 'antd';
import { AppAvatar } from '@/components/ui';
import { cn } from '@/components/utils/cn';

export interface TicketAvatarProps {
  src?: string;
  name: string;
  size?: number;
  status?: 'unread' | 'pending' | 'answered' | string;
  className?: string;
  style?: React.CSSProperties;
}

export function TicketAvatar({ src, name, size = 24, status, className, style }: TicketAvatarProps) {
  let borderColor = 'border-transparent';
  if (status === 'unread') {
    borderColor = 'border-red-500 dark:border-red-400';
  } else if (status === 'pending') {
    borderColor = 'border-yellow-500 dark:border-yellow-400';
  } else if (status === 'answered') {
    borderColor = 'border-green-500 dark:border-green-400';
  }

  return (
    <Tooltip title={name} placement="top" mouseEnterDelay={0.2}>
      <div
        className={cn(
          "rounded-full p-[1px] border-2 flex items-center justify-center shrink-0 bg-background transition-all duration-200 hover:!z-50 hover:shadow-md cursor-pointer relative",
          borderColor,
          className
        )}
        style={style}
      >
        <AppAvatar
          src={src}
          name={name}
          size={size - 4}
          className="border-none shadow-none"
        />
      </div>
    </Tooltip>
  );
}
