'use client';

import React from 'react';
import { AppModal } from '@/components/ui/modal';
import { AppCard } from '@/components/ui/cards';
import { Award, Box } from 'lucide-react';

interface BrandTypeSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: 'Focus' | 'Non Focus') => void;
}

export function BrandTypeSelectModal({ open, onClose, onSelect }: BrandTypeSelectModalProps) {
  return (
    <AppModal open={open} onClose={onClose} width={480}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-1.5 mt-2">
          <AppModal.Title className="text-xl font-extrabold text-text tracking-tight flex items-center justify-center gap-2">
            Compose Price Inquiry
          </AppModal.Title>
          <AppModal.Description className="text-sm text-text-info max-w-sm mx-auto">
            Please select the brand category for your new price inquiry to route it appropriately.
          </AppModal.Description>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3.5 mb-2">
          <AppCard
            as="button"
            onClick={() => onSelect('Focus')}
            variant="interactive"
            className="w-full p-5 flex items-center gap-4 text-left border border-border/80 hover:border-accent-1/60 hover:bg-accent-1/5 transition-all duration-300 rounded-2xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-1/10 text-accent-1 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Award size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base text-text group-hover:text-accent-1 transition-colors">
                Focus Brand
              </h4>
              <p className="text-xs text-text-info mt-1 leading-relaxed font-normal">
                High-priority standard brands requiring special routing and fast approvals.
              </p>
            </div>
          </AppCard>

          <AppCard
            as="button"
            onClick={() => onSelect('Non Focus')}
            variant="interactive"
            className="w-full p-5 flex items-center gap-4 text-left border border-border/80 hover:border-text/30 hover:bg-neutral/40 transition-all duration-300 rounded-2xl group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-neutral text-text-info flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              <Box size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base text-text group-hover:text-text transition-colors">
                Non-Focus Brand
              </h4>
              <p className="text-xs text-text-info mt-1 leading-relaxed font-normal">
                Standard or minor catalog brands.
              </p>
            </div>
          </AppCard>
        </div>
      </div>
    </AppModal>
  );
}
