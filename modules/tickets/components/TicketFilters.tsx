'use client';

import React from 'react';
import { SlidersHorizontal, Filter } from 'lucide-react';
import { AppButton, AppInput } from '@integrated-computer-system/ui-kit';
import { AppPopover, AppFilterPopover } from '@/components/ui';
import { STATUS_META } from '@/lib/types';

interface TicketFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: 'recent' | 'oldest' | 'price-desc' | 'price-asc' | 'qty-desc') => void;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedBrandTypes: string[];
  setSelectedBrandTypes: React.Dispatch<React.SetStateAction<string[]>>;
  sortOpen: boolean;
  setSortOpen: (open: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  activeFiltersCount: number;
}

export function TicketFilters({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedStatuses,
  setSelectedStatuses,
  selectedBrandTypes,
  setSelectedBrandTypes,
  sortOpen,
  setSortOpen,
  filterOpen,
  setFilterOpen,
  activeFiltersCount,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
      <div className="flex-1 min-w-0">
        <AppInput
          preset="search"
          placeholder="Search inquiries (subject, supplier...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <AppPopover
          content={
            <div className="w-[200px] p-2 flex flex-col gap-1">
              {[
                { value: 'recent', label: 'Most Recent' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'price-desc', label: 'Cost (High to Low)' },
                { value: 'price-asc', label: 'Cost (Low to High)' },
                { value: 'qty-desc', label: 'Quantity (High to Low)' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value as any);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${sortBy === opt.value
                      ? 'bg-accent-1/10 text-accent-1'
                      : 'text-text-info hover:bg-hover hover:text-text'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          }
          open={sortOpen}
          onOpenChange={setSortOpen}
          placement="bottomLeft"
        >
          <AppButton
            variant="neutral"
            leftIcon={<SlidersHorizontal size={14} />}
          >
            Sort
          </AppButton>
        </AppPopover>

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
          title="Filter Tickets"
          onResetAll={() => {
            setSelectedStatuses([]);
            setSelectedBrandTypes([]);
          }}
          onApply={() => setFilterOpen(false)}
          onClose={() => setFilterOpen(false)}
        >
          <AppFilterPopover.Group title="Brand Type">
            <div className="flex flex-col gap-1 p-1">
              {['Focus', 'Non Focus'].map((brandType) => {
                const isChecked = selectedBrandTypes.includes(brandType);
                return (
                  <label
                    key={brandType}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-hover rounded-lg cursor-pointer text-xs text-text font-semibold"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedBrandTypes((prev) =>
                          isChecked ? prev.filter((b) => b !== brandType) : [...prev, brandType]
                        );
                      }}
                      className="rounded border-border text-accent-1 focus:ring-accent-1"
                    />
                    {brandType}
                  </label>
                );
              })}
            </div>
          </AppFilterPopover.Group>

          <AppFilterPopover.Group title="Status">
            <div className="flex flex-col gap-1 p-1 max-h-[160px] overflow-y-auto">
              {Object.entries(STATUS_META)
                .filter(([statusKey]) =>
                  ['unassigned', 'bu-declined', 'pending', 'answered', 'closed', 'reassigned'].includes(statusKey)
                )
                .map(([statusKey, meta]) => {
                  const isChecked = selectedStatuses.includes(statusKey);
                  return (
                    <label
                      key={statusKey}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-hover rounded-lg cursor-pointer text-xs text-text font-semibold"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedStatuses((prev) =>
                            isChecked ? prev.filter((s) => s !== statusKey) : [...prev, statusKey]
                          );
                        }}
                        className="rounded border-border text-accent-1 focus:ring-accent-1"
                      />
                      {meta.label}
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
