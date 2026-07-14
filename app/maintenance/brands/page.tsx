'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AppButton,
  AppInput,
  AppModal,
  AppSelect,
  AppLabel,
  AppChip,
} from '@integrated-computer-system/ui-kit';
import { Plus, Search, Edit, Trash2, ArrowLeft, PlusCircle, MinusCircle, MoreVertical, Target, Circle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProportNavbar } from '@/modules/sidebar';
import { getBrands, addBrand, updateBrand, deleteBrand, type Brand } from '@/lib/brands';
import { AppDropdown, AppTable } from '@/components/ui';
import { notification, modal, message } from '@/modules/theme';

const TYPE_OPTIONS = [
  { value: 'Focus', label: 'Focus' },
  { value: 'Non Focus', label: 'Non Focus' },
];

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Form states
  const [newRows, setNewRows] = useState<{ id: string; name: string; type: 'Focus' | 'Non Focus'; checked: boolean }[]>([
    { id: '1', name: '', type: 'Focus', checked: false }
  ]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState<'Focus' | 'Non Focus'>('Focus');

  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as const,
    },
    {
      title: 'Brand Type',
      dataIndex: 'type',
      key: 'type',
      slotName: 'brandType',
      align: 'center' as const,
    },
    {
      title: 'Action',
      key: 'action',
      slotName: 'action',
      align: 'center' as const,
      width: 120,
    },
  ];

  const slots = {
    brandType: (type: string) => (
      <AppChip
        label={type}
        color={type === 'Focus' ? '#7c3aed' : '#2563eb'}
        icon={type === 'Focus' ? <Target /> : <Circle />}
        size="sm"
      />
    ),
    action: (_: any, record: Brand) => {
      const dropdownItems = [
        {
          key: 'edit',
          label: 'Edit',
          icon: <Edit size={14} className="text-emerald-600" />,
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <Trash2 size={14} className="text-rose-600" />,
          danger: true,
        },
      ];

      const handleMenuClick = (info: any) => {
        if (info.key === 'edit') {
          handleOpenEdit(record);
        } else if (info.key === 'delete') {
          handleOpenDelete(record);
        }
      };

      return (
        <div className="flex items-center justify-center">
          <AppDropdown
            items={dropdownItems}
            onItemClick={handleMenuClick}
            placement="bottomRight"
          >
            <button className="p-2 rounded-lg text-text-info transition-all cursor-pointer">
              <MoreVertical size={16} />
            </button>
          </AppDropdown>
        </div>
      );
    },
  };

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
      message.warning('Please fill in all brand names!');
      return;
    }

    newRows.forEach((r) => {
      addBrand(r.name.trim(), r.type);
    });

    setNewRows([{ id: '1', name: '', type: 'Focus', checked: false }]);
    setAddOpen(false);
    loadBrands();

    notification.success({
      message: 'Brands Added',
      description: 'The brands have been successfully added to the catalog.',
      placement: 'topRight',
    });
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
      message.warning('Brand name is required!');
      return;
    }
    if (selectedBrand) {
      updateBrand(selectedBrand.id, editName.trim(), editType);
      setEditOpen(false);
      loadBrands();

      notification.success({
        message: 'Brand Updated',
        description: `"${editName.trim()}" has been successfully updated.`,
        placement: 'topRight',
      });
    }
  };

  // Delete Brand: open using modal.confirm
  const handleOpenDelete = (brand: Brand) => {
    modal.confirm({
      title: 'Confirm Brand Deletion',
      content: `Are you sure you want to permanently delete the brand "${brand.name}"? This action cannot be undone and will update the global catalog configuration.`,
      okText: 'Delete Brand',
      cancelText: 'Cancel',
      okButtonProps: { danger: true },
      centered: true,
      onOk: () => {
        deleteBrand(brand.id);
        loadBrands();
        notification.success({
          message: 'Brand Deleted',
          description: `"${brand.name}" has been successfully deleted.`,
          placement: 'topRight',
        });
      },
    });
  };

  return (
    <>
      <ProportNavbar title="Brand Maintenance" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <AppLabel as="h2" variant="title" className="!text-lg !font-bold">Brand Maintenance</AppLabel>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <AppInput
              preset="search"
              placeholder="Search brands by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <AppTable
          columns={columns}
          dataSource={filteredBrands}
          slots={slots}
          rowKey="id"
        />
      </div>

      {/* Add Brand Modal */}
      <AppModal open={addOpen} onClose={() => setAddOpen(false)} width="520px" centered>
        <AppModal.Body className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="text-base font-bold text-text">Add New Brands</h3>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 py-1">
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

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <AppButton variant="neutral" onClick={() => setAddOpen(false)}>Cancel</AppButton>
            <AppButton variant="primary" onClick={handleSaveBrands}>
              Save
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>

      {/* Edit Brand Modal */}
      <AppModal open={editOpen} onClose={() => setEditOpen(false)} width="420px" centered>
        <AppModal.Body className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="text-base font-bold text-text">Edit Brand Maintenance</h3>
          </div>

          <div className="space-y-4">
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

          <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
            <AppButton variant="neutral" onClick={() => setEditOpen(false)}>Cancel</AppButton>
            <AppButton variant="primary" onClick={handleUpdateBrand}>
              Save Changes
            </AppButton>
          </div>
        </AppModal.Body>
      </AppModal>
    </>
  );
}
