'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Popover } from 'antd';
import { AppAvatar, AppLabel } from '@integrated-computer-system/ui-kit';
import { AppEmptyState, AppTable, AppChip } from '@/components/ui';
import { TicketAvatar } from '@/components/tickets/TicketAvatar';
import { BrandTicketChip } from '@/components/tickets/BrandTicketChip';
import { STATUS_META } from '@/lib/types';
import type { Ticket, TicketStatus } from '@/lib/types';
import { useTickets } from '../hooks/useTickets';
import { useTicketFilters } from '../hooks/useTicketFilters';
import { TicketTabs } from './TicketTabs';
import { TicketFilters } from './TicketFilters';
import { TicketTableSkeleton } from '@/components/skeleton/tickets';
import { useAuthStore } from '@/modules/auth';
import { timeAgo } from '@/components/utils/time';

function formatOrderNumber(ticketNumber: number): string {
  return `#${String(ticketNumber).padStart(4, '0')}`;
}

export interface TicketTableProps {
  tickets?: Ticket[];
  hideHeader?: boolean;
  hideFilters?: boolean;
  refetch?: boolean;
}

export function TicketTable({ tickets, hideHeader = false, hideFilters = false, refetch = true }: TicketTableProps = {}) {
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
    myTicketsOnly,
    setMyTicketsOnly,
    sortOpen,
    setSortOpen,
    filterOpen,
    setFilterOpen,
    emptyState,
    activeFiltersCount,
    handleTabChange,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useTicketFilters();

  const queryParams = React.useMemo(() => {
    const statusVal = selectedStatuses.length > 0 ? selectedStatuses.join(',') : undefined;
    const brandTypeVal = selectedBrandTypes.length > 0 ? selectedBrandTypes.join(',') : undefined;

    return {
      page,
      per_page: pageSize,
      tab: activeTab,
      search: searchQuery.trim() || undefined,
      sort_by: sortBy,
      status: statusVal,
      brand_type: brandTypeVal,
      my_tickets: myTicketsOnly ? 'true' : undefined,
    };
  }, [page, pageSize, activeTab, searchQuery, sortBy, selectedStatuses, selectedBrandTypes, myTicketsOnly]);

  const { data, isLoading } = useTickets(queryParams, refetch);

  const filteredTickets = React.useMemo(() => {
    return data?.data || [];
  }, [data]);

  const total = data?.total || 0;

  const resolvedTickets = React.useMemo(() => {
    const rawList = tickets ?? filteredTickets;
    return rawList.map((t: any) => ({
      ...t,
      id: t.id ?? t.ticket_id,
      ticketNumber: t.ticketNumber ?? t.ticket_id,
      requesterName: t.requesterName ?? t.requestor_name ?? t.requestor_nickname ?? 'Unknown',
      requesterAvatar: t.requesterAvatar ?? t.GAvatarReq ?? undefined,
      description: t.description ?? t.project_name ?? t.ticket_content ?? '',
      status: t.status ?? (t.status_description ? String(t.status_description).toLowerCase() : 'pending'),
      updatedAt: t.updatedAt ?? t.last_updated ?? t.date_created,
      createdAt: t.createdAt ?? t.date_created,
      reply_ctr: t.reply_ctr ?? 0,
      last_transaction: t.last_transaction ?? '',
    }));
  }, [tickets, filteredTickets]);

  const [role, setRole] = React.useState<string>('super_user');
  const [localPageSize, setLocalPageSize] = React.useState<number>(10);

  const { user } = useAuthStore();
  const isDeveloper = user?.is_developer ?? false;
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
      width: '8px',
      align: 'center' as const,
      sorter: (a: any, b: any) => (a.ticketNumber || 0) - (b.ticketNumber || 0),
      render: (num: number) => (
        <AppLabel as="span" variant="label" className="font-mono text-xs font-semibold text-text-info">
          {formatOrderNumber(num)}
        </AppLabel>
      ),
    },
    {
      title: 'Brand',
      key: 'brand',
      width: '80px',
      sorter: (a: any, b: any) => String(a.brandName || '').localeCompare(String(b.brandName || '')),
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
      width: '300px',
      sorter: (a: any, b: any) => String(a.subject || '').localeCompare(String(b.subject || '')),
      render: (_: any, record: Ticket) => (
        <div className="flex items-center gap-3 w-full">
          {/* Creator avatar */}
          <AppAvatar
            name={record.requesterName}
            src={record.GAvatarReq || `https://api.dicebear.com/7.x/initials/svg?seed=${record.requesterName}`}
            size={36}
            className="shrink-0"
          />

          {/* Subject + description */}
          <div className="flex flex-col gap-0.5 min-w-0 break-words whitespace-normal">
            <AppLabel as="span" variant="label" className="text-sm font-bold text-text leading-snug whitespace-normal break-words">
              {record.subject}
            </AppLabel>
            <AppLabel as="span" variant="description" className="text-xs text-text-info leading-snug font-medium whitespace-normal break-words">
              {(record.AccountGroup ?? (record as any).businessUnitName) ? `${record.AccountGroup ?? (record as any).businessUnitName} • ` : ''}{record.requesterName}
            </AppLabel>
          </div>
        </div>
      ),
    },
    {
      title: 'Assignee',
      key: 'assignee',
      width: '100px',
      render: (_: any, record: any) => {
        let participants: string[] = [];
        let participantAvatars: string[] = [];

        if (record.OwnerName) {
          const parts = record.OwnerName.split(';');
          parts.forEach((p: string) => {
            const fields = p.split(',');
            if (fields[0]) {
              participants.push(fields[0]);
              participantAvatars.push(fields[1] || `https://api.dicebear.com/7.x/initials/svg?seed=${fields[0]}`);
            }
          });
        } else {
          const rawParticipants = Array.from(
            new Set(
              [...((record.assignees || []).map((a: any) => a.name)), ...(record.replies || []).map((r: any) => r.authorName)].filter(
                (name): name is string => Boolean(name) && name !== record.requesterName
              )
            )
          );
          participants = rawParticipants as string[];
          participantAvatars = participants.map(name => `https://api.dicebear.com/7.x/initials/svg?seed=${name}`);
        }

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
            <div className="flex -space-x-1.5 py-1 px-0.5">
              {participants.slice(0, 3).map((name, i) => (
                <TicketAvatar
                  key={name}
                  name={name}
                  src={participantAvatars[i]}
                  size={24}
                  status={avatarStatus}
                  className="ring-2 ring-background rounded-full shrink-0 relative"
                  style={{ zIndex: 10 - i }}
                />
              ))}
              {participants.length > 3 && (
                <Popover
                  content={
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto p-1 select-none min-w-[160px]">
                      <AppLabel as="span" className="text-[10px] font-bold text-text-info/60 uppercase tracking-wider border-b border-border/40 pb-1 mb-0.5">
                        Additional Assignees ({participants.length - 3})
                      </AppLabel>
                      {participants.slice(3).map((name, i) => (
                        <div key={name} className="flex items-center gap-2 py-0.5">
                          <AppAvatar
                            name={name}
                            src={participantAvatars[i + 3]}
                            size={22}
                            className="shrink-0 rounded-full"
                          />
                          <AppLabel as="span" className="text-xs font-medium text-foreground truncate">
                            {name}
                          </AppLabel>
                        </div>
                      ))}
                    </div>
                  }
                  trigger="hover"
                  placement="top"
                  arrow={false}
                  overlayInnerStyle={{ padding: '10px 12px', borderRadius: '10px' }}
                >
                  <div
                    className="w-[24px] h-[24px] rounded-full bg-neutral hover:bg-neutral/80 text-[9px] font-bold text-text-info flex items-center justify-center ring-2 ring-background shrink-0 select-none relative cursor-pointer transition-colors"
                    style={{ zIndex: 5 }}
                  >
                    +{participants.length - 3}
                  </div>
                </Popover>
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
      width: '80px',
      sorter: (a: any, b: any) => String(a.status || '').localeCompare(String(b.status || '')),
      render: (status: string) => {
        const meta = STATUS_META[status as TicketStatus] || {
          label: typeof status === 'string' ? status : 'Unknown',
          chipVariant: 'default'
        };
        return (
          <AppChip
            label={meta.label}
            variant={meta.chipVariant as any}
            size="sm"
          />
        );
      },
    },
    {
      title: 'Replies',
      dataIndex: 'reply_ctr',
      key: 'reply_ctr',
      width: '80px',
      align: 'center' as const,
      sorter: (a: any, b: any) => (Number(a.reply_ctr) || 0) - (Number(b.reply_ctr) || 0),
      render: (ctr: any) => (
        <AppLabel as="span" variant="body" className="text-xs font-semibold text-text">
          {ctr}
        </AppLabel>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: '100px',
      defaultSortOrder: 'descend' as const,
      sorter: (a: any, b: any) => new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime(),
      render: (date: string) => (
        <AppLabel as="span" variant="info" className="text-xs text-text-info font-medium">
          {timeAgo(date)}
        </AppLabel>
      ),
    },
    {
      title: 'Last Transaction',
      dataIndex: 'last_transaction',
      key: 'last_transaction',
      width: '100px',
      sorter: (a: any, b: any) => new Date(a.last_transaction || 0).getTime() - new Date(b.last_transaction || 0).getTime(),
      render: (date: string) => (
        <AppLabel as="span" variant="info" className="text-xs text-text-info font-medium">
          {date ? timeAgo(date) : '-'}
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
          user={user}
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
          myTicketsOnly={myTicketsOnly}
          setMyTicketsOnly={setMyTicketsOnly}
          sortOpen={sortOpen}
          setSortOpen={setSortOpen}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      {isLoading ? (
        <TicketTableSkeleton rows={pageSize || 5} />
      ) : resolvedTickets.length === 0 ? (
        <div className="py-12 flex justify-center border border-border/60 bg-background rounded-2xl shadow-sm">
          <AppEmptyState
            title={emptyState.title}
            description={emptyState.description}
            imageSrc="/aria-mascott-happy.svg"
            imageSize={110}
          />
        </div>
      ) : (
        <AppTable<Ticket>
          columns={columns}
          dataSource={resolvedTickets}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          loading={isLoading}
          pagination={
            !tickets
              ? {
                current: page,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: (p, ps) => {
                  setPage(p);
                  if (ps) setPageSize(ps);
                },
              }
              : {
                pageSize: localPageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onShowSizeChange: (_, size) => setLocalPageSize(size),
              }
          }
          onRow={(record) => ({
            onClick: () => router.push(`/tickets/${record.id}`),
            className: 'cursor-pointer hover:bg-neutral/5 transition-colors group',
          })}
        />
      )}
    </div>
  );
}
