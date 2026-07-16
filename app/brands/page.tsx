'use client';

import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { AppButton, AppInput, AppLabel } from '@integrated-computer-system/ui-kit';
import { AppFilterPopover } from '@/components/ui';
import { ProportNavbar } from '@/modules/sidebar';
import {
  BrandMaintenanceTable,
  BrandModal,
  useBrandMaintenance,
} from '@/modules/brand';

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
    selectedBrandTypes,
    setSelectedBrandTypes,
    filterOpen,
    setFilterOpen,
    activeFiltersCount,
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          <div className="flex-1 min-w-0">
            <AppInput
              preset="search"
              placeholder="Search brands by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AppFilterPopover
              trigger={
                <AppButton
                  variant="neutral"
                  leftIcon={<Filter size={14} />}
                >
                  Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
                </AppButton>
              }
              open={filterOpen}
              onOpenChange={setFilterOpen}
              title="Filter Brands"
              onResetAll={() => {
                setSelectedBrandTypes([]);
              }}
              onApply={() => setFilterOpen(false)}
              onClose={() => setFilterOpen(false)}
            >
              <AppFilterPopover.Group title="Brand Type">
                <div className="flex flex-col gap-1 p-1">
                  {['Focus', 'Non Focus'].map((type) => {
                    const isChecked = selectedBrandTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-hover rounded-lg cursor-pointer text-xs text-text font-semibold"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedBrandTypes((prev) =>
                              isChecked ? prev.filter((b) => b !== type) : [...prev, type]
                            );
                          }}
                          className="rounded border-border text-accent-1 focus:ring-accent-1"
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </AppFilterPopover.Group>
            </AppFilterPopover>
          </div>
        </div>

        <BrandMaintenanceTable
          filteredBrands={filteredBrands}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </div>

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
