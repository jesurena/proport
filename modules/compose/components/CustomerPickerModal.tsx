'use client';

import React, { useState, useMemo } from 'react';
import { AppModal } from '@/components/ui/modal';
import { AppCard } from '@/components/ui/cards';
import { Building2, Search, CheckCircle2 } from 'lucide-react';
import type { User } from '@/lib/types';

// Derive company from email domain
function getCompany(email: string): string {
  const domain = email.split('@')[1] || '';
  const map: Record<string, string> = {
    'proport.com':   'Proport Inc.',
    'ics.com.ph':    'ICS Group',
    'tcd.com.ph':    'TCD Corp',
    'globalink.ph':  'GlobalInk Philippines',
    'apexph.com':    'Apex Pacific',
    'meridian.ph':   'Meridian Solutions',
    'stargroup.com': 'Star Group Inc.',
    'pinnacle.ph':   'Pinnacle Systems',
  };
  return map[domain] || domain;
}

interface CustomerPickerModalProps {
  open: boolean;
  onClose: () => void;
  customers: User[];
  selectedCustomer: User | null;
  onSelect: (customer: User) => void;
}

export function CustomerPickerModal({
  open,
  onClose,
  customers,
  selectedCustomer,
  onSelect,
}: CustomerPickerModalProps) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const availableDepts = useMemo(() => {
    const depts = new Set(customers.map((c) => c.department || '').filter(Boolean));
    return ['All', ...Array.from(depts).sort()];
  }, [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
         !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        getCompany(c.email).toLowerCase().includes(search.toLowerCase()) ||
        (c.department || '').toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === 'All' || c.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [customers, search, deptFilter]);

  const handleSelect = (c: User) => {
    onSelect(c);
    onClose();
    setSearch('');
    setDeptFilter('All');
  };

  return (
    <AppModal open={open} onClose={onClose} width={720} padding="none">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border/60">
        <AppModal.Title>Select Sales Representative</AppModal.Title>
        <AppModal.Description>
          Choose a sales requester from the list below. Use search or filter by department.
        </AppModal.Description>
      </div>

      {/* Search + filters */}
      <div className="px-6 pt-4 pb-3 space-y-3 border-b border-border/40">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-info pointer-events-none" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or department..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-sm text-text placeholder:text-text-info focus:outline-none focus:border-accent-1/60 transition-colors"
          />
        </div>

        {/* Department filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {availableDepts.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                deptFilter === dept
                  ? 'bg-accent-1 text-white'
                  : 'bg-neutral text-text-info hover:bg-hover hover:text-text'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Customer grid */}
      <div className="px-6 py-4 max-h-[52vh] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center text-text-info">
              <Search size={20} />
            </div>
            <p className="text-sm font-semibold text-text">No Sales reps found</p>
            <p className="text-xs text-text-info text-center max-w-[220px]">
              Try adjusting your search term or department filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              const company = getCompany(c.email);
              return (
                <AppCard
                  key={c.id}
                  as="button"
                  onClick={() => handleSelect(c)}
                  variant={isSelected ? 'nested' : 'interactive'}
                  padding="none"
                  className={`w-full p-4 flex items-start gap-3 text-left border-2 transition-all group ${
                    isSelected
                      ? 'border-accent-1 bg-accent-1/5 shadow-sm hover:translate-y-0'
                      : 'border-border hover:border-accent-1/30'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-xl shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-accent-1 text-white'
                        : 'bg-neutral text-text-info group-hover:text-accent-1'
                    }`}
                  >
                    <Building2 size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span
                        className={`font-bold text-sm truncate leading-none ${
                          isSelected ? 'text-accent-1' : 'text-text'
                        }`}
                      >
                        {c.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={15} className="text-accent-1 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-text-info truncate mb-1.5">{company}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.department && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-1/10 text-accent-1 uppercase tracking-wider">
                          {c.department}
                        </span>
                      )}
                      <span className="text-[10px] text-text-info truncate">{c.email}</span>
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer count */}
      <div className="px-6 py-3 border-t border-border/40 flex items-center justify-between">
        <p className="text-xs text-text-info">
          Showing <span className="font-semibold text-text">{filtered.length}</span> of{' '}
          <span className="font-semibold text-text">{customers.length}</span> sales reps
        </p>
        {selectedCustomer && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-1">
            <CheckCircle2 size={13} />
            {selectedCustomer.name} selected
          </div>
        )}
      </div>
    </AppModal>
  );
}
