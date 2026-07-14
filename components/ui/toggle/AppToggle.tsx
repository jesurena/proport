'use client';

import React from 'react';
import { Segmented } from 'antd';

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
  return (
    <Segmented
      value={value}
      onChange={(val) => onChange(val as T)}
      options={options.map((o) => ({ label: o.label, value: o.value }))}
      className={className}
      style={{}}
      // Override Ant Design's default styling via CSS classes applied to root
      rootClassName="app-toggle"
    />
  );
}
