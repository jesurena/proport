import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { UserProfile, UserTicketsStats } from '../types';
import type { Ticket as TicketType } from '@/lib/types';

// Helper ticket mapper (used for user period tickets)
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
    assignees: t.assignees
      ? t.assignees.map((a: any) => ({
          id: String(a.id),
          name: a.name,
          avatar: a.avatar || undefined,
          email: a.email || undefined,
        }))
      : t.ao_name
      ? [
          {
            id: String(t.req_id || ''),
            name: t.ao_name,
            avatar: t.GAvatarAO || undefined,
          },
        ]
      : [],
    brandType: t.transaction_description || undefined,
    requestType: t.request_type || undefined,
    businessUnitId: t.AccountGroup || 'Unknown',
    businessUnitName: t.AccountGroup || 'Unknown',
    aoId: t.req_id ? String(t.req_id) : undefined,
    aoName: t.ao_name || undefined,
    ccUsers: [],
    createdAt: t.date_created ? new Date(t.date_created).toISOString() : new Date().toISOString(),
    updatedAt: t.last_updated ? new Date(t.last_updated).toISOString() : new Date().toISOString(),
    closedAt: t.status_id === 3 && t.last_updated ? new Date(t.last_updated).toISOString() : undefined,
    replies: [],
    tags: [],
    customerName: t.customer_name || undefined,
    projectName: t.project_name || undefined,
    GAvatarReq: t.GAvatarReq || undefined,
  };
};

export const useUserProfile = (id?: string | number, enabled = false) => {
  return useQuery<UserProfile>({
    queryKey: ['user-profile', id],
    queryFn: async () => {
      if (!id) return null as any;
      return profileService.getUserProfile(String(id));
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserTicketsStats = (userId: string | null, period: 'today' | 'week' | 'all', enabled = true) => {
  return useQuery<UserTicketsStats>({
    queryKey: ['user-tickets-stats', userId, period],
    queryFn: async () => {
      if (!userId) return { total: 0, answered: 0, pending: 0, declined: 0, user: null };
      return profileService.getUserTicketsStats(userId, period);
    },
    enabled: !!userId && enabled,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export interface PaginatedTicketsResponse {
  data: TicketType[];
  total: number;
  currentPage: number;
  lastPage: number;
}

export const useUserPeriodTickets = (
  userId: string | null,
  period: 'today' | 'week' | 'all',
  page = 1,
  perPage = 10,
  enabled = true
) => {
  return useQuery<PaginatedTicketsResponse>({
    queryKey: ['user-period-tickets', userId, period, page, perPage],
    queryFn: async () => {
      if (!userId) return { data: [], total: 0, currentPage: 1, lastPage: 1 };
      const res = await profileService.getUserPeriodTickets(userId, period, page, perPage);
      return {
        data: (res.data || []).map(mapTicket),
        total: res.total || 0,
        currentPage: res.current_page || 1,
        lastPage: res.last_page || 1,
      };
    },
    enabled: !!userId && enabled,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useUserLogs = (userId: string | null, period: 'today' | 'week' | 'all', enabled = true) => {
  return useQuery<any[]>({
    queryKey: ['user-logs', userId, period],
    queryFn: async () => {
      if (!userId) return [];
      return profileService.getUserLogs(userId, period);
    },
    enabled: !!userId && enabled,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
