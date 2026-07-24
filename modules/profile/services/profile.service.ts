import api from '@/lib/api';
import { UserProfile, UserTicketsStats } from '../types';

export const profileService = {
  async getUserProfile(id: string): Promise<UserProfile> {
    const { data } = await api.get(`/users/${id}/profile`);
    return data?.data ?? data;
  },

  async getUserTicketsStats(userId: string, period: 'today' | 'week'): Promise<UserTicketsStats> {
    const { data } = await api.get(`/users/${userId}/tickets-stats`, {
      params: { period },
    });
    return data.data || { total: 0, answered: 0, pending: 0, user: null };
  },

  async getUserPeriodTickets(userId: string, period: 'today' | 'week'): Promise<any[]> {
    const { data } = await api.get('/tickets', {
      params: { user_id: userId, period, per_page: 1000 },
    });
    return data.data || [];
  },

  async getUserLogs(userId: string, period: 'today' | 'week'): Promise<any[]> {
    const { data } = await api.get(`/users/${userId}/logs`, {
      params: { period },
    });
    return data.data || [];
  },
};
