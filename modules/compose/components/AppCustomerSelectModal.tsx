'use client';

import React, { useState, useMemo } from 'react';
import {
  AppModal,
  AppButton,
  AppInput,
  AppTable,
  AppSelect,
  AppFilterPopover
} from '@/components/ui';
import { Search, Building2, Filter } from 'lucide-react';
import { getCustomers, type Customer } from '@/lib/customers';

interface AppCustomerSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (customerName: string) => void;
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

  const customers = useMemo(() => getCustomers(), []);

  // Sync state when modal opens
  React.useEffect(() => {
    if (open) {
      setSearch(initialSearch);
      setSalesAreaFilter('All');
      setTempSalesAreaFilter('All');
      setFilterPopoverOpen(false);
    }
  }, [open, initialSearch]);

  const salesAreas = useMemo(() => {
    const areas = new Set(customers.map((c) => c.salesArea).filter(Boolean));
    return ['All', ...Array.from(areas).sort()];
  }, [customers]);

  const hasSearched = search.trim().length >= 2;

  const filtered = useMemo(() => {
    if (!hasSearched) return [];
    const q = search.toLowerCase().trim();
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchesSalesArea = salesAreaFilter === 'All' || c.salesArea === salesAreaFilter;
      return matchesSearch && matchesSalesArea;
    });
  }, [customers, search, salesAreaFilter, hasSearched]);

  // Sync temporary filter state when popover opens
  React.useEffect(() => {
    if (filterPopoverOpen) {
      setTempSalesAreaFilter(salesAreaFilter);
    }
  }, [filterPopoverOpen, salesAreaFilter]);

  const handleSelect = (customerName: string) => {
    onSelect(customerName);
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
      render: (name: string) => (
        <div className="flex items-start gap-2.5 py-0.5">
          <div className="p-1.5 rounded-lg bg-neutral border border-border text-text-info shrink-0 mt-0.5">
            <Building2 size={13} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-text text-sm break-words whitespace-pre-wrap">{name}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Sales Area',
      dataIndex: 'salesArea',
      key: 'salesArea',
      width: '150px',
      render: (area: string) => (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral border border-border/50 text-text-info">
          {area}
        </span>
      ),
    },
    {
      title: 'BU - AO',
      dataIndex: 'buAo',
      key: 'buAo',
      width: '180px',
      render: (buAo: string) => <span className="text-xs text-text-info">{buAo}</span>,
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      align: 'right' as const,
      render: (_: any, record: Customer) => (
        <AppButton
          variant="primary"
          size="sm"
          onClick={() => handleSelect(record.name.split('\n')[0])}
        >
          Select
        </AppButton>
      ),
    },
  ];

  return (
    <AppModal open={open} onClose={onClose} width={740} padding="none">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <AppModal.Title className="text-lg font-bold">Search Customer</AppModal.Title>
        <AppModal.Description className="text-xs text-text-info mt-1">
          Find and select a customer from the database. Type at least 2 characters to search.
        </AppModal.Description>
      </div>

      {/* Search Input and Filters */}
      <div className="px-5 py-2.5 flex items-center gap-3">
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
          onOpenChange={setFilterPopoverOpen}
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
            <button
              type="button"
              className="h-11 px-4 flex items-center gap-2 rounded-xl border border-border bg-neutral/50 hover:bg-neutral/80 text-sm font-semibold text-text-info hover:text-text hover:border-accent-1/60 transition-all cursor-pointer shrink-0"
            >
              <Filter size={15} />
              {salesAreaFilter !== 'All' && (
                <span className="flex items-center justify-center bg-accent-1 text-white text-[9px] font-bold h-4 w-4 rounded-full -mr-1">
                  1
                </span>
              )}
            </button>
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
      <div className="px-5 py-2 max-h-[40vh] overflow-y-auto">
        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-info text-center">
            <Search size={32} className="opacity-30 mb-2.5" />
            <p className="text-sm font-semibold">Enter a customer name or ID to start searching</p>
            <p className="text-xs mt-1">Type at least 2 characters to fetch matching database entries.</p>
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
            rowKey="id"
            pagination={false}
            size="small"
            onRow={(record) => ({
              onClick: (event) => {
                // Prevent action click double trigger
                const target = event.target as HTMLElement;
                if (target.closest('button')) return;
                handleSelect(record.name.split('\n')[0]);
              },
            })}
            className="cursor-pointer"
          />
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 flex items-center justify-between bg-neutral/10">
        <p className="text-xs text-text-info">
          Found: <span className="font-bold text-text">{hasSearched ? filtered.length : 0}</span> matching customers
        </p>
        <div className="flex items-center gap-2">
          <AppButton variant="neutral" size="md" onClick={onClose}>
            Cancel
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
}
