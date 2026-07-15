'use client';

import { create } from 'zustand';

export interface ComposeState {
  isOpen: boolean;
  isMinimized: boolean;
  isExpanded: boolean;
  defaultBrandType: 'Focus' | 'Non Focus' | '';

  openCompose: (brandType?: 'Focus' | 'Non Focus') => void;
  closeCompose: () => void;
  setMinimized: (minimized: boolean) => void;
  setExpanded: (expanded: boolean) => void;
}

export const useComposeStore = create<ComposeState>((set) => ({
  isOpen: false,
  isMinimized: false,
  isExpanded: false,
  defaultBrandType: '',

  openCompose: (brandType = 'Focus') =>
    set({
      isOpen: true,
      isMinimized: false, // Force restore if currently minimized
      defaultBrandType: brandType,
    }),
  closeCompose: () =>
    set({
      isOpen: false,
      isMinimized: false,
      isExpanded: false,
      defaultBrandType: '',
    }),
  setMinimized: (isMinimized) => set({ isMinimized }),
  setExpanded: (isExpanded) => set({ isExpanded }),
}));
