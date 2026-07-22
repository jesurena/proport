'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { AppButton, AppLabel } from '@integrated-computer-system/ui-kit';
import { ProportNavbar } from '@/modules/sidebar';
import { BrandTableSkeleton } from '@/components/skeleton';
import {
  BrandMaintenanceTable,
  BrandModal,
  BrandToolbar,
  useBrands,
  useBrandFilters,
  useBrandModal,
  useBrandActions,
} from '@/modules/brand';

export default function BrandsPage() {
  const { data: brands = [], isLoading } = useBrands();

  const filters = useBrandFilters(brands);
  const modal = useBrandModal();
  const actions = useBrandActions(modal);

  return (
    <>
      <ProportNavbar title="Brand Maintenance" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <AppLabel as="h2" variant="title" className="!text-lg !font-bold">
              Brand Maintenance
            </AppLabel>
            <AppLabel as="p" variant="description" className="text-sm">
              Manage global brand catalog and their focus classification status.
            </AppLabel>
          </div>
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={modal.openAdd}
          >
            Add Brand
          </AppButton>
        </div>

        {/* Toolbar */}
        <BrandToolbar filters={filters} />

        {/* Table */}
        {isLoading ? (
          <BrandTableSkeleton />
        ) : (
          <BrandMaintenanceTable
            filteredBrands={filters.filteredBrands}
            onEdit={modal.openEdit}
            onDelete={actions.deleteBrand}
          />
        )}
      </div>

      {/* Modal */}
      <BrandModal controller={modal} onSave={actions.saveBrand} loading={actions.loading} />
    </>
  );
}
