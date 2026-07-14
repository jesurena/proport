'use client';

import React from 'react';
import { cn } from '@integrated-computer-system/ui-kit';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-accent-1',
  iconBg = 'bg-accent-1/10',
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-card-bg border border-border/60 p-5',
        'transition-all duration-200 hover:shadow-md hover:border-border',
        'group',
        className
      )}
    >
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-1/[0.02] to-transparent pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-text-info">{label}</span>
          <span className="text-3xl font-bold text-text tracking-tight">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium mt-1',
                trend.positive ? 'text-success' : 'text-danger'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <div
          className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
            'transition-transform duration-200 group-hover:scale-105',
            iconBg
          )}
        >
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
