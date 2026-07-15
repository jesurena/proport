'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  AppChip,
  AppButton,
  AppAvatar,
  AppInput,
} from '@integrated-computer-system/ui-kit';
import { AppTabs } from '@/components/ui';
import { Search, Plus, Eye, MoreHorizontal, Filter, SlidersHorizontal, CalendarDays, MapPin, MessageSquareText, Building2, UserRound, Clock3, Tag, DollarSign, Layers } from 'lucide-react';
import { ProportNavbar } from '@/modules/sidebar';
import { getTickets } from '@/lib/tickets';
import { STATUS_META } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';
import { AppEmptyState } from '@/components/ui';

function timeAgo(dateStr: string): string {
  const now = new Date().getTime();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'focus', label: 'Focus' },
  { id: 'non-focus', label: 'Non Focus' },
  { id: 'bu-approval', label: 'BU Head Approval' },
  { id: 'bu-declined', label: 'BU Head Declined' },
];

function formatCardDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatOrderNumber(ticketNumber: number): string {
  return `#${String(ticketNumber).padStart(4, '0')}`;
}

export default function TicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');
  const tabParam = searchParams.get('tab');

  const getTabFromParams = () => {
    if (tabParam) return tabParam;
    if (statusParam === 'bu-approval' || statusParam === 'bu-declined') {
      return statusParam;
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getTabFromParams());
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  useEffect(() => {
    setActiveTab(getTabFromParams());
  }, [tabParam, statusParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      router.push('/tickets');
    } else {
      router.push(`/tickets?tab=${tabId}`);
    }
  };

  const filteredTickets = useMemo(() => {
    let result = tickets;
    
    // 1. Tab filtering
    if (activeTab === 'focus') {
      result = result.filter((t) => t.brandType === 'Focus');
    } else if (activeTab === 'non-focus') {
      result = result.filter((t) => t.brandType !== 'Focus');
    } else if (activeTab === 'bu-approval') {
      result = result.filter((t) => t.brandType !== 'Focus' && t.status === 'bu-approval');
    } else if (activeTab === 'bu-declined') {
      result = result.filter((t) => t.brandType !== 'Focus' && t.status === 'bu-declined');
    }

    // 2. Optional status parameter filtering
    if (statusParam && activeTab !== 'bu-approval' && activeTab !== 'bu-declined') {
      result = result.filter((t) => t.status === statusParam);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.requesterName.toLowerCase().includes(q) ||
          t.assigneeName?.toLowerCase().includes(q) ||
          t.supplierName?.toLowerCase().includes(q) ||
          String(t.ticketNumber).includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [tickets, activeTab, statusParam, searchQuery]);

  const emptyState = useMemo(() => {
    if (searchQuery.trim()) {
      return {
        imageSrc: '/aria-mascott-search.svg',
        title: 'No inquiries found',
        description: `Try searching for a different keyword instead of "${searchQuery}".`,
      };
    }
    if (activeTab === 'all') {
      return {
        imageSrc: '/aria-mascott-sad.svg',
        title: 'No inquiries submitted',
        description: 'Create a new price inquiry to get started.',
      };
    }
    if (activeTab === 'bu-approval') {
      return {
        imageSrc: '/aria-mascott-idle.svg',
        title: 'No pending BU approvals',
        description: 'Tickets waiting for BU head signature will appear here.',
      };
    }
    if (activeTab === 'bu-declined') {
      return {
        imageSrc: '/aria-mascott-sad.svg',
        title: 'No declined tickets',
        description: 'Tickets declined by BU heads will appear here.',
      };
    }
    const tabLabel = activeTab === 'focus' ? 'Focus' : 'Non Focus';
    const statusLabel = statusParam ? `${statusParam} ` : '';
    return {
      imageSrc: '/aria-mascott-happy.svg',
      title: 'Inbox cleared!',
      description: `You have no ${statusLabel}${tabLabel} inquiries remaining in this view.`,
    };
  }, [activeTab, statusParam, searchQuery]);

  return (
    <>
      <ProportNavbar title="Inquiries" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Price Inquiries</h1>
            <p className="text-sm text-text-info mt-1">Manage sales pricing questions and track quotes progress in a card-based workspace.</p>
          </div>

          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => router.push('/compose')}
            className="h-11 shrink-0 font-medium"
          >
            New Inquiry
          </AppButton>
        </div>

        <AppTabs
          tabs={STATUS_TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
          variant="underlined"
          className="bg-transparent"
        />

        <div className="rounded-2xl border border-border/60 bg-background shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/60 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">Submitted inquiries</h2>
              <p className="text-xs text-text-info mt-1">{filteredTickets.length} total inquiries in the current view.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="w-full sm:w-80">
                <AppInput
                  preset="search"
                  placeholder="Search inquiries (subject, supplier...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <AppButton
                  variant="neutral"
                  leftIcon={<SlidersHorizontal size={14} />}
                >
                  Sort
                </AppButton>
                <AppButton
                  variant="neutral"
                  leftIcon={<Filter size={14} />}
                >
                  Filter
                </AppButton>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {filteredTickets.length === 0 ? (
              <AppEmptyState
                title={emptyState.title}
                description={emptyState.description}
                imageSrc={emptyState.imageSrc}
                imageSize={110}
                className="py-12"
              />
            ) : (
              filteredTickets.map((ticket) => {
                const statusMeta = STATUS_META[ticket.status];
                const menuItems: MenuProps['items'] = [
                  {
                    key: 'view',
                    label: (
                      <div className="flex items-center gap-2 text-text-info py-1 font-medium">
                        <Eye size={16} />
                        <span>View Details</span>
                      </div>
                    ),
                    onClick: ({ domEvent }: { domEvent: React.SyntheticEvent }) => {
                      domEvent.stopPropagation();
                      router.push(`/tickets/${ticket.id}`);
                    },
                  },
                ];

                return (
                  <div
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    className="p-5 hover:bg-neutral/20 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <AppAvatar
                          name={ticket.requesterName}
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${ticket.requesterName}`}
                          size={40}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-text truncate">{ticket.requesterName}</h3>
                            <span className="text-xs text-text-info">{formatCardDate(ticket.updatedAt)}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-text-info bg-neutral px-2 py-1 rounded-md">
                              {formatOrderNumber(ticket.ticketNumber)}
                            </span>
                            <AppChip label={statusMeta.label} variant={statusMeta.chipVariant as any} size="sm" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-auto" onClick={(e) => e.stopPropagation()}>
                        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                          <Button
                            type="text"
                            icon={<MoreHorizontal size={18} className="text-text-info" />}
                            className="flex items-center justify-center p-0 w-9 h-9 rounded-full hover:bg-hover-bg transition-colors"
                          />
                        </Dropdown>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_1fr_0.9fr] gap-6 mt-5 xl:gap-5">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Inquiry details</p>
                          <div className="mt-3 space-y-2 text-sm text-text">
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="mt-0.5 text-text-info shrink-0" />
                              <span className="leading-relaxed font-semibold">{ticket.subject}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Building2 size={14} className="mt-0.5 text-text-info shrink-0" />
                              <span className="leading-relaxed">{ticket.businessUnitName}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <UserRound size={14} className="mt-0.5 text-text-info shrink-0" />
                              <span className="leading-relaxed">Buyer: {ticket.assigneeName || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Timestamps</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-text-info">
                              <Clock3 size={13} />
                              {timeAgo(ticket.updatedAt)}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-text-info">
                              <CalendarDays size={13} />
                              {formatCardDate(ticket.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 xl:border-x xl:border-border/60 xl:px-5">
                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Description & Notes</p>
                          <p className="mt-3 text-sm text-text leading-relaxed line-clamp-4">{ticket.description}</p>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Replies</p>
                          <div className="mt-3 flex items-center gap-2 text-sm text-text-info">
                            <MessageSquareText size={14} />
                            <span>{ticket.replies.length} message updates</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Pricing specifications</p>
                          <div className="mt-3 space-y-2 text-sm text-text">
                            {ticket.supplierName && (
                              <div className="flex items-center gap-2">
                                <Tag size={13} className="text-text-info" />
                                <span>Supplier: <b className="font-semibold">{ticket.supplierName}</b></span>
                              </div>
                            )}
                            {ticket.targetPrice !== undefined && (
                              <div className="flex items-center gap-2">
                                <DollarSign size={13} className="text-text-info" />
                                <span>Target: <b className="font-semibold">${ticket.targetPrice.toFixed(2)}</b></span>
                              </div>
                            )}
                            {ticket.estimatedQuantity !== undefined && (
                              <div className="flex items-center gap-2">
                                <Layers size={13} className="text-text-info" />
                                <span>Quantity: <b className="font-semibold">{ticket.estimatedQuantity} units</b></span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-text-info uppercase tracking-wider">Priority</p>
                          <p className="mt-3 text-sm font-medium text-text capitalize">{ticket.priority}</p>
                        </div>

                        <div className="pt-1 flex flex-wrap gap-2 animate-pulse">
                          <AppButton
                            variant="neutral"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/tickets/${ticket.id}`);
                            }}
                          >
                            Open Conversation
                          </AppButton>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
