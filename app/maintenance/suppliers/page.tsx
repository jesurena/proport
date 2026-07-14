'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppButton,
  AppInput,
  AppChip,
  AppModal,
  AppSelect,
} from '@integrated-computer-system/ui-kit';
import { Plus, Search, Edit, Trash2, ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProportNavbar } from '@/modules/sidebar';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier, type Supplier } from '@/lib/suppliers';

const TYPE_OPTIONS = [
  { value: '1', label: 'Hardware/Systems' },
  { value: '2', label: 'Software/Cloud' },
];

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form states
  const [newRows, setNewRows] = useState<{ id: string; name: string; typeId: number; checked: boolean }[]>([
    { id: '1', name: '', typeId: 1, checked: false }
  ]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [editName, setEditName] = useState('');
  const [editTypeId, setEditTypeId] = useState(1);

  // Load suppliers
  const loadSuppliers = () => {
    setSuppliers(getSuppliers());
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliers;
    const q = searchQuery.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.typeName.toLowerCase().includes(q)
    );
  }, [suppliers, searchQuery]);

  // Add Supplier: add a row in modal
  const handleAddRow = () => {
    setNewRows((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), name: '', typeId: 1, checked: false }
    ]);
  };

  // Add Supplier: remove checked rows
  const handleRemoveCheckedRows = () => {
    if (newRows.length <= 1) {
      alert("You can't delete all rows!");
      return;
    }
    const unchecked = newRows.filter((r) => !r.checked);
    if (unchecked.length === 0) {
      alert("You must keep at least one row!");
      return;
    }
    setNewRows(unchecked);
  };

  // Add Supplier: save
  const handleSaveSuppliers = () => {
    // Check if empty
    const hasEmpty = newRows.some((r) => !r.name.trim());
    if (hasEmpty) {
      alert('Please fill in all supplier names!');
      return;
    }

    newRows.forEach((r) => {
      addSupplier(r.name.trim(), r.typeId);
    });

    setNewRows([{ id: '1', name: '', typeId: 1, checked: false }]);
    setAddOpen(false);
    loadSuppliers();
  };

  // Edit Supplier: open
  const handleOpenEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setEditName(supplier.name);
    setEditTypeId(supplier.typeId);
    setEditOpen(true);
  };

  // Edit Supplier: save
  const handleUpdateSupplier = () => {
    if (!editName.trim()) {
      alert('Supplier name is required!');
      return;
    }
    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, editName.trim(), editTypeId);
      setEditOpen(false);
      loadSuppliers();
    }
  };

  // Delete Supplier: open
  const handleOpenDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDeleteOpen(true);
  };

  // Delete Supplier: confirm
  const handleDeleteSupplier = () => {
    if (selectedSupplier) {
      deleteSupplier(selectedSupplier.id);
      setDeleteOpen(false);
      loadSuppliers();
    }
  };

  return (
    <>
      <ProportNavbar title="Supplier Settings" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-text">System Supplier Configuration</h2>
            <p className="text-sm text-text-info">Manage global tech and hardware suppliers database.</p>
          </div>
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setNewRows([{ id: '1', name: '', typeId: 1, checked: false }]);
              setAddOpen(true);
            }}
          >
            Add New Supplier
          </AppButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <AppInput
              placeholder="Search suppliers..."
              leftIcon={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              shape="pill"
            />
          </div>
        </div>

        {/* Suppliers Table Card */}
        <div className="rounded-2xl bg-card-bg border border-border/60 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_200px_120px] gap-4 px-6 py-3.5 bg-neutral/30 border-b border-border/40 font-semibold text-[11px] text-text-info uppercase tracking-wider">
            <span>Supplier Name</span>
            <span>Supplier Classification</span>
            <span className="text-right">Action</span>
          </div>

          {/* Rows */}
          {filteredSuppliers.length === 0 ? (
            <div className="text-center py-16 text-text-info">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No suppliers found</p>
              <p className="text-xs mt-1">Try search queries or add a new supplier.</p>
            </div>
          ) : (
            filteredSuppliers.map((supplier, i) => (
              <div
                key={supplier.id}
                className={`grid grid-cols-[1fr_200px_120px] gap-4 px-6 py-4 items-center ${
                  i !== filteredSuppliers.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                <span className="text-sm font-semibold text-text">{supplier.name}</span>
                <div>
                  <AppChip
                    label={supplier.typeName}
                    variant={supplier.typeId === 1 ? 'accent' : 'info'}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <AppButton
                    variant="neutral"
                    size="icon"
                    onClick={() => handleOpenEdit(supplier)}
                    className="!w-8 !h-8 !p-0 !text-success hover:!bg-success/5 hover:!border-success/30"
                    title={`Edit ${supplier.name}`}
                  >
                    <Edit size={14} />
                  </AppButton>
                  <AppButton
                    variant="neutral"
                    size="icon"
                    onClick={() => handleOpenDelete(supplier)}
                    className="!w-8 !h-8 !p-0 !text-danger hover:!bg-danger/5 hover:!border-danger/30"
                    title={`Delete ${supplier.name}`}
                  >
                    <Trash2 size={14} />
                  </AppButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD SUPPLIER MODAL */}
      <AppModal open={addOpen} onClose={() => setAddOpen(false)} width="500px" centered>
        <AppModal.Body className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-3">
            <h3 className="text-base font-bold text-text">Add Supplier Settings</h3>
          </div>

          {/* Add & Remove buttons */}
          <div className="flex gap-2 justify-end mb-2">
            <AppButton
              variant="neutral"
              leftIcon={<PlusCircle size={14} />}
              onClick={handleAddRow}
              className="text-xs !py-1 !px-2.5 !h-auto"
            >
              Add Row
            </AppButton>
            <AppButton
              variant="danger"
              leftIcon={<MinusCircle size={14} />}
              onClick={handleRemoveCheckedRows}
              className="text-xs !py-1 !px-2.5 !h-auto"
            >
              Remove Row
            </AppButton>
          </div>

          {/* Table list of rows */}
          <div className="max-h-[220px] overflow-y-auto border border-border/40 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral/40 border-b border-border/40 text-[10px] text-text-info uppercase tracking-wider font-semibold">
                  <th className="p-2 text-center w-[40px]">Select</th>
                  <th className="p-2">Supplier Name</th>
                  <th className="p-2 w-[160px]">Supplier Type</th>
                </tr>
              </thead>
              <tbody>
                {newRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/20 last:border-none hover:bg-neutral/10"
                    style={{ backgroundColor: row.checked ? 'var(--neutral)' : 'transparent' }}
                  >
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.checked}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setNewRows((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, checked: val } : r))
                          );
                        }}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="e.g. Ingram Micro"
                        value={row.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewRows((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, name: val } : r))
                          );
                        }}
                        className="w-full px-2 py-1 bg-background text-text border border-border/60 rounded focus:outline-none focus:border-accent-1"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={row.typeId}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setNewRows((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, typeId: val } : r))
                          );
                        }}
                        className="w-full px-2 py-1 bg-background text-text border border-border/60 rounded focus:outline-none focus:border-accent-1"
                      >
                        <option value="1">Hardware/Systems</option>
                        <option value="2">Software/Cloud</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <AppButton variant="neutral" onClick={() => setAddOpen(false)}>
              Cancel
            </AppButton>
            <AppButton variant="primary" onClick={handleSaveSuppliers}>
              Save Suppliers
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>

      {/* EDIT SUPPLIER MODAL */}
      <AppModal open={editOpen} onClose={() => setEditOpen(false)} width="420px" centered>
        <AppModal.Body className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="text-base font-bold text-text">Edit Supplier Settings</h3>
          </div>

          <div className="space-y-4">
            <AppInput
              label="Supplier Name"
              placeholder="e.g. Ingram Micro"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />

            <AppSelect
              label="Supplier Type"
              options={TYPE_OPTIONS}
              value={String(editTypeId)}
              onChange={(val) => setEditTypeId(Number(val))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <AppButton variant="neutral" onClick={() => setEditOpen(false)}>
              Cancel
            </AppButton>
            <AppButton variant="primary" onClick={handleUpdateSupplier}>
              Update Supplier
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>

      {/* DELETE CONFIRM MODAL */}
      <AppModal open={deleteOpen} onClose={() => setDeleteOpen(false)} width="380px" centered>
        <AppModal.Body className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <Trash2 size={40} className="mx-auto text-danger animate-bounce" />
            <h3 className="text-base font-bold text-text">Delete Supplier?</h3>
            <p className="text-sm text-text-info">
              Are you sure you want to delete supplier{' '}
              <span className="font-bold text-text">{selectedSupplier?.name}</span>? This action cannot be
              undone.
            </p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <AppButton variant="neutral" onClick={() => setDeleteOpen(false)}>
              Cancel
            </AppButton>
            <AppButton variant="danger" onClick={handleDeleteSupplier}>
              Yes, Delete It
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>
    </>
  );
}
