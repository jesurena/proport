'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { AppEmptyState, AppTable, AppChip } from '@/components/ui';
import { TicketAvatar } from '@/components/tickets/TicketAvatar';
import { BrandTicketChip } from '@/components/tickets/BrandTicketChip';
import { STATUS_META } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';
import { useTickets } from '../hooks/useTickets';
import { TicketTabs } from './TicketTabs';
import { TicketFilters } from './TicketFilters';
import { useAuthStore } from '@/modules/auth';

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

function formatOrderNumber(ticketNumber: number): string {
  return `#${String(ticketNumber).padStart(4, '0')}`;
}

export interface TicketTableProps {
  tickets?: Ticket[];
  hideHeader?: boolean;
  hideFilters?: boolean;
}

export function TicketTable({ tickets, hideHeader = false, hideFilters = false }: TicketTableProps = {}) {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
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
    filteredTickets,
    emptyState,
    activeFiltersCount,
    handleTabChange,
  } = useTickets();

  const resolvedTickets = tickets ?? filteredTickets;

  const [role, setRole] = React.useState<string>('super_user');
  const [pageSize, setPageSize] = React.useState<number>(10);

  const { user } = useAuthStore();
  const isDeveloper = user?.isDeveloper ?? false;
  const actualRole = user?.role_name ?? 'buyer';

  React.useEffect(() => {
    const storedRole = localStorage.getItem('proport_my_role');
    if (isDeveloper && storedRole) {
      setRole(storedRole);
    } else {
      setRole(actualRole);
    }
  }, [isDeveloper, actualRole]);

  const columns = [
    {
      title: '# ID',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      width: '80px',
      align: 'center' as const,
      render: (num: number) => (
        <AppLabel as="span" variant="label" className="font-mono text-xs font-semibold text-text-info">
          {formatOrderNumber(num)}
        </AppLabel>
      ),
    },
    {
      title: 'Brand',
      key: 'brand',
      width: '130px',
      render: (_: any, record: Ticket) => (
        <BrandTicketChip
          brandName={record.brandName}
          brandType={record.brandType}
        />
      ),
    },
    {
      title: 'Subject',
      key: 'subject',
      render: (_: any, record: Ticket) => (
        <div className="flex items-center gap-3 max-w-[400px]">
          {/* Creator avatar */}
          <AppAvatar
            name={record.requesterName}
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${record.requesterName}`}
            size={28}
            className="shrink-0"
          />

          {/* Subject + description */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <AppLabel as="span" variant="label" className="text-sm font-bold text-text truncate leading-snug">
              {record.subject}
            </AppLabel>
            <AppLabel as="span" variant="description" className="text-xs text-text-info truncate leading-snug font-medium">
              {record.description}
            </AppLabel>
          </div>
        </div>
      ),
    },
    {
      title: 'Assignee',
      key: 'assignee',
      width: '100px',
      render: (_: any, record: Ticket) => {
        const participants = Array.from(
          new Set(
            [record.assigneeName, ...record.replies.map((r) => r.authorName)].filter(
              (name): name is string => Boolean(name) && name !== record.requesterName
            )
          )
        );

        if (participants.length === 0) {
          return (
            <AppLabel as="span" variant="info" className="text-xs font-medium text-text-info/60">
              Unassigned
            </AppLabel>
          );
        }

        let avatarStatus = 'unread';
        if (['pending', 'bu-approval'].includes(record.status)) {
          avatarStatus = 'pending';
        } else if (['answered', 'final-approval', 'closed'].includes(record.status)) {
          avatarStatus = 'answered';
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden shrink-0">
              {participants.slice(0, 3).map((name, i) => (
                <TicketAvatar
                  key={name}
                  name={name}
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                  size={24}
                  status={avatarStatus}
                  className="ring-2 ring-background rounded-full shrink-0 relative"
                  style={{ zIndex: 10 - i }}
                />
              ))}
              {participants.length > 3 && (
                <div
                  className="w-[24px] h-[24px] rounded-full bg-neutral text-[9px] font-bold text-text-info flex items-center justify-center ring-2 ring-background shrink-0 select-none relative"
                  style={{ zIndex: 5 }}
                >
                  +{participants.length - 3}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      width: '110px',
      render: (status: string) => {
        const meta = STATUS_META[status as TicketStatus];
        return (
          <AppChip
            label={meta?.label || status}
            variant={status as any}
            size="sm"
          />
        );
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '100px',
      render: (date: string) => (
        <AppLabel as="span" variant="info" className="text-xs text-text-info font-medium">
          {timeAgo(date)}
        </AppLabel>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Subcomponent */}
      {!hideHeader && (
        <TicketTabs
          activeTab={activeTab}
          onChange={handleTabChange}
          role={role}
        />
      )}

      {/* Filters, Sort, Search Subcomponent */}
      {!hideFilters && (
        <TicketFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedBrandTypes={selectedBrandTypes}
          setSelectedBrandTypes={setSelectedBrandTypes}
          sortOpen={sortOpen}
          setSortOpen={setSortOpen}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {/* Ticket Table list */}
      {resolvedTickets.length === 0 ? (
        <div className="py-12 flex justify-center border border-border/60 bg-background rounded-2xl shadow-sm">
          <AppEmptyState
            title={emptyState.title}
            description={emptyState.description}
            imageSrc={emptyState.imageSrc}
            imageSize={110}
          />
        </div>
      ) : (
        <AppTable<Ticket>
          columns={columns}
          dataSource={resolvedTickets}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          onRow={(record) => ({
            onClick: () => router.push(`/tickets/${record.id}`),
            className: 'cursor-pointer hover:bg-neutral/5 transition-colors group',
          })}
        />
      )}
    </div>
  );
}
