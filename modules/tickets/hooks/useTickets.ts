import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTickets } from '@/lib/tickets';
import type { Ticket } from '@/lib/types';

export function useTickets() {
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'price-desc' | 'price-asc' | 'qty-desc'>('recent');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedBrandTypes, setSelectedBrandTypes] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  useEffect(() => {
    setActiveTab(getTabFromParams());
    if (statusParam) {
      setSelectedStatuses([statusParam]);
    } else {
      setSelectedStatuses([]);
    }
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
      result = result.filter((t) => t.status === 'bu-approval');
    } else if (activeTab === 'bu-declined') {
      result = result.filter((t) => t.status === 'bu-declined');
    } else if (activeTab === 'final-approval') {
      result = result.filter((t) => t.status === 'final-approval');
    } else if (activeTab === 'adel-declined') {
      result = result.filter((t) => t.status === 'adel-declined');
    }

    // Exclude 'adel-declined' (Sales Declined by Adel) from standard views by default
    if (activeTab === 'all' || activeTab === 'focus' || activeTab === 'non-focus') {
      result = result.filter((t) => t.status !== 'adel-declined');
    }

    // 3. Brand type filter
    if (selectedBrandTypes.length > 0) {
      result = result.filter((t) => selectedBrandTypes.includes(t.brandType || ''));
    }

    // 4. Status filter
    if (selectedStatuses.length > 0) {
      if (selectedStatuses.includes('all')) {
        // Do not filter status if 'all' is selected
      } else if (selectedStatuses.includes('open')) {
        result = result.filter((t) => t.status !== 'closed');
      } else {
        result = result.filter((t) => selectedStatuses.includes(t.status));
      }
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

    // 6. Sorting
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.targetPrice || 0) - (a.targetPrice || 0));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.targetPrice || 0) - (b.targetPrice || 0));
    } else if (sortBy === 'qty-desc') {
      result.sort((a, b) => (b.estimatedQuantity || 0) - (a.estimatedQuantity || 0));
    }

    return result;
  }, [tickets, activeTab, statusParam, searchQuery, sortBy, selectedStatuses, selectedBrandTypes]);

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
    if (activeTab === 'final-approval') {
      return {
        imageSrc: '/aria-mascott-happy.svg',
        title: 'No final approvals',
        description: 'Tickets with final approval status will appear here.',
      };
    }
    if (activeTab === 'adel-declined') {
      return {
        imageSrc: '/aria-mascott-sad.svg',
        title: 'No tickets declined by Adel',
        description: 'Tickets declined by Adel will appear here.',
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

  const activeFiltersCount = selectedStatuses.length + selectedBrandTypes.length;

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
    sortOpen,
    setSortOpen,
    filterOpen,
    setFilterOpen,
    filteredTickets,
    emptyState,
    activeFiltersCount,
    handleTabChange,
  };
}
