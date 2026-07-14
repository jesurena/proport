'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppModal, AppInput, AppCard } from '@integrated-computer-system/ui-kit';
import { Folder, Ticket as TicketIcon, CornerDownLeft, Loader2 } from 'lucide-react';
import { getTickets } from '@/lib/tickets';
import type { Ticket } from '@/lib/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface ModuleItem {
  id: string;
  label: string;
  path: string;
  description: string;
}

const MODULES: ModuleItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', description: 'Overview and status of pricing inquiries' },
  { id: 'compose', label: 'Compose Inquiry', path: '/compose', description: 'Create a new price inquiry request' },
  { id: 'tickets', label: 'All Inquiries', path: '/tickets', description: 'View and filter all pricing inquiries' },
  { id: 'reports', label: 'Reports', path: '/reports', description: 'Analytics and pricing trends' },
  { id: 'suppliers', label: 'Supplier Settings', path: '/maintenance/suppliers', description: 'Manage supplier definitions' },
  { id: 'logs', label: 'User Logs', path: '/logs', description: 'Audit trails and security logs' },
];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(t);
    } else {
      setLoading(false);
    }
  }, [searchQuery]);

  const filteredModules = useMemo(() => {
    if (!searchQuery) return MODULES;
    const q = searchQuery.toLowerCase();
    return MODULES.filter(
      (m) => m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();
    const allTickets = getTickets();
    return allTickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q) ||
        (t.supplierName && t.supplierName.toLowerCase().includes(q)) ||
        String(t.ticketNumber).includes(q)
    );
  }, [searchQuery]);

  const handleSelectModule = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleSelectTicket = (id: string) => {
    router.push(`/tickets/${id}`);
    onClose();
  };

  return (
    <AppModal open={open} onClose={onClose} width={600} centered>
      <AppModal.Header>
        <AppModal.Title>Search Portal</AppModal.Title>
      </AppModal.Header>

      <AppModal.Body className="space-y-4">
        <AppInput
          preset="search"
          placeholder="Search modules, inquiries, suppliers, description, number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          autoFocus
        />

        <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-info/50">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-xs">Searching...</span>
            </div>
          ) : (
            <>
              {/* Modules Group */}
              {filteredModules.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block px-1">
                    Modules ({filteredModules.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredModules.map((m) => (
                      <AppCard
                        key={m.id}
                        variant="interactive"
                        padding="none"
                        onClick={() => handleSelectModule(m.path)}
                        className="flex items-center justify-between p-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent-1/10 flex items-center justify-center text-accent-1 shrink-0">
                            <Folder size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-text group-hover:text-accent-1 transition-colors">
                              {m.label}
                            </span>
                            <span className="text-xs text-text-info">{m.description}</span>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-text-info opacity-0 group-hover:opacity-100 transition-opacity" />
                      </AppCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Tickets Group */}
              {searchQuery && filteredTickets.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-text-info uppercase tracking-wider block px-1">
                    Inquiries ({filteredTickets.length})
                  </span>
                  <div className="flex flex-col gap-1">
                    {filteredTickets.map((t) => (
                      <AppCard
                        key={t.id}
                        variant="interactive"
                        padding="none"
                        onClick={() => handleSelectTicket(t.id)}
                        className="flex items-center justify-between p-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-neutral flex items-center justify-center text-text-info shrink-0">
                            <TicketIcon size={16} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-text-info">
                                #{String(t.ticketNumber).padStart(4, '0')}
                              </span>
                              <span className="text-sm font-semibold text-text truncate group-hover:text-accent-1 transition-colors">
                                {t.subject}
                              </span>
                            </div>
                            <span className="text-xs text-text-info truncate">
                              Inquiry by {t.requesterName} • {t.businessUnitName} {t.supplierName ? `• ${t.supplierName}` : ''}
                            </span>
                          </div>
                        </div>
                        <CornerDownLeft size={14} className="text-text-info opacity-0 group-hover:opacity-100 transition-opacity" />
                      </AppCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {searchQuery && filteredModules.length === 0 && filteredTickets.length === 0 && (
                <div className="py-12 text-center text-text-info/60 space-y-1">
                  <p className="text-sm font-medium">No results found for "{searchQuery}"</p>
                  <p className="text-xs">Try searching for modules, inquiry titles, suppliers, numbers, or sales names.</p>
                </div>
              )}
            </>
          )}
        </div>
      </AppModal.Body>
    </AppModal>
  );
}
