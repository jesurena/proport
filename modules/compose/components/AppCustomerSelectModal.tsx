'use client';

import React, { useState, useMemo } from 'react';
import {
  AppModal,
  AppButton,
  AppInput,
  AppTable,
  AppSelect,
  AppFilterPopover,
  AppChip,
  type AppChipVariant
} from '@/components/ui';
import { Search, Building2, Filter, ArrowRight } from 'lucide-react';
import { type Customer } from '@/lib/customers';
import { useCustomer } from '../hooks/useCustomer';

const CHIP_VARIANTS: AppChipVariant[] = [
  'info',
  'non-focus',
  'focus',
  'answered',
  'reassigned',
  'assigned',
  'warning',
  'default',
];

function getSalesAreaChipVariant(area: string): AppChipVariant {
  if (!area) return 'muted';
  let hash = 0;
  for (let i = 0; i < area.length; i++) {
    hash = area.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CHIP_VARIANTS.length;
  return CHIP_VARIANTS[index];
}

interface AppCustomerSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (customerName: string, customerID?: string) => void;
  initialSearch?: string;
}

export function AppCustomerSelectModal({
  open,
  onClose,
  onSelect,
  initialSearch = '',
}: AppCustomerSelectModalProps) {
  const [search, setSearch] = useState('');
  const [salesAreaFilter, setSalesAreaFilter] = useState('All');
  const [tempSalesAreaFilter, setTempSalesAreaFilter] = useState('All');
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const activeFiltersCount = salesAreaFilter !== 'All' ? 1 : 0;

  // Use custom customer hook for live search
  const { customers: baseCustomers, isLoading, hasSearched } = useCustomer(search, open);

  // Sync state when modal opens
  React.useEffect(() => {
    if (open) {
      setSearch(initialSearch);
      setSalesAreaFilter('All');
      setTempSalesAreaFilter('All');
      setFilterPopoverOpen(false);
    }
  }, [open, initialSearch]);

  // Reset salesAreaFilter when user types a new search query
  React.useEffect(() => {
    setSalesAreaFilter('All');
    setTempSalesAreaFilter('All');
  }, [search]);

  const salesAreas = useMemo(() => {
    const areas = new Set(baseCustomers.map((c) => c.salesArea?.trim()).filter(Boolean));
    return ['All', ...Array.from(areas).sort()];
  }, [baseCustomers]);

  const filtered = useMemo(() => {
    if (!hasSearched) return [];
    const q = search.toLowerCase().trim();
    return baseCustomers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchesSalesArea =
        salesAreaFilter === 'All' ||
        c.salesArea.trim().toLowerCase() === salesAreaFilter.trim().toLowerCase();
      return matchesSearch && matchesSalesArea;
    });
  }, [baseCustomers, search, salesAreaFilter, hasSearched]);

  const handlePopoverOpenChange = (nextOpen: boolean) => {
    setFilterPopoverOpen(nextOpen);
    if (nextOpen) {
      setTempSalesAreaFilter(salesAreaFilter);
    }
  };

  const handleSelect = (customer: Customer) => {
    onSelect(customer.name.split('\n')[0], customer.id);
    onClose();
  };

  const columns = [
    {
      title: '# ID',
      dataIndex: 'id',
      key: 'id',
      width: '100px',
      render: (id: string) => <span className="font-mono text-xs text-text-info font-semibold">{id}</span>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      width: '280px',
      render: (name: string) => (
        <div className="py-1 max-w-[280px]">
          <span className="font-bold text-text text-sm group-hover:text-accent-1 transition-colors duration-200 break-words whitespace-pre-wrap leading-snug">
            {name}
          </span>
        </div>
      ),
    },
    {
      title: 'Sales Area',
      dataIndex: 'salesArea',
      key: 'salesArea',
      width: '160px',
      render: (area: string) => (
        <AppChip
          label={area || '—'}
          variant={getSalesAreaChipVariant(area)}
          size="sm"
          icon={null}
        />
      ),
    },
    {
      title: 'BU - AO',
      dataIndex: 'buAo',
      key: 'buAo',
      width: '180px',
      render: (buAo: string) => <span className="text-xs text-text-info">{buAo || '—'}</span>,
    },
    {
      title: '',
      key: 'arrow',
      width: '50px',
      align: 'right' as const,
      render: () => (
        <AppButton
          variant="neutral"
          size="icon"
          className="!w-7 !h-7 rounded-full group-hover:!bg-accent-1 group-hover:!text-white group-hover:!border-accent-1 transition-colors duration-200"
        >
          <ArrowRight size={13} className="group-hover:transition-transform" />
        </AppButton>
      ),
    },
  ];

  return (
    <AppModal open={open} onClose={onClose} width={820} centered>
      <AppModal.Body className="space-y-4">
        {/* Header */}
        <div>
          <AppModal.Title>Search Customer</AppModal.Title>
          <AppModal.Description>
            Find and select a customer from the database. Type at least 2 characters to search.
          </AppModal.Description>
        </div>

        {/* Search Input and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <AppInput
              preset="search"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type customer name or ID..."
              className="w-full"
            />
          </div>

          {/* Filter Popover Component */}
          <AppFilterPopover
            open={filterPopoverOpen}
            onOpenChange={handlePopoverOpenChange}
            title="Filters"
            onResetAll={() => {
              setSalesAreaFilter('All');
              setTempSalesAreaFilter('All');
              setFilterPopoverOpen(false);
            }}
            onApply={() => {
              setSalesAreaFilter(tempSalesAreaFilter);
              setFilterPopoverOpen(false);
            }}
            onClose={() => setFilterPopoverOpen(false)}
            trigger={
              <AppButton
                variant="neutral"
                leftIcon={<Filter size={15} />}
              >
                Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
              </AppButton>
            }
          >
            <AppFilterPopover.Group
              title="Sales Area"
              showReset={tempSalesAreaFilter !== 'All'}
              onReset={() => setTempSalesAreaFilter('All')}
            >
              <AppSelect
                options={salesAreas.map((s) => ({ value: s, label: s }))}
                value={tempSalesAreaFilter}
                onChange={(val) => setTempSalesAreaFilter(val)}
                placeholder="Select sales area"
                variant="borderless"
              />
            </AppFilterPopover.Group>
          </AppFilterPopover>
        </div>

        {/* Customers Table or Search Help State */}
        <div className="max-h-[45vh] overflow-y-auto">
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-info text-center">
              <Search size={32} className="opacity-30 mb-2.5" />
              <p className="text-sm font-semibold">Enter a customer name or ID to start searching</p>
              <p className="text-xs mt-1">Type at least 2 characters to fetch matching database entries.</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-info text-center">
              <div className="w-7 h-7 border-2 border-accent-1 border-t-transparent rounded-full animate-spin mb-2.5" />
              <p className="text-sm font-semibold">Searching live customers...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-info text-center">
              <Building2 size={32} className="opacity-30 mb-2.5" />
              <p className="text-sm font-semibold">No customers found</p>
              <p className="text-xs mt-1">Try typing a different name or checking your Sales Area filter.</p>
            </div>
          ) : (
            <AppTable<Customer>
              columns={columns}
              dataSource={filtered}
              rowKey={(record, index) => `${record.id}_${record.name}_${index}`}
              pagination={false}
              size="small"
              scroll={{ x: 750 }}
              onRow={(record) => ({
                onClick: () => handleSelect(record),
                className: 'group cursor-pointer hover:bg-neutral/40 transition-colors',
              })}
              className="cursor-pointer"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <p className="text-xs text-text-info">
            Found: <span className="font-bold text-text">{hasSearched ? filtered.length : 0}</span> matching customers
          </p>
          <div className="flex items-center gap-2">
            <AppButton variant="neutral" onClick={onClose}>
              Cancel
            </AppButton>
          </div>
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
