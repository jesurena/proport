'use client';

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Clock, 
  Archive, 
  UserCheck, 
  UserMinus,
  Award,
  Box
} from 'lucide-react';
import { cn } from '../../utils/cn';

export type AppChipVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'accent'
    | 'muted'
    | 'soon'
    | 'archive'
    | 'assigned'
    | 'unassigned'
    | 'pending'
    | 'answered'
    | 'closed'
    | 'escalated'
    | 'reassigned'
    | 'bu-approval'
    | 'bu-declined'
    | 'final-approval'
    | 'adel-declined'
    | 'focus'
    | 'non-focus'
    | 'for approval of bu head'
    | 'for-approval-of-bu-head'
    | 'declined by bu head'
    | 'declined-by-bu-head'
    | 'for final approval'
    | 'for-final-approval'
    | 'declined by final approver'
    | 'declined-by-final-approver';

export interface AppChipProps {
    label: string;
    variant?: AppChipVariant;
    icon?: React.ReactNode | null;
    color?: string;
    removable?: boolean;
    onRemove?: () => void;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    size?: 'sm' | 'md';
}

const VARIANT_CLASSES: Record<AppChipVariant, string> = {
    default:  'bg-accent-1 text-white',
    success:  'bg-green-600 text-white',
    warning:  'bg-amber-500 text-white',
    danger:   'bg-red-500 text-white',
    info:     'bg-sky-500 text-white',
    accent:   'bg-accent-1 text-white',
    muted:    'bg-foreground/10 text-foreground/60',
    soon:     'bg-foreground/10 text-foreground/40',
    archive:  'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-neutral/40 dark:text-foreground/60 dark:border-border/40',
    assigned: 'bg-emerald-600 text-white',
    unassigned: 'bg-zinc-500 text-white',
    pending: 'bg-amber-500 text-white',
    answered: 'bg-teal-600 text-white',
    closed: 'bg-emerald-600 text-white',
    escalated: 'bg-red-600 text-white',
    reassigned: 'bg-indigo-600 text-white',
    'bu-approval': 'bg-emerald-800 text-white',
    'bu-declined': 'bg-red-600 text-white',
    'final-approval': 'bg-emerald-600 text-white',
    'adel-declined': 'bg-red-600 text-white',
    focus: 'bg-purple-600 text-white',
    'non-focus': 'bg-blue-600 text-white',
    'for approval of bu head': 'bg-pink-600 text-white',
    'for-approval-of-bu-head': 'bg-pink-600 text-white',
    'declined by bu head': 'bg-red-600 text-white',
    'declined-by-bu-head': 'bg-red-600 text-white',
    'for final approval': 'bg-emerald-600 text-white',
    'for-final-approval': 'bg-emerald-600 text-white',
    'declined by final approver': 'bg-red-600 text-white',
    'declined-by-final-approver': 'bg-red-600 text-white',
};

const VARIANT_DEFAULT_ICONS: Partial<Record<AppChipVariant, React.ReactElement>> = {
    success: <CheckCircle2 />,
    warning: <AlertTriangle />,
    danger:  <XCircle />,
    info:    <Info />,
    soon:    <Clock />,
    archive: <Archive />,
    assigned: <UserCheck />,
    unassigned: <UserMinus />,
    pending: <Clock />,
    answered: <CheckCircle2 />,
    closed: <CheckCircle2 />,
    escalated: <AlertTriangle />,
    reassigned: <Clock />,
    'bu-approval': <Clock />,
    'bu-declined': <XCircle />,
    'final-approval': <CheckCircle2 />,
    'adel-declined': <XCircle />,
    focus: <Award />,
    'non-focus': <Box />,
    'for approval of bu head': <Clock />,
    'for-approval-of-bu-head': <Clock />,
    'declined by bu head': <XCircle />,
    'declined-by-bu-head': <XCircle />,
    'for final approval': <CheckCircle2 />,
    'for-final-approval': <CheckCircle2 />,
    'declined by final approver': <XCircle />,
    'declined-by-final-approver': <XCircle />,
};

export const AppChip: React.FC<AppChipProps> = ({
    label,
    variant = 'default',
    icon,
    color,
    removable = false,
    onRemove,
    disabled = false,
    className,
    onClick,
    size = 'sm',
}) => {
    const isInteractive = !!onClick && !disabled;

    const sizeClasses = size === 'md'
        ? 'pl-3 pr-4 py-1.5 text-xs gap-2'
        : 'pl-2.5 pr-3.5 py-1 text-[11px] gap-1.5';

    const iconSize = size === 'md' ? 12 : 10;
    const iconBoxClasses = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

    const resolvedIcon: React.ReactNode = icon !== undefined
        ? icon
        : VARIANT_DEFAULT_ICONS[variant] ?? null;

    return (
        <div
            role={isInteractive ? 'button' : undefined}
            tabIndex={isInteractive ? 0 : undefined}
            onClick={isInteractive ? onClick : undefined}
            onKeyDown={isInteractive
                ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }
                : undefined}
            className={cn(
                'inline-flex items-center rounded-full font-bold shadow-sm select-none transition-all',
                sizeClasses,
                !color && VARIANT_CLASSES[variant],
                disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : isInteractive
                        ? 'cursor-pointer hover:opacity-90'
                        : 'cursor-default hover:opacity-90',
                className,
            )}
            style={color ? { background: color, color: 'white' } : undefined}
        >
            {resolvedIcon && (
                <span className={cn('flex items-center justify-center shrink-0', iconBoxClasses)}>
                    {React.isValidElement(resolvedIcon)
                        ? React.cloneElement(resolvedIcon as React.ReactElement<any>, { size: iconSize })
                        : resolvedIcon}
                </span>
            )}

            <span className="truncate max-w-[200px] leading-none">{label}</span>

            {removable && !disabled && (
                <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                    className="flex items-center justify-center hover:bg-white/25 rounded-full p-0.5 shrink-0 transition-colors"
                >
                    <X size={iconSize} />
                </button>
            )}
        </div>
    );
};
