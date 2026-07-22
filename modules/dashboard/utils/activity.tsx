import React from 'react';
import { Mail, CheckCircle, UserPlus, Settings } from 'lucide-react';

export const formatActivityText = (text: string) => {
  if (!text) return '';
  const parts = text.split(/(#[0-9]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('#')) {
      return (
        <strong key={index} className="font-extrabold text-foreground">
          {part}
        </strong>
      );
    }
    return part;
  });
};

// Maps logs to visual icons and timeline colors
export const getLogCategoryMeta = (activityText: string) => {
  const text = activityText.toLowerCase();
  if (text.includes('reply') || text.includes('posted') || text.includes('comment') || text.includes('mail')) {
    return {
      icon: Mail,
      colorClass: 'bg-blue-600 dark:bg-blue-500 text-white border border-blue-700 dark:border-blue-400',
    };
  }
  if (text.includes('status') || text.includes('closed') || text.includes('resolved') || text.includes('answered') || text.includes('open') || text.includes('progress') || text.includes('unassigned')) {
    return {
      icon: CheckCircle,
      colorClass: 'bg-amber-500 dark:bg-amber-500 text-white border border-amber-600 dark:border-amber-400',
    };
  }
  if (text.includes('assigned') || text.includes('assign') || text.includes('reassigned') || text.includes('owner')) {
    return {
      icon: UserPlus,
      colorClass: 'bg-emerald-600 dark:bg-emerald-500 text-white border border-emerald-700 dark:border-emerald-400',
    };
  }
  return {
    icon: Settings,
    colorClass: 'bg-neutral-500 dark:bg-neutral-600 text-white border border-neutral-600 dark:border-neutral-500',
  };
};
