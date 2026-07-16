import api from '@/lib/api';

export const dashboardService = {
  async getTickets(): Promise<any[]> {
    const { data } = await api.get('/dashboard/tickets');
    return data || [];
  },

  async getRecentTickets(): Promise<any[]> {
    const { data } = await api.get('/dashboard/recent-tickets');
    return data || [];
  },

  async getFocusBreakdown(): Promise<{ focus: number; non_focus: number; request_types: any[] }> {
    const { data } = await api.get('/dashboard/focus-breakdown');
    return data;
  },

  async getBookmarkedTickets(): Promise<any[]> {
    const { data } = await api.get('/dashboard/bookmarked-tickets');
    return data || [];
  },
};
