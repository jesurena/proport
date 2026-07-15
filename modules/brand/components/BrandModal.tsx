import React from 'react';
import { AppButton, AppInput, AppModal, AppSelect, AppLabel } from '@integrated-computer-system/ui-kit';

interface BrandModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  brandName: string;
  setBrandName: (name: string) => void;
  brandType: 'Focus' | 'Non Focus';
  setBrandType: (type: 'Focus' | 'Non Focus') => void;
  onSave: () => void;
}

const TYPE_OPTIONS = [
  { value: 'Focus', label: 'Focus' },
  { value: 'Non Focus', label: 'Non Focus' },
];

export default function BrandModal({
  open,
  onClose,
  mode,
  brandName,
  setBrandName,
  brandType,
  setBrandType,
  onSave,
}: BrandModalProps) {
  return (
    <AppModal open={open} onClose={onClose} width="400px" centered>
      <AppModal.Body className="space-y-4">
        {/* Header */}
        <div>
          <AppModal.Title>
            {mode === 'add' ? 'Add New Brand' : 'Edit Brand'}
          </AppModal.Title>
          <AppModal.Description>
            {mode === 'add' 
              ? 'Enter the details of the brand you want to add to the catalog.' 
              : 'Modify the brand name or focus classification status.'}
          </AppModal.Description>
        </div>

        {/* Content Fields */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <AppLabel className="font-semibold text-xs text-text-info">Brand Name</AppLabel>
            <AppInput
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. ASUS"
            />
          </div>
          <div className="space-y-1.5">
            <AppLabel className="font-semibold text-xs text-text-info">Brand Type</AppLabel>
            <AppSelect
              options={TYPE_OPTIONS}
              value={brandType}
              onChange={(val) => setBrandType(val as 'Focus' | 'Non Focus')}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <AppButton variant="neutral" onClick={onClose}>Cancel</AppButton>
          <AppButton variant="primary" onClick={onSave}>
            {mode === 'add' ? 'Save' : 'Save Changes'}
          </AppButton>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
