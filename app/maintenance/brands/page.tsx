'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { AppButton, AppInput, AppLabel } from '@integrated-computer-system/ui-kit';
import { ProportNavbar } from '@/modules/sidebar';
import {
  BrandMaintenanceTable,
  BrandModal,
  useBrandMaintenance,
} from '@/modules/maintenance';

export default function BrandsPage() {
  const {
    searchQuery,
    setSearchQuery,
    modalOpen,
    setModalOpen,
    modalMode,
    brandName,
    setBrandName,
    brandType,
    setBrandType,
    filteredBrands,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
  } = useBrandMaintenance();

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
            onClick={handleOpenAdd}
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
        <BrandMaintenanceTable
          filteredBrands={filteredBrands}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

      {/* Brand Form Modal */}
      <BrandModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        brandName={brandName}
        setBrandName={setBrandName}
        brandType={brandType}
        setBrandType={setBrandType}
        onSave={handleSave}
      />
    </>
  );
}
