import api from '@/lib/api';
import { UserProfile, UserTicketsStats } from '../types';

export const profileService = {
  async getUserProfile(id: string): Promise<UserProfile> {
    const { data } = await api.get(`/users/${id}/profile`);
    return data?.data ?? data;
  },

  async getUserTicketsStats(userId: string, period: 'today' | 'week' | 'all'): Promise<UserTicketsStats> {
    const { data } = await api.get(`/users/${userId}/tickets-stats`, {
      params: { period },
    });
    return data.data || { total: 0, answered: 0, pending: 0, declined: 0, user: null };
  },

  async getUserPeriodTickets(
    userId: string,
    period: 'today' | 'week' | 'all',
    page = 1,
    perPage = 10
  ): Promise<{ data: any[]; total: number; current_page: number; last_page: number }> {
    const { data } = await api.get('/tickets', {
      params: { user_id: userId, period, page, per_page: perPage },
    });
    return data || { data: [], total: 0, current_page: 1, last_page: 1 };
  },

  async getUserLogs(userId: string, period: 'today' | 'week' | 'all'): Promise<any[]> {
    const { data } = await api.get(`/users/${userId}/logs`, {
      params: { period },
    });
    return data.data || [];
  },
};
