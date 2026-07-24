import React, { useState, useEffect } from 'react';
import { Info, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { AppButton, AppInput, AppSelect, AppModal, AppLabel, AppAvatar } from '@/components/ui';
import { BrandAssigneeModal } from './BrandAssigneeModal';
import { getUsers } from '@/lib/tickets';
import type { User } from '@/lib/types';
import type { BrandModalController } from '../hooks/use-brand-modal';

interface BrandModalProps {
  controller: BrandModalController;
  onSave: (items: { name: string; type: 'Focus' | 'Non Focus'; defaultAssignee?: string; assignees?: string[] }[]) => void;
  availableBuyers?: User[];
  loading?: boolean;
}

const TYPE_OPTIONS = [
  { value: 'Focus', label: 'Focus' },
  { value: 'Non Focus', label: 'Non Focus' },
];

export default function BrandModal({
  controller,
  onSave,
  availableBuyers,
  loading,
}: BrandModalProps) {
  const { open, close, mode, brandName, setBrandName, brandType, setBrandType } = controller;

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [brandAssigneeOpen, setBrandAssigneeOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && controller.selectedBrand) {
        const brand = controller.selectedBrand;
        if (brand.assignees && brand.assignees.length > 0) {
          setSelectedUsers(
            brand.assignees.map((a) => ({
              id: a.id,
              name: a.name,
              email: a.email,
              avatar: a.avatar || undefined,
            }))
          );
          setIsSettingsExpanded(true);
        } else {
          const assignees = (brand.defaultAssignee || '')
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean);
          const allUsers = availableBuyers && availableBuyers.length > 0 ? availableBuyers : getUsers();

          const matched = assignees.map((name) => {
            const found = allUsers.find((u) => u.name.toLowerCase() === name.toLowerCase());
            if (found) return found;
            return {
              id: 'temp_' + name,
              name,
              email: `${name.toLowerCase().replace(/\s+/g, '')}@proport.com`,
            } as User;
          });
          setSelectedUsers(matched);
          setIsSettingsExpanded(assignees.length > 0);
        }
      } else {
        setSelectedUsers([]);
        setIsSettingsExpanded(false);
      }
    }
  }, [open, mode, controller.selectedBrand, availableBuyers]);

  const handleSaveClick = () => {
    onSave([
      {
        name: brandName.trim(),
        type: brandType,
        defaultAssignee: selectedUsers.map((u) => u.name).join(', '),
        assignees: selectedUsers.map((u) => String(u.id)).filter((id) => !id.startsWith('temp_')),
      },
    ]);
  };

  return (
    <>
      <AppModal open={open} onClose={close} width="540px" centered>
        <AppModal.Body className="space-y-4">
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

          {/* Inputs */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <AppLabel className="text-xs font-semibold text-text-info">Brand Name</AppLabel>
              <AppInput
                value={brandName}
                onChange={(e) => setBrandName(e.target.value.toUpperCase())}
                placeholder="e.g. ASUS"
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <AppLabel className="text-xs font-semibold text-text-info">Brand Type</AppLabel>
              <AppSelect
                options={TYPE_OPTIONS}
                value={brandType}
                onChange={(val) => setBrandType(val as any)}
                className="w-full"
              />
            </div>
          </div>

          <div className="">
            <button
              type="button"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-text-info/80 hover:text-text cursor-pointer select-none transition-colors"
            >
              <span>Additional Settings</span>
              {isSettingsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isSettingsExpanded && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <AppLabel className="text-xs font-semibold text-text-info">Default Assignees</AppLabel>
                  <AppButton
                    variant="neutral"
                    size="sm"
                    className="text-xs font-semibold !h-7 !py-0.5 cursor-pointer"
                    leftIcon={<Plus size={12} />}
                    onClick={() => setBrandAssigneeOpen(true)}
                  >
                    Assign Buyer
                  </AppButton>
                </div>

                {selectedUsers.length === 0 ? (
                  <div className="text-xs text-text-info/50 border border-dashed border-border/40 rounded-xl p-3.5 text-center">
                    No default assignees selected.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 border border-border/40 rounded-xl p-2.5 bg-neutral/5">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-1.5 bg-card-bg border border-border/60 px-2 py-1 rounded-lg select-none"
                      >
                        <AppAvatar name={user.name} src={user.avatar} size={20} />
                        <span className="text-[11px] font-bold text-foreground max-w-[100px] truncate">
                          {user.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))}
                          className="text-text-info/40 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Remarks */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start gap-2.5 shadow-sm">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900">
                Remarks: Brand Name will be automatically capitalized.
              </p>
              <p className="italic text-amber-800/80">
                E.g: sap bussiness one = SAP BUSINESS ONE
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <AppButton variant="neutral" onClick={close} disabled={loading}>
              Cancel
            </AppButton>
            <AppButton variant="primary" onClick={handleSaveClick} loading={loading} disabled={loading}>
              {mode === 'add' ? 'Save' : 'Save Changes'}
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>

      <BrandAssigneeModal
        open={brandAssigneeOpen}
        onClose={() => setBrandAssigneeOpen(false)}
        selectedUsers={selectedUsers}
        availableBuyers={availableBuyers}
        onSelect={(users) => {
          setSelectedUsers(users);
        }}
      />
    </>
  );
}
