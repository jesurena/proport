import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type { Ticket as TicketType } from '@/lib/types';
import { getTickets } from '@/lib/tickets';

// Helper ticket mapper
const mapTicket = (t: any): TicketType => {
  let status: any = 'pending';
  if (t.status_id === 1) status = 'pending';
  else if (t.status_id === 2) status = 'answered';
  else if (t.status_id === 3) status = 'closed';
  else if (t.status_id === 5) status = 'bu-approval';
  else if (t.status_id === 6) status = 'bu-declined';
  else if (t.status_id === 7) status = 'final-approval';
  else if (t.status_id === 8) status = 'adel-declined';

  return {
    id: String(t.ticket_id),
    ticketNumber: t.ticket_id,
    subject: t.subject || '',
    description: t.ticket_content || t.subject || '',
    status,
    priority: 'medium',
    requesterId: String(t.ao_id),
    requesterName: t.requestor_name || 'Unknown User',
    assigneeId: t.req_id ? String(t.req_id) : undefined,
    assigneeName: t.ao_name || undefined,
    assigneeAvatar: t.GAvatarAO || undefined,
    brandType: t.transaction_description || undefined,
    requestType: t.request_type || undefined,
    businessUnitId: t.AccountGroup || 'Unknown',
    businessUnitName: t.AccountGroup || 'Unknown',
    aoId: t.req_id ? String(t.req_id) : undefined,
    aoName: t.ao_name || undefined,
    cc: [],
    createdAt: t.date_created ? new Date(t.date_created).toISOString() : new Date().toISOString(),
    updatedAt: t.last_updated ? new Date(t.last_updated).toISOString() : new Date().toISOString(),
    closedAt: t.status_id === 3 && t.last_updated ? new Date(t.last_updated).toISOString() : undefined,
    replies: [],
    tags: [],
    customerName: t.customer_name || undefined,
    projectName: t.project_name || undefined,
  };
};

// ─── API Hooks (Querying database/network) ───

export const useDashboardCounts = () => {
  return useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: async () => {
      return dashboardService.getCounts();
    },
  });
};

export const useFocusBreakdown = () => {
  return useQuery<{ focus: number; non_focus: number; request_types: any[] }>({
    queryKey: ['focus-breakdown'],
    queryFn: async () => {
      return dashboardService.getFocusBreakdown();
    },
  });
};

export const useBookmarkedTickets = () => {
  return useQuery<TicketType[]>({
    queryKey: ['bookmarked-tickets'],
    queryFn: async () => {
      const backendBookmarks = await dashboardService.getBookmarkedTickets();
      return backendBookmarks.map(mapTicket);
    },
  });
};

export const useTicketCountAo = (params?: {
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}, enabled: boolean = true) => {
  return useQuery<{ data: any[]; total: number }>({
    queryKey: ['ticket-count-ao', params],
    queryFn: async () => {
      return dashboardService.getTicketCountAo(params);
    },
    enabled,
  });
};

export const useChartPerBu = (enabled: boolean = true) => {
  return useQuery<any[]>({
    queryKey: ['chart-per-bu'],
    queryFn: async () => {
      return dashboardService.getChartPerBu();
    },
    enabled,
  });
};

export const useBuyerCategoryCounts = (params?: {
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}, enabled: boolean = true) => {
  return useQuery<{ data: any[]; total: number }>({
    queryKey: ['buyer-category-counts', params],
    queryFn: async () => {
      return dashboardService.getBuyerCategoryCounts(params);
    },
    enabled,
  });
};

export const useBuyerDateCounts = (params?: {
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
  sort_field?: string;
  sort_order?: 'asc' | 'desc';
}, enabled: boolean = true) => {
  return useQuery<{ data: any[]; total: number }>({
    queryKey: ['buyer-date-counts', params],
    queryFn: async () => {
      return dashboardService.getBuyerDateCounts(params);
    },
    enabled,
  });
};

export const useBuyerPeriodCounts = () => {
  return useQuery<{ today: any[]; week: any[] }>({
    queryKey: ['buyer-period-counts'],
    queryFn: async () => {
      return dashboardService.getBuyerPeriodCounts();
    },
  });
};

export const useBuyerPeriodTickets = (buyer: string | null, period: 'today' | 'week') => {
  return useQuery<any[]>({
    queryKey: ['buyer-period-tickets', buyer, period],
    queryFn: async () => {
      if (!buyer) return [];
      return dashboardService.getBuyerPeriodTickets(buyer, period);
    },
    enabled: !!buyer,
  });
};

// ─── Main useDashboard Hook (API ONLY) ───

export function useDashboard() {
  const { data: counts, isLoading: isCountsLoading } = useDashboardCounts();
  const allTickets = getTickets();
  const recentTickets = getTickets().slice(0, 6);

  return {
    counts,
    allTickets,
    recentTickets,
    isLoading: isCountsLoading,
  };
}
