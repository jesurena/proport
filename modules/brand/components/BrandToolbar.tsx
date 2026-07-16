import React from 'react';
import { Filter } from 'lucide-react';
import { AppButton, AppInput } from '@integrated-computer-system/ui-kit';
import { AppFilterPopover } from '@/components/ui';
import type { BrandFiltersType } from '../hooks/use-brand-filters';

interface BrandToolbarProps {
  filters: BrandFiltersType;
}

export default function BrandToolbar({ filters }: BrandToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
      <div className="flex-1 min-w-0">
        <AppInput
          preset="search"
          placeholder="Search brands by name or type..."
          value={filters.searchQuery}
          onChange={(e) => filters.setSearchQuery(e.target.value)}
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
              Filter {filters.activeFiltersCount > 0 ? `(${filters.activeFiltersCount})` : ''}
            </AppButton>
          }
          open={filters.filterOpen}
          onOpenChange={filters.setFilterOpen}
          title="Filter Brands"
          onResetAll={() => {
            filters.setSelectedBrandTypes([]);
          }}
          onApply={() => filters.setFilterOpen(false)}
          onClose={() => filters.setFilterOpen(false)}
        >
          <AppFilterPopover.Group title="Brand Type">
            <div className="flex flex-col gap-1 p-1">
              {['Focus', 'Non Focus'].map((type) => {
                const isChecked = filters.selectedBrandTypes.includes(type);
                return (
                  <label
                    key={type}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-hover rounded-lg cursor-pointer text-xs text-text font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        filters.setSelectedBrandTypes((prev) =>
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
  );
}
