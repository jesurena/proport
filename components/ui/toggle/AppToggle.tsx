'use client';

import React from 'react';
import { cn, AppLabel } from '@integrated-computer-system/ui-kit';

interface ToggleOption<T> {
  label: string;
  value: T;
}

interface AppToggleProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function AppToggle<T extends string>({
  options,
  value,
  onChange,
  className,
}: AppToggleProps<T>) {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "flex gap-1 bg-primary p-1 rounded-lg border border-primary/20 w-fit shadow-inner",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3 py-1 rounded-md transition-all duration-200 cursor-pointer select-none flex items-center justify-center",
              isActive
                ? (isDark ? "bg-zinc-900 text-white shadow-xs" : "bg-white text-primary shadow-xs")
                : "text-white/75 hover:text-white hover:bg-white/10"
            )}
          >
            <AppLabel
              as="span"
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider leading-none transition-colors",
                isActive
                  ? (isDark ? "text-white" : "text-primary")
                  : "text-white/75 hover:text-white"
              )}
            >
              {opt.label}
            </AppLabel>
          </button>
        );
      })}
    </div>
  );
}
