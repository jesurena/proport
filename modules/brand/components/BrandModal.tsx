import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { AppButton, AppInput, AppModal, AppSelect } from '@integrated-computer-system/ui-kit';
import type { BrandModalController } from '../hooks/use-brand-modal';

interface BrandRow {
  id: string;
  name: string;
  type: 'Focus' | 'Non Focus';
  checked: boolean;
}

interface BrandModalProps {
  controller: BrandModalController;
  onSave: (items: { name: string; type: 'Focus' | 'Non Focus' }[]) => void;
}

const TYPE_OPTIONS = [
  { value: 'Focus', label: 'Focus' },
  { value: 'Non Focus', label: 'Non Focus' },
];

export default function BrandModal({
  controller,
  onSave,
}: BrandModalProps) {
  const { open, close, mode, brandName, brandType } = controller;
  const [rows, setRows] = useState<BrandRow[]>([]);

  useEffect(() => {
    if (open) {
      if (mode === 'add') {
        setRows([{ id: 'row_' + Date.now(), name: '', type: 'Focus', checked: false }]);
      } else {
        setRows([{ id: 'row_' + Date.now(), name: brandName, type: brandType, checked: false }]);
      }
    }
  }, [open, mode, brandName, brandType]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: 'row_' + (Date.now() + Math.random()), name: '', type: 'Focus', checked: false },
    ]);
  };

  const handleRemoveRows = () => {
    if (rows.length === 1) {
      return;
    }
    const remaining = rows.filter((r) => !r.checked);
    if (remaining.length === 0) {
      setRows([{ ...rows[0], name: '', checked: false }]);
    } else {
      setRows(remaining);
    }
  };

  const handleRowChange = (id: string, field: 'name' | 'type' | 'checked', value: any) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (field === 'name') {
            return { ...r, name: (value as string).toUpperCase() };
          }
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  const handleSaveClick = () => {
    onSave(
      rows.map((r) => ({
        name: r.name.trim(),
        type: r.type,
      }))
    );
  };

  return (
    <AppModal open={open} onClose={close} width={mode === 'add' ? '680px' : '450px'} centered>
      <AppModal.Body className="space-y-4">
        <div>
          <AppModal.Title>
            {mode === 'add' ? 'Add New Brand' : 'Edit Brand'}
          </AppModal.Title>
          <AppModal.Description>
            {mode === 'add'
              ? 'Enter the details of the brands you want to add to the catalog.'
              : 'Modify the brand name or focus classification status.'}
          </AppModal.Description>
        </div>

        {/* Buttons (Add Row / Remove Row) */}
        {mode === 'add' && (
          <div className="flex justify-end items-center gap-2 pt-1">
            <AppButton
              variant="neutral"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={handleAddRow}
              className="text-xs !bg-emerald-500/10 !text-emerald-700 !border-emerald-500/20 hover:!bg-emerald-500/15"
            >
              Add Row
            </AppButton>
            <AppButton
              variant="neutral"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={handleRemoveRows}
              className="text-xs !bg-rose-500/10 !text-rose-700 !border-rose-500/20 hover:!bg-rose-500/15"
              disabled={rows.length <= 1}
            >
              Remove Row
            </AppButton>
          </div>
        )}

        {/* Grid / Table */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-background">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral/40 border-b border-border/60 text-xs font-bold text-text-info select-none">
                {mode === 'add' && <th className="p-3 w-10 text-center"></th>}
                <th className="p-3">Brand Name</th>
                <th className="p-3 w-48">Brand Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {rows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-hover/20 transition-colors ${mode === 'add' ? 'cursor-pointer' : ''}`}
                  onClick={(e) => {
                    if (mode === 'add') {
                      const target = e.target as HTMLElement;
                      if (
                        target.tagName === 'INPUT' ||
                        target.closest('.ant-select') ||
                        target.closest('select') ||
                        target.closest('[role="combobox"]') ||
                        target.closest('button')
                      ) {
                        return;
                      }
                      handleRowChange(row.id, 'checked', !row.checked);
                    }
                  }}
                >
                  {mode === 'add' && (
                    <td className="p-3 w-10 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={row.checked}
                        onChange={(e) => handleRowChange(row.id, 'checked', e.target.checked)}
                        className="rounded border-border text-accent-1 focus:ring-accent-1 cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="p-3 align-middle">
                    <AppInput
                      value={row.name}
                      onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                      placeholder="e.g. ASUS"
                      className="w-full"
                    />
                  </td>
                  <td className="p-3 w-48 align-middle">
                    <AppSelect
                      options={TYPE_OPTIONS}
                      value={row.type}
                      onChange={(val) => handleRowChange(row.id, 'type', val)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <AppButton variant="neutral" onClick={close}>
            Cancel
          </AppButton>
          <AppButton variant="primary" onClick={handleSaveClick}>
            {mode === 'add' ? 'Save' : 'Save Changes'}
          </AppButton>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
