import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useTicketFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const statusParam = searchParams.get('status');

  const getTabFromParams = () => {
    if (tabParam) return tabParam;
    if (statusParam === 'bu-approval' || statusParam === 'bu-declined' || statusParam === 'final-approval' || statusParam === 'adel-declined') {
      return statusParam;
    }
    return 'all';
  };

  const [activeTab, setActiveTab] = useState(getTabFromParams());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'price-desc' | 'price-asc' | 'qty-desc'>('recent');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<string[]>([]);
  const [myTicketsOnly, setMyTicketsOnly] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setActiveTab(getTabFromParams());
    if (statusParam) {
      setSelectedStatuses([statusParam]);
    } else {
      setSelectedStatuses([]);
    }
    setPage(1);
  }, [tabParam, statusParam]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'all') {
      router.push('/tickets');
    } else {
      router.push(`/tickets?tab=${tabId}`);
    }
  };

  const emptyState = useMemo(() => {
    if (searchQuery.trim()) {
      return {
        title: 'No inquiries found',
        description: `Try searching for a different keyword instead of "${searchQuery}".`,
      };
    }
    if (activeTab === 'all') {
      return {
        title: 'No inquiries submitted',
        description: 'Create a new price inquiry to get started.',
      };
    }
    if (activeTab === 'bu-approval') {
      return {
        title: 'No pending BU approvals',
        description: 'Tickets waiting for BU head signature will appear here.',
      };
    }
    if (activeTab === 'bu-declined') {
      return {
        title: 'No declined tickets',
        description: 'Tickets declined by BU heads will appear here.',
      };
    }
    if (activeTab === 'final-approval') {
      return {
        title: 'No final approvals',
        description: 'Tickets with final approval status will appear here.',
      };
    }
    if (activeTab === 'adel-declined') {
      return {
        title: 'No tickets declined by Adel',
        description: 'Tickets declined by Adel will appear here.',
      };
    }
    const tabLabel = activeTab === 'focus' ? 'Focus' : 'Non Focus';
    const statusLabel = statusParam ? `${statusParam} ` : '';
    return {
      title: 'Inbox cleared!',
      description: `You have no ${statusLabel}${tabLabel} inquiries remaining in this view.`,
    };
  }, [activeTab, statusParam, searchQuery]);

  const activeFiltersCount = selectedStatuses.length + selectedBrandTypes.length + (myTicketsOnly ? 1 : 0);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
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
  };
}
