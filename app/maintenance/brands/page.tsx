'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppButton,
  AppInput,
  AppModal,
  AppSelect,
  AppLabel,
} from '@integrated-computer-system/ui-kit';
import { Plus, Search, Edit, Trash2, ArrowLeft, PlusCircle, MinusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProportNavbar } from '@/modules/sidebar';
import { getBrands, addBrand, updateBrand, deleteBrand, type Brand } from '@/lib/brands';

const TYPE_OPTIONS = [
  { value: 'Focus', label: 'Focus' },
  { value: 'Non Focus', label: 'Non Focus' },
];

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form states
  const [newRows, setNewRows] = useState<{ id: string; name: string; type: 'Focus' | 'Non Focus'; checked: boolean }[]>([
    { id: '1', name: '', type: 'Focus', checked: false }
  ]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Focus' | 'Non Focus'>('Focus');

  // Load brands
  const loadBrands = () => {
    setBrands(getBrands());
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // Filtered brands
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const q = searchQuery.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.type.toLowerCase().includes(q)
    );
  }, [brands, searchQuery]);

  // Paginated brands
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBrands.slice(start, start + pageSize);
  }, [filteredBrands, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredBrands.length / pageSize) || 1;

  // Add Brand: add a row in modal
  const handleAddRow = () => {
    setNewRows((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), name: '', type: 'Focus', checked: false }
    ]);
  };

  // Add Brand: remove checked rows
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

  // Add Brand: save
  const handleSaveBrands = () => {
    const hasEmpty = newRows.some((r) => !r.name.trim());
    if (hasEmpty) {
      alert('Please fill in all brand names!');
      return;
    }

    newRows.forEach((r) => {
      addBrand(r.name.trim(), r.type);
    });

    setNewRows([{ id: '1', name: '', type: 'Focus', checked: false }]);
    setAddOpen(false);
    loadBrands();
  };

  // Edit Brand: open
  const handleOpenEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setEditName(brand.name);
    setEditType(brand.type);
    setEditOpen(true);
  };

  // Edit Brand: save
  const handleUpdateBrand = () => {
    if (!editName.trim()) {
      alert('Brand name is required!');
      return;
    }
    if (selectedBrand) {
      updateBrand(selectedBrand.id, editName.trim(), editType);
      setEditOpen(false);
      loadBrands();
    }
  };

  // Delete Brand: open
  const handleOpenDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteOpen(true);
  };

  // Delete Brand: confirm
  const handleDeleteBrand = () => {
    if (selectedBrand) {
      deleteBrand(selectedBrand.id);
      setDeleteOpen(false);
      loadBrands();
    }
  };

  return (
    <>
      <ProportNavbar title="Brand Settings" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-full border border-border/60 hover:bg-hover transition-colors cursor-pointer text-text-info hover:text-text"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <AppLabel as="h2" variant="title" className="!text-lg !font-bold">Brand Configuration</AppLabel>
              <AppLabel as="p" variant="description" className="text-sm">Manage global brand catalog and their focus classification status.</AppLabel>
            </div>
          </div>
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setNewRows([{ id: '1', name: '', type: 'Focus', checked: false }]);
              setAddOpen(true);
            }}
          >
            Add Brand
          </AppButton>
        </div>

        {/* Filters and Search */}
        <div className="bg-card-bg border border-border/60 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-text">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-neutral border border-border/60 rounded-lg px-2 py-1 focus:outline-hidden cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="w-full md:w-80">
              <AppInput
                preset="search"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-border/40 rounded-2xl">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-neutral/40 border-b border-border/40 text-xs text-text font-bold uppercase tracking-wider">
                  <th className="p-3.5">Brand Name</th>
                  <th className="p-3.5">Brand Type</th>
                  <th className="p-3.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {paginatedBrands.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-sm text-text-info/60 font-medium">
                      No brands found matching filters.
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral/10 text-sm text-text font-semibold">
                      <td className="p-4">{b.name}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white shadow-xs ${
                            b.type === 'Focus' ? 'bg-[#7c3aed]' : 'bg-[#2563eb]'
                          }`}
                        >
                          {b.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                            title="Edit Brand"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(b)}
                            className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                            title="Delete Brand"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border/20 pt-4 text-xs font-medium text-text-info">
            <div>
              Showing {filteredBrands.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredBrands.length)} of {filteredBrands.length} entries
            </div>
            <div className="flex items-center gap-1">
              <AppButton
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </AppButton>
              <div className="bg-neutral px-3 py-1 rounded-md text-text font-semibold">
                {currentPage} of {totalPages}
              </div>
              <AppButton
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      {/* Add Brand Modal */}
      <AppModal
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add New Brands"
        footer={
          <div className="flex justify-end gap-2 w-full mt-4">
            <AppButton onClick={() => setAddOpen(false)}>Cancel</AppButton>
            <AppButton variant="primary" onClick={handleSaveBrands}>
              Save
            </AppButton>
          </div>
        }
      >
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 py-1">
          <div className="flex justify-between items-center pb-2 border-b border-border/20">
            <span className="text-xs text-text-info font-bold">Manage rows:</span>
            <div className="flex gap-2">
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
              >
                <PlusCircle size={14} /> Add Row
              </button>
              <button
                onClick={handleRemoveCheckedRows}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
              >
                <MinusCircle size={14} /> Delete Checked
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {newRows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-3 bg-neutral/20 p-3 rounded-xl border border-border/20">
                <input
                  type="checkbox"
                  checked={row.checked}
                  onChange={(e) => {
                    const next = [...newRows];
                    next[index].checked = e.target.checked;
                    setNewRows(next);
                  }}
                  className="rounded border-border text-primary cursor-pointer w-4 h-4"
                />
                <div className="flex-1">
                  <AppInput
                    placeholder="Brand Name (e.g. ASUS)"
                    value={row.name}
                    onChange={(e) => {
                      const next = [...newRows];
                      next[index].name = e.target.value;
                      setNewRows(next);
                    }}
                  />
                </div>
                <div className="w-40">
                  <AppSelect
                    options={TYPE_OPTIONS}
                    value={row.type}
                    onChange={(val) => {
                      const next = [...newRows];
                      next[index].type = val as 'Focus' | 'Non Focus';
                      setNewRows(next);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppModal>

      {/* Edit Brand Modal */}
      <AppModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Brand Settings"
        footer={
          <div className="flex justify-end gap-2 w-full mt-4">
            <AppButton onClick={() => setEditOpen(false)}>Cancel</AppButton>
            <AppButton variant="primary" onClick={handleUpdateBrand}>
              Save Changes
            </AppButton>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <AppLabel className="font-semibold text-xs text-text-info">Brand Name</AppLabel>
            <AppInput
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="ASUS"
            />
          </div>
          <div className="space-y-1.5">
            <AppLabel className="font-semibold text-xs text-text-info">Brand Type</AppLabel>
            <AppSelect
              options={TYPE_OPTIONS}
              value={editType}
              onChange={(val) => setEditType(val as 'Focus' | 'Non Focus')}
            />
          </div>
        </div>
      </AppModal>

      {/* Delete Confirmation Modal */}
      <AppModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Confirm Brand Deletion"
        footer={
          <div className="flex justify-end gap-2 w-full mt-4">
            <AppButton onClick={() => setDeleteOpen(false)}>Cancel</AppButton>
            <AppButton variant="danger" onClick={handleDeleteBrand}>
              Delete Brand
            </AppButton>
          </div>
        }
      >
        <div className="py-2">
          <p className="text-sm text-text">
            Are you sure you want to permanently delete the brand{' '}
            <span className="font-bold text-accent-2">"{selectedBrand?.name}"</span>?
          </p>
          <p className="text-xs text-text-info mt-1.5">
            This action cannot be undone and will update the global catalog configuration.
          </p>
        </div>
      </AppModal>
    </>
  );
}
